import React, { useState } from 'react';
// import config from '../api/config';
// import axios from 'axios';
import { 
          Breadcrumbs,
          Button,
          TableContainer,
          Paper
       } from '@mui/material'

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2'

const Incentive_Advisor = () => {

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
          <Link to='/incentives'>Incentives Advisor</Link>
        </Breadcrumbs>
        </Grid>
      </Grid>
      <br/> 
      
      <h4><b>INCENTIVE & EVALUATION FORM(SERVICE ADVISOR)</b></h4>
      <TableContainer component={Paper}>
      <table style={{width: '100%', border:' 1px solid #dddddd'}} >
        <tbody>
          <tr>
            <td style={{border:' 1px solid #dddddd'}}>Customer Name:</td>
            <td style={{border:' 1px solid #dddddd'}}>Manufacturer/Model: </td>
            <td style={{border:' 1px solid #dddddd'}}>Chassis Number:</td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}}>Service Status1:(Complete/Pending/Canceled)</td>
            <td style={{border:' 1px solid #dddddd'}}>Service Status2:(Complete/Pending/Canceled)</td>
            <td style={{border:' 1px solid #dddddd'}}>Service Status3:(Complete/Pending/Canceled)</td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}}>Service Request:</td>
            <td style={{border:' 1px solid #dddddd'}}></td>
            <td style={{border:' 1px solid #dddddd'}}>Date of Service:</td>
          </tr>
        </tbody>
      </table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
      <table style={{width: '100%', border:' 1px solid #dddddd'}} >
        <tbody>
          <tr>
            <td style={{border:' 1px solid #dddddd', width: '31%'}} rowSpan={'4'}>
              <span style={{textDecorationLine: 'underline'}}>Quarterly Cash Incentive Program Mechanic:<br/>
              X Rating</span> = Automatic disqualification to recieve 
              cash incentive share on the R.O, <br/>
              <span style={{textDecorationLine: 'underline'}}>3 Accumulated Failed R.O Rating</span> =<br/>
              Disqualification from PTI Quarterly Cash Incentive
              Program
            </td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'4'}>Customer Relations Officer Rating</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Service manager Rating</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Parts Manager Rating</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Warranty Officer Rating</td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'4'}>Name: ANGEL/SHIELA</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Name: Charlie</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Name: VIVIAN</td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}>Name:</td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'4'}><label htmlFor='date9'>Date: </label><input style={{width: '65%'}} type="date" id="date9"/></td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date10'>Date: </label><input style={{width: '65%'}} type="date" id="date10"/></td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date11'>Date: </label><input style={{width: '65%'}} type="date" id="date11"/></td>
            <td style={{border:' 1px solid #dddddd',}} colSpan={'3'}><label htmlFor='date12'>Date: </label><input style={{width: '65%'}} type="date" id="date12"/></td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} colSpan={'4'}>Service Advisor Name:</td>
            <td style={{border:' 1px solid #dddddd'}} colSpan={'3'}>Service Advisor Name:</td>
            <td style={{border:' 1px solid #dddddd'}} colSpan={'3'}>Service Advisor Name:</td>
            <td style={{border:' 1px solid #dddddd'}} colSpan={'3'}>Service Advisor Name:</td>
          </tr>
          <tr >
            <td style={{border:' 1px solid #dddddd', width: '5rem'}} colSpan={'2'}>RATING:<br/>Check the ff: Pass/Fail or Na(Not Applicable)</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS FAIL NA</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS FAIL NA</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS FAIL NA</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colSpan={'3'}>PASS FAIL NA</td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Attendance</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Service Update (Communication)</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Reports (Completed/Submitted)</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Pictures (Repair/GPS pic.)</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Parts (Returned-Used or Not)</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd'}} >Customer Survey</td>
            <td style={{border:' 1px solid #dddddd'}} >X/✔</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd', width: '2rem'}} colspan="2">R.O Submitted Date (updated): PASS/FAIL</td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}}> <input type="checkbox" /> </td>
          </tr>
          <tr>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colspan="2">CASH INCENTIVE SHARE </td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colspan="3"></td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colspan="3"></td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colspan="3"></td>
            <td style={{border:' 1px solid #dddddd', textAlign: 'center'}} colspan="3"></td>
          </tr>
        </tbody>
      </table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
        <table style={{width: '100%', border:' 1px solid #dddddd'}}>
          <tbody>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}></td>
              <td style={{border:' 1px solid #dddddd'}}>Service Labor Sales</td>
              <td style={{border:' 1px solid #dddddd'}}>Service Parts Sales</td>
              <td style={{border:' 1px solid #dddddd'}}>Labor Warranty Sales</td>
              <td style={{border:' 1px solid #dddddd'}}>Parts Warranty Sales</td>
            </tr>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>GENERATED SALES</td>
              <td style={{border:' 1px solid #dddddd'}}></td>
              <td style={{border:' 1px solid #dddddd'}}></td>
              <td style={{border:' 1px solid #dddddd'}}></td>
              <td style={{border:' 1px solid #dddddd'}}></td>
            </tr>
          </tbody>
        </table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
        <table style={{width: '100%', border:' 1px solid #dddddd'}}>
          <tbody>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>Special Comments:</td>
            </tr>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>:</td>
            </tr>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>:</td>
            </tr>
          </tbody>
        </table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
        <table style={{width: '100%', border:' 1px solid #dddddd'}}>
          <tbody>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>Service Advisor</td>
              <td style={{border:' 1px solid #dddddd'}}>Asst. Service Manager</td>
              <td style={{border:' 1px solid #dddddd'}}>Parts Manager</td>
              <td style={{border:' 1px solid #dddddd'}}>Service HR</td>
              <td style={{border:' 1px solid #dddddd'}}>Service Verifier</td>
              <td style={{border:' 1px solid #dddddd'}}>Accounting</td>
              <td style={{border:' 1px solid #dddddd'}}>President</td>
            </tr>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>Angel/Shiela</td>
              <td style={{border:' 1px solid #dddddd'}}>Charlie</td>
              <td style={{border:' 1px solid #dddddd'}}>Vivian</td>
              <td style={{border:' 1px solid #dddddd'}}>Rhea</td>
              <td style={{border:' 1px solid #dddddd'}}>:</td>
              <td style={{border:' 1px solid #dddddd'}}>Jeff</td>
              <td style={{border:' 1px solid #dddddd'}}>Boss Lito</td>
            </tr>
          </tbody>
        </table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
        <table style={{width: '100%', border:' 1px solid #dddddd'}}>
          <tbody>
            <tr>
              <td style={{border:' 1px solid #dddddd'}}>Control Number:</td>
              <td style={{border:' 1px solid #dddddd'}}>Process By:</td>
              <td style={{border:' 1px solid #dddddd'}}>Signature & Date:</td>
            </tr>
          </tbody>
        </table>
      </TableContainer>
    </div>
  )
}

export default Incentive_Advisor