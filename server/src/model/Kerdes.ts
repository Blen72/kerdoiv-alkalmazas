import { model, Model, Schema } from "mongoose";

interface IKerdes extends Document {
    kerdoid: Schema.Types.ObjectId;
    kerdes: string;
    type: string;
    valaszok: string;
}

const KerdesSchema: Schema<IKerdes>=new Schema({
    kerdoid: {type: Schema.Types.ObjectId, required: true},
    kerdes: {type: String, required: true},
    type: {type: String, required: true},
    valaszok: {type: String}
});

export const Kerdes: Model<IKerdes>=model("Kerdesek", KerdesSchema);


//KerdesAdat
interface IKerdesAdat extends Document {
    kerdesid: Schema.Types.ObjectId; //melyik kérdés lett kitöltve
    userid: Schema.Types.ObjectId;
    valasz: string;
}

const KerdesAdatSchema: Schema<IKerdesAdat>=new Schema({
    kerdesid: {type: Schema.Types.ObjectId, required: true},
    userid: {type: Schema.Types.ObjectId},
    valasz: {type: String, required: true}
});

export const KerdesAdat: Model<IKerdesAdat>=model("KerdesAdatok", KerdesAdatSchema);