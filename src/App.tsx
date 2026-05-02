import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import Features from './components/Features';
import PatchSimulator from './components/PatchSimulator';
import { AuditResult } from './types';

type Page = 'home' | 'scanner' | 'dashboard' | 'features' | 'patch';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [originalCode, setOriginalCode] = useState<string>('');

  const handleAuditComplete = (result: AuditResult, code: string) => {
    setAuditResult(result);
    setOriginalCode(code);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'scanner':
        return <Scanner onAuditComplete={handleAuditComplete} onBack={() => setCurrentPage('home')} />;
      case 'dashboard':
        return <Dashboard result={auditResult} originalCode={originalCode} onBack={() => setCurrentPage('scanner')} />;
      case 'features':
        return <Features onBack={() => setCurrentPage('home')} />;
      case 'patch':
        return <PatchSimulator onBack={() => setCurrentPage('home')} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderPage()}
    </div>
  );
}
