import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import config from '../api/config'

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Alert,
  Breadcrumbs,
  Button,
  TablePagination
} from '@mui/material';

import { Delete as DeleteIcon } from '@mui/icons-material';

const Monitoring = React.memo(() => {
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null); // State for warning message
    const [rows, setRows] = useState([]); // State for dynamic rows
   // Selection State
    const [selected, setSelected] = useState([]);
    // State for Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
      // Handle page change
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    // Handle change in number of rows per page
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page
    };


    const formatDate = (dateString) => {
      return dateString.split('T')[0]; // Extracts the date part from the ISO string
    };
  
    // api
    const getApiUrl = useCallback(() => {
      if (window.location.hostname === 'localhost') {
        return config.api.local;
      } else {
        return config.api.remote;
      }
    }, []);
    
    const apiUrl = getApiUrl();
// api end

  

  // Selection Handlers
// Selection Handlers
const handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const newSelecteds = rows.map((row) => row.id);
    setSelected(newSelecteds);
    return;
  }
  setSelected([]);
};

const handleClick = (event, id) => {
  const selectedIndex = selected.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1)
    );
  }

  setSelected(newSelected);
};

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleBulkDelete = () => {
    const updatedRows = rows.filter((row) => !selected.includes(row.id));
    setRows(updatedRows);
    setSelected([]);
    localStorage.setItem('rows', JSON.stringify(updatedRows));
  
    // Calculate the new maximum page based on updatedRows
    const maxPage = Math.ceil(updatedRows.length / rowsPerPage) - 1;
    
    // If the current page exceeds the maxPage, set it to maxPage
    if (page > maxPage) {
      setPage(maxPage >= 0 ? maxPage : 0);
    }
  };
  

  const handleSearch = useCallback(async (id) => {
    const row = rows.find(r => r.id === id);
    if (!row) {
      setError('Row not found');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/customer/${row.ROnumber}`, {
        headers: { 
          'ngrok-skip-browser-warning': true
        }
      });
      const data = response.data;
      // Format the Dateofpurchase field
      if (data.Dateofpurchase) {
        data.Dateofpurchase = formatDate(data.Dateofpurchase);
      }
  
      setRows((prevRows) => {
        const updatedRows = prevRows.map((r) => 
          r.id === id ? { ...r, ...data } : r
        );
        localStorage.setItem('rows', JSON.stringify(updatedRows));
        return updatedRows;
      });
  
      setError(null);
      // Check for warning conditions
      let warningMessage = '';
      if (!data.Mechaniccodename && !data.Actualrepairdone) {
        warningMessage = 'NO MECHANIC ASSIGNED AND NO ACTUAL REPAIR DONE';
      } else if (!data.Mechaniccodename) {
        warningMessage = 'NO MECHANIC ASSIGNED';
      } else if (!data.Actualrepairdone) {
        warningMessage = 'NO ACTUAL REPAIR DONE';
      }
      setWarning(warningMessage);
    } catch (err) {
      setError('Record not found');
      setWarning(null);
      setRows((prevRows) => {
        const updatedRows = prevRows.map((r) => 
          r.id === id ? { ...r, Companyname: '*Not Found*', Telephone: '*Not Found*' /* other fields as needed */ } : r
        );
        localStorage.setItem('rows', JSON.stringify(updatedRows));
        return updatedRows;
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, rows]);
  
  useEffect(() => {
    const savedRows = localStorage.getItem('rows');
    if (savedRows) {
      const parsedRows = JSON.parse(savedRows);
      // Assign unique IDs if not present
      const rowsWithIds = parsedRows.map(row => ({
        id: row.id || Date.now() + Math.random(), // Assign if missing
        ...row
      }));
      setRows(rowsWithIds);
    }
  }, []);
  
    const handleExport = useCallback(async () => {
      if (!rows.length) return;
  
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
        { header: 'MECHANIC ASSIGNED', key: 'Mechaniccodename', width: 50 },
        { header: 'SERVICE ADVISOR', key: 'Serviceentry', width: 50 },
        { header: 'REMARKS (Actual repair done)', key: 'Actualrepairdone', width: 50 },
        { header: 'VOC  (Voice of the Customer)', key: 'Voc', width: 60 },
        { header: 'STATUS', key: 'Status', width: 40 },
        { header: 'FOLLOW UP', key: 'Followup', width: 40 }
        
      ];
  
      // Apply header styles
      worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = headerStyle;
      });
  
      // Add data rows
      rows.forEach((row) => worksheet.addRow(row));
  
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
    }, [rows]);
  
    const handleAddRow = useCallback(() => {
      const newRow = {
        id: Date.now(), // Simple unique ID using timestamp
        ROnumber: '',
        DOCNumber: '',
        AutoIDnumber: '',
        Companyname: '',
        Telephone: '',
        Dateofservice: '',
        Dateofcompleted: '',
        Address: '',
        Model: '',
        Vinchassisno: '',
        ROengineno: '',
        Remarksnote: '',
        Dateofpurchase: '',
        chargerwarranty: '',
        Mechaniccodename: '',
        Serviceentry: '',
        Actualrepairdone: '',
        Voc: '',
        Status: '',
        Followup: ''
      };
      const updatedRows = [...rows, newRow];
      setRows(updatedRows);
      localStorage.setItem('rows', JSON.stringify(updatedRows));
    }, [rows]);
    
  

    const handleRowChange = (id, field, value) => {
      const validFields = [
        'ROnumber',
        'DOCNumber',
        'AutoIDnumber',
        'Companyname',
        'Telephone',
        'Dateofservice',
        'Dateofcompleted',
        'Address',
        'Model',
        'Vinchassisno',
        'ROengineno',
        'Remarksnote',
        'Dateofpurchase',
        'chargerwarranty',
        'Mechaniccodename',
        'Serviceentry',
        'Actualrepairdone',
        'Voc',
        'Status',
        'Followup'
      ];
    
      if (!validFields.includes(field)) {
        console.warn(`Attempted to update invalid field: ${field}`);
        return;
      }
    
      setRows((prevRows) => {
        const updatedRows = prevRows.map((row) => 
          row.id === id ? { ...row, [field]: value } : row
        );
        localStorage.setItem('rows', JSON.stringify(updatedRows));
        return updatedRows;
      });
    };
    
  
// src/components/Monitoring.js

return (
  <div >
    <Grid container spacing={2} alignItems="center">
      {/* Left side: Export Button */}
      <Grid  xs={12} sm={6} md={4} sx={{ flexGrow: 1 }}>
        <Button 
          variant='contained' 
          onClick={handleExport} 
          disabled={!rows.length} 
          sx={{ display: 'flex' }}
        >
          Export to Excel
        </Button>
      </Grid>

      {/* Middle: Error Alert (if any) */}
      <Grid  xs={12} sm={6} md={4}>
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>

      {/* Right side: Breadcrumbs */}
      <Grid   xs={12} sm={12} md={4} display="flex" justifyContent="flex-end">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to='/monitoring'>Dashboard</Link>
          <Link to='/monitoring'>Monitoring</Link>
          <Link to='/incentive_advisor'>Incentives-Advisor</Link>
        </Breadcrumbs>
      </Grid>
    </Grid>

     
    <div>
      {warning && <h1 style={{ color: 'red', fontWeight: 'bold', textAlign: 'center',n: 'center' }}>{warning}</h1>}

      {/* Conditional Toolbar for Bulk Actions */}
      {selected.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: (theme) =>
              selected.length > 0 ? theme.palette.action.selected : 'inherit',
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton  onClick={handleBulkDelete}  style={{ color: 'red' }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}
      {/* MUI Table */}
      <TableContainer  component={Paper} style={{ overflowX: 'auto' }} sx={{ borderStyle: 'ridge', borderCollapse: 'collapse', maxHeight: '400px', overflowY: 'auto'}}>
     
      
        <Table>
          <TableHead>
            <TableRow >
              {/* Master Checkbox */}
              <TableCell padding="checkbox" sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                <Checkbox    
                  // name={'checkbox-header'}     
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all rows',
                  }}
                />
              </TableCell>
              {/* Table Headers with Sorting */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                  No.
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                  RO.TURN-OVER DATE(DATE ENDORSED)
              </TableCell>
              {/* Repeat for other headers with appropriate orderBy keys */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DATE OF VALIDATION</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                  R.O NO.
              </TableCell>
              {/* Continue for other headers */}
              {/* Example: */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DOC NO.</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>S.O NO.</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>CONTACT NO.</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DATE OF SERVICE</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DATE COMPLETED</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>LOCATION</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>REGION</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>UNIT/MODEL</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>VIN./CHASSIS NO</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>ENGINE NO</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>SO CONCERN</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DATE PURCHASE</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>UW/FO/CH/CL</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>MECHANIC ASSIGNED</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>SERVICE ADVISOR</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>REMARKS (Actual repair done)</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>VOC (Voice of the customer)</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>STATUS</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>FOLLOW UP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const isItemSelected = isSelected(row.id); // Use unique 'id'
              const labelId = `checkbox-${row.id}`;
              const globalIndex = page * rowsPerPage + index; // If needed for numbering
              return (
                
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id} // Use unique 'id'
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox" sx={{ borderRight: '1px solid #ccc' }}>
                    <Checkbox
                      id={`select-${row.id}`} // Unique id for checkbox
                      name={`select-${row.id}`} // Unique name for checkbox 
                      checked={isItemSelected}
                      onChange={(event) => handleClick(event, row.id)}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                  
                  <TableCell id={labelId}   sx={{ borderRight: '1px solid #ccc' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell id={labelId}  padding="checkbox" sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>
                    <input
                      type="text"
                      id={`ROnumber-${row.id}`} // Unique id for each input
                      name={`ROnumber-${row.id}`} // Unique name for each input
                      value={row.ROnumber}
                      onChange={(e) => handleRowChange(row.id, 'ROnumber', e.target.value)}
                      placeholder="Enter ROnumber"
                    />
                    <div style={{textAlign: 'center',n: 'center'}}>
                    <Button size="small" sx={{margin: '1rem'}}  variant='contained' onClick={() => handleSearch(row.id)}>Search</Button >
                    </div>
                  </TableCell>
                  
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>
                    <input
                      type="text"
                      id={`DOCNumber-${row.id}`} // Unique id for each input
                      name={`DOCNumber-${row.id}`} // Unique name for each input 
                      value={row.DOCNumber}
                      onChange={(e) => handleRowChange(row.id, 'DOCNumber', e.target.value)}
                    />
                  </TableCell>         
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.AutoIDnumber}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Companyname}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Telephone}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>
                    <input
                      type="date"
                      id={`Dateofservice-${row.id}`} // Unique id for each input
                      name={`Dateofservice-${row.id}`} // Unique name for each input
                      value={row.Dateofservice}
                      onChange={(e) => handleRowChange(row.id, 'Dateofservice', e.target.value)}
                    />
                  </TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>
                    <input
                      type="date"
                      id={`Dateofservice-${row.id}`} // Unique id for each input
                      name={`Dateofservice-${row.id}`} // Unique name for each input
                      value={row.Dateofcompleted}
                      onChange={(e) => handleRowChange(row.id, 'Dateofcompleted', e.target.value)}
                    />
                  </TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Address}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Model}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Vinchassisno}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.ROengineno}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Remarksnote}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Dateofpurchase}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.chargerwarranty}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Mechaniccodename || '*No mechanic assigned*'}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Serviceentry}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}>{row.Actualrepairdone || '*No actual repair done*'}</TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                  <TableCell id={labelId}  sx={{ borderRight: '1px solid #ccc' }}></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
          {/* Pagination Component */}

        

      </TableContainer>
      <Paper sx={{ width: '100%' }}>
        <TablePagination
              name={"TablePagination"}
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              id='TablePagination'
            />
        </Paper>
      <div style={{textAlignn: 'center',n: 'center'}}>
        <Button variant="contained" onClick={handleAddRow}>Add Row</Button>
      </div>
    </div>
    
  </div>
);
});

export default Monitoring