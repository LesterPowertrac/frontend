// SOmonitoring.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { TextField } from '@mui/material';
import config from '../api/config';

const SOmonitoring = () => {
  // API setup
  const getApiUrl = useCallback(() => {
    return window.location.hostname === 'localhost' ? config.api.local : config.api.remote;
  }, []);
  
  const apiUrl = getApiUrl();

  const columns = [
    { id: 'no', label: 'No.' },
    { id: 'ro_turnover_date', label: 'RO.TURN-OVER DATE(DATE ENDORSED)' },
    { id: 'date_validation', label: 'DATE OF VALIDATION' },
    { id: 'ro_no', label: 'R.O NO.' },
    { id: 'doc_no', label: 'DOC NO.' },
    { id: 'so_no', label: 'S.O NO.' },
    { id: 'customer_name', label: 'CUSTOMER NAME' },
    { id: 'contact_no', label: 'CONTACT NO.' },
    { id: 'date_service', label: 'DATE OF SERVICE' },
    { id: 'date_completed', label: 'DATE COMPLETED' },
    { id: 'location', label: 'LOCATION' },
    { id: 'region', label: 'REGION' },
    { id: 'unit_model', label: 'UNIT/MODEL' },
    { id: 'vin_chassis_no', label: 'VIN./CHASSIS NO' },
    { id: 'engine_no', label: 'ENGINE NO' },
    { id: 'so_concern', label: 'SO CONCERN' },
    { id: 'date_purchase', label: 'DATE PURCHASE' },
    { id: 'uw_fo_ch_cl', label: 'UW/FO/CH/CL' },
    { id: 'mechanic_assigned', label: 'MECHANIC ASSIGNED' },
    { id: 'service_advisor', label: 'SERVICE ADVISOR' },
    { id: 'remarks', label: 'REMARKS(Actual repair done)' },
    { id: 'voc', label: 'VOC (Voice of the customer)' },
    { id: 'status', label: 'STATUS' },
    { id: 'follow_up', label: 'FOLLOW UP' }
  ];

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/somonitoring`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Filter data based on selected date
  const filteredData = filterDate
    ? data.filter(row => row.date_service === filterDate)
    : data;

  return (
    <div>
      {/* Date Filter */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <TextField
          label="Filter by Date of Service"
          type="date"
          shrink='true'
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        title="SO Monitoring"
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default SOmonitoring;
