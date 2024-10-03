import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import config from '../api/config';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem('categoriess')) || [];
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
        const newCategories = { id: categories.length + 1, name: '', type: ''}; // Use timestamp for unique ID
        const updatedCategories = [...categories, newCategories];
        setCategories(updatedCategories);
        localStorage.setItem('categoriess', JSON.stringify(updatedCategories));
    };
  
      // Function to handle deleting a row
      const deleteRow = (id) => {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        localStorage.setItem('categoriess', JSON.stringify(updatedCategories)); // Update localStorage
    };
  
    // Function to update name and save to localStorage
    const handleNameChange = (id, name) => {
      const updatedCategories = categories.map(emp =>
          emp.id === id ? { ...emp, name} : emp
      ); 
      setCategories(updatedCategories);
      localStorage.setItem('categoriess', JSON.stringify(updatedCategories));
    };
  
    // Function to update address and save to localStorage
    const handleTypeChange = (id, type) => {
      const updatedCategories = categories.map(emp =>
          emp.id === id ? { ...emp, type} : emp
      ); 
      setCategories(updatedCategories);
      localStorage.setItem('categoriess', JSON.stringify(updatedCategories));
    };
  
      // Function to save category to the backend
      const handleSave = async () => {
        try {
            for (const category of categories) {
                if (category.name && category.type) { // Only save employees with names
                    await axios.post(`${apiUrl}/categories`,
                       { 
                        Category_name: category.name, 
                        Category_type: category.type
                       });
                }
            }
            alert('Categories saved successfully');
        } catch (error) {
            console.error('Error saving categories:', error);
            alert('Failed to save categories');
        }
    };
  return (
    <div>
      <div className=''>
        <h1>Categories Expense Prototype1</h1>
        <button className='save' onClick={handleSave}>Save</button>
        <Link to='/viewcategories'style={{position: 'absolute', left: '50px'}}>
            <button>View</button>
        </Link>
        <br /><br />
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Expense Name</th>
                    <th>Types</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                    <textarea 
                        value={category.name} 
                        onChange={(e) => handleNameChange(category.id, e.target.value)} 
                        placeholder="Enter category name" 
                    />
                    </td>
                    <td>
                      <select 
                        name="Category_type" id="Category_type"
                        value={category.type} 
                        onChange={(e) => handleTypeChange(category.id, e.target.value)} 
                        placeholder="choose category type"
                      >
                        <option value="" hidden>Category type</option>
                        <option value="Expense">Expense</option>
                        <option value="None-Expense">None-Expense</option>
                      </select>
                    </td>
                    <td>
                        <button onClick={() => deleteRow(category.id)}>Delete</button>
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

export default Categories