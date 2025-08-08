import React, { useState, useEffect, useCallback } from 'react';
import config from '../api/config'
import axios from 'axios';
import Styles from '../css/Text.module.css'
import {
          Breadcrumbs,
          TableContainer,
          Paper,
          TextField,
          IconButton,
          Autocomplete,
          Box,
          Button
       } from '@mui/material'

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2'
import SearchIcon from '@mui/icons-material/Search';
import PDFExportButton from '../components/PdfButton';

const Incentives_FleetTechnician = () => {
  const [roNumber, setRoNumber] = useState(''); // Hold RO number input
  const [customerData, setCustomerData] = useState(null); // Hold fetched customer data
  const [options, setOptions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const addColumn = () => {
    const newColumnIndex = columns.length + 1;
    setColumns([...columns, { dateId: `date${newColumnIndex}`, techId: `technician-name-${newColumnIndex}` }]);
  };

  const deleteLastColumn = () => {
    // Remove the last column if there are columns present
    if (columns.length > 0) {
      setColumns(columns.slice(0, -1)); // Remove the last column
    }
  };

  // API URL based on environment
  const getApiUrl = useCallback(() => {
    return window.location.hostname === 'localhost'
      ? config.api.local
      : config.api.remote;
  }, []);

  const apiUrl = getApiUrl();

  const handleSearch = async () => {
    if (!roNumber) {
      alert("Please enter an RO number.");
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/customer/${roNumber}`, {
        headers: { 
          'ngrok-skip-browser-warning': true
        }
      });
      setCustomerData(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
    
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();  // Call handleSearch on Enter key press
    }
  };

const [inputValue, setInputValue] = useState('');

  // Fetch mechanics based on inputValue with debouncing
  const fetchOptions = async () => {
    if (inputValue.length > 0) {
      try {
        const response = await axios.get(`${apiUrl}/mechaniclist/${inputValue}`, {
          headers: { 
            'ngrok-skip-browser-warning': true
          }
        });
      // Assuming response.data is an array of objects
      const trimmedOptions = response.data.map(mechanic => ({
        ...mechanic,
        name: mechanic.MechanicName.trim() // Adjust 'name' to the correct property
      }));
      setOptions(trimmedOptions);
      } catch (error) {
        // Suppress 404 error logs
          console.log("Unique name:");
        setOptions([]); // Clear options if there's an error
      }
    } else {
      setOptions([]); // Clear options if input is empty
    }
  };
  

  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      fetchOptions();
    }, 300); // Adjust the debounce time as necessary

    setDebounceTimeout(timeout);
    
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [inputValue]);

  
  return (
    <div>
    <Grid container spacing={2} alignItems="center">
      {/* Left side: Export Button */}
      <Grid  xs={12} sm={6} md={4} sx={{ flexGrow: 1 }}>

        <PDFExportButton
        roNumber={roNumber}
        inputValue={inputValue}
        targetIds={['printable-area-1', 'printable-area-2', 'printable-area-3', 'printable-area-4', 'printable-area-5', 
                    'printable-area-6', 'printable-area-7'
                  ]} 
        filename="combined_report.pdf" sx={{ display: 'flex' }} 
        />
        {/* <Button 
          variant='contained' 
          sx={{ display: 'flex' }}
          onClick={handlePrint}
        >
          Print
        </Button> */}
      </Grid>

      {/* Middle: Error Alert (if any) */}
      <Grid  xs={12} sm={6} md={4}>
        {/* {error && <Alert severity="error">{error}</Alert>} */}
      </Grid>

      {/* Right side: Breadcrumbs */}
      <Grid  xs={12} sm={12} md={4} display="flex" justifyContent="flex-end">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to='/incentive_technician'>Dashboard</Link>
          <Link to='/incentive_technician'>Incentives Technician</Link>
        </Breadcrumbs>
      </Grid>
      </Grid>
      <br/> 
      <div id="printable-area-1"> 
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid  xs={12} sm={8} sx={{ display: 'flex' }}>
          <h4><b>INCENTIVE & EVALUATION FORM (FLEET TECHNICIAN)</b></h4>
        </Grid>
        <Grid  xs={12} sm={4} sx={{ display: 'block', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <TextField
              id="ro-number"
              label="RO number"
              variant="filled"
              size="small"
              sx={{ width: '100%' }} // Ensures full-width in responsive layouts
              value={roNumber}
              onKeyDown={handleKeyDown}
              onChange={(e) => setRoNumber(e.target.value)}
    
            />
            <IconButton color="primary" variant="contained"  onClick={handleSearch} aria-label="search">
              <SearchIcon/>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      </div>
    

      <TableContainer component={Paper} >
      
      <table style={{margin: '0.5rem', width: '105%', border:' 1px solid #dddddd'}} >
        <tbody id="printable-area-2">
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
            {customerData ? (
                <span >Customer Name: <br/>
                  <span className={Styles.TextBlue}>{customerData.Companyname || ''}</span>
                </span>
              ) : (
                <span>Customer Name:{''}</span>
              )}
            </td>
            
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
            {customerData ? (
              <span> Manufacturer/Model: <br/>
                <span className={Styles.TextBlue}>{customerData.Model || ''}</span>
              </span>
             ) : (
              <span>Manufacturer/Model:{''}</span>
             )}
             </td>
             
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
            {customerData ? (
            <span> Chassis Number: <br/>
              <span className={Styles.TextBlue}>{customerData.Vinchassisno || ''}</span>
            </span>
            ) : (
              <span>Chassis Number: {''}</span>
            )}
            </td>

          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status1:(Complete/Pending/Canceled)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status2:(Complete/Pending/Canceled)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status3:(Complete/Pending/Canceled)</td>
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan='3'>
              {customerData ? (
              <span>Comments: <br/>
                <span className={Styles.TextBlue}>{customerData.Actualrepairdone || ''}</span>
              </span>
              ) : (
                <span>Comments: {''}</span>
              )}
            </td>
            {/* <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
              Date of Service: <br/>
              <span className={Styles.InputMiddle}>
                <input type="date"/>
              </span>
            </td> */}
          </tr>
        </tbody>
      </table>
      </TableContainer>

      <br />
      <TableContainer component={Paper}>
        {/* button add */}
        <span className={Styles.PositionLeft}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={addColumn} 
            style={{ marginRight: '8px' }} // Add space to the right of the ADD button
          >
            ADD
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={deleteLastColumn} 
            disabled={columns.length === 0} // Disable if no columns are present
          >
            Delete
          </Button>
        </span>


      <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}} >
        
        <tbody id="printable-area-3">
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', width: '31%'}} rowSpan={'4'}>
              <span style={{textDecorationLine: 'underline'}}>Quarterly Cash Incentive Program Mechanic:<br/>
              X Rating</span> = Automatic disqualification to recieve 
              cash incentive share on the R.O, <br/>
              <span style={{textDecorationLine: 'underline'}}>3 Accumulated Failed R.O Rating</span> =<br/>
              Disqualification from PTI Quarterly Cash Incentive
              Program
            </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date1'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date1"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date2'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date2"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date3'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date3"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date4'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date4"/></td>
            {columns.map((col, index) => (
              <td key={index} style={{ padding: "0.5rem", border: "1px solid #dddddd" }} colSpan="3">
                <label htmlFor={col.dateId}>Date 1:</label>
                <input type="date" id={col.dateId} style={{ width: '65%', marginLeft: '0.5rem' }} />
              </td>
            ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date5'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date5"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date6'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date6"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date7'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date7"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date8'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date8"/></td>
            {columns.map((col, index) => (
              <td key={index} style={{ padding: "0.5rem", border: "1px solid #dddddd" }} colSpan="3">
                <label htmlFor={col.dateId}>Date 2:</label>
                <input type="date" id={col.dateId} style={{ width: '65%', marginLeft: '0.5rem' }} />
              </td>
            ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date9'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date9"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date10'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date10"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date11'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date11"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date12'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date12"/></td>
            {columns.map((col, index) => (
              <td key={index} style={{ padding: "0.5rem", border: "1px solid #dddddd" }} colSpan="3">
                <label htmlFor={col.dateId}>Date 3:</label>
                <input type="date" id={col.dateId} style={{ width: '65%', marginLeft: '0.5rem' }} />
              </td>
            ))}
          </tr>

          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'4'}>Technician Name:<br/> 
              <Autocomplete
              freeSolo
                options={options}
                getOptionLabel={(option) => option.MechanicName ? option.MechanicName.trim() : ''} 
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue.toUpperCase()); 
                  
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.MechanicID}>
                    {option.MechanicName ? option.MechanicName.trim() : option} 
                  </li>
                )}
                renderInput={(params) => <TextField {...params} size='small' variant="outlined"  id="technician-name-1" required />}
              />
            </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>
            <Autocomplete
              freeSolo
                options={options}
                getOptionLabel={(option) => option.MechanicName ? option.MechanicName.trim() : ''} 
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue.toUpperCase()); 
                  
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.MechanicID}>
                    {option.MechanicName ? option.MechanicName.trim() : option} 
                  </li>
                )}
                renderInput={(params) => <TextField {...params} size='small' id="technician-name-2" variant="outlined"  />}
              />
            </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>
            <Autocomplete
              freeSolo
                options={options}
                getOptionLabel={(option) => option.MechanicName ? option.MechanicName.trim() : ''} 
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue.toUpperCase()); 
                  
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.MechanicID}>
                    {option.MechanicName ? option.MechanicName.trim() : option} 
                  </li>
                )}
                renderInput={(params) => <TextField {...params} size='small' id="technician-name-3" variant="outlined" />}
              />
            </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>
            <Autocomplete
              freeSolo
                sx={{textTransform: 'uppercase'}}
                options={options}
                getOptionLabel={(option) => option.MechanicName ? option.MechanicName.trim() : ''} 
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue.toUpperCase()); 
                  
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.MechanicID}>
                    {option.MechanicName ? option.MechanicName.trim() : option} 
                  </li>
                )}
                renderInput={(params) => <TextField id="technician-name-4"  {...params} size='small' variant="outlined" />}
              />
            </td>
            {columns.map((col, index) => (
              <td key={index} style={{ padding: "0.5rem", border: "1px solid #dddddd" }} colSpan="3">
                Technician Name:<br />
                <Autocomplete
                  freeSolo
                  sx={{textTransform: 'uppercase'}}
                  options={options}
                  getOptionLabel={(option) => option.MechanicName ? option.MechanicName.trim() : ''} 
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue.toUpperCase()); 
                    
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.MechanicID}>
                      {option.MechanicName ? option.MechanicName.trim() : option} 
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} size="small" id={col.techId} variant="outlined" />}
                />
              </td>
            ))}
        
          </tr>
          <tr >
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', width: '5rem'}} colSpan={'2'}>RATING:<br/>Check the ff: Pass/Fail or Na(Not Applicable)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
            {columns.map((index) => (
            <td key={index} style={{ padding: "0.5rem", border: '1px solid #dddddd', textAlign: 'center' }} colSpan={'3'}>
              PASS | FAIL | NA
            </td>
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Attendance</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Service Update (Communication)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Reports (Completed/Submitted)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Pictures (Repair/GPS pic.)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Parts (Returned-Used or Not)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >Customer Survey</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
                         {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', width: '2rem'}} colSpan="2">R.O Submitted Date (updated): PASS/FAIL</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
             {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
              
             ))}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="2">CASH INCENTIVE SHARE </td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            {columns.map((index) => (
              <td key={index} style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            ))}
          </tr>
        </tbody>
      </table>
 
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}}>
          <tbody id="printable-area-4">
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}></th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Labor Sales</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Parts Sales</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Labor Warranty Sales</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Parts Warranty Sales</th>
            </tr>
  
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>GENERATED SALES</th>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}><TextField size="small" variant="outlined"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}><TextField size="small" variant="outlined"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}><TextField size="small" variant="outlined"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}><TextField size="small" variant="outlined"/></td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}}>
          <tbody id="printable-area-5">
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Special Comments:</th>
            </tr>
          
         
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
                <TextField sx={{width: '100%'}} size="small" variant="outlined"/>
              </td>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
                <TextField sx={{width: '100%'}} size="small" variant="outlined"/>
              </td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>

      <br />

      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '105%', border:' 1px solid #dddddd'}}>
          <tbody id="printable-area-6">
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Advisor</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Regional Service Manager</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Parts Supervisor</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service HR</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Verifier</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Accounting</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>President</th>
            </tr>
         
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
              {customerData ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={customerData.Serviceentry
                      ? customerData.Serviceentry.charAt(0).toUpperCase() + customerData.Serviceentry.slice(1)
                      : ''}
                    onChange={(e) => {
                      // If you want to update the customerData state with new input, handle it here
                      const updatedData = { ...customerData, Serviceentry: e.target.value };
                      setCustomerData(updatedData);
                    }}
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'blue', // Text color change to blue
                      },
                    }}
                  />
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value=""
                    disabled
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'blue', // Text color change to blue
                      },
                    }}
                  />
                )}
              </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Vivian</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Joven</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Rhea</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Angel/Shiela/Jennifer</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Jeff</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Boss Lito</td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}}>
          <tbody id="printable-area-7">
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Control Number:<TextField sx={{marginLeft: '0.5rem'}} size="small" variant="outlined"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Process By:<TextField sx={{marginLeft: '0.5rem'}} size="small" variant="outlined"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Signature & Date:<TextField sx={{marginLeft: '0.5rem'}} size="small" variant="outlined"/></td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>
    </div>
  )
}

export default Incentives_FleetTechnician