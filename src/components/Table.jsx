import React from "react";

const Table = ({ columns = [], data = [], title, textCenter }) => {
  // Normalize columns: make sure it's always an array of rows
  const normalizedColumns = Array.isArray(columns[0])
    ? columns // already multi-row
    : [columns]; // wrap single-row headers

  return (
    <div
      className={`overflow-x-auto p-1 rounded-2xl shadow-md bg-white ${
        textCenter || ""
      }`}
    >
      {/* Title */}
      {title && (
        <h2 className="text-lg font-semibold px-4 py-3 border-b border-gray-200 bg-gray-50">
          {title}
        </h2>
      )}

      <table className="min-w-full text-sm text-left border-collapse">
        {/* ---------- TABLE HEADER ---------- */}
        <thead className="bg-gray-100">
          {normalizedColumns.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((col, colIndex) => (
                <th
                  key={colIndex}
                  colSpan={col.colSpan || 1}
                  rowSpan={col.rowSpan || 1}
                  className="px-4 py-2 font-semibold border-2 border-gray-700"
                >
                  {React.isValidElement(col.label)
                    ? col.label
                    : col.label ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* ---------- TABLE BODY ---------- */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  colSpan={cell.colSpan || 1}
                  rowSpan={cell.rowSpan || 1}
                  className="px-4 py-2 border-2 border-gray-700"
                >
                  {React.isValidElement(cell.content)
                    ? cell.content
                    : cell.content ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
