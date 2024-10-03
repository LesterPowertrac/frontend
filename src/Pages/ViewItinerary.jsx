import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../api/config';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

const ViewItinerary = () => {

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // API
    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
        return config.api.local;
        } else {
        return config.api.remote;
        }
    };
    
    const apiUrl = getApiUrl();
    // API End 



  // Update Itinerary
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/dispatching`, {
              headers: { 
                'ngrok-skip-browser-warning': true
              },
            })

            setData(response.data);
        } catch (error) {
          alert('Failed to fetch Data');
        }
        };

        fetchData();
    }, []);
  // Update Itinerary End
  
  // Delete Itinerary
    const deleteItinerary = async (Recnumber) => {
      try {
          await axios.delete(`${apiUrl}/dispatching/${Recnumber}`, {
            headers: { 
              'ngrok-skip-browser-warning': true
            },
          })
            
          setData(data.filter(item => item.Recnumber !== Recnumber));
          alert('Itinerary deleted successfully');
      } catch (error) {
          // console.error('Error deleting itinerary:', error);
          alert('Failed to delete itinerary');
      }
  };
  // Delete Itinerary End

    // Handle null or undefined values safely
    const getValue = (value) => (value !== null && value !== undefined) ? value : 'N/A';

          // Filter data based on search query
          const filteredData = data.filter(item =>
            getValue(item.DateInspection).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.DocNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.RoNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.CsdNo).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.CustomerName).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.LocationAddress).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.ContactPerson).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.Model).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.IssueAndConcern).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.AssignedMechanics).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.PartsNeed).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.StatusJOB).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.RemarksNote).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.DispatchDate).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.Platenumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getValue(item.AssignedNotes).toLowerCase().includes(searchQuery.toLowerCase())
        );
    
  return (
    <div>
      <h1>View Itineraries</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <table>
        <thead>
          <tr>
            <th>No.#</th>
            <th>Actions</th>
            <th>Date of Inspection</th>
            <th>Document Number</th>
            <th>RO Number</th>
            <th>CSD Number</th>
            <th>Company Name</th>
            <th>Address</th>
            <th>Telephone</th>
            <th>Model</th>
            <th>Remarks Note</th>
            <th>Mechanic Names</th>
            <th>Parts</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Dispatch Date</th>
            <th>Plate Number</th>
            <th>Dispatch Time</th>
            <th>Assigned Notes</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>
                <Link to={`/dispatching/${row.Recnumber}`}>
                  <button>Edit</button>
                </Link>
                <br />
                <button onClick={() => deleteItinerary(row.Recnumber)}>Delete</button>
              </td>
              <td>{row.DateInspection}</td>
              <td>{row.DocNumber}</td>
              <td>{row.RoNumber}</td>
              <td>{row.CsdNo}</td>
              <td>{row.CustomerName}</td>
              <td>{row.LocationAddress}</td>
              <td>{row.ContactPerson}</td>
              <td>{row.Model}</td>
              <td>{row.IssueAndConcern}</td>
              <td>{row.AssignedMechanics}</td>
              <td>{row.PartsNeed}</td>
              <td>{row.StatusJOB}</td>
              <td>{row.RemarksNote}</td>
              <td>{row.DispatchDate}</td>
              <td>{row.Platenumber}</td>
              <td>{row.Dispatchtime}</td>
              <td>{row.AssignedNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewItinerary