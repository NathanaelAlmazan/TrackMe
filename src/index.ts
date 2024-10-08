import {ApolloServer} from '@apollo/server';
import {ApolloServerErrorCode} from '@apollo/server/errors';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {createServer} from 'http';
import webpush from 'web-push';
import express from 'express';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {WebSocketServer} from 'ws';
import {useServer} from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import {merge} from 'lodash';
import {gql} from 'graphql-tag';
import bodyParser from 'body-parser';
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';
import schedule from 'node-schedule';

// modules
import {userSchema, userResolvers} from './users';
import {documentSchema, documentResolvers} from './document';
import {reportSchema, reportResolvers} from './reports';

// routines
import {autoGenerateReports} from './routines/reports';
import {subscribeUser} from './routines/users';

dotenv.config();

// handle notifications
// setting vapid keys details
webpush.setVapidDetails(
    'https://rr6manila.com',
    process.env.PUBLIC_VAPID_KEY as string,
    process.env.PRIVATE_VAPID_KEY as string
);

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const root = gql`
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }

    type Subscription {
        _empty: String
    }
`;
const schema = makeExecutableSchema({
    typeDefs: [root, userSchema, documentSchema, reportSchema],
    resolvers: merge({}, userResolvers, documentResolvers, reportResolvers)
});

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
// Save the returned server's info, so we can shut down this server later
const serverCleanup = useServer({schema}, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({httpServer}),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
    formatError: (formattedError, error) => {
        // Return a different error message
        if (
            formattedError.extensions?.code ===
            ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
            console.log(formattedError.message);

            return {
                ...formattedError,
                message: "Your query doesn't match the schema.",
            };
        } else if (
            formattedError.extensions?.code ===
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR
        ) {
            console.log(formattedError.message);

            return {
                ...formattedError,
                message: "Internal Error Occurred. Please contact technical support.",
            };
        }

        // Otherwise return the formatted error. This error can also
        // be manipulated in other ways, as long as it's returned.
        return formattedError;
    },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/media', express.static(path.join(__dirname, 'uploads')));

server.start().then(() => {
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

    const PORT = 4000;
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
}).catch(err => console.error(err));

// ========================================== FILE UPLOADS ======================================== //

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime().toString() + '_' + file.originalname.replace(/ /g, ""));
    }
})

const upload = multer({storage: storage});

app.post("/upload", upload.array("files"), (req, res) => {
    if (req.files) {
        const files: Express.Multer.File[] = req.files as unknown as Express.Multer.File[];

        return res.status(200).json({
            files: files.map(file => ({
                fileName: file.originalname,
                filePath: `/${file.filename}`,
                fileUrl: `${process.env.BASE_MEDIA_URL}/${file.filename}`,
                fileType: file.mimetype
            }))
        });
    }
    return res.status(400).json({message: "Failed to upload."});
});

// ========================================== NOTIFICATIONS ======================================== //
app.post('/subscribe/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const subscription = req.body;

    await subscribeUser(uuid, subscription);

    // send status 201 for the request
    return res.status(201).json({
        message: 'User Subscribed.'
    });
})


// ========================================== ROUTINES ======================================== //

const reportGenerate = schedule.scheduleJob('0 8 * * *', function () {
    autoGenerateReports()
        .then(() => {
            console.log("Generated Report Submissions.");
        })
        .catch(() => {
            console.log("Failed to generate Report Submissions.");
        });
});

