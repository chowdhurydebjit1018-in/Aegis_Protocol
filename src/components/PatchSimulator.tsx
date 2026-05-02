import React, { useState } from 'react';

interface PatchSimulatorProps {
  onBack: () => void;
}

type SimulationStage = 'idle' | 'detecting' | 'analyzing' | 'generating' | 'applying' | 'complete';

interface PatchResult {
  detection: {
    status: 'DETECTED' | 'NOT_DETECTED';
    attack_type: string;
    swc_id: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  };
  analysis: {
    root_cause: string;
    attack_vector: string;
    affected_function: string;
    technical_detail: string;
  };
  patch_decision: {
    strategy: 'REENTRANCY_GUARD' | 'ACCESS_CONTROL' | 'RATE_LIMIT' | 'INPUT_VALIDATION' | 'NONE';
    confidence: number;
    reason: string;
    requires_manual_approval: boolean;
  };
  patch_source: {
    type: 'PRE_AUDITED_LIBRARY';
    library_name: string;
    module: string;
    audit_status: 'VERIFIED';
  };
  simulation: {
    status: 'PASSED' | 'FAILED';
    attack_blocked: boolean;
    regression_detected: boolean;
    gas_impact: 'LOW' | 'MEDIUM' | 'HIGH';
    notes: string;
  };
  execution_diff: {
    before: string;
    after: string;
  };
  routing_update: {
    function: string;
    old_path: string;
    new_path: string;
  };
  final_action: {
    decision: 'APPLIED' | 'BLOCKED' | 'REQUIRES_APPROVAL';
    reason: string;
    rollback_available: boolean;
  };
}

const PatchSimulator: React.FC<PatchSimulatorProps> = ({ onBack }) => {
  const [stage, setStage] = useState<SimulationStage>('idle');
  const [selectedAttack, setSelectedAttack] = useState<string>('reentrancy');
  const [patchResult, setPatchResult] = useState<PatchResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const simulateAttack = async () => {
    setStage('detecting');
    setLogs([]);
    addLog('🔍 Monitoring transaction mempool...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('⚠️  ALERT: Suspicious transaction detected!');
    addLog(`📍 Attack Type: ${selectedAttack.toUpperCase()}`);
    
    setStage('analyzing');
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('🤖 AI analyzing vulnerability...');
    addLog('📊 Running pattern matching algorithms...');
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setStage('generating');
    addLog('🧠 Generating patch strategy...');
    addLog('🔍 Searching pre-audited patch library...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const patchStrategies: Record<string, PatchResult> = {
      reentrancy: {
        detection: {
          status: 'DETECTED',
          attack_type: 'Reentrancy Attack',
          swc_id: 'SWC-107',
          severity: 'CRITICAL',
          description: 'State modification after external call detected in withdraw() function'
        },
        analysis: {
          root_cause: 'External call to untrusted address before state update',
          attack_vector: 'Attacker can recursively call withdraw() via fallback function',
          affected_function: 'withdraw(uint256)',
          technical_detail: 'msg.sender.call{value: amount}("") executes before balances[msg.sender] -= amount'
        },
        patch_decision: {
          strategy: 'REENTRANCY_GUARD',
          confidence: 0.92,
          reason: 'OpenZeppelin ReentrancyGuard is battle-tested and prevents recursive calls via mutex pattern',
          requires_manual_approval: false
        },
        patch_source: {
          type: 'PRE_AUDITED_LIBRARY',
          library_name: 'OpenZeppelin Contracts v4.9.0',
          module: 'ReentrancyGuard.sol',
          audit_status: 'VERIFIED'
        },
        simulation: {
          status: 'PASSED',
          attack_blocked: true,
          regression_detected: false,
          gas_impact: 'LOW',
          notes: 'Tested with 1000 attack scenarios. All blocked. Legitimate withdrawals unaffected. Gas overhead: ~2300 per call.'
        },
        execution_diff: {
          before: 'User → withdraw() → External Call → State Update (VULNERABLE)',
          after: 'User → Proxy → ReentrancyGuard → Check Lock → Set Lock → withdraw() → Clear Lock (SAFE)'
        },
        routing_update: {
          function: 'withdraw(uint256)',
          old_path: 'User → VulnerableContract.withdraw()',
          new_path: 'User → SentinelProxy → ReentrancyPatch.withdraw() → VulnerableContract'
        },
        final_action: {
          decision: 'APPLIED',
          reason: 'Confidence above threshold (0.92 > 0.75), simulation passed, no regressions detected',
          rollback_available: true
        }
      },
      access_control: {
        detection: {
          status: 'DETECTED',
          attack_type: 'Missing Access Control',
          swc_id: 'SWC-105',
          severity: 'CRITICAL',
          description: 'Critical function selfdestruct() accessible to any caller without authorization'
        },
        analysis: {
          root_cause: 'No access control modifier or require statement protecting selfdestruct',
          attack_vector: 'Any address can call selfdestruct and destroy contract, stealing remaining funds',
          affected_function: 'emergencyShutdown()',
          technical_detail: 'Function has public visibility but no onlyOwner, onlyAdmin, or msg.sender validation'
        },
        patch_decision: {
          strategy: 'ACCESS_CONTROL',
          confidence: 0.89,
          reason: 'OpenZeppelin Ownable pattern is industry standard for admin functions',
          requires_manual_approval: false
        },
        patch_source: {
          type: 'PRE_AUDITED_LIBRARY',
          library_name: 'OpenZeppelin Contracts v4.9.0',
          module: 'Ownable.sol',
          audit_status: 'VERIFIED'
        },
        simulation: {
          status: 'PASSED',
          attack_blocked: true,
          regression_detected: false,
          gas_impact: 'LOW',
          notes: 'Unauthorized calls now revert with "Ownable: caller is not the owner". Owner can still execute normally. Gas overhead: ~800 per call.'
        },
        execution_diff: {
          before: 'Anyone → emergencyShutdown() → Contract Destroyed (VULNERABLE)',
          after: 'User → Proxy → Check msg.sender == owner → If Not: REVERT, If Yes: emergencyShutdown() (SAFE)'
        },
        routing_update: {
          function: 'emergencyShutdown()',
          old_path: 'Anyone → VulnerableContract.emergencyShutdown()',
          new_path: 'User → SentinelProxy → AccessControlPatch.onlyOwner() → VulnerableContract'
        },
        final_action: {
          decision: 'APPLIED',
          reason: 'Confidence above threshold (0.89 > 0.75), simulation passed, critical vulnerability blocked',
          rollback_available: true
        }
      },
      dos: {
        detection: {
          status: 'DETECTED',
          attack_type: 'DoS via Unbounded Loop',
          swc_id: 'SWC-128',
          severity: 'HIGH',
          description: 'Function iterates over unbounded array, allowing gas limit DoS attack'
        },
        analysis: {
          root_cause: 'for (uint i = 0; i < users.length; i++) loop with no upper bound',
          attack_vector: 'Attacker adds many users, causing function to exceed block gas limit',
          affected_function: 'processAllUsers()',
          technical_detail: 'Array size can grow indefinitely. At ~1000 users, function becomes uncallable due to gas costs'
        },
        patch_decision: {
          strategy: 'RATE_LIMIT',
          confidence: 0.78,
          reason: 'Rate limiting prevents spam while allowing legitimate usage. Lower confidence due to potential UX impact',
          requires_manual_approval: true
        },
        patch_source: {
          type: 'PRE_AUDITED_LIBRARY',
          library_name: 'Custom Security Module',
          module: 'RateLimiter.sol',
          audit_status: 'VERIFIED'
        },
        simulation: {
          status: 'PASSED',
          attack_blocked: true,
          regression_detected: false,
          gas_impact: 'MEDIUM',
          notes: 'Limits to 5 calls per 60 seconds. Attack attempts blocked. Legitimate users may experience delays during high traffic. Gas overhead: ~5000 per call.'
        },
        execution_diff: {
          before: 'User → processAllUsers() → Iterate 10,000 users → OUT_OF_GAS (VULNERABLE)',
          after: 'User → Proxy → Check rate limit → If exceeded: REVERT, If OK: processAllUsers() with max 100 iterations (SAFE)'
        },
        routing_update: {
          function: 'processAllUsers()',
          old_path: 'User → VulnerableContract.processAllUsers()',
          new_path: 'User → SentinelProxy → RateLimiterPatch.check() → VulnerableContract (limited)'
        },
        final_action: {
          decision: 'REQUIRES_APPROVAL',
          reason: 'Confidence below auto-apply threshold (0.78 < 0.85). Manual review needed for UX impact assessment',
          rollback_available: true
        }
      }
    };

    const result = patchStrategies[selectedAttack] || patchStrategies.reentrancy;
    setPatchResult(result);
    
    addLog(`✅ Vulnerability: ${result.detection.attack_type} (${result.detection.swc_id})`);
    addLog(`📊 Severity: ${result.detection.severity}`);
    addLog(`🔍 Root Cause: ${result.analysis.root_cause}`);
    
    setStage('generating');
    await new Promise(resolve => setTimeout(resolve, 900));
    addLog(`🔧 Patch Strategy: ${result.patch_decision.strategy}`);
    addLog(`📚 Source: ${result.patch_source.library_name}`);
    addLog(`✅ Module: ${result.patch_source.module} (${result.patch_source.audit_status})`);
    addLog(`📈 Confidence: ${(result.patch_decision.confidence * 100).toFixed(1)}%`);
    
    if (result.patch_decision.confidence < 0.75) {
      addLog('⚠️  Confidence below auto-apply threshold (0.75)');
      addLog('🔒 Requires manual approval');
    }
    
    setStage('applying');
    await new Promise(resolve => setTimeout(resolve, 1100));
    addLog('🔧 Preparing patch application...');
    addLog('📝 Updating Sentinel Proxy routing table...');
    addLog(`📍 Function: ${result.routing_update.function}`);
    addLog(`🔄 Old Path: ${result.routing_update.old_path}`);
    addLog(`🔄 New Path: ${result.routing_update.new_path}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    addLog('🧪 Starting forked chain simulation...');
    addLog('⏳ Deploying contracts to fork...');
    await new Promise(resolve => setTimeout(resolve, 800));
    addLog('🎯 Replaying attack scenario...');
    addLog(`${result.simulation.attack_blocked ? '✅' : '❌'} Attack ${result.simulation.attack_blocked ? 'BLOCKED' : 'NOT BLOCKED'}`);
    addLog(`${result.simulation.regression_detected ? '❌' : '✅'} Regression test: ${result.simulation.regression_detected ? 'FAILED' : 'PASSED'}`);
    addLog(`⛽ Gas impact: ${result.simulation.gas_impact} (${result.simulation.notes.split('.')[0]})`);
    
    await new Promise(resolve => setTimeout(resolve, 900));
    
    if (result.final_action.decision === 'APPLIED') {
      setStage('complete');
      addLog('🎉 PATCH APPLIED SUCCESSFULLY');
      addLog(`✅ ${result.execution_diff.after}`);
      addLog('✅ Protocol continues running safely');
      addLog('🔄 Rollback available if needed');
      addLog('📧 Development team notified');
    } else if (result.final_action.decision === 'REQUIRES_APPROVAL') {
      setStage('complete');
      addLog('⚠️  MANUAL APPROVAL REQUIRED');
      addLog(`📋 Reason: ${result.final_action.reason}`);
      addLog('🔒 Patch staged for review');
      addLog('📧 Admin notification sent');
    } else {
      setStage('complete');
      addLog('🚫 PATCH BLOCKED');
      addLog(`❌ Reason: ${result.final_action.reason}`);
      addLog('🛡️ Emergency pause activated');
    }
  };

  const resetSimulation = () => {
    setStage('idle');
    setPatchResult(null);
    setLogs([]);
  };

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
            Back to Home
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl">
              🔧
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Autonomous Patch & Safe Execution Layer</h1>
              <p className="text-gray-400 text-lg">
                🚀 Exploit → Intercept → Patch → Continue (without shutdown)
              </p>
            </div>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-500 rounded-lg p-6 mb-8">
          <h2 className="text-white font-bold text-2xl mb-3">🛡️ Self-Healing Smart Contract Security</h2>
          <p className="text-gray-300 mb-4">
            Instead of just pausing contracts when something goes wrong, Aegis Protocol can <strong>automatically generate 
            and apply safe temporary patches at runtime</strong> - allowing your protocol to continue running while blocking attacks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: '🔍', label: 'Detect Exploit', desc: 'Real-time monitoring' },
              { icon: '🛑', label: 'Intercept Attack', desc: 'Block malicious call' },
              { icon: '🔧', label: 'Apply Patch', desc: 'Safe fallback logic' },
              { icon: '✅', label: 'Continue Running', desc: 'No downtime' }
            ].map((step, idx) => (
              <div key={idx} className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{step.icon}</div>
                <div className="text-white font-semibold mb-1">{step.label}</div>
                <div className="text-gray-400 text-sm">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Simulation Control */}
          <div>
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold text-xl mb-4">⚙️ Simulation Control</h3>
              
              <div className="mb-6">
                <label className="text-gray-300 font-semibold mb-2 block">Select Attack Type:</label>
                <select
                  value={selectedAttack}
                  onChange={(e) => setSelectedAttack(e.target.value)}
                  disabled={stage !== 'idle'}
                  className="w-full bg-slate-800 text-white border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                >
                  <option value="reentrancy">🔄 Reentrancy Attack</option>
                  <option value="access_control">🔐 Missing Access Control</option>
                  <option value="dos">⚠️ DoS via Unbounded Loop</option>
                </select>
              </div>

              {stage === 'idle' && (
                <button
                  onClick={simulateAttack}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  🚀 Simulate Attack & Patch
                </button>
              )}

              {stage === 'complete' && (
                <button
                  onClick={resetSimulation}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  🔄 Reset Simulation
                </button>
              )}

              {stage !== 'idle' && stage !== 'complete' && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Processing...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stage === 'detecting' && '🔍 Detecting attack...'}
                    {stage === 'analyzing' && '🤖 Analyzing vulnerability...'}
                    {stage === 'generating' && '🔧 Generating patch...'}
                    {stage === 'applying' && '✅ Applying patch...'}
                  </div>
                </div>
              )}
            </div>

            {/* Real-time Logs */}
            <div className="bg-slate-900 border border-purple-500/20 rounded-xl overflow-hidden">
              <div className="bg-slate-800 px-4 py-3 border-b border-purple-500/20">
                <h4 className="text-white font-semibold">📋 Real-Time Logs</h4>
              </div>
              <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    Waiting for simulation to start...
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="text-green-400 mb-1 hover:bg-slate-800 px-2 py-1 rounded">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Patch Details */}
          <div>
            {/* Current Stage Indicator */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold text-xl mb-4">📊 Execution Pipeline</h3>
              <div className="space-y-3">
                {[
                  { stage: 'detecting', label: 'Exploit Detection', icon: '🔍' },
                  { stage: 'analyzing', label: 'AI Analysis', icon: '🤖' },
                  { stage: 'generating', label: 'Patch Generation', icon: '🔧' },
                  { stage: 'applying', label: 'Safe Execution', icon: '✅' },
                  { stage: 'complete', label: 'Protocol Running', icon: '🎉' }
                ].map((item, idx) => {
                  const isActive = stage === item.stage;
                  const isComplete = ['detecting', 'analyzing', 'generating', 'applying', 'complete'].indexOf(stage) > 
                                    ['detecting', 'analyzing', 'generating', 'applying', 'complete'].indexOf(item.stage);
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isActive ? 'bg-green-500/20 border border-green-500/50' :
                        isComplete ? 'bg-green-500/10' :
                        'bg-slate-800/50'
                      }`}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className={`font-semibold ${isActive || isComplete ? 'text-green-300' : 'text-gray-400'}`}>
                          {item.label}
                        </div>
                      </div>
                      {isComplete && <div className="text-green-400">✓</div>}
                      {isActive && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patch Result */}
            {patchResult && (
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-white font-bold text-xl mb-4">🔍 Security Analysis Report</h3>
                
                <div className="space-y-4">
                  {/* Detection */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Detection Status</div>
                    <div className="text-white font-semibold text-lg">{patchResult.detection.attack_type}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        patchResult.detection.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 
                        patchResult.detection.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50' :
                        'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                      }`}>
                        {patchResult.detection.severity}
                      </span>
                      <span className="text-gray-500 text-xs">{patchResult.detection.swc_id}</span>
                    </div>
                    <div className="text-gray-400 text-sm mt-2">{patchResult.detection.description}</div>
                  </div>

                  {/* Analysis */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2 font-semibold">📊 Root Cause Analysis</div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-purple-300">Function:</span> <span className="text-gray-300 font-mono">{patchResult.analysis.affected_function}</span></div>
                      <div><span className="text-purple-300">Issue:</span> <span className="text-gray-300">{patchResult.analysis.root_cause}</span></div>
                      <div><span className="text-purple-300">Vector:</span> <span className="text-gray-300">{patchResult.analysis.attack_vector}</span></div>
                    </div>
                  </div>

                  {/* Patch Decision */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">🔧 Patch Strategy Selected</div>
                    <div className="text-white font-semibold text-lg mb-2">{patchResult.patch_decision.strategy}</div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="text-gray-400 text-sm">AI Confidence:</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            patchResult.patch_decision.confidence >= 0.85 ? 'bg-green-400' :
                            patchResult.patch_decision.confidence >= 0.75 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${patchResult.patch_decision.confidence * 100}%` }}
                        ></div>
                      </div>
                      <div className={`font-semibold ${
                        patchResult.patch_decision.confidence >= 0.85 ? 'text-green-400' :
                        patchResult.patch_decision.confidence >= 0.75 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {(patchResult.patch_decision.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">{patchResult.patch_decision.reason}</div>
                    {patchResult.patch_decision.requires_manual_approval && (
                      <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-1 text-yellow-300 text-sm">
                        ⚠️ Manual Approval Required
                      </div>
                    )}
                  </div>

                  {/* Patch Source */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 font-semibold mb-2">📚 Verified Patch Source</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Library:</span>
                        <span className="text-gray-300 font-mono">{patchResult.patch_source.library_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Module:</span>
                        <span className="text-gray-300 font-mono">{patchResult.patch_source.module}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-300 font-semibold">✅ {patchResult.patch_source.audit_status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Results */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2 font-semibold">🧪 Simulation Results</div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className={`text-center p-2 rounded ${patchResult.simulation.status === 'PASSED' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className="text-xs text-gray-400">Status</div>
                        <div className={`font-bold ${patchResult.simulation.status === 'PASSED' ? 'text-green-400' : 'text-red-400'}`}>
                          {patchResult.simulation.status}
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded ${patchResult.simulation.attack_blocked ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className="text-xs text-gray-400">Attack Blocked</div>
                        <div className={`font-bold ${patchResult.simulation.attack_blocked ? 'text-green-400' : 'text-red-400'}`}>
                          {patchResult.simulation.attack_blocked ? 'YES' : 'NO'}
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded ${!patchResult.simulation.regression_detected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className="text-xs text-gray-400">Regression</div>
                        <div className={`font-bold ${!patchResult.simulation.regression_detected ? 'text-green-400' : 'text-red-400'}`}>
                          {patchResult.simulation.regression_detected ? 'DETECTED' : 'NONE'}
                        </div>
                      </div>
                      <div className="text-center p-2 rounded bg-blue-500/10">
                        <div className="text-xs text-gray-400">Gas Impact</div>
                        <div className="font-bold text-blue-400">{patchResult.simulation.gas_impact}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">{patchResult.simulation.notes}</div>
                  </div>

                  {/* Execution Flow */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2 font-semibold">🔄 Execution Flow Changes</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-red-300 text-xs mb-1">❌ BEFORE (Vulnerable):</div>
                        <div className="bg-red-900/20 border border-red-500/30 rounded px-3 py-2 text-gray-300 text-sm font-mono">
                          {patchResult.execution_diff.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-300 text-xs mb-1">✅ AFTER (Patched):</div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded px-3 py-2 text-gray-300 text-sm font-mono">
                          {patchResult.execution_diff.after}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Action */}
                  <div className={`rounded-lg p-4 ${
                    patchResult.final_action.decision === 'APPLIED' ? 'bg-green-500/10 border border-green-500/30' :
                    patchResult.final_action.decision === 'REQUIRES_APPROVAL' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <div className={`font-semibold mb-2 ${
                      patchResult.final_action.decision === 'APPLIED' ? 'text-green-400' :
                      patchResult.final_action.decision === 'REQUIRES_APPROVAL' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {patchResult.final_action.decision === 'APPLIED' ? '✅ PATCH APPLIED' :
                       patchResult.final_action.decision === 'REQUIRES_APPROVAL' ? '⚠️ AWAITING APPROVAL' :
                       '🚫 PATCH BLOCKED'}
                    </div>
                    <div className="text-gray-300 text-sm mb-2">{patchResult.final_action.reason}</div>
                    {patchResult.final_action.rollback_available && (
                      <div className="text-gray-400 text-xs">🔄 Rollback mechanism available</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-white font-bold text-2xl mb-6">🏗️ Self-Healing Architecture</h3>
          <div className="bg-slate-900 rounded-lg p-8 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm whitespace-pre">
{`        User Transaction
              ↓
    ┌─────────────────────┐
    │   Sentinel Proxy    │ ← Intercepts all calls
    └─────────┬───────────┘
              ↓
       Check Attack?
              ↓
    ┌─────────┴─────────┐
    │                   │
   YES                 NO
    │                   │
    ↓                   ↓
┌───────────┐     ┌──────────────┐
│ AI Brain  │     │  Original    │
│ Analyzes  │     │  Function    │
└─────┬─────┘     └──────────────┘
      ↓
┌─────────────────┐
│ Patch Library   │
│ (Pre-Audited)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Apply Patch     │
│ (Hot Swap)      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Safe Execution  │ ✅ Protocol continues
└─────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatchSimulator;
