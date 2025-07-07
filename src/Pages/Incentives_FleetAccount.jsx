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
          Box
       } from '@mui/material'

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2'
import SearchIcon from '@mui/icons-material/Search';
import PDFExportButton2 from '../components/PdfButton2';

const Incentives_FleetAccount = () => {
    const [roNumber, setRoNumber] = useState(''); // Hold RO number input
    const [customerData, setCustomerData] = useState(null); // Hold fetched customer data
    const [options, setOptions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
  
  
    // API URL based on environment
    const getApiUrl = useCallback(() => {
      return window.location.hostname === 'localhost'
        ? config.api.local
        : config.api.remote;
    }, []);
  
    const apiUrl = getApiUrl();
  
    const handleSearch = async () => {
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
          const response = await axios.get(`${apiUrl}/mechaniclist/${inputValue}`);
        // Assuming response.data is an array of objects
        const trimmedOptions = response.data.map(mechanic => ({
          ...mechanic,
          name: mechanic.MechanicName.trim() // Adjust 'name' to the correct property
        }));
        setOptions(trimmedOptions);
        } catch (error) {
          // Suppress 404 error logs
          if (error.response) {
            if (error.response.status === 404) {
              // Display a user-friendly message in the UI
              alert(`Mechanic "${inputValue}" not found.`);
            } else {
              // Log error only in development environment
              if (process.env.NODE_ENV !== 'production') {
                console.error("Error fetching mechanics:", error.response.data);
              }
            }
          } else {
            console.error("Network error or no response:", error);
          }
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
  
          <PDFExportButton2
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
            <Link to='/incentive_advisor'>Dashboard</Link>
            <Link to='/incentive_advisor'>Incentives Advisor</Link>
            <Link to='/monitoring'>Monitoring</Link>
          </Breadcrumbs>
        </Grid>
        </Grid>
        <br/> 
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" id="printable-area-1" >
          <Grid  xs={12} sm={8} sx={{ display: 'flex' }}>
            <h4 className={Styles.TextBlack}><b>INCENTIVE & EVALUATION FORM (FLEET ADVISOR)</b></h4>
          </Grid>
          <Grid  xs={12} sm={4} sx={{ display: 'block', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box display="flex" alignItems="center">
              <TextField
                id="RO number"
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
                <span>Manufacturer/Model: <br/>
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
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status: (Complete/Pending/Canceled)</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
                <span>Service Technicians:</span>
              </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
              {customerData ? (
                <span>Location: <br/>
                  <span className={Styles.TextBlue}>{customerData.Address || ''}</span>
                </span>
                ) : (
                  <span>Location: {''}</span>
                )}
              </td>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
                {customerData ? (
                <span>R.O Concern: <br/>
                  <span className={Styles.TextBlue}>{customerData.Remarksnote || ''}</span>
                </span>
                ) : (
                  <span>R.O Concern: {''}</span>
                )}
              </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
              {customerData ? (
                <span>Actual Done: <br/>
                  <span className={Styles.TextBlue}>{customerData.Actualrepairdone || ''}</span>
                </span>
                ) : (
                  <span>Actual Done: {''}</span>
                )}
              </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
                Date/Remarks: <br/>
                <span className={Styles.InputMiddle}>
                  <input type="date"/>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        </TableContainer>
  
        <br />
        <TableContainer component={Paper}>
       
        <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}} >
          <tbody id="printable-area-4">
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', width: '31%'}} rowSpan={'4'}>
                <span style={{textDecorationLine: 'underline'}}>Quarterly Cash Incentive Program Mechanic:<br/>
                X Rating</span> = Automatic disqualification to recieve 
                cash incentive share on the R.O, <br/>
                <span style={{textDecorationLine: 'underline'}}>3 Accumulated Failed R.O Rating</span> =<br/>
                Disqualification from PTI Quarterly Cash Incentive
                Program
              </td>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'4'}><label >Customer Relations Officer Rating</label></th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}><label >Regional Service Manager</label></th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}><label >Parts Supervisor</label></th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}><label >Warranty Officer Rating</label></th>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'4'}><label >Name:</label><TextField size="small" className= {Styles.TextCenterInput} variant="outlined" value='ANGEL/SHIELA/JENNEFER'/> </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}><label >Name:</label><TextField  size="small" className= {Styles.TextCenterInput} variant="outlined" value='VIVIAN'/> </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}><label >Name:</label><TextField  size="small" className= {Styles.TextCenterInput} variant="outlined" value='JOVEN'/> </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}><label >Name:</label><TextField size="small" className= {Styles.TextCenterInput} variant="outlined" /> </td>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label >Date:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date9"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date10'>Date:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date10"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date11'>Date:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date11"/></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date12'>Date:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date12"/></td>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'4'}>Fleet Service Supervisor Name:<br/> 
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
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Fleet Service Supervisor Name:<br/>
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
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Fleet Service Supervisor Name:<br/>
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
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Fleet Service Supervisor Name:<br/>
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
                          textAlign: 'center' // Center the text
                        },
                      }}
                    />
                  )}
              </td>
            </tr>
            <tr >
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', width: '5rem'}} colSpan={'2'}>RATING:<br/>Check the ff: Pass/Fail or Na(Not Applicable)</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS | FAIL | NA</td>
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
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="2">CASH INCENTIVE SHARE </td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}} colSpan="3"></td>
            </tr>
          </tbody>
        </table>
   
        </TableContainer>
        <br />
        <TableContainer component={Paper}>
       
          <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}}>
            <thead id="printable-area-3">
              <tr>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}></th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Labor Sales</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Parts Sales</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Labor Warranty Sales</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Parts Warranty Sales</th>
              </tr>
            </thead>
            <tbody>
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
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Service Verifier</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Regional Service Manager</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Parts Supervisor</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Service HR</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Warranty Officer</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Accounting</th>
                <th style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>President</th>
              </tr>
      
              <tr>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Angel/Shiela/Jennifer</td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Vivian</td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Joven</td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Rhea</td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}> <TextField sx={{width: '50%'}} name='warranty officer' size="small" variant="outlined"/></td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Jeff</td>
                <td style={{padding: "0.5rem", border:' 1px solid #dddddd', textAlign: 'center'}}>Boss Lito</td>
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

export default Incentives_FleetAccount