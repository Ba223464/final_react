const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const dataRoutes = require("./dataRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", dataRoutes);

// POST Route
app.post("/api/patients", async (req, res) => {
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

// PUT Route
app.put("/api/patients/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Don't forget to import the Patient model
const Patient = require("./dataModel");