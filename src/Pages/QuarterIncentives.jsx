import React from "react";
import Table from "../components/Table";

const QuarterIncentives = () => {
  // 🔹 EMPLOYEE INFO
  const data1 = [
    [
      { content: "Employee Code" },
      { content: "ST-001" },
    ],
    [
      { content: "Employee Name" },
      { content: "ACIO, RUEL" },
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
      { content: "12%" },
      { content: "1.25%" },
      { content: "15%" },
    ],
  ];

  // 🔹 MAIN INCENTIVE TABLE
  const columns3 = [
    [
      { label: "PAID REPAIR ORDER SUMMARY", colSpan: 6 },
      { label: "Sales / Charge", colSpan: 2 },
      { label: "Warranty" },
      { label: "Tech Involve", rowSpan: 2 },
      { label: "Sales Incentive", colSpan: 2 },
      { label: "Warranty Incentive", rowSpan: 2 },
      { label: "RO Total" },
      { label: "TOTAL PAID",  rowSpan: 2},
      { label: "TOTAL FAILED", rowSpan: 2 },
      { label: "TOTAL UNPAID", rowSpan: 2 },
    ],
    [
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
      { label: "Tech Incentive Share" },
      { label: "Incentive Share per Tech TOTAL PAID" },
    ],
  ];

  const data3 = [
    [
      { content: "3" },
      { content: "RO-0001" },
      { content: "John Doe" },
      { content: "2024-11-15" },
      { content: "2024-11-20" },
      { content: "₱12,000" },
      { content: "₱8,000" },
      { content: "₱4,000" },
      { content: "60%" },
      { content: "40%" },
      { content: "₱1,500" },
      { content: "₱1,500" },
      { content: "₱1,500" },
      { content: "₱1,500" },
      { content: "?" },
      { content: "?" },   
      { content: "?" },
    ],
  ];

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center gap-10">
        <Table
          title="PTI SERVICE TECHNICIAN INCENTIVE SHARE (Individual Summary)"
          data={data1}
        />

        <span className="text-center font-bold text-red-600">
          NOVEMBER 2024 - APRIL 2025
        </span>

        <Table
          title="ADJUSTABLE FACTOR"
          textCenter="text-end"
          columns={columns2}
          data={data2}
        />
      </div>

      {/* --- MAIN INCENTIVE TABLE --- */}
      <Table
        title="ADJUSTABLE FIGURE"
        textCenter="text-center"
        columns={columns3}
        data={data3}
      />
    </div>
  );
};

export default QuarterIncentives;
