import React from 'react';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'scanner' | 'dashboard' | 'features' | 'patch') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-bold text-xl">Aegis Protocol</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-white transition-colors">
                Home
              </button>
              <button onClick={() => onNavigate('features')} className="text-gray-300 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => onNavigate('patch')} className="text-gray-300 hover:text-white transition-colors">
                🔧 Self-Healing
              </button>
              <button onClick={() => onNavigate('scanner')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Launch Scanner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-purple-300 text-sm font-medium">AI-Powered Security Layer for Web3</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Autonomous AI Auditor
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                for Smart Contracts
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Aegis Protocol combines AI-powered code analysis with real-time on-chain protection. 
              Detect vulnerabilities before deployment and actively block malicious interactions with our circuit breaker.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onNavigate('scanner')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                🚀 Start Free Audit
              </button>
              <button 
                onClick={() => onNavigate('features')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Contracts Audited' },
              { number: '99.7%', label: 'Vulnerability Detection' },
              { number: '<2min', label: 'Average Audit Time' },
              { number: '$500M+', label: 'Assets Protected' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Defense Layers */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Three Layers of Defense</h2>
            <p className="text-gray-400 text-lg">Comprehensive security from development to deployment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Pre-Deployment AI Audit',
                description: 'AI scans for reentrancy, access control flaws, logic bugs, and gas abuse patterns before deployment.',
                features: ['Reentrancy Detection', 'Logic Analysis', 'Gas Optimization', 'Access Control']
              },
              {
                icon: '📊',
                title: 'Risk Scoring Engine',
                description: 'Advanced risk assessment with detailed vulnerability classification and automated fix suggestions.',
                features: ['Risk Score (0-100)', 'Vulnerability Classification', 'Fix Suggestions', 'Complexity Analysis']
              },
              {
                icon: '🚨',
                title: 'On-Chain Circuit Breaker',
                description: 'Real-time protection that pauses suspicious transactions and notifies administrators instantly.',
                features: ['Auto-Pause Transactions', 'Admin Notifications', 'Function Blocking', 'Rate Limiting']
              }
            ].map((layer, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-8 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20">
                <div className="text-6xl mb-4">{layer.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{layer.title}</h3>
                <p className="text-gray-300 mb-6">{layer.description}</p>
                <ul className="space-y-2">
                  {layer.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Autonomous Patch Feature Highlight */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-300 text-sm font-medium">NEW: Revolutionary Self-Healing Technology</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Autonomous Patch & Safe Execution Layer
            </h2>
            <p className="text-2xl text-gray-300 mb-4">
              🚀 Exploit → Intercept → Patch → Continue (without shutdown)
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              The world's first <span className="text-green-400 font-semibold">self-healing smart contract security system</span> that 
              doesn't just detect and block exploits—but autonomously patches vulnerabilities in real-time without shutting down your protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-4xl">❌</div>
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Traditional Approach</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Contract gets exploited</li>
                    <li>• Emergency pause activated</li>
                    <li>• Users panic and leave</li>
                    <li>• Protocol loses trust and TVL</li>
                    <li>• Weeks to fix and redeploy</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-8 ring-2 ring-green-400/30">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-4xl">✅</div>
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Aegis Protocol Self-Healing</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Attack detected in mempool</li>
                    <li>• AI generates safe patch instantly</li>
                    <li>• Malicious call intercepted & blocked</li>
                    <li>• Protocol continues running safely</li>
                    <li>• Zero downtime, users protected</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How Self-Healing Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: '🔍',
                  title: 'Vulnerability Understanding',
                  desc: 'AI identifies exact vulnerability type and attack vector in real-time'
                },
                {
                  step: '2',
                  icon: '🔧',
                  title: 'Patch Generation',
                  desc: 'Selects pre-audited patch from library (ReentrancyGuard, AccessControl, etc.)'
                },
                {
                  step: '3',
                  icon: '🧪',
                  title: 'Safe Simulation',
                  desc: 'Tests patch on forked chain to ensure it blocks attack without breaking legitimate flows'
                },
                {
                  step: '4',
                  icon: '⚡',
                  title: 'Hot Swap Execution',
                  desc: 'Proxy routes calls to patched logic via function selector override'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-400">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => onNavigate('patch')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
            >
              🔧 Try Self-Healing Simulator →
            </button>
            <p className="text-gray-400 mt-4">See autonomous patching in action with live attack simulations</p>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-gray-400 text-lg">Enterprise-grade security powered by AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI Smart Contract Scanner',
                description: 'Fine-tuned LLM for Solidity detects reentrancy, integer overflow, authorization bugs, and complex business logic flaws.'
              },
              {
                icon: '⚡',
                title: 'Real-Time Transaction Guard',
                description: 'Monitors transactions via mempool and flags suspicious interactions before execution.'
              },
              {
                icon: '🧯',
                title: 'Smart Contract Firewall',
                description: 'Proxy-based architecture to pause, rate-limit, or block specific functions with granular control.'
              },
              {
                icon: '🧠',
                title: 'Adversarially Robust AI',
                description: 'Detects prompt injection attempts and uses input sanitization with rule-based override layers.'
              },
              {
                icon: '📈',
                title: 'Developer Dashboard',
                description: 'Comprehensive code risk visualization, attack simulation, and automated fix recommendations.'
              },
              {
                icon: '🔐',
                title: 'Multi-Chain Support',
                description: 'Deploy protection across Ethereum, Polygon, Arbitrum, and other EVM-compatible chains.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built with Cutting-Edge Technology</h2>
            <p className="text-gray-400 text-lg">Production-ready stack for maximum security and performance</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'CodeLlama', category: 'AI Model' },
              { name: 'Solidity 0.8+', category: 'Smart Contracts' },
              { name: 'FastAPI', category: 'Backend' },
              { name: 'Hardhat', category: 'Development' },
              { name: 'ethers.js', category: 'Web3' },
              { name: 'PostgreSQL', category: 'Database' },
              { name: 'Redis', category: 'Caching' },
              { name: 'Sepolia', category: 'Testnet' }
            ].map((tech, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-white font-bold mb-1">{tech.name}</div>
                <div className="text-purple-300 text-sm">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers protecting billions in digital assets
          </p>
          <button 
            onClick={() => onNavigate('scanner')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Start Your First Audit →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2026 Aegis Protocol. Built for the Web3 security revolution.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
