import React, { useState, useCallback, useEffect  } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { TextField, Button, CircularProgress } from '@mui/material';
import config from '../api/config';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Autocomplete, Box } from '@mui/material';

const RO_monitoring = () => {
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
  const [searchName, setSearchName] = useState('');
  const [companyOptions, setCompanyOptions] = useState([]);
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
        // Only show rows where all of these fields are NOT empty
        const relevantColumns = [
          row.Mechaniccodename,
          row.Actualrepairdone,
          row.Technicianscomments,
          row.Pwsno,
          row.Approvalconformationlog
        ];
        
        return relevantColumns.some(value => value && value.trim() !== '');

      })
      .filter(row =>
        !searchName || row.Companyname?.toLowerCase().includes(searchName.toLowerCase())
      );
    
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [apiUrl, startDate, endDate, searchName]);

  const handleExport = useCallback(async () => {
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Company Data');

    const headerStyle = {
      font: {
        name: 'Calibri', // Set font to Calibri
        size: 14, // Set font size to 14
        bold: true, // Make font bold
        color: { argb: 'black' } // White font color
      },
      fill: {
        type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF200' }
      },
      alignment: { horizontal: 'center', vertical: 'middle',  wrapText: true },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      },
    };

    const cellStyle = {
      font: { size: 12, color: { argb: 'FF000000' } },
      alignment: { horizontal: 'center', vertical: 'middle',  wrapText: true },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      },
    };

    worksheet.columns = [
      { header: 'No.', key: 'index', width: 10 },  
      { header: 'RO.TURN-OVERDATE (DATE ENDORSED).', key: 'ROturn', width: 50 },
      { header: 'DATE OF VALIDATION', key: 'index', width: 30 },
      { header: 'RO Number', key: 'ROnumber', width: 30 },
      { header: 'DOC Number', key: 'DOCNumber', width: 30 },
      { header: 'S.O Number', key: 'AutoIDnumber', width: 30 },
      { header: 'Customer Name', key: 'Companyname', width: 40 },
      { header: 'Contact No.', key: 'Telephone', width: 30 },
      { header: 'DATE OF SERVICE', key: 'Dateofservice', width: 30 },
      { header: 'DATE COMPLETED', key: 'Dateofcompleted', width: 30 },
      { header: 'Location', key: 'Address', width: 50 },
      { header: 'Region', key: 'Region', width: 20 },
      { header: 'Unit/Model', key: 'Model', width: 50 },
      { header: 'VIN./ CHASSIS NO', key: 'Vinchassisno', width: 50 },
      { header: 'ENGINE NO', key: 'ROengineno', width: 50 },
      { header: 'SO CONCERN', key: 'Remarksnote', width: 50 },
      { header: 'DATE PURCHASE', key: 'Dateofpurchase', width: 40 },
      { header: 'UW/FOC/CH/CL', key: 'chargerwarranty', width: 30 },
      { header: 'SERVICE ADVISOR', key: 'Serviceentry', width: 50 },
      { header: 'MECHANIC ASSIGNED', key: 'Mechaniccodename', width: 50 },
      { header: 'REMARKS(Actual repair done)', key: 'Actualrepairdone', width: 50 },
      { header: 'Technicians Comments', key: 'Technicianscomments', width: 50 }, 
      { header: 'Pws No.', key: 'Pwsno', width: 50 },
      { header: 'ACL', key: 'Approvalconformationlog', width: 50 },
      { header: 'Actualrepairdone', key: 'REMARKS (Actual repair done)', width: 50 },
      { header: 'VOC  (Voice of the Customer)', key: 'Voc', width: 60 },
      { header: 'STATUS', key: 'Status', width: 40 },
      { header: 'FOLLOW UP', key: 'Followup', width: 40 }
      
    ];

    // Apply header styles
    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.style = headerStyle;
    });

    // Add data rows
    data.forEach((row) => worksheet.addRow(row));

    // Apply cell styles
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      if (row.number > 1) { // Skip header row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.style = cellStyle;
        });
      }
    });

    // Set the page orientation to portrait
    worksheet.pageSetup = {
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'CompanyData.xlsx');
  }, [data]);

  useEffect(() => {
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/somonitoring`, {
          headers: { 'ngrok-skip-browser-warning': true }
        });
  
        const names = response.data
          .map(row => row.Companyname)
          .filter(Boolean);
  
        const uniqueNames = [...new Set(names)];
        setCompanyOptions(uniqueNames);
      } catch (error) {
        console.error('Failed to fetch company names:', error);
      }
    };
  
    fetchCompanyNames();
  }, [apiUrl]);
  
  return (
    <div>
      {/* Date Filter */}
     

    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
    >
        <Autocomplete
        freeSolo
        disableClearable
        options={companyOptions}
        inputValue={searchName}
        onInputChange={(e, newInputValue) => setSearchName(newInputValue)}
        filterOptions={(options, state) =>
            state.inputValue.trim() === ''
            ? []
            : options.filter(option =>
                option.toLowerCase().includes(state.inputValue.toLowerCase())
                )
        }
        renderInput={(params) => (
            <TextField
            {...params}
            label="Search by Customer Name"
            variant="outlined"
            />
        )}
        sx={{ width: 300 }}
        />

        <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        focused 
        />

        <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        focused
        />

        <Button
        variant="contained"
        color="primary"
        onClick={fetchData}
        disabled={loading}
        >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Apply'}
        </Button>
    </Box>
    </div>

      <Button variant="contained" color="primary" onClick={handleExport}>
        Export to Excel
      </Button>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data.map((row, index) => ({ ...row, id: index + 1 }))}
        title="RO Monitoring"
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default RO_monitoring;
