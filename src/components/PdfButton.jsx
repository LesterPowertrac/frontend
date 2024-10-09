import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfButton = ({ targetIds, filename }) => {
    const handlePDF = async () => {
        const canvases = [];
    
        // Capture each target area individually
        for (let id of targetIds) {
          const input = document.getElementById(id);
          if (input) {
            const canvas = await html2canvas(input);
            canvases.push(canvas);
          }
        }
    
        // Combine canvases into one image
        if (canvases.length > 0) {
          const pdf = new jsPDF();
          let totalHeight = 0;
          const imgWidth = 190; // mm
    
          canvases.forEach((canvas) => {
            totalHeight += (canvas.height * imgWidth) / canvas.width;
          });
    
          let currentHeight = 10;
          canvases.forEach((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            if (currentHeight + imgHeight > pdf.internal.pageSize.height) {
              // If it exceeds the page, create a new page
              pdf.addPage();
              currentHeight = 10; // Reset position for new page
            }
    
            pdf.addImage(imgData, 'PNG', 10, currentHeight, imgWidth, imgHeight);
            currentHeight += imgHeight;
          });
    
          pdf.save(filename);
        }
      };
    
      return (
        <Button variant="contained" color="primary" onClick={handlePDF}>
          Export to PDF
        </Button>
      );
    };
    

export default PdfButton