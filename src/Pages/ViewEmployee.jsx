import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../api/config';
import { Link } from 'react-router-dom';

const ViewEmployee = () => {
    const [employees, setEmployees] = useState([]);

        // api
        const getApiUrl = () => {
            if (window.location.hostname === 'localhost') {
            return config.api.local;
            } else {
            return config.api.remote;
            }
        };
        
        const apiUrl = getApiUrl();
        // api end

     // Fetch all employees from backend on load
    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const response = await axios.get(`${apiUrl}/employee`);
            setEmployees(response.data);
          } catch (error) {
            console.error('Error fetching employees:', error);
          }
        };
    
        fetchEmployees();
      }, [apiUrl]);

  // Delete employee function
  const deleteEmployee = async (id) => {
    try {
      // Confirm before deleting
      if (window.confirm('Are you sure you want to delete this employee?')) {
        await axios.delete(`${apiUrl}/employee/${id}`);
        setEmployees(employees.filter((employee) => employee.id !== id)); // Remove from UI
        alert('Employee deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  return (
    <div>
      <h1>View Employees</h1>

      <Link to='/employee' >
            <button>Back</button>
      </Link>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.Employee_name}</td>
              <td>
              <Link to={`/editemployee/${employee.id}`}>
                <button>Edit</button>
              </Link>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewEmployee;