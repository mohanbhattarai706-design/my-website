// client/src/pages/MethodChoice.jsx - DARK MODE FULLY FIXED
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../src/api';

const MethodChoice = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    }
  }, [userEmail, navigate]);

  const handleMethodSelect = (method) => {
    navigate(`/${method}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-200">
      <Header />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              How would you like to create your job posting?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Smart Builder Option */}
            <div 
              onClick={() => handleMethodSelect('smart-builder')}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 cursor-pointer transform transition hover:scale-105 hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
                  <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Smart Builder
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Let AI generate a complete job description from just a few details
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Quick setup (5 minutes)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">AI-powered suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Best for new job postings</span>
                </li>
              </ul>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                Start Building
              </button>
            </div>

            {/* Manual Entry Option */}
            <div 
              onClick={() => handleMethodSelect('manual-entry')}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 cursor-pointer transform transition hover:scale-105 hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full">
                  <svg className="w-16 h-16 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Manual Entry
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Upload or paste an existing job description for AI analysis
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Upload TXT, DOCX, or PDF</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Get quality score & feedback</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Best for existing JDs</span>
                </li>
              </ul>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                Analyze Existing JD
              </button>
            </div>
          </div>

          {/* Dashboard Link */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center mx-auto transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              View My Job Postings
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};


export default MethodChoice;
