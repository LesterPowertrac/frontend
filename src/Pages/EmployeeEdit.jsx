import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../api/config';

const EmployeeEdit = () => {
    const { id } = useParams(); // Get the employee ID from the URL
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({ Employee_name: '' });

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

    useEffect(() => {
        // Fetch the employee data by ID
        const fetchEmployee = async () => {
          try {
            const response = await axios.get(`${apiUrl}/employee/${id}`);
            setEmployee(response.data);
          } catch (error) {
            console.error('Error fetching employee:', error);
          }
        };
    
        fetchEmployee();
      }, [id, apiUrl]);

      const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.put(`${apiUrl}/employee/${id}`, employee);
          alert('Employee updated successfully');
          navigate('/viewemployee'); // Redirect back to the employee list
        } catch (error) {
          console.error('Error updating employee:', error);
          alert('Failed to update employee');
        }
      };
  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <label>Employee Name:</label>
        <input
          type="text"
          name="Employee_name"
          value={employee.Employee_name}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Save</button>
      </form>
      <button onClick={() => navigate('/viewemployee')}>Cancel</button>
    </div>
  )
}

export default EmployeeEdit