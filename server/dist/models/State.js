"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const mongoose_1 = require("mongoose");
const StateSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, {
    timestamps: true
});
exports.State = (0, mongoose_1.model)('State', StateSchema);
