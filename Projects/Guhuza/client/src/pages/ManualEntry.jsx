// client/src/pages/ManualEntry.jsx - WITH REGENERATE & RE-ANALYSIS
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnalysisResults from '../components/AnalysisResults';
import API_URL from '../config/api';

const ManualEntry = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  
  const [jdText, setJdText] = useState('');
  const [uploadMethod, setUploadMethod] = useState('paste');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showEditableJD, setShowEditableJD] = useState(false);
  const [editedJD, setEditedJD] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);
  const [improvedAnalysis, setImprovedAnalysis] = useState(null); // NEW: Store re-analysis

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    }
  }, [userEmail, navigate]);

  const handleTextAnalysis = async (e) => {
    e.preventDefault();
    
    if (!jdText.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/analyze/manual-entry', {
        jdText
      });
      
      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        setOriginalText(response.data.originalText);
        setShowEditableJD(false);
        setEditedJD(null);
        setImprovedAnalysis(null); // Reset improved analysis
        toast.success('Analysis completed successfully!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx)$/i)) {
      toast.error('Only TXT, PDF, and DOCX files are allowed');
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('${API_URL}/api/analyze/file-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        setOriginalText(response.data.originalText);
        setJdText(response.data.originalText);
        setShowEditableJD(false);
        setEditedJD(null);
        setImprovedAnalysis(null);
        toast.success(`File "${response.data.fileName}" analyzed successfully!`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze uploaded file');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ENHANCED: Generate improved JD with applied suggestions AND re-analyze
  const handleGenerateImprovedJD = async () => {
    if (!analysisResult || appliedSuggestions.length === 0) {
      toast.error('Please apply at least one suggestion first!');
      return;
    }

    setIsRegenerating(true);

    try {
      const appliedSuggestionsList = [];
      
      ['critical', 'recommended', 'niceToHave'].forEach(priority => {
        if (analysisResult.suggestions && analysisResult.suggestions[priority]) {
          analysisResult.suggestions[priority].forEach((suggestion, idx) => {
            const key = `${priority}-${idx}`;
            if (appliedSuggestions.includes(key)) {
              appliedSuggestionsList.push(suggestion);
            }
          });
        }
      });

      const improvementPrompt = `
Original Job Description:
${originalText}

Applied Improvements:
${appliedSuggestionsList.map((s, i) => `${i + 1}. ${s.text} - ${s.suggestedText || ''}`).join('\n')}

Please create an improved, professional job description that incorporates all these suggestions. Return a structured format with clear sections.
`;

      const response = await axios.post('${API_URL}/api/analyze/regenerate-jd', {
        originalText: originalText,
        appliedSuggestions: appliedSuggestionsList,
        improvementPrompt: improvementPrompt
      });

      if (response.data.success) {
        setEditedJD(response.data.improvedJD);
        
        // NEW: Re-analyze the improved JD
        const improvedText = response.data.improvedJD.fullText || JSON.stringify(response.data.improvedJD);
        
        const reanalysisResponse = await axios.post('${API_URL}/api/analyze/manual-entry', {
          jdText: improvedText
        });
        
        if (reanalysisResponse.data.success) {
          setImprovedAnalysis(reanalysisResponse.data.analysis);
          toast.success('✨ Improved job description generated and analyzed!');
        } else {
          toast.success('Improved job description generated!');
        }
        
        setShowEditableJD(true);
        
        setTimeout(() => {
          document.getElementById('editable-jd-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      
      const improvedJD = createLocallyImprovedJD(originalText, appliedSuggestions, analysisResult);
      setEditedJD(improvedJD);
      setShowEditableJD(true);
      toast.success('Improved job description created! You can now edit it before posting.');
      
      setTimeout(() => {
        document.getElementById('editable-jd-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setIsRegenerating(false);
    }
  };

  const createLocallyImprovedJD = (original, appliedKeys, analysis) => {
    let improved = original;
    
    ['critical', 'recommended', 'niceToHave'].forEach(priority => {
      if (analysis.suggestions && analysis.suggestions[priority]) {
        analysis.suggestions[priority].forEach((suggestion, idx) => {
          const key = `${priority}-${idx}`;
          if (appliedKeys.includes(key)) {
            if (suggestion.currentText && suggestion.suggestedText) {
              improved = improved.replace(suggestion.currentText, suggestion.suggestedText);
            }
          }
        });
      }
    });

    return {
      title: analysis.detectedSections?.title || 'Job Title',
      fullText: improved,
      summary: 'This is an improved version of your job description with AI suggestions applied.',
      responsibilities: extractSection(improved, 'responsibilities') || [],
      qualifications: extractSection(improved, 'qualifications') || [],
      benefits: extractSection(improved, 'benefits') || '',
      workingConditions: extractSection(improved, 'working') || ''
    };
  };

  const extractSection = (text, keyword) => {
    const lines = text.split('\n');
    const sectionLines = [];
    let capturing = false;

    for (let line of lines) {
      if (line.toLowerCase().includes(keyword)) {
        capturing = true;
        continue;
      }
      if (capturing) {
        if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
          sectionLines.push(line.trim().replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''));
        } else if (line.trim() === '') {
          break;
        }
      }
    }

    return sectionLines.length > 0 ? sectionLines : null;
  };

  const handleEditJDField = (field, value) => {
    setEditedJD(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditJDArray = (field, index, value) => {
    setEditedJD(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleAddJDArrayItem = (field) => {
    setEditedJD(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const handleRemoveJDArrayItem = (field, index) => {
    setEditedJD(prev => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSubmitJob = async (postingData) => {
    if (!analysisResult && !editedJD) {
      toast.error('Please analyze a job description first');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        email: userEmail,
        jobTitle: editedJD?.title || analysisResult.detectedSections?.title || 'Job Title',
        jobDescription: editedJD?.fullText || originalText,
        analysis: improvedAnalysis || analysisResult, // Use improved analysis if available
        editedJD: editedJD,
        type: 'manual-entry',
        locationRadius: postingData.locationRadius,
        status: postingData.saveAs === 'draft' ? 'draft' : 'active',
        location: postingData.location || 'Not specified',
        workCondition: postingData.workCondition || 'Not specified',
        employmentType: postingData.employmentType || 'Not specified'
      };

      const response = await axios.post('${API_URL}/api/jobs', jobData);
      
      if (response.data.success) {
        toast.success('Job posted successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Manual Entry</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload or paste an existing job description for AI analysis</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setUploadMethod('paste')}
              className={`pb-3 px-4 font-medium transition ${
                uploadMethod === 'paste'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`pb-3 px-4 font-medium transition ${
                uploadMethod === 'file'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Upload File
            </button>
          </div>

          {uploadMethod === 'paste' && (
            <form onSubmit={handleTextAnalysis}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description Text
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows="15"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Paste your job description here..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {jdText.length} characters
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isAnalyzing || !jdText.trim()}
                  className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Job Description'
                  )}
                </button>
              </div>
            </form>
          )}

          {uploadMethod === 'file' && (
            <div>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition">
                <input
                  type="file"
                  id="file-upload"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isAnalyzing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isAnalyzing ? 'Analyzing file...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    TXT, PDF, or DOCX (max 5MB)
                  </p>
                </label>
              </div>

              {isAnalyzing && (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing your file...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {analysisResult && !showEditableJD && (
          <>
            <AnalysisResults 
              analysis={analysisResult}
              onSubmitJob={handleSubmitJob}
              isSubmitting={isSubmitting}
              mode="manual-entry"
              originalText={originalText}
              onAppliedSuggestionsChange={setAppliedSuggestions}
            />

            {/* GENERATE IMPROVED JD BUTTON */}
            {appliedSuggestions.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-8 mb-8 border-2 border-green-200 dark:border-green-800 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Ready to Generate Improved Version?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You've applied {appliedSuggestions.length} suggestion{appliedSuggestions.length !== 1 ? 's' : ''}. Create a polished job description incorporating all improvements.
                  </p>
                </div>
                
                <button
                  onClick={handleGenerateImprovedJD}
                  disabled={isRegenerating}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-12 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl transform hover:scale-105"
                >
                  {isRegenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Improved Job Description
                    </span>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* EDITABLE IMPROVED JD */}
        {showEditableJD && editedJD && (
          <>
            <div id="editable-jd-section" className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 border-2 border-green-500 dark:border-green-600">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Improved Job Description
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Edit any field before posting</p>
                </div>
                <button
                  onClick={() => setShowEditableJD(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={editedJD.title || ''}
                    onChange={(e) => handleEditJDField('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Full Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Description</label>
                  <textarea
                    value={editedJD.fullText || ''}
                    onChange={(e) => handleEditJDField('fullText', e.target.value)}
                    rows="15"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Responsibilities */}
                {editedJD.responsibilities && editedJD.responsibilities.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Responsibilities</label>
                      <button
                        onClick={() => handleAddJDArrayItem('responsibilities')}
                        className="text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/40"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editedJD.responsibilities.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleEditJDArray('responsibilities', idx, e.target.value)}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => handleRemoveJDArrayItem('responsibilities', idx)}
                            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qualifications */}
                {editedJD.qualifications && editedJD.qualifications.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Qualifications</label>
                      <button
                        onClick={() => handleAddJDArrayItem('qualifications')}
                        className="text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/40"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editedJD.qualifications.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleEditJDArray('qualifications', idx, e.target.value)}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => handleRemoveJDArrayItem('qualifications', idx)}
                            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NEW: RE-ANALYSIS DISPLAY */}
            {improvedAnalysis && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-2xl p-8 mb-8 border-2 border-green-500 dark:border-green-400">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Improved Job Description Analysis
                  </h2>
                </div>

                {/* Score Comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Original Score */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Original Score</h3>
                    <div className="text-6xl font-black text-gray-400 dark:text-gray-600 mb-2">
                      {analysisResult.overallScore}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Before improvements</div>
                  </div>

                  {/* New Score */}
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 shadow-xl transform hover:scale-105 transition">
                    <h3 className="text-lg font-bold text-white mb-3">New Score</h3>
                    <div className="flex items-end justify-between">
                      <div className="text-6xl font-black text-white">
                        {improvedAnalysis.overallScore}
                      </div>
                      <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-full">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        <span className="text-2xl font-bold">+{improvedAnalysis.overallScore - analysisResult.overallScore}</span>
                      </div>
                    </div>
                    <div className="text-sm text-white/90 mt-2">After applying {appliedSuggestions.length} suggestions</div>
                  </div>
                </div>

                {/* Category Improvements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Category Improvements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(improvedAnalysis.categoryScores).map(([key, newScore]) => {
                      const oldScore = analysisResult.categoryScores?.[key] || 0;
                      const improvement = newScore - oldScore;
                      return (
                        <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:shadow-md transition">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {newScore}
                          </div>
                          {improvement > 0 && (
                            <div className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center justify-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              +{improvement}
                            </div>
                          )}
                          {improvement === 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">→</div>
                          )}
                          {improvement < 0 && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-1">
                              {improvement}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Remaining Suggestions */}
                {(improvedAnalysis.suggestions?.critical?.length > 0 || 
                  improvedAnalysis.suggestions?.recommended?.length > 0 ||
                  improvedAnalysis.suggestions?.niceToHave?.length > 0) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Additional Improvements Available
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {improvedAnalysis.suggestions?.critical?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <div className="text-red-600 dark:text-red-400 font-bold mb-2">🚨 Critical</div>
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {improvedAnalysis.suggestions.critical.length}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">must fix</div>
                        </div>
                      )}
                      {improvedAnalysis.suggestions?.recommended?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <div className="text-yellow-600 dark:text-yellow-400 font-bold mb-2">💡 Recommended</div>
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {improvedAnalysis.suggestions.recommended.length}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">improvements</div>
                        </div>
                      )}
                      {improvedAnalysis.suggestions?.niceToHave?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <div className="text-green-600 dark:text-green-400 font-bold mb-2">✨ Nice to Have</div>
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {improvedAnalysis.suggestions.niceToHave.length}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">enhancements</div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                      You can apply these additional suggestions to further enhance your job description.
                    </p>
                  </div>
                )}

                {/* Perfect Score Celebration */}
                {improvedAnalysis.overallScore >= 90 && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                    <div className="text-6xl mb-3">🎉</div>
                    <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                      Outstanding Job Description!
                    </h3>
                    <p className="text-purple-700 dark:text-purple-400">
                      Your job description is now at an exceptional quality level. Ready to attract top talent!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Post Button Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ready to Post Your Job?</h3>
              <button
                onClick={() => {
                  // Use the same submit flow as in AnalysisResults
                  handleSubmitJob({ locationRadius: '25', saveAs: 'immediate', editedJD });
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-16 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 text-lg shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  'Post Improved Job Description'
                )}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {improvedAnalysis && `✨ Score: ${improvedAnalysis.overallScore}/100 • `}
                {appliedSuggestions.length} improvements applied
              </p>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};


export default ManualEntry;

