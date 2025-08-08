import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import config from '../api/config';
import axios from 'axios';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState(() => {
    return JSON.parse(localStorage.getItem('supplierss')) || [];
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
      const newSupplier = { id: suppliers.length + 1, name: '', address: '', tin: '' }; // Use timestamp for unique ID
      const updatedSuppliers = [...suppliers, newSupplier];
      setSuppliers(updatedSuppliers);
      localStorage.setItem('supplierss', JSON.stringify(updatedSuppliers));
  };

    // Function to handle deleting a row
    const deleteRow = (id) => {
      const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
      setSuppliers(updatedSuppliers);
      localStorage.setItem('supplierss', JSON.stringify(updatedSuppliers)); // Update localStorage
  };

  // Function to update name and save to localStorage
  const handleNameChange = (id, name) => {
    const updatedSuppliers = suppliers.map(emp =>
        emp.id === id ? { ...emp, name} : emp
    ); 
    setSuppliers(updatedSuppliers);
    localStorage.setItem('supplierss', JSON.stringify(updatedSuppliers));
  };

  // Function to update address and save to localStorage
  const handleAddressChange = (id, address) => {
    const updatedSuppliers = suppliers.map(emp =>
        emp.id === id ? { ...emp, address} : emp
    ); 
    setSuppliers(updatedSuppliers);
    localStorage.setItem('supplierss', JSON.stringify(updatedSuppliers));
  };

  // Function to update TIN and save to localStorage
  const handleTinChange = (id, tin) => {
    const updatedSuppliers = suppliers.map(emp =>
        emp.id === id ? { ...emp, tin} : emp
    ); 
    setSuppliers(updatedSuppliers);
    localStorage.setItem('supplierss', JSON.stringify(updatedSuppliers));
  };

    // Function to save supplier to the backend
    const handleSave = async () => {
      try {
          for (const supplier of suppliers) {
              if (supplier.name, supplier.address, supplier.tin) { // Only save employees with names
                  await axios.post(`${apiUrl}/supplier`,
                     { 
                      Supplier_name: supplier.name, 
                      Supplier_address: supplier.name, 
                      Tin:  supplier.tin
                     });
              }
          }
          alert('Supplier saved successfully');
      } catch (error) {
          console.error('Error saving supplier:', error);
          alert('Failed to save supplier');
      }
  };
  return (
    <div>
           <div className=''>
            <h1>Supplier Prototype1</h1>
            <button className='save' onClick={handleSave}>Save</button>
            <Link to='/viewsupplier'style={{position: 'absolute', left: '50px'}}>
                <button>View</button>
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
                        <td>
                        <textarea 
                           
                            value={supplier.name} 
                            onChange={(e) => handleNameChange(supplier.id, e.target.value)} 
                            placeholder="Enter supplier name" 
                        />
                        </td>
                        <td>
                          <textarea 
                            
                            value={supplier.address} 
                            onChange={(e) => handleAddressChange(supplier.id, e.target.value)} 
                            placeholder="Enter supplier name" 
                          />
                        </td>
                        <td>
                          <textarea 
                            
                            value={supplier.tin} 
                            onChange={(e) => handleTinChange(supplier.id, e.target.value)} 
                            placeholder="Enter supplier name" 
                          />
                        </td>
                        <td>
                            <button onClick={() => deleteRow(supplier.id)}>Delete</button>
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

export default Supplier