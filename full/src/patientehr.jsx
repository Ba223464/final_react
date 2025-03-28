import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, FileText, Activity, Calendar, Heart
} from 'lucide-react';

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

export default function PatientEHR() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        //const userId = localStorage.getItem('userId');
        const userId='67e64568fdd168648d27e7eb';
        if (!userId) {
          throw new Error('No user logged in');
        }

        const response = await axios.get(`/patients/${userId}`);
        const formattedPatient = transformPatientData(response.data);
        
        setPatient(formattedPatient);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.message || 'Failed to load patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const transformPatientData = (patientData) => {
    return {
      id: patientData._id,
      ehrId: patientData.ehrId,
      name: patientData.patientName,
      age: patientData.age,
      gender: patientData.gender,
      dob: new Date(patientData.dateOfBirth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: patientData.status,
      bloodType: patientData.bloodType,
      bloodPressure: patientData.vitalSigns?.bloodPressure || 'N/A',
      medicalHistory: patientData.medicalHistory || [],
      medications: patientData.medications || [],
      encounters: (patientData.encounters || []).map(encounter => ({
        date: new Date(encounter.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        type: encounter.type,
        provider: encounter.provider,
        notes: encounter.notes
      })),
      contactNumber: patientData.contactNumber,
      address: patientData.address,
      allergies: patientData.allergies,
      currentMedications: patientData.currentMedications
    };
  };

  function SidebarItem({ icon, label, isActive, onClick }) {
    return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center p-3 ${isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-50'} transition-colors rounded-md`}
      >
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
      </button>
    );
  }

  function ProfileSection() {
    if (!patient) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Date of Birth:</strong> {patient.dob}</p>
            <p><strong>EHR ID:</strong> {patient.ehrId}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Contact Number:</strong> {patient.contactNumber}</p>
            <p><strong>Address:</strong> {patient.address}</p>
          </div>
        </div>
      </div>
    );
  }

  function MedicalSection() {
    if (!patient) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Medical Overview</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Blood Type:</strong> {patient.bloodType}</p>
            <p><strong>Blood Pressure:</strong> {patient.bloodPressure}</p>
            <p><strong>Current Status:</strong> {patient.status}</p>
            <p><strong>Allergies:</strong> {patient.allergies || 'None'}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Medical Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Medical History:</strong></p>
            <ul className="list-disc list-inside">
              {patient.medicalHistory.length > 0 
                ? patient.medicalHistory.map((history, index) => (
                    <li key={index}>{history}</li>
                  ))
                : <li>No medical history recorded</li>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function EncountersSection() {
    if (!patient || !patient.encounters.length) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          No medical encounters recorded
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {patient.encounters.map((encounter, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{encounter.type}</h4>
              <span className="text-sm text-gray-600">{encounter.date}</span>
            </div>
            <p><strong>Provider:</strong> {encounter.provider}</p>
            <p><strong>Notes:</strong> {encounter.notes}</p>
          </div>
        ))}
      </div>
    );
  }

  function MedicationsSection() {
    if (!patient) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Current Medications</h3>
        {patient.medications.length > 0 ? (
          <ul className="list-disc list-inside">
            {patient.medications.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>
        ) : (
          <p>No current medications</p>
        )}
      </div>
    );
  }

  // Render content based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'medical':
        return <MedicalSection />;
      case 'encounters':
        return <EncountersSection />;
      case 'medications':
        return <MedicationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  // Logout functionality
  const handleLogout = () => {
    // Clear user authentication
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-600">Loading your health records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
        {error}
        <button 
          onClick={handleLogout} 
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <div className="mb-8 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-3xl">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h2 className="text-xl font-bold">{patient.name}</h2>
          <p className="text-gray-600">Patient Portal</p>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem 
            icon={<User />} 
            label="Profile" 
            isActive={activeSection === 'profile'}
            onClick={() => setActiveSection('profile')}
          />
          <SidebarItem 
            icon={<Heart />} 
            label="Medical Information" 
            isActive={activeSection === 'medical'}
            onClick={() => setActiveSection('medical')}
          />
          <SidebarItem 
            icon={<FileText />} 
            label="Medical Encounters" 
            isActive={activeSection === 'encounters'}
            onClick={() => setActiveSection('encounters')}
          />
          <SidebarItem 
            icon={<Activity />} 
            label="Medications" 
            isActive={activeSection === 'medications'}
            onClick={() => setActiveSection('medications')}
          />
        </nav>

        <div className="mt-8">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            {activeSection === 'profile' ? 'My Profile' : 
             activeSection === 'medical' ? 'Medical Information' : 
             activeSection === 'encounters' ? 'Medical Encounters' : 
             'Medications'}
          </h1>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}