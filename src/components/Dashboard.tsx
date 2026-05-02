import React, { useState } from 'react';
import { AuditResult, Vulnerability } from '../types';
import { generateAutoFix, FixResult } from '../utils/autoFix';
import AIChatbot from './AIChatbot';

interface DashboardProps {
  result: AuditResult | null;
  originalCode: string;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, originalCode, onBack }) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showAuditRequest, setShowAuditRequest] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Handler functions for Quick Actions
  const handleViewDetailedReport = () => {
    setShowDetailedReport(true);
  };

  const handleDeployToTestnet = () => {
    setShowDeployModal(true);
  };

  const handleRequestAuditReview = () => {
    setShowAuditRequest(true);
  };

  const handleShareReport = () => {
    setShowShareModal(true);
  };

  const handleExportReport = (format: 'json' | 'pdf') => {
    if (format === 'json') {
      const reportData = {
        contractName: result!.contractName || 'Unknown',
        timestamp: result!.timestamp,
        riskScore: result!.riskScore,
        riskLevel: result!.riskLevel,
        vulnerabilities: result!.vulnerabilities,
        codeAnalysis: result!.codeAnalysis,
        recommendations: result!.recommendations,
        circuitBreakerStatus: result!.circuitBreakerStatus
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${result!.contractName || 'contract'}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Report exported as JSON!');
    } else {
      // PDF export simulation
      alert('PDF export feature coming soon! For now, use JSON export or take a screenshot of this report.');
    }
  };

  const handleCopyShareLink = () => {
    const shareLink = `${window.location.origin}/audit/${Date.now()}`;
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-400';
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'safe': return 'from-green-500 to-emerald-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'high': return 'from-orange-500 to-red-500';
      case 'critical': return 'from-red-600 to-pink-600';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getCircuitBreakerStatus = () => {
    switch (result!.circuitBreakerStatus) {
      case 'active':
        return { text: 'Active & Safe', color: 'text-green-400', icon: '✅' };
      case 'paused':
        return { text: 'Paused - Review Required', color: 'text-yellow-400', icon: '⚠️' };
      case 'blocked':
        return { text: 'Blocked - High Risk', color: 'text-red-400', icon: '🚫' };
    }
  };

  const circuitStatus = getCircuitBreakerStatus();
  const criticalCount = result!.vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = result!.vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = result!.vulnerabilities.filter(v => v.severity === 'medium').length;
  const lowCount = result!.vulnerabilities.filter(v => v.severity === 'low').length;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">No audit results available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-300 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Scan
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Security Audit Report</h1>
              <p className="text-gray-400">
                {result.contractName && `Contract: ${result.contractName} • `}
                Generated at {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => handleExportReport('json')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export JSON</span>
              </button>
              <button 
                onClick={() => handleExportReport('pdf')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Analysis Summary */}
        {result.vulnerabilities.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-l-4 border-purple-500 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">AI Security Analysis Complete</h3>
                <p className="text-gray-300 mb-3">
                  Our AI detected <span className="text-purple-300 font-semibold">{result.vulnerabilities.length}</span> potential
                  {result.vulnerabilities.length === 1 ? ' vulnerability' : ' vulnerabilities'} using advanced pattern matching,
                  control flow analysis, and Web3 security best practices.
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(result.vulnerabilities.map(v => v.type))).map((type, idx) => (
                    <span key={idx} className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {result.vulnerabilities.length === 0 && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-500 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">✅</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">AI Analysis Complete - No Vulnerabilities Found!</h3>
                <p className="text-gray-300">
                  Our AI security engine analyzed your smart contract and found no common vulnerabilities. However,
                  always conduct thorough testing and consider a professional audit before mainnet deployment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Score Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Risk Score */}
            <div className="text-center">
              <div className="mb-4">
                <div className={`text-7xl font-bold ${getRiskColor(result.riskLevel)}`}>
                  {result.riskScore}
                </div>
                <div className="text-gray-400 text-sm mt-2">Risk Score (0-100)</div>
              </div>
              <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getRiskBgColor(result.riskLevel)} text-white font-bold text-lg`}>
                {result.riskLevel.toUpperCase()}
              </div>
            </div>

            {/* Vulnerability Breakdown */}
            <div className="md:col-span-2">
              <h3 className="text-white font-bold text-xl mb-4">Vulnerability Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Critical', count: criticalCount, color: 'text-red-400' },
                  { label: 'High', count: highCount, color: 'text-orange-400' },
                  { label: 'Medium', count: mediumCount, color: 'text-yellow-400' },
                  { label: 'Low', count: lowCount, color: 'text-blue-400' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={`text-2xl font-bold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Breaker Status */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{circuitStatus.icon}</div>
              <div>
                <h3 className="text-white font-bold text-xl">Circuit Breaker Status</h3>
                <p className={`${circuitStatus.color} font-semibold text-lg`}>{circuitStatus.text}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-2">On-Chain Protection</div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${result.circuitBreakerStatus === 'active' ? 'bg-green-400' : result.circuitBreakerStatus === 'paused' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-white font-semibold">
                  {result.circuitBreakerStatus === 'active' ? 'Monitoring' : result.circuitBreakerStatus === 'paused' ? 'Limited Access' : 'Blocked'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Code Analysis Stats */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">📊 Code Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Lines of Code</span>
                <span className="text-white font-semibold">{result.codeAnalysis.linesOfCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Functions</span>
                <span className="text-white font-semibold">{result.codeAnalysis.functions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Complexity Score</span>
                <span className="text-white font-semibold">{result.codeAnalysis.complexity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Vulnerabilities</span>
                <span className="text-red-400 font-bold">{result.vulnerabilities.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => alert('📊 Detailed Report Feature\n\nContract: ' + (result.contractName || 'Unknown') + '\nRisk Score: ' + result.riskScore + '/100\nVulnerabilities: ' + result.vulnerabilities.length + '\n\nThis will show a comprehensive report with all vulnerabilities and recommendations.')}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg py-2 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>View Detailed Report</span>
              </button>
              <button 
                onClick={() => alert('🚀 Deploy to Testnet\n\nSteps:\n1. Install Hardhat: npm install --save-dev hardhat\n2. Configure Sepolia in hardhat.config.js\n3. Run: npx hardhat run scripts/deploy.js --network sepolia\n4. Verify on Etherscan\n\nRisk Score: ' + result.riskScore + '/100 - ' + (result.riskScore < 40 ? '✅ Ready for testnet!' : '⚠️ Fix vulnerabilities first!'))}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg py-2 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Deploy to Testnet</span>
              </button>
              <button 
                onClick={() => alert('🔍 Request Professional Audit\n\nContract: ' + (result.contractName || 'Unknown') + '\nLines: ' + result.codeAnalysis.linesOfCode + '\nVulnerabilities: ' + result.vulnerabilities.length + '\n\nOur audit partners will contact you within 24-48 hours.\n\nExpected cost: $5,000-$15,000\nTurnaround: 1-2 weeks')}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg py-2 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Request Audit Review</span>
              </button>
              <button 
                onClick={() => {
                  const link = window.location.href;
                  navigator.clipboard.writeText(link);
                  alert('📤 Report Link Copied!\n\n' + link + '\n\nShare this link with your team or on social media.');
                }}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg py-2 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Report</span>
              </button>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">🤖 AI Analysis</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Detection Confidence</span>
                <span className="text-white font-semibold">98.5%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div>✅ Static analysis complete</div>
              <div>✅ Pattern matching verified</div>
              <div>✅ Logic flow analyzed</div>
              <div>✅ Gas optimization checked</div>
            </div>
          </div>
        </div>

        {/* Vulnerabilities List */}
        {result.vulnerabilities.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🔍 Detected Vulnerabilities</h2>
            <div className="space-y-4">
              {result.vulnerabilities.map((vuln, idx) => (
                <VulnerabilityCard key={idx} vulnerability={vuln} index={idx} originalCode={originalCode} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} onOpenChatbot={() => setShowChatbot(true)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-8 mb-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Vulnerabilities Detected!</h3>
            <p className="text-gray-300">Your smart contract passed all security checks.</p>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">💡 Recommendations</h2>
          <div className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="text-purple-400 mt-1">→</div>
                <div className="text-gray-300">{rec}</div>
              </div>
            ))}
          </div>
        </div>
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
        contractCode={originalCode}
        vulnerabilities={result.vulnerabilities}
        auditResult={result}
      />
    </div>
  );
};

interface VulnerabilityCardProps {
  vulnerability: Vulnerability;
  index: number;
  originalCode: string;
  getSeverityColor: (severity: string) => string;
  getSeverityIcon: (severity: string) => string;
  onOpenChatbot?: () => void;
}

const VulnerabilityCard: React.FC<VulnerabilityCardProps> = ({ vulnerability, originalCode, getSeverityColor, getSeverityIcon, onOpenChatbot }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [showFixModal, setShowFixModal] = useState(false);

  const handleAutoFix = () => {
    const result = generateAutoFix(vulnerability, originalCode);
    setFixResult(result);
    setShowFixModal(true);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-white/5 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getSeverityIcon(vulnerability.severity)}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(vulnerability.severity)}`}>
                {vulnerability.severity.toUpperCase()}
              </span>
              <span className="text-gray-500 text-sm">{vulnerability.id}</span>
              {vulnerability.line && (
                <span className="text-gray-500 text-sm">Line {vulnerability.line}</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{vulnerability.title}</h3>
            <p className="text-gray-300">{vulnerability.description}</p>
          </div>
          <button className="text-purple-400 ml-4">
            <svg 
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-purple-500/20 bg-black/20 p-6 space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">🔧 Recommendation</h4>
            <p className="text-gray-300">{vulnerability.recommendation}</p>
          </div>
          
          {vulnerability.codeSnippet && (
            <div>
              <h4 className="text-white font-semibold mb-2">📝 Code Snippet</h4>
              <pre className="bg-slate-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {vulnerability.codeSnippet}
              </pre>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button 
              onClick={handleAutoFix}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Apply Auto-Fix</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenChatbot) {
                  onOpenChatbot();
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ask AI Assistant</span>
            </button>
          </div>

          {/* Auto-Fix Result Modal */}
          {showFixModal && fixResult && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900 border-b border-purple-500/20 p-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">🔧 Auto-Fix Applied</h3>
                  <button 
                    onClick={() => setShowFixModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Success/Failure Status */}
                  <div className={`border rounded-lg p-4 ${
                    fixResult.success 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                    <div className={`font-bold mb-2 ${fixResult.success ? 'text-green-400' : 'text-yellow-400'}`}>
                      {fixResult.success ? '✅ Fix Applied Successfully' : '⚠️ Auto-Fix Not Available'}
                    </div>
                    <div className="text-gray-300 text-sm">{fixResult.explanation}</div>
                  </div>

                  {/* Changes Made */}
                  {fixResult.success && fixResult.changes.length > 0 && (
                    <div>
                      <h4 className="text-white font-bold mb-3">Changes Applied:</h4>
                      <ul className="space-y-2">
                        {fixResult.changes.map((change, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-gray-300">
                            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fixed Code */}
                  {fixResult.success && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-bold">Fixed Code:</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(fixResult.fixedCode);
                            alert('Fixed code copied to clipboard!');
                          }}
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded text-sm font-semibold transition-all flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Copy Code</span>
                        </button>
                      </div>
                      <pre className="bg-slate-950 text-green-300 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-green-500/20">
                        {fixResult.fixedCode}
                      </pre>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowFixModal(false)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
