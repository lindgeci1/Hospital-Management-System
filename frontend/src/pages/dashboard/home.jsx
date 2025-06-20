import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@material-tailwind/react';

export function Home() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [department, setDepartment] = useState([]);
  const [staff, setStaff] = useState([]);
  const [room, setRoom] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [userRole, setUserRole] = useState(null); // State to store role

  // Fetch user data (including role) from the API endpoint
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
        const { role } = response.data;
        setUserRole(role);
        // console.log('Fetched User Role from API:', role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }

    fetchUserRole();
  }, []);

  // Fetch data for dashboard metrics
  useEffect(() => {
    async function fetchData() {
      try {
        const headers = {}; // You can set headers if needed (or rely on cookies being sent automatically)
        const visitResponse = await axios.get('http://localhost:9004/api/visit', { headers, withCredentials: true });
        setVisits(visitResponse.data);

        const patientResponse = await axios.get('http://localhost:9004/api/patient', { headers, withCredentials: true });
        setPatients(patientResponse.data);

        const departmentResponse = await axios.get('http://localhost:9004/api/department', { headers, withCredentials: true });
        setDepartment(departmentResponse.data);

        const staffResponse = await axios.get('http://localhost:9004/api/staff', { headers, withCredentials: true });
        setStaff(staffResponse.data);

        const roomResponse = await axios.get('http://localhost:9004/api/room', { headers, withCredentials: true });
        setRoom(roomResponse.data);

        const medicineResponse = await axios.get('http://localhost:9004/api/medicine', { headers, withCredentials: true });
        setMedicine(medicineResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Visits */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Visits</p>
            <h2 className="text-5xl font-bold">{visits.length}</h2>
            <p className="text-sm text-gray-600">Total visits scheduled</p>
          </div>
        </div>

        {/* Patients */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Patients</p>
            <h2 className="text-5xl font-bold">{patients.length}</h2>
            <p className="text-sm text-gray-600">Total patients registered</p>
          </div>
        </div>

        {/* Departments */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Departments</p>
            <h2 className="text-5xl font-bold">{department.length}</h2>
            <p className="text-sm text-gray-600">Total departments available</p>
          </div>
        </div>

        {/* Staff */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Staffs</p>
            <h2 className="text-5xl font-bold">{staff.length}</h2>
            <p className="text-sm text-gray-600">Total staff members</p>
          </div>
        </div>

        {/* Rooms */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Rooms</p>
            <h2 className="text-5xl font-bold">{room.length}</h2>
            <p className="text-sm text-gray-600">Total rooms available</p>
          </div>
        </div>

        {/* Medicines */}
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5" />
          </svg>
          <div className="text-center">
            <p className="text-gray-500">Medicines</p>
            <h2 className="text-5xl font-bold">{medicine.length}</h2>
            <p className="text-sm text-gray-600">Total medicine available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
