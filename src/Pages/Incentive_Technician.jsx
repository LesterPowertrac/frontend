import React, { useState, useEffect, useCallback } from 'react';
import config from '../api/config'
import axios from 'axios';
import {
          Breadcrumbs,
          Button, 
          TableContainer,
          Paper,
          TextField,
          IconButton,
          Box
       } from '@mui/material'

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2'
import SearchIcon from '@mui/icons-material/Search';

const Incentive_Technician = () => {
  const [roNumber, setRoNumber] = useState(''); // Hold RO number input
  const [customerData, setCustomerData] = useState(null); // Hold fetched customer data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // API URL based on environment
  const getApiUrl = useCallback(() => {
    return window.location.hostname === 'localhost'
      ? config.api.local
      : config.api.remote;
  }, []);

  const apiUrl = getApiUrl();

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
        try {
            const response = await axios.get(`${apiUrl}/customer/${roNumber}`);
            setCustomerData(response.data);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    }
};

  
  return (
    <div>
    <Grid container spacing={2} alignItems="center">
      {/* Left side: Export Button */}
      <Grid  xs={12} sm={6} md={4} sx={{ flexGrow: 1 }}>
        <Button 
          variant='contained' 
          sx={{ display: 'flex' }}
        >
          Print
        </Button>
      </Grid>

      {/* Middle: Error Alert (if any) */}
      <Grid  xs={12} sm={6} md={4}>
        {/* {error && <Alert severity="error">{error}</Alert>} */}
      </Grid>

      {/* Right side: Breadcrumbs */}
      <Grid   xs={12} sm={12} md={4} display="flex" justifyContent="flex-end">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to='/incentives'>Dashboard</Link>
          <Link to='/incentives'>Incentives Technician</Link>
        </Breadcrumbs>
        </Grid>
      </Grid>
      <br/> 
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid  xs={12} sm={8} sx={{ display: 'flex' }}>
          <h4><b>INCENTIVE & EVALUATION FORM (SERVICE TECHNICIAN)</b></h4>
        </Grid>
        <Grid  xs={12} sm={4} sx={{ display: 'block', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <TextField
              id="RO number"
              label="RO number"
              variant="outlined"
              size="small"
              sx={{ width: '100%' }} // Ensures full-width in responsive layouts
              value={roNumber}
              onKeyDown={handleSearch}
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
     
        <tbody>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>
            {customerData ? (
                <span>Customer Name: {customerData.Companyname || ''}</span>
              ) : (
                <span>Customer Name:{''}</span>
              )}
            </td>
            {customerData ? (
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Manufacturer/Model: {customerData.Model || ''}</td>
             ) : (
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Manufacturer/Model: {''}</td>
             )}
             {customerData ? (
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Chassis Number: {customerData.Vinchassisno || ''}</td>
             ) : (
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Chassis Number: {''}</td>
            )}
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status1:(Complete/Pending/Canceled)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status2:(Complete/Pending/Canceled)</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Status3:(Complete/Pending/Canceled)</td>
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Request:</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Date of Service:</td>
          </tr>
        </tbody>
    
      </table>
      </TableContainer>


      <br />
      <TableContainer component={Paper}>
     
      <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}} >
        <tbody>
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
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date2'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date2"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date3'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date3"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date4'>Date4:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date4"/></td>
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date5'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date5"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date6'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date6"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date7'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date7"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date8'>Date4:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date8"/></td>
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date9'>Date1:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date9"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date10'>Date2:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date10"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date11'>Date3:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date11"/></td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date12'>Date4:</label><input style={{width: '65%', marginLeft: '0.5rem'}} type="date" id="date12"/></td>
          </tr>
          <tr>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'4'}>Technician Name:<br/>{}</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>{}</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>{}</td>
            <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}} colSpan={'3'}>Technician Name:<br/>{}</td>
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
          <thead>
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
          <thead>
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Special Comments:</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>:</td>
            </tr>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>:</td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '105%', border:' 1px solid #dddddd'}}>
          <thead>
            <tr>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Advisor</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Asst. Service Manager</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Parts Manager</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service HR</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Service Verifier</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Accounting</th>
              <th style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>President</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>{}</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Charlie</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Vivian</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Rhea</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Angel/Shiela</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Jeff</td>
              <td style={{padding: "0.5rem", border:' 1px solid #dddddd'}}>Boss Lito</td>
            </tr>
          </tbody>
        </table>
 
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
     
        <table style={{margin: '0.5rem', width: '100%', border:' 1px solid #dddddd'}}>
          <tbody>
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

export default Incentive_Technician