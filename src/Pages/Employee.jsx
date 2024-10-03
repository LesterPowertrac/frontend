import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import config from '../api/config';
import axios from 'axios';

const Employee = () => {

    const [employees, setEmployees] = useState(() => {
        return JSON.parse(localStorage.getItem('employees')) || [];
    });

    
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

    // Function to add a new row
    const addRow = () => {
        const newEmployee = { id: employees.length + 1, name: '' }; // Use timestamp for unique ID
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    };
    
    // Function to handle deleting a row
    const deleteRow = (id) => {
        const updatedEmployees = employees.filter(employee => employee.id !== id);
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees)); // Update localStorage
    };

    // Function to update name and save to localStorage
    const handleNameChange = (id, name) => {
        const updatedEmployees = employees.map(emp =>
            emp.id === id ? { ...emp, name } : emp
        );
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    };
    

    // Function to save employees to the backend
    const handleSave = async () => {
        try {
            for (const employee of employees) {
                if (employee.name) { // Only save employees with names
                    await axios.post(`${apiUrl}/employee`, { Employee_name: employee.name });
                }
            }
            alert('Employees saved successfully');
        } catch (error) {
            console.error('Error saving employees:', error);
            alert('Failed to save employees');
        }
    };
    

  return (
    <div>
        <div className=''>
            <h1>Employee Prototype1</h1>
            <button className='save' onClick={handleSave}>Save</button>
            <Link to='/viewemployee'style={{position: 'absolute', left: '50px'}}>
                <button>View</button>
            </Link>
            <br /><br />
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>
                        <textarea 
                           
                            value={employee.name} 
                            onChange={(e) => handleNameChange(employee.id, e.target.value)} 
                            placeholder="Enter employee name" 
                        />
                        </td>
                        <td>
                            <button onClick={() => deleteRow(employee.id)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <div className='add-row'>
                <button className='' onClick={addRow}>Add Row</button>
            </div>
        </div>
    </div>
  )
}

export default Employee