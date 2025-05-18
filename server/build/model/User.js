"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_FACTOR = 10;
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
UserSchema.pre("save", function (next) {
    const user = this;
    bcrypt_1.default.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt_1.default.hash(user.password, salt, (err, hashed) => {
            if (err) {
                return next(error);
            }
            user.password = hashed;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (potentionalPassword, callback) {
    const user = this;
    bcrypt_1.default.compare(potentionalPassword, user.password, (error, same) => {
        if (error) {
            callback(error, false);
            return;
        }
        callback(null, same);
    });
};
exports.User = (0, mongoose_1.model)("Users", UserSchema);
/*export class User {
    username: string;
    password: string;

    constructor(username: string, password: string){
        this.username=username;
        this.password=password;
    }
}*/ 
