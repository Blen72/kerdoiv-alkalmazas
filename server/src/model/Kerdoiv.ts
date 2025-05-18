import { model, Model, Schema } from "mongoose";

interface IKerdoiv extends Document {
    userid: Schema.Types.ObjectId;
    nev: string;
    nyilvanos: boolean;
}

const KerdoivSchema: Schema<IKerdoiv>=new Schema({
    userid: {type: Schema.Types.ObjectId, required: true},
    nev: {type: String, required: true},
    nyilvanos: {type: Boolean, required: true}
});

export const Kerdoiv: Model<IKerdoiv>=model("Kerdoivek", KerdoivSchema);
