import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import config from '../api/config';
import axios from 'axios';
// import styles from '../css/dispatching.module.css';

const BudgetandControl = () => {
  const [employees, setEmployees] = useState([]);
  const [budget_controls, setBudget_controls] = useState(() => {
    return JSON.parse(localStorage.getItem('budget_controlss')) || [];
  });

  const getApiUrl = () => {
    return window.location.hostname === 'localhost' ? config.api.local : config.api.remote;
  };

  const apiUrl = getApiUrl();

  const addRow = () => {
    // Get the last PVC number and increment it for the new row
    const lastPVC = budget_controls.length > 0 ? parseInt(budget_controls[budget_controls.length - 1].pvc, 10) : 0; // Default to 0 if no rows
    const newPVC = lastPVC + 1;

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const newBudget_control = {
      id: budget_controls.length + 1,
      dates: [today],
      pvc: newPVC.toString(),
      employee: [''], // Initialize with an empty string for the first input
      date_receipt: [''], // Initialize with an empty string for the first input
      reciept_no: [''], // Initialize with an empty string for the first input
      supplier: [''], // Initialize with an empty string for the first input
      address: [''], // Initialize with an empty string for the first input
      tin: [''], // Initialize with an empty string for the first input
      type: [''], // Initialize with an empty string for the first input
      categories: [''], // Initialize with an empty string for the first input
      gross_amt: [''], // Initialize with an empty string for the first input
      net_vat: [''], // Initialize with an empty string for the first input
      input_vat: [''], // Initialize with an empty string for the first input
      non_vat: [''], // Initialize with an empty string for the first input
      ewt: [''], // Initialize with an empty string for the first input
    };
    
    const updatedBudget_controls = [...budget_controls, newBudget_control];
    setBudget_controls(updatedBudget_controls);
    localStorage.setItem('budget_controlss', JSON.stringify(updatedBudget_controls));
  };

  // Add Input
  const addInput = (id, field) => {
    const updatedBudgetControls = budget_controls.map(control => {
      if (control.id === id) {
        return {
          ...control,
          [field]: [...control[field], '']  // Append an empty string to the respective field
        };
      }
      return control;
    });

    setBudget_controls(updatedBudgetControls);
    localStorage.setItem('budget_controlss', JSON.stringify(updatedBudgetControls)); // Keep local storage in sync
  };

  // Function to delete a row
  const deleteRow = (id) => {
    const updatedBudget_controls = budget_controls.filter(budget_control => budget_control.id !== id);
    setBudget_controls(updatedBudget_controls);
    localStorage.setItem('budget_controlss', JSON.stringify(updatedBudget_controls));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee`); // Adjust the endpoint to your API
        setEmployees(response.data); // Assuming response.data contains an array of employee objects
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSave = async () => {
    try {
      for (const budget_control of budget_controls) {
        if (budget_control.dates.length > 0 && budget_control.pvc.length > 0 && budget_control.employee.length > 0) {
          await axios.post(`${apiUrl}/supplier`, {
            Date: budget_control.dates,
            Pvc_number: budget_control.pvc,
            Employee_name_id: budget_control.employee,
            Date_receipt: budget_control.date_receipt,
            Address_id: budget_control.address,
            Tin_id: budget_control.tin,
            Category_name_id: budget_control.type,
            Gross_amount: budget_control.gross_amt,
            Net_vat: budget_control.net_vat,
            Input_vat: budget_control.input_vat,
            Non_vat: budget_control.non_vat,
            Ewt: budget_control.ewt,
          });
        }
      }
      alert('Supplier saved successfully');
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier');
    }
  };

  const updateBudgetControl = (id, field, index, value) => {
    const updatedBudgetControls = budget_controls.map(control => {
      if (control.id === id) {
        if (Array.isArray(control[field])) {
          const updatedField = [...control[field]];
          updatedField[index] = value; // Update the specific index in the array
          return { ...control, [field]: updatedField };
        }
        return { ...control, [field]: value }; // Update single field value
      }
      return control;
    });
    setBudget_controls(updatedBudgetControls);
    localStorage.setItem('budget_controlss', JSON.stringify(updatedBudgetControls));
  };

  return (
    <div>
      <h1>Budget and Control Prototype</h1>
      <button className='save' onClick={handleSave}>Save</button>
      <Link to='/viewsupplier' style={{ position: 'absolute', left: '50px' }}>
        <button>View</button>
      </Link>

      <br /><br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>DATE</th>
            <th>PVC NO.</th>
            <th>PAYEE</th>
            <th>DATE OF RECEIPT</th>
            <th>RECEIPT/INVOICE NO.</th>
            <th>SUPPLIER NAME</th>
            <th>ADDRESS</th>
            <th>TIN #</th>
            <th>TYPE</th>
            <th>EXPENSE CATEGORY</th>
            <th>GROSS AMT</th>
            <th>NET OF VAT</th>
            <th>INPUT VAT</th>
            <th>NON-VAT</th>
            <th>EWT-INT</th>
          </tr>
        </thead>
        <tbody>
          {budget_controls.map(budget_control => (
            <tr key={budget_control.id}>
              <td>{budget_control.id}</td>

              {/* Dates Input */}
              <td>
                {Array.isArray(budget_control.dates) && budget_control.dates.map((inputValue, index) => (
                  <input
                    key={`date-${index}`}
                    type="date"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'dates', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'dates')}>Add Date</button>
                <button onClick={() => deleteRow(budget_control.id)}>Delete</button>
              </td>

              {/* PVC Input */}
              <td>
                {Array.isArray(budget_control.pvc) && budget_control.pvc.map((inputValue, index) => (
                  <input
                    key={`pvc-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'pvc', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'pvc')}>Add PVC</button>
              </td>

              {/* Employee Select */}
              <td>
                {Array.isArray(budget_control.employee) && budget_control.employee.map((inputValue, index) => (
                  <select
                    key={index} // Ensure a unique key for each select
                    value={inputValue}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'employee', index, e.target.value)}
                  >
                    <option value="" hidden>Select an Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.Employee_name}
                      </option>
                    ))}
                  </select>
                ))}
                <button onClick={() => addInput(budget_control.id, 'employee')}>Add Employee</button>
              </td>

              {/* Date Receipt Input */}
              <td>
                {Array.isArray(budget_control.date_receipt) && budget_control.date_receipt.map((inputValue, index) => (
                  <input
                    key={`date_receipt-${index}`}
                    type="date"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'date_receipt', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'date_receipt')}>Add Receipt Date</button>
              </td>

              {/* Receipt No Input */}
              <td>
                {Array.isArray(budget_control.reciept_no) && budget_control.reciept_no.map((inputValue, index) => (
                  <input
                    key={`reciept_no-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'reciept_no', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'reciept_no')}>Add Receipt No</button>
              </td>

              {/* Supplier Input */}
              <td>
                {Array.isArray(budget_control.supplier) && budget_control.supplier.map((inputValue, index) => (
                  <input
                    key={`supplier-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'supplier', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'supplier')}>Add Supplier</button>
              </td>

              {/* Address Input */}
              <td>
                {Array.isArray(budget_control.address) && budget_control.address.map((inputValue, index) => (
                  <input
                    key={`address-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'address', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'address')}>Add Address</button>
              </td>

              {/* TIN Input */}
              <td>
                {Array.isArray(budget_control.tin) && budget_control.tin.map((inputValue, index) => (
                  <input
                    key={`tin-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'tin', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'tin')}>Add TIN</button>
              </td>

              {/* Type Input */}
              <td>
                {Array.isArray(budget_control.type) && budget_control.type.map((inputValue, index) => (
                  <input
                    key={`type-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'type', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'type')}>Add Type</button>
              </td>

              {/* Categories Input */}
              <td>
                {Array.isArray(budget_control.categories) && budget_control.categories.map((inputValue, index) => (
                  <input
                    key={`categories-${index}`}
                    type="text"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'categories', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'categories')}>Add Category</button>
              </td>

              {/* Gross Amount Input */}
              <td>
                {Array.isArray(budget_control.gross_amt) && budget_control.gross_amt.map((inputValue, index) => (
                  <input
                    key={`gross_amt-${index}`}
                    type="number"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'gross_amt', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'gross_amt')}>Add Gross Amount</button>
              </td>

              {/* Net VAT Input */}
              <td>
                {Array.isArray(budget_control.net_vat) && budget_control.net_vat.map((inputValue, index) => (
                  <input
                    key={`net_vat-${index}`}
                    type="number"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'net_vat', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'net_vat')}>Add Net VAT</button>
              </td>

              {/* Input VAT Input */}
              <td>
                {Array.isArray(budget_control.input_vat) && budget_control.input_vat.map((inputValue, index) => (
                  <input
                    key={`input_vat-${index}`}
                    type="number"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'input_vat', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'input_vat')}>Add Input VAT</button>
              </td>

              {/* Non-VAT Input */}
              <td>
                {Array.isArray(budget_control.non_vat) && budget_control.non_vat.map((inputValue, index) => (
                  <input
                    key={`non_vat-${index}`}
                    type="number"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'non_vat', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'non_vat')}>Add Non-VAT</button>
              </td>

              {/* EWT Input */}
              <td>
                {Array.isArray(budget_control.ewt) && budget_control.ewt.map((inputValue, index) => (
                  <input
                    key={`ewt-${index}`}
                    type="number"
                    value={inputValue || ''}
                    onChange={(e) => updateBudgetControl(budget_control.id, 'ewt', index, e.target.value)}
                  />
                ))}
                <button onClick={() => addInput(budget_control.id, 'ewt')}>Add EWT</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add New Row</button>
    </div>
  );
};

export default BudgetandControl;
