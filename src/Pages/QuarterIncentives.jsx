import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axios from "axios";
import config from "../api/config";
import { useCallback } from "react";

const QuarterIncentives = () => {
  // 🔍 API base URL
  const getApiUrl = useCallback(() => {
    if (window.location.hostname === "localhost") {
      return config.api.local;
    } else {
      return config.api.remote;
    }
  }, []);

  const apiUrl = getApiUrl();

  const handleDeleteAllRows = () => {
    if (confirm("Are you sure you want to delete ALL rows?")) {
      setData3([]); // clear state
      localStorage.removeItem("quarterIncentivesData"); // clear localStorage
    }
  };


  // 🔹 EMPLOYEE INFO
  const data1 = [
    [
      { content: "Employee Code" },
      { content: <input type="text" className="w-full border rounded p-1 text-lg" /> },
    ],
    [
      { content: "Employee Name" },
      { content: <input type="text" className="w-full  border rounded p-1 text-lg" /> },
    ],
  ];

  // 🔹 FACTORS TABLE
  const columns2 = [
    { label: "Service Labor Factor" },
    { label: "Spare Parts Factor" },
    { label: "Warranty Labor Factor" },
  ];

  const data2 = [
    [
      { content: 12 +"%" },
      { content:  1.25 +"%" },
      { content: 15 + "%" },
    ],
  ];

  // 🔹 MAIN INCENTIVE TABLE
  const columns3 = [
    [
      { label: "PAID REPAIR ORDER SUMMARY", colSpan: 7 },
      { label: "Sales / Charge", colSpan: 2 },
      { label: "Warranty" },
      { label: "Tech Involve", rowSpan: 2 },
      { label: "Sales Incentive", colSpan: 2 },
      { label: "Warranty Incentive", rowSpan: 1 },
      { label: "RO Total"  },
      { label: "Status", rowSpan: 2 },
      { label: "Total Paid",  rowSpan: 2},
      { label: "Total Failed", rowSpan: 2 },
      { label: "Total Unpaid", rowSpan: 2 },
    ],
    [
      { label: 
        <button
        onClick={handleDeleteAllRows}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
      >
        Delete All
      </button>
      },
      { label: "RO Transaction Count" },
      { label: "Repair Order Number" },
      { label: "Service Advisor" },
      { label: "RO Date" },
      { label: "Completed Date / Reason Failed" },
      { label: "RO Amount" },
      { label: "Service Repair Total" },
      { label: "Spare Parts Total" },
      { label: "Service Repair Share" },
      { label: "Spare Parts Share" },
      { label: "Service Repair Share" }, 
      { label: "Tech Incentive Share" },
      { label: "Incentive Share per Tech TOTAL PAID" },
    ],
  ];

  
  const [data3, setData3] = useState(() => {
    const saved = localStorage.getItem("quarterIncentivesData");
    return saved ? JSON.parse(saved) : []; // Load from localStorage if available
  });
  
  // 🔹 Auto-save to localStorage
  useEffect(() => {
    if (data3.length > 0) {
      localStorage.setItem("quarterIncentivesData", JSON.stringify(data3));
    } else {
      localStorage.removeItem("quarterIncentivesData");
    }
  }, [data3]);


  const handleAddRow = () => {
    const newRow = [
      { content: "" }, // RO Transaction Count
      { content: "" },  // RO Number
      { content: "" },  // Service Advisor
      { content: "" },  // RO Date
      { content: "" },  // Completed Date / Reason Failed
      { content: "" },  // RO Amount
      { content: "" },  // Service Repair Total
      { content: "" },  // Spare Parts Total
      { content: "" },  // Service Repair Share
      { content: "" },  // Spare Parts Share
      { content: "" },  // Tech Incentive Share
      { content: "" },  // Incentive Share per Tech TOTAL PAID
      { content: "" },  // RO Total
      { content: "" },  // Status
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
    ];
    setData3(prev => [...prev, newRow]);
  };



  // 🧩 Insert delete button on the LEFT side
// 2️⃣ When rendering, dynamically inject <input> or <select>
const dataWithDelete = data3.map((row, rowIndex) => [
  {
    content: (
      <button
        onClick={() => handleDeleteRow(rowIndex)}
        className="bg-red-500 hover:bg-red-700 font-semibold px-2 py-2 text-white"
      >
        Delete
      </button>
    ),
  },
  ...row.map((cell, cellIndex) => {
    // Define which columns are editable inputs
    const inputCols = [
      1, // Repair Order Number
      4, // Completed Date / Reason Failed 
      9,
      10,
      11,
      12
    ];
    if (inputCols.includes(cellIndex)) {
      let inputType = "text";
      let inputClass = "border rounded p-1 text-center w-full"; // default
    
      // Completed Date
      if (cellIndex === 4) inputType = "date";
    
      // Numeric fields (except RO Number)
      if ([9, 10, 11, 12].includes(cellIndex)) {
        inputType = "number";
        inputClass = "border rounded p-1 text-center w-20"; // narrower width
      }
    
      // Repair Order Number column
      if (cellIndex === 1) {
        inputType = "text";
        inputClass = "border rounded p-1 text-center w-28"; // custom width
        return {
          content: (
            <div className="flex items-center justify-center gap-1">
              <input
                type={inputType}
                value={cell.content}
                onChange={(e) => {
                  const newData = [...data3];
                  newData[rowIndex][cellIndex].content = e.target.value;
                  setData3(newData);
                }}
                placeholder="Enter RO No."
                className={inputClass}
              />
              <button
                onClick={() => handleSearch(rowIndex)}
                className="bg-gray-200 border border-gray-400 px-2 py-1 rounded hover:bg-gray-300"
              >
                🔍
              </button>
            </div>
          ),
        };
      }
    
      if (cellIndex === 12) ;

      return {
        content: (
          <input
            type={inputType}
            value={cell.content}
            onChange={(e) => {
              const newData = [...data3];
              newData[rowIndex][cellIndex].content = e.target.value;
              setData3(newData);
            }}
            className={inputClass}
          />
        ),
      };
    }
    
    
    

    // Default non-editable cell
    return { content: cell.content };
  }),
]);

const handleDeleteRow = (index) => {
  if (confirm("Delete this row?")) {
    setData3((prev) => prev.filter((_, i) => i !== index));
  }
};

// 🔍 Handle Search by ROnumber
const handleSearch = useCallback(
  async (rowIndex) => {
    const row = data3[rowIndex];
    const ROnumber = row[1]?.content; // column 1 = Repair Order Number

    if (!ROnumber) {
      alert("Please enter a valid RO Number first.");
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/customer/${ROnumber}`, {
        headers: { "ngrok-skip-browser-warning": true },
      });

      const record = response.data;
      if (!record) {
        alert("No record found.");
        return;
      }

      // Update Service Advisor (Serviceentry) and RO Date (Date)
      const newData = [...data3];
      newData[rowIndex][3].content = record.Serviceentry || ""; // RO Date column
      newData[rowIndex][2].content = record.Serviceentry || ""; // Service Advisor column
      newData[rowIndex][3].content = record.Date || record.Dateofservice
      ? new Date(record.Date || record.Dateofservice).toISOString().split('T')[0]
      : "";// RO Date column

      setData3(newData);
      localStorage.setItem("quarterIncentivesData", JSON.stringify(newData));
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to fetch data. Please check the RO Number or try again later.");
    }
  },
  [apiUrl, data3]
);

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center gap-10">
        <Table
          title="PTI SERVICE TECHNICIAN INCENTIVE SHARE (Individual Summary)"
          data={data1}
        />

        <span className="text-center font-bold text-red-600">
          <input type="date" name="" id="" className="text-3xl"/>
        </span>

        <Table
          title="ADJUSTABLE FACTOR"
          textCenter="text-end"
          columns={columns2}
          data={data2}
        />
      </div>

      {/* --- MAIN INCENTIVE TABLE --- */}
      {/* --- MAIN INCENTIVE TABLE --- */}
      <span className="flex justify-between items-center">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + ADD ROWS
        </button>
      </span>
      <Table
        title="ADJUSTABLE FIGURE"
        textCenter="text-center"
        columns={columns3}
        data={dataWithDelete}
      />
    </div>
  );
};

export default QuarterIncentives;
