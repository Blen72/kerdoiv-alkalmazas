import { model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_FACTOR=10;

interface IUser extends Document {
    username: string;
    password: string;
    comparePassword: (potentionalPassword: string, callback: (error: Error|null, same: boolean) => void) => void;
}

const UserSchema: Schema<IUser>=new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.pre<IUser>("save", function(next){
    const user=this;
    bcrypt.genSalt(SALT_FACTOR, (error, salt)=>{
        if(error){
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, hashed)=>{
            if(err){
                return next(error);
            }
            user.password=hashed;
            next();
        })
    });
});

UserSchema.methods.comparePassword = function(potentionalPassword: string, callback: (error: Error|null, same: boolean) => void): void {
    const user=this;
    bcrypt.compare(potentionalPassword, user.password, (error, same)=>{
        if(error){
            callback(error, false);
            return;
        }
        callback(null, same);
    });
}

export const User: Model<IUser>=model("Users", UserSchema);

/*export class User {
    username: string;
    password: string;

    constructor(username: string, password: string){
        this.username=username;
        this.password=password;
    }
}*/