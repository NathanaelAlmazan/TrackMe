import {
  Events,
  Officers,
  Offices,
  Positions,
  Role,
  Status,
} from "@prisma/client";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import dataClient from "../data-client";
import {
  compileContent,
  generateSixDigitCode,
  sendEmail,
  sendSms,
} from "../utils/smtp";
import { getDayDiff } from "../utils/dates";
import { generateReport } from "../routines/documents";

const resolvers = {
  Positions: {
    id: (parent: Positions) => {
      return parent.id.toString();
    },
  },

  Offices: {
    id: (parent: Offices) => {
      return parent.id.toString();
    },

    officers: async (parent: Offices) => {
      return await dataClient.officers.findMany({
        where: {
          officeId: parent.id,
        },
        orderBy: {
          lastName: "asc",
        },
      });
    },

    reports: async (parent: Offices, args: { complied?: boolean }) => {
      return await dataClient.submittedReports.findMany({
        where: {
          officeId: parent.id,
          status: args.complied ? "FINISHED" : "REFERRED",
        },
      });
    },
  },

  Officers: {
    position: async (parent: Officers) => {
      if (!parent.positionId) return null;

      return await dataClient.positions.findUnique({
        where: {
          id: parent.positionId,
        },
      });
    },

    office: async (parent: Officers) => {
      if (!parent.officeId) return null;

      return await dataClient.offices.findUnique({
        where: {
          id: parent.officeId,
        },
      });
    },
  },

  Query: {
    generateReport: async () => {
      return await generateReport();
    },

    getPositions: async () => {
      return await dataClient.positions.findMany({
        orderBy: {
          role: "asc",
        },
      });
    },

    getOffices: async () => {
      return await dataClient.offices.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },

    getOfficers: async (_: unknown, args: { officeId?: number }) => {
      return await dataClient.officers.findMany({
        where: {
          officeId: args.officeId,
        },
        orderBy: {
          firstName: "asc",
        },
      });
    },

    getSignatories: async () => {
      return await dataClient.officers.findMany({
        where: {
          position: {
            role: Role.DIRECTOR,
          },
        },
        orderBy: {
          firstName: "asc",
        },
      });
    },

    getOfficerById: async (_: unknown, args: Officers) => {
      return await dataClient.officers.findUnique({
        where: {
          uuid: args.uuid,
        },
      });
    },

    loginOfficer: async (
      _: unknown,
      args: { username: string; password: string }
    ) => {
      const { username, password } = args;

      // check username provided
      let officer: Officers | null = null;
      if (username.includes("@")) {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

        if (!emailRegex.test(username))
          throw new GraphQLError("Invalid email address.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        officer = await dataClient.officers.findUnique({
          where: {
            email: username,
            active: true,
          },
        });
      } else {
        const startIndex = username.indexOf("9");

        if (startIndex < 0)
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        const phoneNumber = username.substring(startIndex, username.length);

        if (phoneNumber.length !== 10 || !/^\d+$/.test(username))
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        officer = await dataClient.officers.findUnique({
          where: {
            phone: phoneNumber,
            active: true,
          },
        });
      }

      if (!officer || !officer.password)
        throw new GraphQLError("Account does not exist or inactive.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // verify password
      if (await bcrypt.compare(password, officer.password)) return officer;
      else
        throw new GraphQLError("You entered a wrong password.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
    },

    getNotifications: async (_: unknown, args: { uuid: string }) => {
      // get officer
      const officer = await dataClient.officers.findUnique({
        where: {
          uuid: args.uuid,
        },
        include: {
          position: {
            select: {
              role: true,
            },
          },
        },
      });

      if (!officer || !officer.officeId)
        throw new GraphQLError("Officer does not exist", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const events: Events[] = await dataClient.$queryRaw`
                SELECT * FROM public."Events"
                WHERE (
                        EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND frequency = 'YEARLY'
                    ) OR (
                        EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND frequency = 'MONTHLY'
                    ) OR (
                        EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP)
                        AND frequency = 'NONE'
                    )`;

      if (officer.position?.role === Role.DIRECTOR) {
        const documents = await dataClient.documents.findMany({
          where: {
            dateDue: {
              lt: new Date(),
            },
            referrals: {
              some: {
                AND: [
                  {
                    status: {
                      category: {
                        not: Status.FINISHED,
                      },
                    },
                  },
                  {
                    status: {
                      category: {
                        not: Status.NOT_ACTIONABLE,
                      },
                    },
                  },
                ],
              },
            },
          },
        });

        const submissions = await dataClient.submittedReports.findMany({
          where: {
            localDue: {
              lt: new Date(),
            },
            AND: [
              {
                status: {
                  not: Status.FINISHED,
                },
              },
              {
                status: {
                  not: Status.NOT_ACTIONABLE,
                },
              },
            ],
          },
          include: {
            report: {
              select: {
                name: true,
              },
            },
          },
        });

        const reports = await dataClient.reports.findMany({
          where: {
            id: {
              in: Array.from(new Set(submissions.map((sub) => sub.reportId))),
            },
          },
        });

        const submitted = await dataClient.referrals.findMany({
          where: {
            status: {
              category: Status.SUBMITTED,
            },
          },
          include: {
            document: {
              select: {
                referenceNum: true,
              },
            },
            office: {
              select: {
                name: true,
              },
            },
          },
        });

        return documents
          .map((document) => ({
            subject: "Overdue Document",
            description: `Document ${document.referenceNum} is ${getDayDiff(
              document.dateDue
            )} days overdue.`,
            timestamp: new Date(document.dateDue).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                weekday: "short",
              }
            ),
          }))
          .concat(
            submitted.map((sub) => ({
              subject: "Submitted Document",
              description: `${sub.office.name} submitted ${sub.document.referenceNum} for your review.`,
              timestamp: new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                weekday: "short",
              }),
            }))
          )
          .concat(
            reports.map((report) => {
              const offices = submissions.filter(
                (sub) => sub.reportId === report.id
              );
              const overdue = offices[0].localDue;

              return {
                subject: "Due Report",
                description: `${report.name} is ${getDayDiff(
                  overdue
                )} days overdue. Waiting for ${offices.length} offices.`,
                timestamp: new Date(overdue).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                }),
              };
            })
          )
          .concat(
            events.map((event) => ({
              subject: "Event",
              description: event.subject,
              timestamp: new Date(event.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                weekday: "short",
              }),
            }))
          );
      } else if (officer.position?.role === Role.OFFICER) {
        const documents = await dataClient.assigned.findMany({
          where: {
            officerId: args.uuid,
          },
          include: {
            document: {
              select: {
                referenceNum: true,
                dateCreated: true,
                dateDue: true,
              },
            },
          },
        });

        return documents
          .map((document) => ({
            subject: "Assigned Document",
            description: `Document ${
              document.document.referenceNum
            } has been assigned to your office for completion by ${new Date(
              document.document.dateDue
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}`,
            timestamp: new Date(
              document.document.dateCreated
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "short",
            }),
          }))
          .concat(
            events.map((event) => ({
              subject: "Event",
              description: event.subject,
              timestamp: new Date(event.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                weekday: "short",
              }),
            }))
          );
      }

      // get document notifications
      const documents = await dataClient.documents.findMany({
        where: {
          referrals: {
            some: {
              officeId: officer.officeId,
              AND: [
                {
                  status: {
                    category: {
                      not: Status.FINISHED,
                    },
                  },
                },
                {
                  status: {
                    category: {
                      not: Status.NOT_ACTIONABLE,
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const reports: { name: string; dateCreated: Date; localDue: Date }[] =
        await dataClient.$queryRaw`
                SELECT rp."name", sr."dateCreated", sr."localDue" FROM public."SubmittedReports" sr
                INNER JOIN public."Reports" rp ON rp.id = sr."reportId"
                WHERE (sr."localDue" - INTERVAL '7 days') < CURRENT_TIMESTAMP
                AND sr."status" = 'REFERRED'
                AND sr."officeId" = ${officer.officeId}`;

      return documents
        .map((document) => ({
          subject: "Assigned Document",
          description: `Document ${
            document.referenceNum
          } has been assigned to your office for completion by ${new Date(
            document.dateDue
          ).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            weekday: "short",
          })}`,
          timestamp: new Date(document.dateCreated).toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
              weekday: "short",
            }
          ),
        }))
        .concat(
          reports.map((report) => ({
            subject: "Due Report",
            description: `Please submit ${report.name} before ${new Date(
              report.localDue
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}`,
            timestamp: new Date(report.dateCreated).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                weekday: "short",
              }
            ),
          }))
        )
        .concat(
          events.map((event) => ({
            subject: "Event",
            description: event.subject,
            timestamp: new Date(event.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "short",
            }),
          }))
        );
    },

    requestResetPassword: async (
      _: unknown,
      args: { email?: string; phone?: string }
    ) => {
      if (!args.email && !args.phone)
        throw new GraphQLError("Please provide email or phone.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // find officer
      const officer = await dataClient.officers.findFirst({
        where: {
          OR: [
            {
              email: args.email,
            },
            {
              phone: args.phone,
            },
          ],
        },
      });

      if (!officer)
        throw new GraphQLError("Account does not exist.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // generate code
      const code = generateSixDigitCode();
      await dataClient.officers.update({
        where: {
          uuid: officer.uuid,
        },
        data: {
          code: code,
        },
      });

      // send code
      try {
        if (args.email) {
          const subject = "Reset Password";
          const message =
            "A unique code to reset your password has been generated for you.";
          const content = compileContent(officer.firstName, code, message);
          await sendEmail(args.email, subject, content);

          return args.email;
        } else if (args.phone) {
          const message = `${code} is your TrackMe reset password code.`;
          await sendSms(args.phone, message);

          return args.phone;
        }
      } catch (err) {
        throw new GraphQLError("Failed to send reset code.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    confirmResetPassword: async (
      _: unknown,
      args: { email?: string; phone?: string; code: string; password: string }
    ) => {
      if (!args.email && !args.phone)
        throw new GraphQLError("Please provide email or phone.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // find officer
      const officer = await dataClient.officers.findFirst({
        where: {
          OR: [
            {
              email: args.email,
              code: args.code,
            },
            {
              phone: args.phone,
              code: args.code,
            },
          ],
        },
      });

      if (!officer)
        throw new GraphQLError("You entered a wrong code.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // update password
      return await dataClient.officers.update({
        where: {
          uuid: officer.uuid,
        },
        data: {
          password: await bcrypt.hash(args.password, 10),
          code: null,
        },
      });
    },

    requestAccountVerify: async (
      _: unknown,
      args: { uuid: string; contact: string }
    ) => {
      const { uuid, contact } = args;

      // check username provided
      let email: string | null = null;
      let phone: string | null = null;
      if (contact.includes("@")) {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

        if (!emailRegex.test(contact))
          throw new GraphQLError("Invalid email address.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        email = contact;
      } else {
        const startIndex = contact.indexOf("9");

        if (startIndex < 0)
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        const phoneNumber = contact.substring(startIndex, contact.length);

        if (phoneNumber.length !== 10 || !/^\d+$/.test(contact))
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        phone = phoneNumber;
      }

      if (!email && !phone)
        throw new GraphQLError("Please provide email or phone number.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // find officer
      const officer = await dataClient.officers.findUnique({
        where: {
          uuid: uuid,
        },
      });

      if (!officer)
        throw new GraphQLError("Account does not exist.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      try {
        // generate code
        const code = generateSixDigitCode();
        await dataClient.officers.update({
          where: {
            uuid: officer.uuid,
          },
          data: {
            code: code,
            email: email,
            phone: phone,
          },
        });

        // send code
        try {
          if (email) {
            const subject = "Account Verification";
            const message =
              "A unique code to verify your account has been generated for you.";
            const content = compileContent(officer.firstName, code, message);
            await sendEmail(email, subject, content);

            return email;
          } else if (phone) {
            const message = `${code} is your TrackMe account verification code.`;
            await sendSms(phone, message);

            return phone;
          }
        } catch (err) {
          throw new GraphQLError("Failed to send reset code.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      } catch (err) {
        throw new GraphQLError("Email or phone number is already used.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    },

    confirmAccountVerify: async (
      _: unknown,
      args: { contact: string; code: string }
    ) => {
      const { contact, code } = args;

      // check username provided
      let email: string | null = null;
      let phone: string | null = null;
      if (contact.includes("@")) {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

        if (!emailRegex.test(contact))
          throw new GraphQLError("Invalid email address.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        email = contact;
      } else {
        const startIndex = contact.indexOf("9");

        if (startIndex < 0)
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        const phoneNumber = contact.substring(startIndex, contact.length);

        if (phoneNumber.length !== 10 || !/^\d+$/.test(contact))
          throw new GraphQLError("Invalid phone number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });

        phone = phoneNumber;
      }

      if (!email && !phone)
        throw new GraphQLError("Please provide email or phone number.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // find officer
      const officer = await dataClient.officers.findFirst({
        where: {
          OR: [
            {
              email: email,
              code: code,
            },
            {
              phone: phone,
              code: code,
            },
          ],
        },
      });

      if (!officer)
        throw new GraphQLError("Account does not exist.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // verify account
      return await dataClient.officers.update({
        where: {
          uuid: officer.uuid,
        },
        data: {
          verified: true,
          code: null,
        },
      });
    },
  },

  Mutation: {
    createPosition: async (_: unknown, args: Positions) => {
      return await dataClient.positions.create({
        data: {
          label: args.label,
          role: args.role,
        },
      });
    },

    updatePosition: async (_: unknown, args: Positions) => {
      return await dataClient.positions.update({
        where: {
          id: args.id,
        },
        data: {
          label: args.label,
          role: args.role,
        },
      });
    },

    deletePosition: async (_: unknown, args: Positions) => {
      const positions = await dataClient.officers.aggregate({
        where: {
          positionId: args.id,
        },
        _count: true,
      });

      if (positions._count > 0)
        throw new GraphQLError(
          "There are active officers under this position.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );

      return await dataClient.positions.delete({
        where: {
          id: args.id,
        },
      });
    },

    // ============================== OFFICES ===================================

    createOffice: async (_: unknown, args: Offices) => {
      const { name } = args;

      return await dataClient.offices.create({
        data: {
          name: name,
        },
      });
    },

    updateOffice: async (_: unknown, args: Offices) => {
      const { id, name } = args;

      return await dataClient.offices.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
    },

    deleteOffice: async (_: unknown, args: Offices) => {
      const { id } = args;
      const officers = await dataClient.officers.aggregate({
        where: {
          officeId: args.id,
        },
        _count: true,
      });

      if (officers._count > 0)
        throw new GraphQLError("There are active officers under this office.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      return await dataClient.offices.delete({
        where: {
          id: id,
        },
      });
    },

    // ============================== OFFICERS ===================================

    createOfficer: async (_: unknown, args: Officers) => {
      const {
        firstName,
        lastName,
        positionId,
        officeId,
        email,
        phone,
        password,
      } = args;

      try {
        const account = await dataClient.officers.findUnique({
          where: {
            firstName_lastName: {
              firstName: firstName,
              lastName: lastName,
            },
          },
        });

        if (account) {
          return await dataClient.officers.update({
            where: {
              uuid: account.uuid,
            },
            data: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              phone: phone,
              password: password ? await bcrypt.hash(password, 12) : null,
            },
          });
        }

        return await dataClient.officers.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            officeId: officeId,
            positionId: positionId,
            email: email,
            phone: phone,
            password: password ? await bcrypt.hash(password, 12) : null,
          },
        });
      } catch (err) {
        console.log(err);
        throw new GraphQLError("Account already exists.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    },

    updateOfficer: async (_: unknown, args: Officers) => {
      const {
        uuid,
        avatar,
        firstName,
        lastName,
        positionId,
        officeId,
        password,
        signature,
      } = args;

      let email = !args.email ? undefined : args.email;
      let phone = !args.phone ? undefined : args.phone;
      try {
        return await dataClient.officers.update({
          where: {
            uuid: uuid,
          },
          data: {
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            officeId: officeId,
            positionId: positionId,
            password: password ? await bcrypt.hash(password, 12) : undefined,
            signature: signature,
          },
        });
      } catch (err) {
        throw new GraphQLError("Email or phone number is already used.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    },

    deleteOfficer: async (_: unknown, args: Officers) => {
      const { uuid } = args;

      await dataClient.comments.deleteMany({
        where: {
          OR: [
            {
              sender: uuid
            },
            {
              recipient: uuid
            }
          ]
        }
      })

      return await dataClient.officers.delete({
        where: {
          uuid: uuid,
        },
      });
    },

    activateOfficer: async (_: unknown, args: Officers) => {
      const { uuid, active } = args;

      return await dataClient.officers.update({
        where: {
          uuid: uuid,
        },
        data: {
          active: active,
        },
      });
    },
  },
};

export default resolvers;
