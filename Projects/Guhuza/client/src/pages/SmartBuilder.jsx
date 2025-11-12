// client/src/pages/SmartBuilder.jsx - DARK MODE FULLY FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnalysisResults from '../components/AnalysisResults';

const SmartBuilder = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    workCondition: '',
    employmentType: '',
    responsibilities: '',
    minimumRequirement: '',
    preferredSkills: '',
    requirements: '',
    email: userEmail || ''
  });
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]); // NEW
  const [isRegenerating, setIsRegenerating] = useState(false); // NEW
  const [showImprovedJD, setShowImprovedJD] = useState(false); // NEW
  const [improvedJD, setImprovedJD] = useState(null); // NEW
  const [improvedAnalysis, setImprovedAnalysis] = useState(null); // NEW

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    }
  }, [userEmail, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!formData.jobTitle) {
      toast.error('Job title is required');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/analyze/smart-builder', formData);
      
      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        setShowImprovedJD(false); // Reset improved JD view
        setImprovedJD(null);
        setImprovedAnalysis(null);
        setAppliedSuggestions([]);
        toast.success('Job description generated successfully!');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // NEW: Generate improved JD with applied suggestions
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

      // Create improved version based on original generated JD
      const originalJD = analysisResult.generatedJD;
      const improvedVersion = {
        ...originalJD,
        title: originalJD.title,
        summary: originalJD.summary,
        responsibilities: [...(originalJD.responsibilities || [])],
        minimumQualifications: [...(originalJD.minimumQualifications || [])],
        preferredQualifications: [...(originalJD.preferredQualifications || [])],
        workingConditions: originalJD.workingConditions,
        benefits: originalJD.benefits
      };

      // Apply suggestions to improve the JD
      appliedSuggestionsList.forEach(suggestion => {
        if (suggestion.suggestedText) {
          switch(suggestion.category) {
            case 'jobTitle':
              improvedVersion.title = suggestion.suggestedText;
              break;
            case 'roleSummary':
              improvedVersion.summary = suggestion.suggestedText;
              break;
            case 'responsibilities':
              if (!improvedVersion.responsibilities.includes(suggestion.suggestedText)) {
                improvedVersion.responsibilities.push(suggestion.suggestedText);
              }
              break;
            case 'qualifications':
              if (!improvedVersion.minimumQualifications.includes(suggestion.suggestedText)) {
                improvedVersion.minimumQualifications.push(suggestion.suggestedText);
              }
              break;
            case 'benefits':
              improvedVersion.benefits = improvedVersion.benefits + '\n' + suggestion.suggestedText;
              break;
          }
        }
      });

      setImprovedJD(improvedVersion);
      setShowImprovedJD(true);

      // Re-analyze the improved JD
      const improvedText = JSON.stringify(improvedVersion);
      const reanalysisResponse = await axios.post('http://localhost:5000/api/analyze/manual-entry', {
        jdText: improvedText
      });

      if (reanalysisResponse.data.success) {
        setImprovedAnalysis(reanalysisResponse.data.analysis);
        toast.success('✨ Improved job description generated and analyzed!');
      } else {
        toast.success('Improved job description generated!');
      }

      setTimeout(() => {
        document.getElementById('improved-jd-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Failed to generate improved version');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmitJob = async (postingData) => {
    if (!analysisResult) {
      toast.error('Please generate a job description first');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        ...formData,
        ...(improvedJD || analysisResult.generatedJD), // Use improved JD if available
        analysis: improvedAnalysis || analysisResult, // Use improved analysis if available
        type: 'smart-builder',
        locationRadius: postingData.locationRadius,
        status: postingData.saveAs === 'draft' ? 'draft' : 'active'
      };

      const response = await axios.post('http://localhost:5000/api/jobs', jobData);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-200">
      <Header />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Smart Builder</h1>
          <p className="text-gray-600 dark:text-gray-400">Fill in the details below and let AI generate a professional job description</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New York, NY or Remote"
              />
            </div>

            {/* Work Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Condition
              </label>
              <select
                name="workCondition"
                value={formData.workCondition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select work condition</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Key Responsibilities */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Responsibilities (Optional)
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the main duties and responsibilities..."
              />
            </div>

            {/* Minimum Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Requirements (Optional)
              </label>
              <textarea
                name="minimumRequirement"
                value={formData.minimumRequirement}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Required skills, education, experience..."
              />
            </div>

            {/* Preferred Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Skills (Optional)
              </label>
              <textarea
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nice-to-have skills and qualifications..."
              />
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any other details you'd like to include..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Job Description'
              )}
            </button>
          </div>
        </form>

        {analysisResult && !showImprovedJD && (
          <>
            <AnalysisResults 
              analysis={analysisResult}
              onSubmitJob={handleSubmitJob}
              isSubmitting={isSubmitting}
              mode="smart-builder"
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
                    You've applied {appliedSuggestions.length} suggestion{appliedSuggestions.length !== 1 ? 's' : ''}. Create an enhanced job description with all improvements.
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

        {/* IMPROVED JD WITH RE-ANALYSIS */}
        {showImprovedJD && improvedJD && (
          <>
            <div id="improved-jd-section" className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 border-2 border-green-500 dark:border-green-600">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Improved Job Description
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Review the enhanced version with applied suggestions</p>
                </div>
                <button
                  onClick={() => setShowImprovedJD(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Display Improved JD */}
              <div className="space-y-6">
                {improvedJD.title && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Job Title</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">{improvedJD.title}</p>
                  </div>
                )}

                {improvedJD.summary && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Summary</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">{improvedJD.summary}</p>
                  </div>
                )}

                {improvedJD.responsibilities && improvedJD.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Responsibilities</h3>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <ul className="space-y-2">
                        {improvedJD.responsibilities.map((item, idx) => (
                          <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {improvedJD.minimumQualifications && improvedJD.minimumQualifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Minimum Qualifications</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <ul className="space-y-2">
                        {improvedJD.minimumQualifications.map((item, idx) => (
                          <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RE-ANALYSIS DISPLAY */}
            {improvedAnalysis && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-2xl p-8 mb-8 border-2 border-green-500 dark:border-green-400">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Improved Analysis Results
                </h2>

                {/* Score Comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Original Score</h3>
                    <div className="text-6xl font-black text-gray-400 dark:text-gray-600">
                      {analysisResult.overallScore}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 shadow-xl">
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
                  </div>
                </div>

                {improvedAnalysis.overallScore >= 90 && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                    <div className="text-6xl mb-3">🎉</div>
                    <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                      Outstanding Job Description!
                    </h3>
                    <p className="text-purple-700 dark:text-purple-400">
                      Your improved job description is exceptional quality!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button for Improved Version */}
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ready to Post?</h3>
              <button
                onClick={() => handleSubmitJob({ locationRadius: '25', saveAs: 'immediate' })}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-16 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 text-lg shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? 'Posting...' : 'Post Improved Job Description'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                ✨ {appliedSuggestions.length} improvements applied
                {improvedAnalysis && ` • Score: ${improvedAnalysis.overallScore}/100`}
              </p>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SmartBuilder;