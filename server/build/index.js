"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const local_passport_1 = require("./local-passport");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
const dataBaseUrl = "mongodb://localhost:27017/kerdo_db";
const clientUrl = "http://localhost:4200";
mongoose_1.default.connect(dataBaseUrl).then((data) => {
    console.log("Connected to mongodb.");
}).catch((error) => {
    console.error(error);
    return;
});
const corsOptiopns = {
    origin: (o, callback) => {
        if (o === clientUrl) {
            callback(null, true);
            return;
        }
        callback(new Error("You shall not pass!"), false);
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptiopns));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const sessionOptions = {
    secret: "secret$Batida",
    resave: false,
    saveUninitialized: false
};
app.use((0, express_session_1.default)(sessionOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, local_passport_1.configurePassport)(passport_1.default);
app.use((0, routes_1.configureRoutes)(passport_1.default, express_1.default.Router()));
app.listen(port, () => {
    console.log("A szerver elindult.");
});
