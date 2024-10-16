import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../api/config';

const SupplierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({ Supplier_name: '', Supplier_address: '', Tin: '' });

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
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`${apiUrl}/supplier/${id}`);
        setSupplier(response.data);
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    };
    fetchSupplier();
  }, [id, apiUrl]);

  // Single handleChange function for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prevSupplier) => ({ ...prevSupplier, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/supplier/${id}`, supplier);
      alert('Supplier updated successfully');
      navigate('/viewsupplier');
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Failed to update supplier');
    }
  };

  return (
    <div>
      <h1>Edit Supplier</h1>
      <form onSubmit={handleSubmit}>
        <label>Supplier Name:</label>
        <input
          type="text"
          name="Supplier_name"
          value={supplier.Supplier_name || ''}
          onChange={handleChange}
          required
        />
        <br/>
        <label>Supplier Address:</label>
        <input
          type="text"
          name="Supplier_address"
          value={supplier.Supplier_address || ''}
          onChange={handleChange}
          required
        />
        <br/>
        <label>TIN:</label>
        <input
          type="text"
          name="Tin"
          value={supplier.Tin || ''}
          onChange={handleChange}
          required
        />
        <br/><br/>
        <button type="submit">Save</button>
      </form>
      <button onClick={() => navigate('/viewsupplier')}>Cancel</button>
    </div>
  );
};

export default SupplierEdit;
