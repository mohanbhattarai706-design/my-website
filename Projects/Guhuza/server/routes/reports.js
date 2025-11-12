// server/routes/reports.js - PDF GENERATION API
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// Generate PDF Report
router.post('/generate-pdf', async (req, res) => {
  try {
    const { email, userData, statistics, jobs } = req.body;

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Guhuza_Report_${Date.now()}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Helper function for drawing colored boxes
    const drawBox = (x, y, width, height, color) => {
      doc.fillColor(color).rect(x, y, width, height).fill();
    };

    // Helper function for score color
    const getScoreColor = (score) => {
      if (score >= 80) return '#10b981'; // Green
      if (score >= 60) return '#f59e0b'; // Yellow
      return '#ef4444'; // Red
    };

    // HEADER
    drawBox(0, 0, 595, 100, '#3b82f6');
    doc.fillColor('#ffffff')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('Guhuza Job Posting Report', 50, 30);
    
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Generated on ${new Date().toLocaleDateString('en-US', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, 50, 65);

    doc.moveDown(3);

    // USER INFORMATION
    doc.fillColor('#1f2937')
       .fontSize(18)
       .font('Helvetica-Bold')
       .text('Account Information', 50, 130);

    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#4b5563')
       .text(`Name: ${userData.name || 'Not provided'}`, 50, 160)
       .text(`Email: ${userData.email}`, 50, 180)
       .text(`Company: ${userData.company || 'Not provided'}`, 50, 200)
       .text(`Phone: ${userData.phone || 'Not provided'}`, 50, 220);

    // Divider line
    doc.moveTo(50, 250).lineTo(545, 250).stroke('#e5e7eb');

    // STATISTICS OVERVIEW
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Performance Overview', 50, 270);

    // Statistics boxes
    const statY = 300;
    const boxWidth = 115;
    const boxHeight = 80;
    const boxSpacing = 10;

    // Total Jobs Box
    drawBox(50, statY, boxWidth, boxHeight, '#dbeafe');
    doc.fillColor('#1e40af')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(statistics.totalJobs.toString(), 50, statY + 15, { width: boxWidth, align: 'center' });
    doc.fontSize(10)
       .font('Helvetica')
       .text('Total Jobs', 50, statY + 55, { width: boxWidth, align: 'center' });

    // Active Jobs Box
    drawBox(50 + boxWidth + boxSpacing, statY, boxWidth, boxHeight, '#d1fae5');
    doc.fillColor('#065f46')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(statistics.activeJobs.toString(), 50 + boxWidth + boxSpacing, statY + 15, { width: boxWidth, align: 'center' });
    doc.fontSize(10)
       .font('Helvetica')
       .text('Active Jobs', 50 + boxWidth + boxSpacing, statY + 55, { width: boxWidth, align: 'center' });

    // Draft Jobs Box
    drawBox(50 + (boxWidth + boxSpacing) * 2, statY, boxWidth, boxHeight, '#fef3c7');
    doc.fillColor('#92400e')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(statistics.draftJobs.toString(), 50 + (boxWidth + boxSpacing) * 2, statY + 15, { width: boxWidth, align: 'center' });
    doc.fontSize(10)
       .font('Helvetica')
       .text('Draft Jobs', 50 + (boxWidth + boxSpacing) * 2, statY + 55, { width: boxWidth, align: 'center' });

    // Average Score Box
    drawBox(50 + (boxWidth + boxSpacing) * 3, statY, boxWidth, boxHeight, '#e9d5ff');
    doc.fillColor('#6b21a8')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(statistics.avgScore.toString(), 50 + (boxWidth + boxSpacing) * 3, statY + 15, { width: boxWidth, align: 'center' });
    doc.fontSize(10)
       .font('Helvetica')
       .text('Avg Score', 50 + (boxWidth + boxSpacing) * 3, statY + 55, { width: boxWidth, align: 'center' });

    // Quality Distribution
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Quality Distribution', 50, 410);

    const distY = 435;
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#4b5563')
       .text(`Excellent (80+): ${statistics.excellentJobs} jobs`, 50, distY)
       .text(`Good (60-79): ${statistics.goodJobs} jobs`, 50, distY + 20)
       .text(`Needs Work (<60): ${statistics.needsWorkJobs} jobs`, 50, distY + 40);

    // Creation Method
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Creation Method', 300, 410);

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#4b5563')
       .text(`Smart Builder: ${statistics.smartBuilderJobs} jobs`, 300, distY)
       .text(`Manual Entry: ${statistics.manualEntryJobs} jobs`, 300, distY + 20);

    // New page for job listings
    doc.addPage();

    // JOB LISTINGS HEADER
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Job Listings', 50, 50);

    let currentY = 90;
    const pageHeight = 750;

    jobs.forEach((job, index) => {
      // Check if we need a new page
      if (currentY > pageHeight) {
        doc.addPage();
        currentY = 50;
      }

      // Job card background
      const cardHeight = 110;
      const scoreColor = getScoreColor(job.score);
      
      // Draw colored left border
      drawBox(45, currentY, 5, cardHeight, scoreColor);
      
      // Draw card background
      drawBox(50, currentY, 495, cardHeight, '#f9fafb');

      // Job number and title
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1f2937')
         .text(`${index + 1}. ${job.title}`, 60, currentY + 10, { width: 380 });

      // Job details
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#6b7280')
         .text(`Type: ${job.type === 'smart-builder' ? 'AI Generated' : 'Manual Entry'}`, 60, currentY + 35)
         .text(`Status: ${job.status.charAt(0).toUpperCase() + job.status.slice(1)}`, 60, currentY + 50)
         .text(`Location: ${job.location || 'Not specified'}`, 60, currentY + 65)
         .text(`Employment: ${job.employmentType || 'Not specified'}`, 60, currentY + 80);

      // Score badge
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor(scoreColor)
         .text(job.score.toString(), 470, currentY + 35, { width: 60, align: 'center' });
      
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#6b7280')
         .text('Score', 470, currentY + 65, { width: 60, align: 'center' });

      // Created date
      const createdDate = new Date(job.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      doc.fontSize(8)
         .fillColor('#9ca3af')
         .text(createdDate, 60, currentY + 95);

      currentY += cardHeight + 15;
    });

    // FOOTER on last page
    const footerY = 780;
    doc.fontSize(8)
       .fillColor('#9ca3af')
       .text('Generated by Guhuza Job Posting Platform', 50, footerY, { 
         width: 495, 
         align: 'center' 
       })
       .text('https://guhuza.com', 50, footerY + 12, { 
         width: 495, 
         align: 'center' 
       });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate PDF report' 
    });
  }
});

module.exports = router;