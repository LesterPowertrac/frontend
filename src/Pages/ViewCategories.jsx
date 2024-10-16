import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../api/config';
import { Link } from 'react-router-dom';

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);

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

  // Fetch all suppliers from backend on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

    // Delete employee function
    const deleteCategory = async (id) => {
      try {
        // Confirm before deleting
        if (window.confirm('Are you sure you want to delete this category?')) {
          await axios.delete(`${apiUrl}/categories/${id}`);
          setCategories(categories.filter((category) => category.id !== id)); // Remove from UI
          alert('Category deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    };

  return (
    <div>
      <h1>View Expenses</h1>

      <Link to='/categories' >
            <button>Back</button>
      </Link>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Expenses Name</th>
            <th>Type of Expenses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.Category_name}</td>
              <td>{category.Category_type}</td>
              <td>
              <Link to={`/editcategories/${category.id}`}>
                <button>Edit</button>
              </Link>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>      
    </div>
  )
}

export default ViewCategories