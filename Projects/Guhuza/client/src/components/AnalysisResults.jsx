import React, { useState, useEffect } from 'react';

const AnalysisResults = ({ 
  analysis, 
  onSubmitJob, 
  isSubmitting, 
  mode = 'manual-entry', 
  originalText, 
  onUpdateContent,
  onAppliedSuggestionsChange
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);
  const [editedContent, setEditedContent] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [locationRadius, setLocationRadius] = useState('25');
  const [saveAs, setSaveAs] = useState('immediate');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (mode === 'smart-builder' && analysis?.generatedJD) {
      setEditedContent(analysis.generatedJD);
    }
    setTimeout(() => setIsVisible(true), 100);
  }, [analysis, mode]);

  useEffect(() => {
    if (onAppliedSuggestionsChange) {
      onAppliedSuggestionsChange(appliedSuggestions);
    }
  }, [appliedSuggestions, onAppliedSuggestionsChange]);

  if (!analysis) return null;

  const handleApplySuggestion = (suggestion, index, priority) => {
    const key = `${priority}-${index}`;
    
    if (!appliedSuggestions.includes(key)) {
      setAppliedSuggestions([...appliedSuggestions, key]);
      
      if (suggestion.suggestedText && mode === 'smart-builder' && editedContent) {
        const updatedContent = { ...editedContent };
        
        switch(suggestion.category) {
          case 'jobTitle':
            updatedContent.title = suggestion.suggestedText;
            break;
          case 'roleSummary':
            updatedContent.summary = suggestion.suggestedText;
            break;
          case 'responsibilities':
            if (!updatedContent.responsibilities) updatedContent.responsibilities = [];
            updatedContent.responsibilities.push(suggestion.suggestedText);
            break;
          case 'qualifications':
            if (!updatedContent.minimumQualifications) updatedContent.minimumQualifications = [];
            updatedContent.minimumQualifications.push(suggestion.suggestedText);
            break;
          case 'benefits':
            if (updatedContent.benefits && typeof updatedContent.benefits === 'object') {
              updatedContent.benefits.unique = (updatedContent.benefits.unique || '') + ' ' + suggestion.suggestedText;
            } else {
              updatedContent.benefits = suggestion.suggestedText;
            }
            break;
          default:
            break;
        }
        
        setEditedContent(updatedContent);
        if (onUpdateContent) onUpdateContent(updatedContent);
      }
      
      // Show success message (you can add a toast notification system later)
      console.log('✨ Suggestion applied successfully!');
      setShowSidebar(false);
      setSelectedSuggestion(null);
    }
  };

  const handleSkipSuggestion = (index, priority) => {
    const key = `${priority}-${index}`;
    setAppliedSuggestions(appliedSuggestions.filter(s => s !== key));
    setShowSidebar(false);
    setSelectedSuggestion(null);
  };

  const handleSkipAll = (priority) => {
    const suggestions = analysis.suggestions[priority] || [];
    const toRemove = suggestions.map((_, idx) => `${priority}-${idx}`);
    setAppliedSuggestions(appliedSuggestions.filter(s => !toRemove.includes(s)));
    console.log(`Skipped all ${priority} suggestions`);
  };

  const handleAcceptAll = (priority) => {
    const suggestions = analysis.suggestions[priority] || [];
    const newApplied = suggestions.map((_, idx) => `${priority}-${idx}`);
    setAppliedSuggestions([...new Set([...appliedSuggestions, ...newApplied])]);
    console.log(`✨ All ${priority} suggestions applied!`);
  };

  const openSuggestionPopup = (suggestion, idx, priority) => {
    setSelectedSuggestion({ suggestion, idx, priority });
    setShowSidebar(true);
  };

  const handleEditContent = (field, value) => {
    const updated = { ...editedContent, [field]: value };
    setEditedContent(updated);
    if (onUpdateContent) onUpdateContent(updated);
  };

  const handleEditArray = (field, index, value) => {
    const updated = { ...editedContent };
    if (!updated[field]) updated[field] = [];
    updated[field][index] = value;
    setEditedContent(updated);
    if (onUpdateContent) onUpdateContent(updated);
  };

  const handleAddArrayItem = (field) => {
    const updated = { ...editedContent };
    if (!updated[field]) updated[field] = [];
    updated[field].push('');
    setEditedContent(updated);
  };

  const handleRemoveArrayItem = (field, index) => {
    const updated = { ...editedContent };
    updated[field].splice(index, 1);
    setEditedContent(updated);
    if (onUpdateContent) onUpdateContent(updated);
  };

  const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 10) * circumference;
    
    const getColor = (score) => {
      if (score >= 8) return '#10b981';
      if (score >= 6) return '#f59e0b';
      return '#ef4444';
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            className="dark:stroke-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ animation: isVisible ? 'none' : 'none' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{score}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">/ 10</span>
        </div>
      </div>
    );
  };

  const OverallScoreCard = () => {
    const score = analysis.overallScore;
    const getGradient = (score) => {
      if (score >= 80) return 'from-green-500 to-emerald-500';
      if (score >= 60) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-500';
    };

    const getStatusText = (score) => {
      if (score >= 90) return { emoji: '🎉', text: 'Outstanding!', desc: 'Your JD is exceptional' };
      if (score >= 80) return { emoji: '✨', text: 'Excellent!', desc: 'Great job description' };
      if (score >= 70) return { emoji: '👍', text: 'Good', desc: 'Solid foundation' };
      if (score >= 60) return { emoji: '📝', text: 'Fair', desc: 'Room for improvement' };
      return { emoji: '⚠️', text: 'Needs Work', desc: 'Significant improvements needed' };
    };

    const status = getStatusText(score);

    return (
      <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 dark:from-gray-800 dark:via-blue-900/10 dark:to-indigo-900/10 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quality Analysis
                </span>
              </h2>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getGradient(score)} animate-pulse`} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Analysis</span>
              </div>
            </div>

            {/* Main Score Display */}
            <div className="flex flex-col md:flex-row items-center justify-around mb-8">
              {/* Large Circular Score */}
              <div className="mb-6 md:mb-0">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(score)} opacity-20 blur-2xl rounded-full animate-pulse`} />
                  <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
                    <div className="text-center">
                      <div className={`text-7xl font-black bg-gradient-to-r ${getGradient(score)} bg-clip-text text-transparent mb-2`}>
                        {score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">OVERALL SCORE</div>
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                              i < Math.floor(score / 20)
                                ? `bg-gradient-to-r ${getGradient(score)}`
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="text-center md:text-left">
                <div className="text-6xl mb-4">{status.emoji}</div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{status.text}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{status.desc}</p>
                <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-md">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {appliedSuggestions.length} improvements applied
                  </span>
                </div>
              </div>
            </div>

            {/* Category Scores Grid */}
            {analysis.categoryScores && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(analysis.categoryScores).map(([key, score], idx) => {
                    const delay = idx * 100;
                    return (
                      <div
                        key={key}
                        className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: `${delay}ms` }}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:scale-105 transform transition-transform">
                          <div className="flex flex-col items-center">
                            <CircularProgress score={score} size={80} strokeWidth={6} />
                            <div className="mt-3 text-center">
                              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize leading-tight">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matchability Insights */}
            {analysis.matchabilityHints && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Candidate Matchability Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysis.matchabilityHints).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          value.toLowerCase().includes('good') || value.toLowerCase().includes('clear')
                            ? 'bg-green-500'
                            : value.toLowerCase().includes('partial')
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`} />
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        value.toLowerCase().includes('good') || value.toLowerCase().includes('clear')
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : value.toLowerCase().includes('partial')
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SuggestionCard = ({ suggestion, idx, priority, colorClass }) => {
    const key = `${priority}-${idx}`;
    const isApplied = appliedSuggestions.includes(key);

    const priorityConfig = {
      critical: { bg: 'from-red-500 to-rose-500', icon: '🚨', label: 'CRITICAL' },
      recommended: { bg: 'from-yellow-500 to-orange-500', icon: '💡', label: 'RECOMMENDED' },
      niceToHave: { bg: 'from-green-500 to-emerald-500', icon: '✨', label: 'NICE TO HAVE' }
    };

    const config = priorityConfig[priority];

    return (
      <div
        onClick={() => !isApplied && openSuggestionPopup(suggestion, idx, priority)}
        className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
          isApplied
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-400'
            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transform hover:-translate-y-1'
        }`}
      >
        {/* Priority Ribbon */}
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-gradient-to-br ${config.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        <div className="p-5 relative">
          <div className="flex items-start justify-between mb-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${config.bg} text-white shadow-lg`}>
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </div>
            {isApplied && (
              <div className="flex items-center px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg animate-bounce-once">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Applied
              </div>
            )}
          </div>

          <p className="text-gray-800 dark:text-gray-200 font-semibold text-base mb-3 leading-relaxed">
            {suggestion.text}
          </p>

          {suggestion.reasoning && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="italic">{suggestion.reasoning}</span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {suggestion.category}
            </span>
            
            {!isApplied && (
              <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Click to review
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SuggestionSection = ({ title, suggestions, priority, colorClass, icon }) => {
    if (!suggestions || suggestions.length === 0) return null;

    const config = {
      critical: { gradient: 'from-red-500 to-rose-500', count: suggestions.length },
      recommended: { gradient: 'from-yellow-500 to-orange-500', count: suggestions.length },
      niceToHave: { gradient: 'from-green-500 to-emerald-500', count: suggestions.length }
    };

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config[priority].gradient} flex items-center justify-center text-2xl shadow-lg`}>
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                {title}
                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${config[priority].gradient} text-white`}>
                  {config[priority].count}
                </span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {priority === 'critical' && 'These issues need immediate attention'}
                {priority === 'recommended' && 'Highly recommended improvements'}
                {priority === 'niceToHave' && 'Optional enhancements for excellence'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleAcceptAll(priority)}
              className={`px-6 py-3 bg-gradient-to-r ${config[priority].gradient} text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm transform hover:scale-105 flex items-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Accept All
            </button>
            <button
              onClick={() => handleSkipAll(priority)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:shadow-lg transition-all font-bold text-sm transform hover:scale-105 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Skip All
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.map((suggestion, idx) => (
            <SuggestionCard
              key={idx}
              suggestion={suggestion}
              idx={idx}
              priority={priority}
              colorClass={colorClass}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <OverallScoreCard />

      {/* AI Suggestions Section */}
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/10 dark:to-pink-900/10 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI-Powered Suggestions
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Suggestions</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {(analysis.suggestions?.critical?.length || 0) + 
               (analysis.suggestions?.recommended?.length || 0) + 
               (analysis.suggestions?.niceToHave?.length || 0)}
            </div>
          </div>
        </div>

        <SuggestionSection
          title="Critical Issues"
          suggestions={analysis.suggestions?.critical}
          priority="critical"
          icon="🚨"
        />

        <SuggestionSection
          title="Recommended Improvements"
          suggestions={analysis.suggestions?.recommended}
          priority="recommended"
          icon="💡"
        />

        <SuggestionSection
          title="Nice to Have"
          suggestions={analysis.suggestions?.niceToHave}
          priority="niceToHave"
          icon="✨"
        />

        {(!analysis.suggestions?.critical || analysis.suggestions.critical.length === 0) &&
         (!analysis.suggestions?.recommended || analysis.suggestions.recommended.length === 0) &&
         (!analysis.suggestions?.niceToHave || analysis.suggestions.niceToHave.length === 0) && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Perfect Job Description!</h3>
            <p className="text-gray-600 dark:text-gray-400">No suggestions needed - your job description looks excellent!</p>
          </div>
        )}
      </div>

      {/* Editable Generated JD (Smart Builder Only) */}
      {mode === 'smart-builder' && editedContent && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Generated Job Description
          </h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
              <input
                type="text"
                value={editedContent.title || ''}
                onChange={(e) => handleEditContent('title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role Summary</label>
              <textarea
                value={editedContent.summary || ''}
                onChange={(e) => handleEditContent('summary', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Responsibilities</label>
                <button
                  onClick={() => handleAddArrayItem('responsibilities')}
                  className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {(editedContent.responsibilities || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditArray('responsibilities', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter responsibility..."
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('responsibilities', idx)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimum Qualifications */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Minimum Qualifications</label>
                <button
                  onClick={() => handleAddArrayItem('minimumQualifications')}
                  className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {(editedContent.minimumQualifications || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditArray('minimumQualifications', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter qualification..."
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('minimumQualifications', idx)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Qualifications */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Qualifications</label>
                <button
                  onClick={() => handleAddArrayItem('preferredQualifications')}
                  className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {(editedContent.preferredQualifications || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditArray('preferredQualifications', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter preferred qualification..."
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('preferredQualifications', idx)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Conditions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Working Conditions</label>
              <textarea
                value={editedContent.workingConditions || ''}
                onChange={(e) => handleEditContent('workingConditions', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefits</label>
              <textarea
                value={typeof editedContent.benefits === 'string' ? editedContent.benefits : JSON.stringify(editedContent.benefits, null, 2)}
                onChange={(e) => handleEditContent('benefits', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Location Radius & Submit Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-2xl p-8 border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Ready to Post?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Location Radius */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Location Radius for Candidate Matching
            </label>
            <select
              value={locationRadius}
              onChange={(e) => setLocationRadius(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="national">National</option>
              <option value="remote">Remote (anywhere)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Candidate matching will begin after posting
            </p>
          </div>

          {/* Save Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Posting Option
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition">
                <input
                  type="radio"
                  value="immediate"
                  checked={saveAs === 'immediate'}
                  onChange={(e) => setSaveAs(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Post Immediately</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Start matching candidates now</div>
                </div>
              </label>
              <label className="flex items-center p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition">
                <input
                  type="radio"
                  value="draft"
                  checked={saveAs === 'draft'}
                  onChange={(e) => setSaveAs(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Save as Draft</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Review and post later</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onSubmitJob({ locationRadius, saveAs, editedContent })}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-16 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg transform hover:scale-105"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {saveAs === 'draft' ? 'Saving Draft...' : 'Posting Job...'}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {saveAs === 'draft' ? 'Save as Draft' : 'Post Job to Guhuza'}
              </span>
            )}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            ✓ {appliedSuggestions.length} suggestions applied • {saveAs === 'draft' ? '💾 Will be saved as draft' : '🚀 Will go live immediately'}
          </p>
        </div>
      </div>

      {/* Popup Sidebar */}
      {showSidebar && selectedSuggestion && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Suggestion Details
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Priority Badge */}
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedSuggestion.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                  selectedSuggestion.priority === 'recommended' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {selectedSuggestion.priority === 'critical' ? '🔴 Critical' :
                   selectedSuggestion.priority === 'recommended' ? '🟡 Recommended' :
                   '🟢 Nice to Have'}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {selectedSuggestion.suggestion.category}
                </span>
              </div>

              {/* Suggestion Text */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  {selectedSuggestion.suggestion.text}
                </p>
              </div>

              {/* Reasoning */}
              {selectedSuggestion.suggestion.reasoning && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Why this matters
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    {selectedSuggestion.suggestion.reasoning}
                  </p>
                </div>
              )}

              {/* Current vs Suggested */}
              {selectedSuggestion.suggestion.currentText && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current:</h4>
                  <p className="text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-800 line-through">
                    {selectedSuggestion.suggestion.currentText}
                  </p>
                </div>
              )}

              {selectedSuggestion.suggestion.suggestedText && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggested:</h4>
                  <p className="text-gray-800 dark:text-gray-200 bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800 font-medium">
                    {selectedSuggestion.suggestion.suggestedText}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleApplySuggestion(selectedSuggestion.suggestion, selectedSuggestion.idx, selectedSuggestion.priority)}
                  className="flex-1 bg-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Apply This
                </button>
                <button
                  onClick={() => handleSkipSuggestion(selectedSuggestion.idx, selectedSuggestion.priority)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-4 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Skip
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisResults;