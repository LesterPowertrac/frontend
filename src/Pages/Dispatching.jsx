import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import config from '../api/config';

import { Link } from 'react-router-dom';
import DraggableRow from '../components/DraggableRow';
import DroppableTableBody from '../components/DroppableTableBody';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
// import styles from '../css/dispatching.module.css'

const Dispatching = React.memo(() => {
// mechanic Iterinary ang next
  const [error, setError] = useState(null);

  const [rows, setRows] = useState([]); // State for dynamic rows

  const [mechanic, setMechanic] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [dispatchDate, setDispatchDate] = useState('');
  const [platenumber, setPlatenumber] = useState('');
  const [time, setTime] = useState('');
  const [assignedNotes, setAssignedNotes] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(new AbortController());
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

// Format date into normal date (M-D-Y)
  const formatDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Format: yyyy-MM-dd
    return regex.test(dateString);
  };
// Format date into normal date (M-D-Y) End


// api
  const getApiUrl = () => {
    if (window.location.hostname === 'localhost') {
      return config.api.local;
    } else {
      return config.api.remote;
    }
  };
  
  const apiUrl = getApiUrl();
// api end

// Mechanictlist
  const handleInputChange = async (e) => {
    const value = e.target.value.toUpperCase();
    setMechanic(value);

    if (value.length > 0) {

      // Abort any ongoing request
        // Abort any ongoing request
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        try {
          const response = await axios.get(`${apiUrl}/mechaniclist/${value}`, 
            {
            signal: abortControllerRef.current.signal,
            headers: { 
              'ngrok-skip-browser-warning': true
            },
          });
          if (mountedRef.current) {
            setSuggestions(response.data); // Ensure response.data is an array of objects
          }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else {
          console.error("Error fetching mechanic names:", error);
        }
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddMechanic = useCallback(() => {
    if (mechanic.trim() !== '') {
      setMechanics(prevMechanics => {
        const updatedMechanics = [...prevMechanics, mechanic];
        localStorage.setItem('mechanics', JSON.stringify(updatedMechanics));
        return updatedMechanics;
      });
      setMechanic('');
    }
  }, [mechanic]);

  const handleRemoveMechanic = useCallback((index) => {
    setMechanics(prevMechanics => {
      const newMechanics = prevMechanics.filter((_, i) => i !== index);
      localStorage.setItem('mechanics', JSON.stringify(newMechanics));
      return newMechanics;
    });
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    setMechanics(prevMechanics => {
      if (!prevMechanics.includes(suggestion)) {
        const updatedMechanics = [...prevMechanics, suggestion];
        localStorage.setItem('mechanics', JSON.stringify(updatedMechanics));
        return updatedMechanics;
      }
      return prevMechanics;
    });
    setMechanic(''); // Clear the input field
    setSuggestions([]); // Clear suggestions
  }, []);
// Mechanictlist end



// Productcso
  const handleSearch = useCallback(async (index) => {
    const controller = new AbortController();
    try {
      const response = await axios.get(`${apiUrl}/customer/${rows[index].ROnumber}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Example custom header
          // Add other headers here if needed
        },
        signal: controller.signal
      });
      const data = response.data;
      // Format the Dateofpurchase field
      if (data.Dateofpurchase) {
        data.Dateofpurchase = formatDate(data.Dateofpurchase);
      }

      setRows(prevRows => {
        const updatedRows = prevRows.map((row, i) => (i === index ? { ...row, ...data } : row));
        localStorage.setItem('rowsss', JSON.stringify(updatedRows));
        return updatedRows;
      });
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        setError('Record not found');
        setRows(prevRows => {
          const updatedRows = prevRows.map((row, i) => (i === index ? { ...row, companyData: null } : row));
          localStorage.setItem('rowsss', JSON.stringify(updatedRows));
          return updatedRows;
        });
      }
    }
  }, [apiUrl, rows]);
// Productcso end

// to save 
// useEffect(() => {
//   mountedRef.current = true;
//   const savedRows = localStorage.getItem('rowsss');
//   const savedMechanics = localStorage.getItem('mechanics');
//   const savedDispatchDate = localStorage.getItem('dispatchDate');
//   const savedPlateNumber = localStorage.getItem('platenumber');
//   const savedTime = localStorage.getItem('time');
//   const savedAssignedNotes = localStorage.getItem('assignedNotes');
//   if (savedRows) {
//     setRows(JSON.parse(savedRows));
//   }
//   if (savedMechanics) {
//     setMechanics(JSON.parse(savedMechanics));
//   }
//   if (savedDispatchDate) {
//     setDispatchDate(savedDispatchDate);
//   }
//   if (savedPlateNumber) {
//     setPlatenumber(savedPlateNumber);
//   }
//   if (savedTime) {
//     setTime(savedTime);
//   }
//   if (savedAssignedNotes) {
//     setAssignedNotes(savedAssignedNotes);
//   }
//   return () => {
//     mountedRef.current = false;
//     abortControllerRef.current.abort(); // Abort ongoing requests on unmount
//   };
// }, []);
// to save end

//export


 // Add data rows
  const handleAddRow = useCallback(() => {
    setRows(prevRows => {
      const newRow = {
      Dateofinspection: '',
      ROnumber: '',
      DOCNumber: '',
      Companyname: '',
      Csdnumber: '',
      Telephone: '',
      Address: '',
      Model: '',
      Remarksnote: '',
      Parts: '',
      Status: '',
      Remarks: ''
    };
    const updatedRows = [...prevRows, newRow];
    localStorage.setItem('rowsss', JSON.stringify(updatedRows));
    return updatedRows;
  });
}, []);
 // Add data rows End

  // Delete data rows
  const handleDeleteRow = useCallback((index) => {
    setRows(prevRows => {
      const updatedRows = prevRows.filter((_, i) => i !== index);
      localStorage.setItem('rowsss', JSON.stringify(updatedRows));
      return updatedRows;
    });
  }, []);
 // Delete data rows End

// Save rows to localstorage
  const handleRowChange = useCallback((index, key, value) => {
    setRows(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [key]: value };
      localStorage.setItem('rowsss', JSON.stringify(updatedRows));
      return updatedRows;
    });
  }, []);
// Save rows to localstorage End

// saveButton functions
const saveButton = useCallback(() => {
  // Ensure there are rows to process
  // if (rows.length === 0) {
  //   setError("No data to save.");
  //   return;
  // }

  // Initialize aggregated data
  const aggregatedData = {
    Dateofinspection: rows.map(row => row.Dateofinspection.trim()).join(", "),
    DOCNumber: rows.map(row => row.DOCNumber).join(", "),
    ROnumber: rows.map(row => row.ROnumber.trim()).join(", "),
    Csdnumber: rows.map(row => row.Csdnumber).join(", "),
    Companyname: rows.map(row => row.Companyname).join(", "),
    MechanicNames: mechanics.map(mechanic => mechanic.trim()).join('/ '), // Assuming `mechanics` is a list of names
    Address: rows.map(row => row.Address.trim()).join(", "),
    Telephone: rows.map(row => row.Telephone.trim()).join(", "),
    Model: rows.map(row => row.Model.trim()).join(", "),
    Remarksnote: rows.map(row => row.IssueAndConcern).join(", "),
    Parts: rows.map(row => row.PartsNeed).join(", "),
    Status: rows.map(row => row.Status).join(", "),
    Remarks: rows.map(row => row.Remarks).join(", "),
    DispatchDate: dispatchDate ? dispatchDate : null,
    Platenumber: platenumber,
    Dispatchtime: time,
    AssignedNotes: assignedNotes
  };


  // Make the POST request with aggregated data
  axios.post(`${apiUrl}/dispatching`, { rows: [aggregatedData] })
    .then(response => {
      // Handle successful response
  
      alert('Data saved successfully!');
      setRefreshKey(whenclicked => whenclicked + 1);
      // Optionally clear the form or reset states
    })
    .catch(error => {
      // Handle errors
      console.error("Error saving data:", error);
      setError("An error occurred while saving the data.");
    });
}, [rows, mechanics, dispatchDate, platenumber, time, assignedNotes]);

// saveButton functions End

  //Itinerary functions
    useEffect(() => {
      const fetchItinerary = async () => {
        try {
          const response = await axios.get(`${apiUrl}/dispatchingmechanicnames`, {
            headers: { 
              'ngrok-skip-browser-warning': true
            }
          });
          setItinerary(response.data);
        } catch (error) {
          console.error('Error fetching mechanics list:', error);
        }
      };
      fetchItinerary();
    }, [apiUrl, refreshKey]);
  //Itinerary functions end

//save the date,platenumber, time and assigned notes from localstorage
const handleDispatchDateChange = (e) => {
  const value = e.target.value;
  if (isValidDate(newDate)) {
  setDispatchDate(value);
  localStorage.setItem('dispatchDate', value);
} else {
  setDispatchDate(''); // or another default value
}
};

const handlePlateNumberChange = (e) => {
  const value = e.target.value;
  setPlatenumber(value);
  localStorage.setItem('platenumber', value);
};

const handleTimeChange = (e) => {
  const value = e.target.value;
  setTime(value);
  localStorage.setItem('time', value);
};

const handleDispatchNotesChange = (e) => {
  const value = e.target.value;
  setAssignedNotes(value);
  localStorage.setItem('assignedNotes', value);
};
//save the date,platenumber, time and assigned notes from localstorage End


// table row draggable
const [tableData, setTableData] = useState([]); // Ensure it's an array

const moveRow = useCallback((dragIndex, hoverIndex) => {
  const updatedRows = [...rows];
  const [movedRow] = updatedRows.splice(dragIndex, 1);
  updatedRows.splice(hoverIndex, 0, movedRow);
  setRows(updatedRows);
  localStorage.setItem('rowsss', JSON.stringify(updatedRows));
}, [rows]);

const handleDrop = (item) => {
  const { index: dragIndex } = item;
  const hoverIndex = tableData.findIndex((_, index) => index === dragIndex);
  moveRow(dragIndex, hoverIndex);
};
// table row draggable End


  return (
    <div >
        <h1>Dispatching Protoype 3</h1>
     
        <div className="">
        <div className='form-row '>

        {/*  Itinerary */}
        <div className="container">
          <div className="header">
            {/* Save Button */}
            <button className="" onClick={saveButton}>+</button>
             {/* Save Button End */}
            Itinerary
            </div>
          
              <div className="scrollable">
              {itinerary.map((allmechanics, index) => (
                <div key={index} className="list-item">
                  <Link to={`/dispatching/${allmechanics.Recnumber || ''}`} >
                    <span>{index + 1}. </span>
                    <span>
                      {allmechanics.AssignedMechanics ? (
                        allmechanics.AssignedMechanics
                      ) : (
                        'No Mechanic'
                      )}
                      <br />
                      {/* Conditionally render DispatchDate only if it exists */}
                      {allmechanics.DispatchDate ? (
                        `(${new Date(allmechanics.DispatchDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })})`
                      ) : (
                        'No Date' 
                      )}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
        </div>
        {/*  Itinerary End*/}


          {/*  Mechanic inputs */}
          <div className='mechaniclist'>
            <label><b>Mechanic:</b></label>
            <input 
              disabled
              type="text" 
              value={mechanic} 
              onChange={handleInputChange} 
              className='mechanicinput'
            />
            <button disabled onClick={handleAddMechanic}>+</button>
            
            {/* Dropdown for suggestions */}
            {suggestions.length > 0 && (
            <div className='dropdown-content'>
              {suggestions
                .filter(item => item.MechanicName && item.MechanicName.startsWith(mechanic) && item.MechanicName !== mechanic)
                .map((item, index) => (
                  <div key={index} onClick={() => handleSuggestionClick(item.MechanicName)}>
                    {item.MechanicName} 
                  </div>
                ))
              }
            </div>
            )}
        
        
            <div className='scrollable-container'>

            <div ref={ref1}>{/* screenshot */}
            <ul>
          
              {mechanics.map((mech, index) => (
               
                <li key={index}>
                    <span className='mechanicname'><b>{mech}</b></span>
                  <button onClick={() => handleRemoveMechanic(index)} className='deletemechanic'>x</button>
                </li>
               
              ))}
            </ul>
           </div>
            
          </div>
        </div>
{/* dategroup */}

 <div ref={ref2}>
  <div className="">

      <label className="" htmlFor="dispatchDate"><b>Dispatch Date:</b></label>
      <input
        disabled
        id="dispatchDate"
        type="date"
        value={dispatchDate}
        onChange={handleDispatchDateChange}
        className=""
      />
      
      <label className=""htmlFor="plateNumber"  style={{fontSize: '20px',fontWeight: 'bold'}}>Plate No:</label>
      <input
        disabled
        id="plateNumber"
        type="text"
        value={platenumber}
        onChange={handlePlateNumberChange}
        className=""
        style={{fontWeight: 'bold', fontSize: '20px'}}
      />
      
      <label className="" htmlFor="time" style={{fontSize: '30px',fontWeight: 'bold'}}>Time:</label>
      <input
        disabled
        id="time"
        type="time"
        value={time}
        onChange={handleTimeChange}
        className=""
        style={{fontWeight: 'bold', fontSize: '25px', color: 'red'}}
      />

      <Link to='/viewitinerary'  className="">
       <button>View all Itenerary</button>
      </Link>
      </div>
    </div>
     
{/* dategroup end */}
       



{/* Screenshot button */}
  {/* <ScreenshotButton targetRefs={[ref1, ref2, ref3, ref4]} delay={500}/> */}
{/* Screenshot button end*/}

{/* Error Message */}
  {error && <h1 className="">{error}</h1>}
{/* Error Message End */}

{/* Table */}
        <div>

          <br />
          <br />
         <div  className="">

        <div ref={ref3}> {/* screenshot */}
          <DndProvider backend={HTML5Backend}>
          <table >
            <thead>
              <tr>
                <th>#</th>
                <th>Date of Inspection</th>{/* editable */}
                <th>DOC NO.</th>{/* editable */}
                <th>R.O No.</th>{/* search bar */}
                <th>CSD No.</th>{/* editable */}
                <th>CUSTOMER NAME</th>
                <th>LOCATION</th>{/* editable */}
                <th>CONTACT PERSON/CONTACT NO.</th>{/* editable */}
                <th>MODEL</th>
                <th>ISSUE CONCERN</th>{/* editable */}
                <th>PARTS</th>
                <th>STATUS</th>{/* editable */}
                <th>REMARKS</th>{/* editable */}
              </tr>
            </thead>
            <DroppableTableBody onDrop={handleDrop}>
              {rows.map((row, index) => (
                <DraggableRow key={index} index={index} moveRow={moveRow}>
                  <td>
                    {index + 1}{row.index}
                  </td>

                  <td>
                    <input 
                    className=""
                      type="date" 
                      value={row.Dateofinspection} 
                      onChange={(e) => handleRowChange(index, 'Dateofinspection', e.target.value)} 
                    />
                  </td>

                  <td>
                    <input 
                      className=""
                      type="text" value={row.DOCNumber} 
                      onChange={(e) => handleRowChange(index, 'DOCNumber', e.target.value)}  
                      />
                  </td>

                  <td>
                    <input
                      className=""
                      type="text"
                      value={row.ROnumber}
                      onChange={(e) => handleRowChange(index, 'ROnumber', e.target.value)}
                      placeholder="Enter RO"
                    />
                      <button className='search' onClick={() => handleSearch(index)}>Search</button>
                        <br />
                      <button onClick={() => handleDeleteRow(index)}>Delete</button>
                  </td>

                  <td>
                    <input 
                      className=""
                      type="text" 
                      value={row.Csdnumber} 
                      onChange={(e) => handleRowChange(index, 'Csdnumber', e.target.value)} 
                      />
                  </td>

                  <td>
                    <b>
                    {row.Companyname}
                    </b>
                  </td>

                  <td>
                    <textarea 
                      className=""
                      value={row.Address} 
                      onChange={(e) => handleRowChange(index, 'Address', e.target.value)} 
                    />
                  </td>

                  <td>
                    <input 
                      className=""
                      type="text" 
                      value={row.Telephone} 
                      onChange={(e) => handleRowChange(index, 'Telephone', e.target.value)} 
                    />
                  </td>
                  <td>
                    {row.Model}
                  </td>
                  <td>
                    <textarea 
                      className=""
                      value={row.Remarksnote} 
                      onChange={(e) => handleRowChange(index, 'Remarksnote', e.target.value)}
                    />
                  </td>

                  <td>
                    <textarea  
                      className=""
                      value={row.PartsNeed}
                      onChange={(e) => handleRowChange(index, 'PartsNeed', e.target.value)}
                    />
                  </td>

                  <td>
                    <input type="text" 
                      className=""
                      value={row.Status} 
                      onChange={(e) => handleRowChange(index, 'Status', e.target.value)} 
                    />
                  </td>

                  <td>
                    <input 
                      className=""
                      type="text" 
                      value={row.Remarks} 
                      onChange={(e) => handleRowChange(index, 'Remarks', e.target.value)} 
                    />
                  </td>
                {/* </tr> */}
                </DraggableRow>
              ))}
           </DroppableTableBody>
          </table>
          </DndProvider>
          </div>
          </div>


        {/* Add Button */}
          <div className='add-row'>
            <button disabled className='' onClick={handleAddRow}>Add Row</button>
          </div>
        {/* Add Button End*/}


          
        <div ref={ref4}> {/* screenshot */}   
          {/* Notes */}
            <div className="">
              <h3>Notes:</h3>
              <textarea
                  disabled
                  value={assignedNotes}
                  onChange={handleDispatchNotesChange}
                  placeholder='Type here...'>
              </textarea>
            </div>
          {/* Notes End */}
        </div>
        </div>  
{/* Table End */}
        </div>
      </div>
      </div>   
  )
});

export default Dispatching