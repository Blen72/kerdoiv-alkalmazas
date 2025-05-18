"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KerdesAdat = exports.Kerdes = void 0;
const mongoose_1 = require("mongoose");
const KerdesSchema = new mongoose_1.Schema({
    kerdoid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    kerdes: { type: String, required: true },
    type: { type: String, required: true },
    valaszok: { type: String }
});
exports.Kerdes = (0, mongoose_1.model)("Kerdesek", KerdesSchema);
const KerdesAdatSchema = new mongoose_1.Schema({
    kerdesid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    userid: { type: mongoose_1.Schema.Types.ObjectId },
    valasz: { type: String, required: true }
});
exports.KerdesAdat = (0, mongoose_1.model)("KerdesAdatok", KerdesAdatSchema);
