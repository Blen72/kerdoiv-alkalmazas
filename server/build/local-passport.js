"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_local_1 = require("passport-local");
const User_1 = require("./model/User");
const configurePassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use("local", new passport_local_1.Strategy((username, password, done) => {
        const query = User_1.User.findOne({ "username": username });
        /*const qAll=User.find({}).then(users=>{
            console.log("Users");
            for(let value in users){
                console.log("FA:"+users[value]);
            }
        });*/
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, same) => {
                    if (error) {
                        done("Hibás felhasználónév vagy jelszó.");
                        return;
                    }
                    if (same) {
                        done(null, user);
                        return;
                    }
                });
            }
            else {
                done("Hibás felhasználónév vagy jelszó.");
            }
        }).catch(error => {
            console.error(error);
        });
        /*if(username==="Pista"&&password=="password"){
            done(null, new User(username, password));
        } else {
            done("Hibás felhasználónév vagy jelszó!");
        }*/
    }));
    return passport;
};
exports.configurePassport = configurePassport;
