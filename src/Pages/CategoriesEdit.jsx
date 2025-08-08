import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../api/config';

const CategoriesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ Category_name: '', Category_type: '' });

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
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`${apiUrl}/categories/${id}`);
          setCategory(response.data);
        } catch (error) {
          console.error('Error fetching supplier:', error);
        }
      };
      fetchCategory();
    }, [id, apiUrl]);

      // Single handleChange function for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/categories/${id}`, category);
      alert('Supplier updated successfully');
      navigate('/viewcategories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };
  return (
    <div>
      <h1>Edit Categories</h1>
      <form onSubmit={handleSubmit}>
        <label>Category Name:</label>
        <input
          type="text"
          name="Category_name"
          value={category.Category_name || ''}
          onChange={handleChange}
          required
        />
        <br/>
        <label>Supplier Address:</label>
        <select
          name="Category_type" id="Category_type"
          value={category.Category_type || ''}
          onChange={handleChange}
          required
        >
          <option value="" hidden>Category type</option>
          <option value="Expense">Expense</option>
          <option value="None-Expense">None-Expense</option>
        </select>
        <br/><br/>
        <button type="submit">Save</button>
      </form>
      <button onClick={() => navigate('/viewcategories')}>Cancel</button>
    </div>
  )
}

export default CategoriesEdit