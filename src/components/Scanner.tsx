import React, { useState } from 'react';
import { analyzeContract } from '../utils/analyzer';
import { AuditResult } from '../types';
import { EXAMPLE_VULNERABLE_CONTRACT } from '../utils/constants';
import AIChatbot from './AIChatbot';

interface ScannerProps {
  onAuditComplete: (result: AuditResult, code: string) => void;
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onAuditComplete, onBack }) => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file extension
    const fileName = file.name;
    const validExtensions = ['.sol', '.txt'];
    const isValid = validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));

    if (!isValid) {
      alert('Please upload a .sol or .txt file');
      return;
    }

    setUploadedFileName(fileName);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Please enter some Solidity code or upload a file to analyze');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = analyzeContract(code);
    
    clearInterval(progressInterval);
    setProgress(100);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsAnalyzing(false);
    setAuditResult(result);
    onAuditComplete(result, code);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-300 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Smart Contract Scanner</h1>
              <p className="text-gray-400">Paste your Solidity code or upload contract files for AI-powered security analysis</p>
            </div>
          </div>
        </div>

        {/* Main Scanner Interface */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-purple-500/20 bg-black/20">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-4">
                <button className="text-white font-semibold border-b-2 border-purple-500 pb-1">
                  Code Editor
                </button>
                <button 
                  onClick={() => setCode(EXAMPLE_VULNERABLE_CONTRACT)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  📝 Load Example
                </button>
              </div>
              <div className="text-sm text-gray-400">
                {code.split('\n').length} lines
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your smart contract code here&#10;}"
              className="w-full h-96 bg-slate-900 text-gray-100 font-mono text-sm p-6 focus:outline-none resize-none"
              spellCheck={false}
            />
            <div className="absolute top-2 right-2">
              <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
                Solidity
              </div>
            </div>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="px-6 py-4 bg-black/20 border-t border-purple-500/20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-white font-semibold">Analyzing contract...</span>
                <span className="text-purple-300">{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {progress < 30 && '🔍 Parsing contract structure...'}
                {progress >= 30 && progress < 60 && '🤖 Running AI vulnerability detection...'}
                {progress >= 60 && progress < 90 && '📊 Calculating risk score...'}
                {progress >= 90 && '✅ Finalizing audit report...'}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-black/20 border-t border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setCode('');
                  setUploadedFileName('');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Clear Code
              </button>
              <label className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload File (.sol, .txt)</span>
                <input
                  type="file"
                  accept=".sol,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isAnalyzing}
                />
              </label>
              {uploadedFileName && (
                <span className="text-purple-300 text-sm">📄 {uploadedFileName}</span>
              )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Run Security Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: '⚡',
              title: 'Fast Analysis',
              description: 'Results in under 2 minutes'
            },
            {
              icon: '🎯',
              title: 'High Accuracy',
              description: '99.7% vulnerability detection'
            },
            {
              icon: '🔒',
              title: 'Secure & Private',
              description: 'Your code never leaves the system'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-white font-semibold mb-1">{feature.title}</div>
              <div className="text-gray-400 text-sm">{feature.description}</div>
            </div>
          ))}
        </div>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:scale-110 z-40 flex items-center space-x-2"
        >
          <span className="text-2xl">🤖</span>
          <span className="font-bold">AI Assistant</span>
        </button>

        {/* AI Chatbot */}
        <AIChatbot
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          contractCode={code}
          vulnerabilities={auditResult?.vulnerabilities || []}
          auditResult={auditResult}
        />
      </div>
    </div>
  );
};

export default Scanner;
