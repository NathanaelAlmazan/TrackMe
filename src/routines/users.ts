import dataClient from "../data-client";

export async function subscribeUser(uuid: string, subscription: object) {
  const payload = JSON.stringify(subscription);

  await dataClient.officers.update({
    where: {
      uuid: uuid,
    },
    data: {
      device: payload,
    },
  });
}
