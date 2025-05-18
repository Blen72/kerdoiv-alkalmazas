import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from './model/User';

export const configurePassport=(passport: PassportStatic): PassportStatic=>{
    passport.serializeUser((user: Express.User, done)=>{
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done)=>{
        done(null, user);
    });
    
    passport.use("local", new Strategy((username, password, done)=>{
        const query=User.findOne({"username": username});
        /*const qAll=User.find({}).then(users=>{
            console.log("Users");
            for(let value in users){
                console.log("FA:"+users[value]);
            }
        });*/
        query.then(user=>{
            if(user){
                user.comparePassword(password, (error, same)=>{
                    if(error){
                        done("Hibás felhasználónév vagy jelszó.");
                        return;
                    }
                    if(same){
                        done(null, user);
                        return;
                    }
                });
            } else {
                done("Hibás felhasználónév vagy jelszó.");
            }
        }).catch(error=>{
            console.error(error);
        });

        /*if(username==="Pista"&&password=="password"){
            done(null, new User(username, password));
        } else {
            done("Hibás felhasználónév vagy jelszó!");
        }*/
    }));

    return passport;
}