const express = require("express");
const router = express.Router();
const Patient = require("./dataModel");

// GET all patient data
router.get("/data", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/data", async (req, res) => {
  const { patientName, age, gender, dob, status, ehrId } = req.body;

  if (!patientName || !age || !gender || !dob || !ehrId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/data/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
