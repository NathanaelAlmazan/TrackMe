"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const errors_1 = require("@apollo/server/errors");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = require("http");
const web_push_1 = __importDefault(require("web-push"));
const express_1 = __importDefault(require("express"));
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const cors_1 = __importDefault(require("cors"));
const lodash_1 = require("lodash");
const graphql_tag_1 = require("graphql-tag");
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_schedule_1 = __importDefault(require("node-schedule"));
// modules
const users_1 = require("./users");
const document_1 = require("./document");
const reports_1 = require("./reports");
// routines
const reports_2 = require("./routines/reports");
const users_2 = require("./routines/users");
dotenv_1.default.config();
// handle notifications
// setting vapid keys details
web_push_1.default.setVapidDetails('https://rr6manila.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);
// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const root = (0, graphql_tag_1.gql) `
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
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: [root, users_1.userSchema, document_1.documentSchema, reports_1.reportSchema],
    resolvers: (0, lodash_1.merge)({}, users_1.userResolvers, document_1.documentResolvers, reports_1.reportResolvers)
});
// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
// Set up ApolloServer.
const server = new server_1.ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            serverWillStart() {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        drainServer() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield serverCleanup.dispose();
                            });
                        },
                    };
                });
            },
        },
    ],
    formatError: (formattedError, error) => {
        var _a, _b;
        // Return a different error message
        if (((_a = formattedError.extensions) === null || _a === void 0 ? void 0 : _a.code) ===
            errors_1.ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
            console.log(formattedError.message);
            return Object.assign(Object.assign({}, formattedError), { message: "Your query doesn't match the schema." });
        }
        else if (((_b = formattedError.extensions) === null || _b === void 0 ? void 0 : _b.code) ===
            errors_1.ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
            console.log(formattedError.message);
            return Object.assign(Object.assign({}, formattedError), { message: "Internal Error Occured. Please contact technical support." });
        }
        // Otherwise return the formatted error. This error can also
        // be manipulated in other ways, as long as it's returned.
        return formattedError;
    },
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/media', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
server.start().then(() => {
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server));
    const PORT = 4000;
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
}).catch(err => console.error(err));
// ========================================== FILE UPLOADS ======================================== //
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path_1.default.join(__dirname, 'uploads'));
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime().toString() + '_' + file.originalname.replace(/ /g, ""));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.post("/upload", upload.array("files"), (req, res) => {
    if (req.files) {
        const files = req.files;
        return res.status(200).json({ files: files.map(file => ({
                fileName: file.originalname,
                fileUrl: `${process.env.BASE_MEDIA_URL}/${file.filename}`,
                fileType: file.mimetype
            })) });
    }
    return res.status(400).json({ message: "Failed to upload." });
});
// ========================================== NOTIFICATIONS ======================================== //
app.post('/subscribe/:uuid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.params.uuid;
    const subscription = req.body;
    yield (0, users_2.subscribeUser)(uuid, subscription);
    // send status 201 for the request
    return res.status(201).json({
        message: 'User Subscribed.'
    });
}));
// ========================================== ROUTINES ======================================== //
const reportGenerate = node_schedule_1.default.scheduleJob('0 8 * * *', function () {
    (0, reports_2.autoGenerateReports)()
        .then(() => {
        console.log("Generated Report Submissions.");
    })
        .catch(() => {
        console.log("Failed to generate Report Submissions.");
    });
});
//# sourceMappingURL=index.js.map