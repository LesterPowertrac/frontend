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

import { Delete as DeleteIcon, FilterList as FilterListIcon } from '@mui/icons-material';


const Pending = () => {
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null); // State for warning message
  const [rows, setRows] = useState([]); // State for dynamic rows
      // Sorting State
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('AutoIDnumber');
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
    const getApiUrl = () => {
      if (window.location.hostname === 'localhost') {
        return config.api.local;
      } else {
        return config.api.remote;
      }
    };
    
    const apiUrl = getApiUrl();

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
  localStorage.setItem('rowss', JSON.stringify(updatedRows));

  // Calculate the new maximum page based on updatedRows
  const maxPage = Math.ceil(updatedRows.length / rowsPerPage) - 1;
  
  // If the current page exceeds the maxPage, set it to maxPage
  if (page > maxPage) {
    setPage(maxPage >= 0 ? maxPage : 0);
  }
};

const handleSearch = async (id) => {
  const row = rows.find((r) => r.id === id);
  if (!row) return; // If the row does not exist, exit the function

  try {
    const response = await axios.get(`${apiUrl}/pending/${row.AutoIDnumber}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const data = response.data;

    // Format the Dateofpurchase field if it exists
    if (data.Dateofpurchase) {
      data.Dateofpurchase = formatDate(data.Dateofpurchase);
    }

    // Update the specific row in the state
    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) =>
        r.id === id ? { ...r, ...data } : r
      );
      localStorage.setItem('rowss', JSON.stringify(updatedRows)); // Save updated data to localStorage
      return updatedRows;
    });

  } catch (err) {
    // Update the specific row with null companyData
    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) =>
        r.id === id ? { ...r, companyData: null } : r
      );
      localStorage.setItem('rowss', JSON.stringify(updatedRows));
      return updatedRows;
    });
  }
};


  useEffect(() => {
    const savedRows = localStorage.getItem('rowss');
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
  

  const handleExport = async () => {
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
      { header: 'S.O Number', key: 'AutoIDnumber', width: 30 },
      { header: 'Customer Name', key: 'Companyname', width: 40 },
      { header: 'RO Number', key: 'ROnumber', width: 30 },
      { header: 'DOC Number', key: 'DOCNumber', width: 30 },
     
      { header: 'Location', key: 'Address', width: 50 },
      { header: 'Unit/Model', key: 'Model', width: 50 },
      { header: 'VIN./ CHASSIS NO', key: 'Vinchassisno', width: 50 },
      { header: 'DATE PURCHASE', key: 'Dateofpurchase', width: 40 },
      { header: 'SO CONCERN', key: 'Remarksnote', width: 50 },
      { header: 'SERVICE ADVISOR', key: 'Serviceentry', width: 50 },
      { header: 'REMARKS (Actual repair done)', key: 'Actualrepairdone', width: 50 },
      { header: 'STATUS', key: 'Status', width: 40 },
      
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
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      ROnumber: '',
      DOCNumber: '',
      AutoIDnumber: '',
      Companyname: '',
      Address: '',
      Model: '',
      Vinchassisno: '',
      Remarksnote: '',
      Dateofpurchase: '',
      Serviceentry: '',
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    localStorage.setItem('rowss', JSON.stringify(updatedRows));
  };


  const handleRowChange = (id, field, value) => {
    const validFields = [
      'ROnumber',
      'DOCNumber',
      'AutoIDnumber',
      'Companyname',
      'Address',
      'Model',
      'Vinchassisno',
      'Remarksnote',
      'Dateofpurchase',
      'Serviceentry'
    ];
  
    if (!validFields.includes(field)) {
      console.warn(`Attempted to update invalid field: ${field}`);
      return;
    }
  
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => 
        row.id === id ? { ...row, [field]: value } : row
      );
      localStorage.setItem('rowss', JSON.stringify(updatedRows));
      return updatedRows;
    });
  };

  return (
    <div className="App">
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
        <Breadcrumbs >
          <Link to='/pending'>Dashboard</Link>
          <Link to='/pending'>Pending</Link>
        </Breadcrumbs>
      </Grid>
    </Grid>

    <br/> 
      
      <div>
      {warning && <h1 style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{warning}</h1>}
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
        <Table >
          <TableHead>
            <TableRow>
            {/* Master Checkbox */}
              <TableCell padding="checkbox" sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                <Checkbox
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
              {/*SO #  */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>
                  RO.TURN-OVER DATE(DATE ENDORSED)
              </TableCell>
              {/*Account Name  */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Account Name</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>RO #</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DOC #</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Location</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>UNIT/MODEL</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>CHASSIS</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>DATE PURCHASE</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>SO CONCERN</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>SERVICE ADVISOR</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>REMARKS</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                key={row.id}
                selected={isItemSelected}
              >
              <TableCell padding="checkbox" sx={{ borderRight: '1px solid #ccc' }}>
                <Checkbox
                  checked={isItemSelected}
                  onChange={(event) => handleClick(event, row.id)}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </TableCell>                

              <TableCell sx={{ borderRight: '1px solid #ccc' }}>{page * rowsPerPage + index + 1}</TableCell>
          
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                  <input
                      type="text"
                      value={row.AutoIDnumber}
                      onChange={(e) => handleRowChange(row.id, 'AutoIDnumber', e.target.value)}
                      placeholder="Enter SO"
                    />
                    <div style={{textAlign: 'center'}}>
                    <Button size="small" sx={{margin: '1rem'}}  variant='contained' onClick={() => handleSearch(row.id)}>Search</Button >
                    </div>           
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>{row.Companyname}</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                  <input
                    type="text"
                    value={row.ROnumber}
                    onChange={(e) => handleRowChange(row.id, 'ROnumber', e.target.value)}
                  />

              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                <input type="text" value={row.DOCNumber} onChange={(e) => handleRowChange(row.id, 'DOCNumber', e.target.value)}  />
              </TableCell>
            
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Address}
              </TableCell>

              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Model}
              </TableCell>

              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Vinchassisno}
              </TableCell>

              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Dateofpurchase}
              </TableCell>

              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Remarksnote}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}>
                {row.Serviceentry}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}></TableCell>
              <TableCell sx={{ borderRight: '1px solid #ccc' }}></TableCell>
              </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ width: '100%' }}>
        <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
      <div style={{textAlign: 'center'}}>
        <Button variant="contained" onClick={handleAddRow}>Add Row</Button>
      </div>
      </div>
    </div>
  )
}


export default Pending