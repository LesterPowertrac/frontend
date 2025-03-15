import React, { useState, useCallback } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { TextField, Button, CircularProgress } from '@mui/material';
import config from '../api/config';

const SOmonitoring = () => {
  // API setup
  const apiUrl = window.location.hostname === 'localhost' ? config.api.local : config.api.remote;

  const columns = [
    { id: 'id', label: 'No.' },
    { id: 'Date', label: 'DATE' },
    { id: 'ROnumber', label: 'R.O NO.' },
    { id: 'DOCNumber', label: 'DOC NO.' },
    { id: 'AutoIDnumber', label: 'S.O NO.' },
    { id: 'Companyname', label: 'CUSTOMER NAME' },
    { id: 'Telephone', label: 'CONTACT NO.' },
    { id: 'Dateofservice', label: 'DATE OF SERVICE' },
    { id: 'Dateofcompleted', label: 'DATE COMPLETED' },
    { id: 'Address', label: 'LOCATION' },
    { id: 'Model', label: 'UNIT/MODEL' },
    { id: 'Vinchassisno', label: 'VIN./CHASSIS NO' },
    { id: 'ROengineno', label: 'ENGINE NO' },
    { id: 'Remarksnote', label: 'SO CONCERN' },
    { id: 'Dateofpurchase', label: 'DATE PURCHASE' },
    { id: 'chargerwarranty', label: 'UW/FO/CH/CL' },
    { id: 'Serviceentry', label: 'SERVICE ADVISOR' },
    { id: 'Mechaniccodename', label: 'MECHANIC ASSIGNED' },
    { id: 'Actualrepairdone', label: 'REMARKS (Actual repair done)' },
    { id: 'Technicianscomments', label: 'TECHNICIANS COMMENTS' }, 
    { id: 'Pwsno', label: 'Pws No.' },
    { id: 'Approvalconformationlog', label: 'ACL' },
    { id: 'Voc', label: 'VOC (Voice of the customer)' },
    { id: 'Status', label: 'STATUS' },
    { id: 'Followup', label: 'FOLLOW UP' }
  ];

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const formatDate = (dateString) => dateString ? dateString.split('T')[0] : '';

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) {
      setData([]); // Clear table if no date range is selected
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${apiUrl}/somonitoring?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'ngrok-skip-browser-warning': true }
      });

      const filteredData = response.data
        .map(row => ({
          ...row,
          Date: formatDate(row.Date),
          Dateofservice: formatDate(row.Dateofservice),
          Dateofcompleted: formatDate(row.Dateofcompleted),
          Dateofpurchase: formatDate(row.Dateofpurchase)
        }))
        .filter(row => {
          // Only show rows where all of these fields are empty
          const relevantColumns = [
            row.Mechaniccodename,
            row.Actualrepairdone,
            row.Technicianscomments,
            row.Pwsno,
            row.Approvalconformationlog
          ];
          
          return relevantColumns.every(value => !value || value.trim() === '');
        });

      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [apiUrl, startDate, endDate]);

  return (
    <div>
      {/* Date Filter */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        
        {/* Apply Button with Loading Indicator */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchData} 
          disabled={loading} // Disable when loading
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Apply'}
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data.map((row, index) => ({ ...row, id: index + 1 }))}
        title="SO Monitoring"
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default SOmonitoring;
