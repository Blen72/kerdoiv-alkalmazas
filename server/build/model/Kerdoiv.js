"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kerdoiv = void 0;
const mongoose_1 = require("mongoose");
const KerdoivSchema = new mongoose_1.Schema({
    userid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    nev: { type: String, required: true },
    nyilvanos: { type: Boolean, required: true }
});
exports.Kerdoiv = (0, mongoose_1.model)("Kerdoivek", KerdoivSchema);
