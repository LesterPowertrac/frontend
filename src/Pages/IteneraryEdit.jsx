import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from '../api/config';
import axios from 'axios';
import DraggableRow from '../components/DraggableRow';
import DroppableTableBody from '../components/DroppableTableBody';
import DragHandle from '../components/DragHandle';
import ScreenshotButton from '../components/ScreenshotButton';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const IteneraryEdit = () => {
  const {id} = useParams();
  const [mechanic, setMechanic] = useState('');
  const [mechanicname, setMechanicname] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [dispatchDate, setDispatchDate] = useState('');
  const [platenumber, setPlatenumber] = useState('');
  const [dispatchtime, setDispatchtime] = useState('');
  const [assignedNotes, setAssignedNotes] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const [rows, setRows] = useState([
    { dateInspection: '', docNumber: '', roNumber: '', csdNumber: '', customerName: '', location: '', contactNumber: '', model: '',remarksnote: '', parts: '', status: '', remarks: '' }
  ]);

  const handleAddRow = () => {
    setRows([...rows, { dateInspection: '', docNumber: '', roNumber: '', csdNumber: '', customerName: '', location: '', contactNumber: '', model: '', remarksnote: '', parts: '', status: '', remarks: '' }]);
  };

  const handleDeleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
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
 // api end
      
    // Handle click to set the selected index
    const handleClick = (index) => {
      setSelectedIndex(index);
    };


   // Filter the itinerary list based on the selected DispatchDate
  const filteredItinerary = itinerary.filter(item => {
    if (!filterDate) return true; // If no filter is selected, show all
    const dispatchDate = item.DispatchDate?.split('T')[0]; // Assuming DispatchDate is in ISO format, we split it to get the date part only
    return dispatchDate === filterDate;
  });
 
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Handle invalid dates
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`; // Ensure YYYY-MM-DD format
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return ''; // Return empty string if there's an error
    }
  };

useEffect(() => {
  axios.get(`${apiUrl}/dispatching/${id}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    }
  })
  .then(res => {
    const data = res.data;
    
    // Ensure all dates are correctly formatted
    setRows(prevRows => {
      return prevRows.map(row => ({
        ...row,
        dateInspection: formatDate(row.dateInspection),
      }));
    });

    const splitData = {
      DateInspection: data.DateInspection ? data.DateInspection.split('|') : [],
      DocNumber: data.DocNumber ? data.DocNumber.split('|') : [],
      RoNumber: data.RoNumber ? data.RoNumber.split('|') : [],
      CsdNo: data.CsdNo ? data.CsdNo.split('|') : [],
      CustomerName: data.CustomerName ? data.CustomerName.split('|') : [],
      LocationAddress: data.LocationAddress ? data.LocationAddress.split('|') : [],
      ContactPerson: data.ContactPerson ? data.ContactPerson.split('|') : [],
      Model: data.Model ? data.Model.split('|') : [],
      IssueAndConcern: data.IssueAndConcern ? data.IssueAndConcern.split('|') : [],
      PartsNeed: data.PartsNeed ? data.PartsNeed.split('|') : [],
      StatusJOB: data.StatusJOB ? data.StatusJOB.split('|') : [],
      RemarksNote: data.RemarksNote ? data.RemarksNote.split('|') : []
    };

    // Get the maximum length of any column
    const maxLength = Math.max(
      splitData.DateInspection.length,
      splitData.DocNumber.length,
      splitData.RoNumber.length,
      splitData.CsdNo.length,
      splitData.CustomerName.length,
      splitData.LocationAddress.length,
      splitData.ContactPerson.length,
      splitData.Model.length,
      splitData.IssueAndConcern.length,
      splitData.PartsNeed.length,
      splitData.StatusJOB.length,
      splitData.RemarksNote.length
    );

    // Create rows from split data
    const rows = [];
    for (let i = 0; i < maxLength; i++) {
      rows.push({
        dateInspection: splitData.DateInspection[i] || '',
        docNumber: splitData.DocNumber[i] || '',
        roNumber: splitData.RoNumber[i] || '',
        csdNumber: splitData.CsdNo[i] || '',
        customerName: splitData.CustomerName[i] || '',
        location: splitData.LocationAddress[i] || '',
        contactNumber: splitData.ContactPerson[i] || '',
        model: splitData.Model[i] || '',
        remarksnote: splitData.IssueAndConcern[i] || '',
        parts: splitData.PartsNeed[i] || '',
        status: splitData.StatusJOB[i] || '',
        remarks: splitData.RemarksNote[i] || ''
      });
    }

    setRows(rows);
    setMechanicname(data.AssignedMechanics ? data.AssignedMechanics.split('|') : []);
    setDispatchDate(formatDate(data.DispatchDate || ''));
    setPlatenumber(data.Platenumber || '');
    setDispatchtime(data.Dispatchtime || '');
    setAssignedNotes(data.AssignedNotes || '');
  })
  .catch(err => console.log(err));
}, [id, apiUrl]);


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
  moveRow(dragIndex, dragIndex); // Adjust if needed
};
// table row draggable End


//Add mechanicnames
const handleAddMechanic = () => {
  if (mechanic && !mechanicname.includes(mechanic)) {
    setMechanicname([...mechanicname, mechanic]);
    setMechanic('');
  }
};

const handleSuggestionClick = (name) => {
  setMechanic(name);
  setSuggestions([]);
};


const handleRemoveMechanic = (index) => {
  const updatedMechanics = mechanicname.filter((_, i) => i !== index);
  setMechanicname(updatedMechanics);
};

const mountedRef = useRef(true);
const abortControllerRef = useRef(new AbortController());

const handleInputChange = async (e) => {
  const value = e.target.value.toUpperCase();
 setMechanic(value);

 if (value.length > 0) {

   // Abort any ongoing request
     // Abort any ongoing request
     abortControllerRef.current.abort();
     abortControllerRef.current = new AbortController();

     try {
       const response = await axios.get(`${apiUrl}/mechaniclist/${value}`, {
         signal: abortControllerRef.current.signal,
          headers: {
            'ngrok-skip-browser-warning': 'true', // Example custom header
            // Add other headers here if needed
          }
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
//Add mechanicnames end


// Update Button
const navigate = useNavigate();


const handleSubmit = () => {
  const data = {
    DateInspection: rows.map(row => String(row.dateInspection || '').trim()).join('|'),
    DocNumber: rows.map(row => String(row.docNumber || '').trim()).join('|'),
    RoNumber: rows.map(row => String(row.roNumber || '').trim()).join('|'),
    CsdNo: rows.map(row => String(row.csdNumber || '').trim()).join('|'),
    CustomerName: rows.map(row => String(row.customerName || '').trim()).join('|'),
    LocationAddress: rows.map(row => String(row.location || '').trim()).join('|'),
    ContactPerson: rows.map(row => String(row.contactNumber || '').trim()).join('|'),
    Model: rows.map(row => String(row.model || '').trim()).join('|'),
    IssueAndConcern: rows.map(row => String(row.remarksnote || '').trim()).join('|'),
    PartsNeed: rows.map(row => String(row.parts || '').trim()).join('|'),
    StatusJOB: rows.map(row => String(row.status || '').trim()).join('|'),
    RemarksNote: rows.map(row => String(row.remarks || '').trim()).join('|'),
    AssignedMechanics: mechanicname.map(name => String(name || '').trim()).join('|'),
    DispatchDate: dispatchDate,
    Platenumber: platenumber,
    Dispatchtime: dispatchtime,
    AssignedNotes: assignedNotes
  };

  axios.put(`${apiUrl}/dispatching/${id}`, data, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    }
  })
    .then(res => {
      if (res.status === 200) {
        alert("Update successful");
        setRefreshKey(whenclicked => whenclicked + 1);
      } else {
        alert("Error: Update failed");
      }
    })
    .catch(err => {
      console.error("Error during update:", err);
      alert("An error occurred while updating. Please try again.");
    });
};

const handleDispatchNotesChange = (e) => {
  const value = e.target.value;
  setAssignedNotes(value);
  localStorage.setItem('assignedNotes', value);
};

// Update Button End

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
        console.error('Error fetching itinerary data:', error);
      }
    };
    fetchItinerary();
  }, [apiUrl, refreshKey]);

// search
const handleSearch = useCallback(async (index) => {
  const controller = new AbortController();
  try {
    const response = await axios.get(`${apiUrl}/customer/${rows[index].roNumber}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Example custom header
        // Add other headers here if needed
      },
      signal: controller.signal
    });
    const data = response.data;

    // Map API response fields to internal data structure
    const updatedData = {
      dateInspection: data.Dateofinspection || '',
      docNumber: data.DOCNumber || '',
      roNumber: data.ROnumber || '',
      csdNumber: data.Csdnumber || '',
      customerName: data.Companyname || '',
      location: data.Address || '',
      contactNumber: data.Telephone || '',
      model: data.Model || '',
      remarksnote: data.Remarksnote || '',
      parts: data.Parts || '',
      status: data.Status || '',
      remarks: data.Remarks || ''
    };

    setRows(prevRows => {
      const updatedRows = prevRows.map((row, i) => (i === index ? { ...row, ...updatedData } : row));
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



  return (
    <div>   
        {/* {error && <p>{error}</p>} */}
        <div >

        <h1> {selectedIndex !== null ? `Itinerary #${selectedIndex + 1}` : 'Itinerary'}</h1>
        
        <div className='form-row'>
          {/* Itinerary Section */}
          <div className="container">

            <div className="header">
            <Link to='/dispatching'>
              <button >Back</button>
            </Link>
              Itinerary
            </div>
            {/* Date Filter Input */}
              <input 
                  type="date" 
                  value={filterDate} 
                  onChange={e => setFilterDate(e.target.value)} 
                  placeholder="Filter by Dispatch Date"
                />
            {/* Date Filter Input End */}
            <div className="scrollable">
             {filteredItinerary.map((allmechanics, index) => (
                <div key={index} className="list-item"> 
                    <Link to={`/dispatching/${allmechanics.Recnumber || ''}`} onClick={() => handleClick(index)}>
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

          {/* Mechanic Inputs */}

          <div className='mechaniclist'>
            <label>Mechanic:</label>
            <input
              type="text"
              value={mechanic}
              onChange={handleInputChange}
              className='mechanicinput'
            />
            <button onClick={handleAddMechanic}>+</button>

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
              <div >{/* screenshot */}
                <ul>
                {mechanicname.map((mech, index) => (
                    <li key={index} ref={ref1}> 
                      <span className='mechanicname'>{mech}</span>
                      <button onClick={() => handleRemoveMechanic(index)} className='deletemechanic'>x</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

              <br/>
            
               <div >
                   {/* Screenshot button */}
               <ScreenshotButton targetRefs={[ref1, ref2, ref3, ref4]} delay={500}/>
               {/* Screenshot button end*/}
               </div>
               
          </div>

          {/* Date Group */}

          <div ref={ref2}>
          <div >

            <label htmlFor="dispatchDate"><b>Dispatch Date:</b></label>
             <input 
                id="dispatchDate"
                type="date"
                value={dispatchDate} 
                onChange={e => setDispatchDate(e.target.value)}
        
             />

              <label  htmlFor="plateNumber"  style={{fontSize: '20px',fontWeight: 'bold'}}>Plate No:</label> 
              <input 
                id="plateNumber"
                type="text" 
                value={platenumber} 
                onChange={e => setPlatenumber(e.target.value)}  
              
                style={{fontWeight: 'bold', fontSize: '20px'}}
              />

              <label  htmlFor="time" style={{fontSize: '30px',fontWeight: 'bold'}}>Time:</label>
              <input 
                id="time"
                type="time" 
                value={dispatchtime} 
                onChange={e => setDispatchtime(e.target.value)}
                style={{fontWeight: 'bold', fontSize: '25px', color: 'red'}}
               
               />

              <div >
                <Link to='/viewitinerary'>
                  <button>View All Itinerary</button>
                </Link>
              </div>
           </div>
          </div>
          {error && <h1>{error}</h1>}

          {/* Table */}
         
        <div >
          <div ref={ref3}> {/* screenshot */}
            <br/>
          <DndProvider backend={HTML5Backend}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  
                  <th>DOC NO.</th>
                  <th>R.O No.</th>
                  <th>CSD No.</th>
                  <th>CUSTOMER NAME</th>
                  <th>LOCATION</th>
                  <th>CONTACT PERSON/CONTACT NO.</th>
                  <th>MODEL</th>
                  <th>ISSUE CONCERN</th>
                  <th>PARTS</th>
                  <th>Date of Inspection</th>
                  <th>STATUS</th>
                  <th>REMARKS</th>
                </tr>
              </thead>
              <DroppableTableBody onDrop={handleDrop}>
              {rows.map((row, index) => (
                  <DraggableRow key={index} index={index} moveRow={moveRow}>
                  <DragHandle index={index} />
                  <td>
                    <input type="text" value={row.docNumber} 
                  
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].docNumber = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="text" value={row.roNumber} 
                    
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].roNumber = e.target.value;
                      setRows(newRows);
                    }} />
                     <button type="button" onClick={() => handleDeleteRow(index)}>Delete</button>
                     <button type="button" onClick={() => handleSearch(index)}>Search</button>
                  </td>
                  <td>
                    <input type="text" value={row.csdNumber} 
                  
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].csdNumber = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="text" value={row.customerName} 
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].customerName = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <textarea value={row.location} 
                  
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].location = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="text" value={row.contactNumber}
                  
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].contactNumber = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                  <textarea  value={row.model}
                    
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].model = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <textarea value={row.remarksnote} 
             
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].remarksnote = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <textarea value={row.parts} 
                
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].parts = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="date" value={row.dateInspection} 
           
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].dateInspection = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="text" value={row.status} 
                  
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].status = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                  <td>
                    <input type="text" value={row.remarks} 
                 
                      onChange={e => {
                      const newRows = [...rows];
                      newRows[index].remarks = e.target.value;
                      setRows(newRows);
                    }} />
                  </td>
                </DraggableRow>
              ))}

              </DroppableTableBody>
            </table>
            </DndProvider>
            </div>
          </div>

        
          <div className='save'>
            <button  onClick={handleSubmit}>Save</button>
            </div>
         </div>

         <div  >
            <button  onClick={handleAddRow}>Add Row</button>
          </div>

          <div ref={ref4}> {/* screenshot */}   
            {/* Notes */}
              <div >
                <h3>Notes:</h3>
                <textarea
                    value={assignedNotes}
                    onChange={handleDispatchNotesChange}
                    placeholder='Type here...'>
                </textarea>
              </div>
            {/* Notes End */}
          </div>
        </div>
    </div>
  );
};

export default IteneraryEdit;