const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  status: { type: String, enum: ["Stable", "Critical", "Recovering"], default: "Stable" },
  medicalHistory: [{ type: String }],
  medications: [{ type: String }],
  ehrId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
