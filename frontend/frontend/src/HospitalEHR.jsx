import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, UserPlus, Bell, Menu, User, X, Clock, FileText, BarChart2, Calendar, Heart, Activity, Settings 
} from 'lucide-react';

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

function PatientFormModal({ isOpen, onClose, patient, onSave, isEditing }) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    status: 'Stable',
    bloodType: '',
    vitalSigns: {
      bloodPressure: ''
    },
    medicalHistory: '',
    medications: '',
    ehrId: '',
    documentHash: '',
    doctorId: '',
    bloodGroup: '',
    contactNumber: '',
    address: '',
    currentMedications: '',
    allergies: ''
  });

  useEffect(() => {
    if (patient && isEditing) {
      setFormData({
        patientName: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || '',
        status: patient.status || 'Stable',
        bloodType: patient.bloodType || '',
        vitalSigns: {
          bloodPressure: patient.bloodPressure || ''
        },
        medicalHistory: Array.isArray(patient.medicalHistory) 
          ? patient.medicalHistory.join('\n') 
          : '',
        medications: Array.isArray(patient.medications) 
          ? patient.medications.join('\n') 
          : '',
        ehrId: patient.ehrId || '',
        documentHash: patient.documentHash || '',
        doctorId: patient.doctorId || '',
        bloodGroup: patient.bloodGroup || '',
        contactNumber: patient.contactNumber || '',
        address: patient.address || '',
        currentMedications: patient.currentMedications || '',
        allergies: patient.allergies || ''
      });
    }
  }, [patient, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested vitalSigns
    if (name === 'bloodPressure') {
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          bloodPressure: value
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      medicalHistory: formData.medicalHistory.split('\n').filter(item => item.trim() !== ''),
      medications: formData.medications.split('\n').filter(item => item.trim() !== '')
    };
    
    onSave(processedData, isEditing);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Patient' : 'Add New Patient'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* doctor edit function change to remove fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EHR ID</label>
              <input
                type="text"
                name="ehrId"
                value={formData.ehrId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
             */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Recovering">Recovering</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Enter each condition on a new line"
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="Enter each medication on a new line"
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
             */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
              <input
                type="text"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HospitalEHR() {
  const [activePatient, setActivePatient] = useState(null);
  const [activePage, setActivePage] = useState('patients');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/data');
        const formattedPatients = transformPatientData(response.data);
        
        setPatients(formattedPatients);
        setFilteredPatients(formattedPatients);
        if (formattedPatients.length > 0) {
          setActivePatient(formattedPatients[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const transformPatientData = (mongoData) => {
    return mongoData.map(record => {
      return {
        id: record._id || record.patientId || 'Unknown',
        ehrId: record.ehrId || 'Unknown',
        name: record.patientName || record.name || 'Unknown Patient',
        age: record.age || 0,
        gender: record.gender || 'Not specified',
        dob: record.dateOfBirth || record.dob || 'Unknown',
        status: record.status || 'Unknown',
        bloodType: record.bloodType || 'Unknown',
        bloodPressure: record.vitalSigns?.bloodPressure || record.bloodPressure || 'N/A',
        lastVisit: new Date(record.updatedAt || Date.now()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        medicalHistory: record.medicalHistory || [],
        medications: record.medications || [],
        encounters: record.encounters?.map(encounter => ({
          date: new Date(encounter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          type: encounter.type || 'Unknown',
          provider: encounter.provider || 'Unknown',
          notes: encounter.notes || 'No notes available'
        })) || [],
        documentHash: record.documentHash || '',
        doctorId: record.doctorId || '',
        bloodGroup: record.bloodGroup || '',
        contactNumber: record.contactNumber || '',
        address: record.address || '',
        currentMedications: record.currentMedications || '',
        allergies: record.allergies || ''
      };
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const results = patients.filter(patient => 
        (patient.name && patient.name.toLowerCase().includes(term)) || 
        (patient.id && patient.id.toLowerCase().includes(term)) ||
        (patient.status && patient.status.toLowerCase().includes(term)) ||
        (patient.ehrId && patient.ehrId.toLowerCase().includes(term)) ||
        (patient.medicalHistory && patient.medicalHistory.some(item => item.toLowerCase().includes(term))) ||
        (patient.medications && patient.medications.some(med => med.toLowerCase().includes(term)))
      );
      setFilteredPatients(results);
    }
  };

  const handleAddPatient = () => {
    setIsEditing(false);
    setShowPatientForm(true);
  };

  const handleEditPatient = () => {
    if (!activePatient) return;
    setIsEditing(true);
    setShowPatientForm(true);
  };

  const handleSavePatient = async (patientData, isEditing) => {
    try {
      if (isEditing && activePatient) {
        const response = await axios.put(`/patients/${activePatient.id}`, patientData);
        
        const updatedPatients = patients.map(patient => 
          patient.id === activePatient.id ? transformPatientData([response.data])[0] : patient
        );
        
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setActivePatient(transformPatientData([response.data])[0]);
        
      } else {
        const response = await axios.post('/patients', patientData);
        
        const newPatient = transformPatientData([response.data])[0];
        const updatedPatients = [...patients, newPatient];
        
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setActivePatient(newPatient);
      }
      
      setShowPatientForm(false);
    } catch (err) {
      console.error('Error saving patient data:', err);
      alert(`Failed to ${isEditing ? 'update' : 'add'} patient: ${err.response?.data?.message || err.message}`);
    }
  };

  // Utility Functions
  function getStatusColor(status) {
    switch(status) {
      case 'Critical': return 'bg-red-500';
      case 'Stable': return 'bg-green-500';
      case 'Recovering': return 'bg-blue-500';
      case 'Scheduled': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  }

  function getStatusTextColor(status) {
    switch(status) {
      case 'Critical': return 'text-red-500';
      case 'Stable': return 'text-green-500';
      case 'Recovering': return 'text-blue-500';
      case 'Scheduled': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  }

  function NavItem({ icon, label, active, expanded, onClick }) {
    return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center p-3 ${active ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-colors`}
      >
        <div className="flex items-center justify-center w-8 h-8">
          {icon}
        </div>
        {expanded && <span className="ml-3">{label}</span>}
      </button>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Health Link</h1>
          ) : (
            <h1 className="text-xl font-bold">HL</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-blue-700">
            <Menu size={20} />
          </button>
        </div>
        <div className="flex-1 mt-6">
          <NavItem 
            icon={<User />} 
            label="Patients" 
            active={activePage === 'patients'} 
            expanded={sidebarOpen} 
            onClick={() => setActivePage('patients')} 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search patients, records..."
                className="bg-transparent border-none outline-none ml-2 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-4">
              {/* <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={handleAddPatient}
              >
                <UserPlus size={16} className="mr-2" />
                <span>Add Patient</span>
              </button> */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">EHR view</h2>
            <p className="text-gray-600">Manage and monitor patient records</p>
            {searchTerm && (
              <div className="mt-2 text-sm text-blue-600">
                {filteredPatients.length === 0 
                  ? "No matching results found" 
                  : `Found ${filteredPatients.length} ${filteredPatients.length === 1 ? 'result' : 'results'} for "${searchTerm}"`}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-blue-600">Loading patient data...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Patient List */}
              <div className="bg-white rounded-lg shadow-md lg:col-span-1 overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-gray-800">
                    {searchTerm ? 'Search Results' : 'Recent Patients'}
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-96">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <div 
                        key={patient.id} 
                        className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${activePatient?.id === patient.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setActivePatient(patient)}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStatusColor(patient.status)}`}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">{patient.name}</h4>
                            {/* <div className="flex items-center text-xs">
                              <span className="text-gray-500">ID: {patient.id}</span>
                              <span className="mx-2">•</span>
                              <span className={`${getStatusTextColor(patient.status)}`}>{patient.status}</span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No patients found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Details */}
              <div className="bg-white rounded-lg shadow-md lg:col-span-3">
                {activePatient ? (
                  <>
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${getStatusColor(activePatient.status)}`}>
                            {activePatient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <h2 className="text-2xl font-bold">{activePatient.name}</h2>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{activePatient.age} years</span>
                              <span className="mx-2">•</span>
                              <span>{activePatient.gender}</span>
                              <span className="mx-2">•</span>
                              <span>DOB: {activePatient.dob}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>EHR ID: {activePatient.ehrId}</span>
                              <span className="mx-2">•</span>
                              <span>Last Updated: {activePatient.lastVisit}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                            onClick={handleEditPatient}
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Patient Details Sections */}
                    <div className="p-6">
                      {/* You can add more detailed sections here about patient's medical information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p><strong>Blood Type:</strong> {activePatient.bloodType}</p>
                            <p><strong>Blood Pressure:</strong> {activePatient.bloodPressure}</p>
                            <p><strong>Medical History:</strong> {activePatient.medicalHistory || 'None'}</p>
                            <p><strong>Allergies:</strong> {activePatient.allergies || 'None'}</p>
                            <p><strong>Medications:</strong> {activePatient.medications || 'None'}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p><strong>Contact Number:</strong> {activePatient.contactNumber}</p>
                            <p><strong>Address:</strong> {activePatient.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Select a patient to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Patient Form Modal */}
      <PatientFormModal 
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
        patient={activePatient}
        onSave={handleSavePatient}
        isEditing={isEditing}
      />
    </div>
  );
}