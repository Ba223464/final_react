import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HospitalEHR = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    bloodGroup: '',
    contactNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log('Fetching patients...');
      const response = await axios.get('/api/patients');
      console.log('Fetched patients:', response.data);
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching patients: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Add new patient
  const addPatient = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Validate required fields
      const requiredFields = ['name', 'age', 'gender', 'bloodGroup', 'contactNumber', 'address'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate age
      const age = Number(formData.age);
      if (isNaN(age) || age < 0) {
        setError('Please enter a valid age');
        return;
      }

      // Validate gender
      const validGenders = ['Male', 'Female', 'Other'];
      if (!validGenders.includes(formData.gender)) {
        setError('Please select a valid gender');
        return;
      }
      
      // Prepare patient data
      const patientData = {
        name: formData.name.trim(),
        age: age,
        gender: formData.gender.trim(),
        bloodGroup: formData.bloodGroup.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        medicalHistory: formData.medicalHistory?.trim() || '',
        currentMedications: formData.currentMedications?.trim() || '',
        allergies: formData.allergies?.trim() || ''
      };
      
      console.log('Submitting patient data:', patientData);
      
      // Make API call using proxy
      const response = await axios.post('/api/patients', patientData);
      
      console.log('Server response:', response.data);
      
      // Update state
      setPatients([...patients, response.data]);
      setSuccess('Patient added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        gender: '',
        medicalHistory: '',
        currentMedications: '',
        allergies: '',
        bloodGroup: '',
        contactNumber: '',
        address: ''
      });
    } catch (err) {
      console.error('Add patient error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Error adding patient: ';
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
        if (err.response.data.fields) {
          errorMessage += ` (Missing fields: ${err.response.data.fields.join(', ')})`;
        }
        if (err.response.data.errors) {
          errorMessage += ` (${err.response.data.errors.join(', ')})`;
        }
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete patient
  const deletePatient = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/patients/${id}`);
      setPatients(patients.filter(patient => patient._id !== id));
      setSuccess('Patient deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hospital EHR System</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Add Patient Form */}
      <form onSubmit={addPatient} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Current Medications</label>
            <textarea
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </div>
      </form>

      {/* Patient List */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        {loading ? (
          <p>Loading patients...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Blood Group</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id} className="border-b">
                    <td className="px-4 py-2">{patient.name}</td>
                    <td className="px-4 py-2">{patient.age}</td>
                    <td className="px-4 py-2">{patient.gender}</td>
                    <td className="px-4 py-2">{patient.bloodGroup}</td>
                    <td className="px-4 py-2">{patient.contactNumber}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deletePatient(patient._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalEHR; 