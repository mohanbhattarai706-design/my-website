// server/routes/analyze.js - WITH REGENERATE JD ROUTE
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { analyzeJobDescription, generateJobDescription, callAI } = require('../utils/aiService');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /txt|doc|docx|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb('Error: Only TXT, DOC, DOCX, and PDF files are allowed!');
    }
  }
});

// Parse file content
async function parseFile(filePath, mimetype) {
  try {
    if (mimetype.includes('text/plain')) {
      return fs.readFileSync(filePath, 'utf8');
    } else if (mimetype.includes('wordprocessing') || filePath.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimetype.includes('pdf') || filePath.endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse file content');
  }
}

// Smart Builder - Generate JD from minimal input
router.post('/smart-builder', async (req, res) => {
  try {
    const formData = req.body;
    
    if (!formData.jobTitle) {
      return res.status(400).json({
        success: false,
        error: 'Job title is required'
      });
    }
    
    const analysis = await generateJobDescription(formData);
    
    res.json({
      success: true,
      analysis,
      message: 'Job description generated successfully'
    });
  } catch (error) {
    console.error('Smart builder error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate job description'
    });
  }
});

// Manual Entry - Analyze pasted text
router.post('/manual-entry', async (req, res) => {
  try {
    const { jdText } = req.body;
    
    if (!jdText || jdText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Job description text is required'
      });
    }
    
    const analysis = await analyzeJobDescription(jdText);
    
    res.json({
      success: true,
      analysis,
      originalText: jdText,
      message: 'Analysis completed successfully'
    });
  } catch (error) {
    console.error('Manual entry analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze job description'
    });
  }
});

// File Upload - Analyze uploaded file
router.post('/file-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const filePath = req.file.path;
    const jdText = await parseFile(filePath, req.file.mimetype);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    if (!jdText || jdText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'File appears to be empty or unreadable'
      });
    }
    
    const analysis = await analyzeJobDescription(jdText);
    
    res.json({
      success: true,
      analysis,
      originalText: jdText,
      fileName: req.file.originalname,
      message: 'File analyzed successfully'
    });
  } catch (error) {
    console.error('File upload analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze uploaded file'
    });
  }
});

// NEW: Regenerate improved JD with applied suggestions
router.post('/regenerate-jd', async (req, res) => {
  try {
    const { originalText, appliedSuggestions, improvementPrompt } = req.body;
    
    if (!originalText) {
      return res.status(400).json({
        success: false,
        error: 'Original job description text is required'
      });
    }

    // Create a prompt for AI to regenerate
    const systemPrompt = `You are an expert HR professional. Create an improved, professional job description based on the original and the applied improvements. Return a well-structured job description.`;

    try {
      const aiResponse = await callAI(improvementPrompt, systemPrompt, 0.4, 2500);
      
      // Parse the response into structured format
      const improvedJD = {
        title: extractTitle(aiResponse, originalText),
        fullText: aiResponse,
        summary: 'This is an improved version with AI suggestions applied.',
        responsibilities: extractBulletPoints(aiResponse, 'responsibilities'),
        qualifications: extractBulletPoints(aiResponse, 'qualifications'),
        benefits: extractSection(aiResponse, 'benefits'),
        workingConditions: extractSection(aiResponse, 'working')
      };

      res.json({
        success: true,
        improvedJD,
        message: 'Improved job description generated'
      });

    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError);
      
      // Fallback: Apply suggestions locally
      let improved = originalText;
      
      if (appliedSuggestions && appliedSuggestions.length > 0) {
        appliedSuggestions.forEach(suggestion => {
          if (suggestion.currentText && suggestion.suggestedText) {
            improved = improved.replace(suggestion.currentText, suggestion.suggestedText);
          }
        });
      }

      const improvedJD = {
        title: extractTitle(improved, originalText),
        fullText: improved,
        summary: 'Job description improved with applied suggestions.',
        responsibilities: extractBulletPoints(improved, 'responsibilities'),
        qualifications: extractBulletPoints(improved, 'qualifications'),
        benefits: extractSection(improved, 'benefits'),
        workingConditions: extractSection(improved, 'working')
      };

      res.json({
        success: true,
        improvedJD,
        message: 'Improved job description created'
      });
    }

  } catch (error) {
    console.error('Regenerate JD error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate job description'
    });
  }
});

// Helper functions for parsing
function extractTitle(text, fallback) {
  const lines = text.split('\n');
  const firstLine = lines[0].trim();
  if (firstLine && firstLine.length < 100 && !firstLine.includes(':')) {
    return firstLine.replace(/^#+\s*/, '').replace(/^\*+\s*/, '');
  }
  
  // Try to find job title pattern
  const titleMatch = text.match(/(?:Job Title|Position|Role):\s*(.+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  return fallback || 'Job Title';
}

function extractBulletPoints(text, keyword) {
  const lines = text.split('\n');
  const bullets = [];
  let capturing = false;

  for (let line of lines) {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      capturing = true;
      continue;
    }
    
    if (capturing) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        bullets.push(trimmed.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, ''));
      } else if (trimmed === '' && bullets.length > 0) {
        break;
      }
    }
  }

  return bullets.length > 0 ? bullets : null;
}

function extractSection(text, keyword) {
  const lines = text.split('\n');
  let capturing = false;
  let section = [];

  for (let line of lines) {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      capturing = true;
      continue;
    }
    
    if (capturing) {
      const trimmed = line.trim();
      if (trimmed === '' && section.length > 0) {
        break;
      }
      if (trimmed) {
        section.push(trimmed);
      }
    }
  }

  return section.length > 0 ? section.join(' ') : null;
}

module.exports = router;