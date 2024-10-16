import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../api/config';
import { Link } from 'react-router-dom';


const ViewSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);

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
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/supplier`);
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, [apiUrl]);

    // Delete employee function
    const deleteSupplier = async (id) => {
      try {
        // Confirm before deleting
        if (window.confirm('Are you sure you want to delete this supplier?')) {
          await axios.delete(`${apiUrl}/supplier/${id}`);
          setSuppliers(suppliers.filter((supplier) => supplier.id !== id)); // Remove from UI
          alert('Supplier deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier');
      }
    };

  return (
    <div>
      <h1>View Suppliers</h1>

      <Link to='/supplier' >
            <button>Back</button>
      </Link>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier Name</th>
            <th>Address</th>
            <th>TIN#</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.Supplier_name}</td>
              <td>{supplier.Supplier_address}</td>
              <td>{supplier.Tin}</td>
              <td>
              <Link to={`/editsupplier/${supplier.id}`}>
                <button>Edit</button>
              </Link>
                <button onClick={() => deleteSupplier(supplier.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>      
    </div>
  )
}

export default ViewSupplier