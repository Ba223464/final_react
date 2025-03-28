import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/api';
import Navbar from './Navbar';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Heart, 
  Clipboard, 
  PlusCircle, 
  Activity 
} from 'lucide-react';

// Loader component for loading state
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

const EHRViewer = () => {
  const [ehrData, setEhrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const patientId = '67e64568fdd168648d27e7eb'; 

  useEffect(() => {
    const fetchEHR = async () => {
      try {
        const data = await fetchWithAuth(`http://localhost:8080/fabric/doctor/view-ehr?patientId=${patientId}`);
        setEhrData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEHR();
  }, [patientId]);

  if (loading) return <Loader />;

  // Helper function to render section with icon
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center mb-4 border-b pb-2">
      <Icon className="mr-3 text-blue-600" size={24} />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
  );

  // Render complex data as a list
  const renderList = (items, emptyMessage = 'No data available') => {
    if (!items || items.length === 0) return <p className="text-gray-500">{emptyMessage}</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={`EHR for Patient ID: ${patientId}`} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Patient Overview Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center">
              <div className="bg-blue-700 p-4 rounded-full mr-6">
                <User size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Patient Electronic Health Record</h1>
                <p className="text-blue-200">Patient ID: {patientId}</p>
              </div>
            </div>
          </div>

          {/* EHR Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Personal Information */}
            <div className="bg-gray-100 p-5 rounded-lg">
              <SectionHeader icon={User} title="Personal Information" />
              {ehrData.personalInfo ? (
                <div className="space-y-2">
                  {Object.entries(ehrData.personalInfo).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium mr-2 capitalize">{key}:</span>
                      <span>{value || 'Not specified'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No personal information available</p>
              )}
            </div>

            {/* Medical History */}
            <div className="bg-gray-100 p-5 rounded-lg">
              <SectionHeader icon={Heart} title="Medical History" />
              {renderList(ehrData.medicalHistory, 'No medical history recorded')}
            </div>

            {/* Medications */}
            <div className="bg-gray-100 p-5 rounded-lg">
              <SectionHeader icon={Clipboard} title="Current Medications" />
              {renderList(ehrData.medications, 'No current medications')}
            </div>

            {/* Allergies */}
            <div className="bg-gray-100 p-5 rounded-lg">
              <SectionHeader icon={PlusCircle} title="Allergies" />
              {renderList(ehrData.allergies, 'No known allergies')}
            </div>
          </div>

          {/* Detailed View Toggle */}
          <details className="p-6 border-t">
            <summary className="cursor-pointer flex items-center">
              <Activity className="mr-2 text-blue-600" />
              <span className="font-semibold">View Full JSON Data</span>
            </summary>
            <pre className="bg-gray-100 p-4 rounded-lg mt-4 overflow-x-auto text-sm">
              {JSON.stringify(ehrData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default EHRViewer;