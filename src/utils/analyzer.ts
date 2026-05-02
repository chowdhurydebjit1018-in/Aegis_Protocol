import { AuditResult, Vulnerability } from '../types';

export function analyzeContract(code: string): AuditResult {
  const vulnerabilities: Vulnerability[] = [];
  const lines = code.split('\n');
  
  // Analyze for various vulnerabilities
  detectReentrancy(code, lines, vulnerabilities);
  detectAccessControl(code, lines, vulnerabilities);
  detectIntegerOverflow(code, lines, vulnerabilities);
  detectUncheckedCalls(code, lines, vulnerabilities);
  detectTxOrigin(code, lines, vulnerabilities);
  detectTimestampDependence(code, lines, vulnerabilities);
  detectUnprotectedSelfDestruct(code, lines, vulnerabilities);
  detectFloatingPragma(code, lines, vulnerabilities);
  detectDeprecatedFunctions(code, lines, vulnerabilities);
  detectUninitializedStorage(code, lines, vulnerabilities);
  detectDoSVulnerabilities(code, lines, vulnerabilities);
  detectFrontRunning(code, lines, vulnerabilities);

  // Calculate risk score
  const riskScore = calculateRiskScore(vulnerabilities);
  const riskLevel = getRiskLevel(riskScore);
  
  // Code analysis
  const codeAnalysis = {
    linesOfCode: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length,
    complexity: calculateComplexity(code),
    functions: (code.match(/function\s+\w+/g) || []).length
  };

  // Generate recommendations
  const recommendations = generateRecommendations(vulnerabilities, code);
  
  // Determine circuit breaker status
  const circuitBreakerStatus = riskScore >= 70 ? 'blocked' : riskScore >= 40 ? 'paused' : 'active';

  return {
    riskScore,
    riskLevel,
    vulnerabilities,
    contractName: extractContractName(code),
    timestamp: new Date().toISOString(),
    codeAnalysis,
    recommendations,
    circuitBreakerStatus
  };
}

function detectReentrancy(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  // Check for external calls (call, transfer, send)
  const callPattern = /\.(call|transfer|send)\s*[({]/g;
  const matches = [...code.matchAll(callPattern)];
  
  if (matches.length > 0) {
    // Find functions containing external calls
    const functionMatches = code.matchAll(/function\s+(\w+)[^{]*\{([\s\S]*?)(?=\n\s*function|\n\s*\}[\s\S]*?$)/g);
    
    for (const funcMatch of functionMatches) {
      const funcName = funcMatch[1];
      const funcBody = funcMatch[0];
      
      // Check if function has external call
      if (callPattern.test(funcBody)) {
        // Look for state changes after the call
        const callIndex = funcBody.search(/\.(call|transfer|send)/);
        const afterCall = funcBody.substring(callIndex);
        
        // Check for state modifications after external call
        const hasStateChangeAfter = /\w+\s*=\s*[^=]|balances\[|\.push\(|\.pop\(/.test(afterCall);
        const hasReentrancyGuard = /nonReentrant|ReentrancyGuard/.test(funcBody);
        
        if (hasStateChangeAfter && !hasReentrancyGuard) {
          const lineNum = findLineNumber(code, funcName, lines);
          vulnerabilities.push({
            id: `REENTRANCY-${vulnerabilities.length + 1}`,
            type: 'Reentrancy',
            severity: 'critical',
            title: `Reentrancy Vulnerability in ${funcName}()`,
            description: 'This function modifies state AFTER making an external call, making it vulnerable to reentrancy attacks. An attacker could recursively call this function to drain funds or manipulate state.',
            line: lineNum,
            recommendation: '1. Move all state changes BEFORE external calls (Checks-Effects-Interactions pattern)\n2. Use OpenZeppelin\'s ReentrancyGuard modifier\n3. Use .transfer() instead of .call() for simple ETH transfers',
            codeSnippet: funcBody.substring(0, 150) + '...'
          });
        }
      }
    }
  }
}

function detectAccessControl(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  // Check for public/external functions with dangerous operations
  const functionMatches = code.matchAll(/function\s+(\w+)\s*\([^)]*\)\s*(public|external)([^{]*)\{([\s\S]*?)(?=\n\s*function|\n\s*\}[\s\S]*?$)/g);
  
  for (const match of functionMatches) {
    const funcName = match[1];
    const visibility = match[2];
    const modifiers = match[3];
    const funcBody = match[4];
    
    // Check for dangerous operations
    const hasSelfDestruct = /selfdestruct|suicide/.test(funcBody);
    const hasDelegateCall = /delegatecall/.test(funcBody);
    const hasTransfer = /transfer|send|call/.test(funcBody) && /value/.test(funcBody);
    const hasStateChange = /\w+\s*=\s*[^=]/.test(funcBody);
    
    // Check for access control
    const hasOnlyOwner = /onlyOwner|onlyAdmin/.test(modifiers);
    const hasRequire = /require\s*\(\s*msg\.sender\s*==/.test(funcBody);
    const hasAccessControl = hasOnlyOwner || hasRequire;
    
    // Flag critical functions without access control
    if ((visibility === 'public' || visibility === 'external') && !hasAccessControl) {
      if (hasSelfDestruct) {
        const lineNum = findLineNumber(code, funcName, lines);
        vulnerabilities.push({
          id: `ACCESS-${vulnerabilities.length + 1}`,
          type: 'Access Control',
          severity: 'critical',
          title: `Unprotected selfdestruct in ${funcName}()`,
          description: 'This function can destroy the contract and is accessible to anyone! An attacker could permanently destroy your contract and steal remaining funds.',
          line: lineNum,
          recommendation: 'Add an onlyOwner modifier or require(msg.sender == owner) check.',
          codeSnippet: match[0].substring(0, 120)
        });
      } else if (hasDelegateCall) {
        const lineNum = findLineNumber(code, funcName, lines);
        vulnerabilities.push({
          id: `ACCESS-${vulnerabilities.length + 1}`,
          type: 'Access Control',
          severity: 'critical',
          title: `Unprotected delegatecall in ${funcName}()`,
          description: 'Anyone can execute arbitrary code in this contract\'s context via delegatecall. This is a complete contract takeover vulnerability.',
          line: lineNum,
          recommendation: 'Add strict access controls and only delegatecall to trusted, audited contracts.',
          codeSnippet: match[0].substring(0, 120)
        });
      } else if (hasTransfer && hasStateChange) {
        const lineNum = findLineNumber(code, funcName, lines);
        vulnerabilities.push({
          id: `ACCESS-${vulnerabilities.length + 1}`,
          type: 'Access Control',
          severity: 'high',
          title: `Missing Access Control in ${funcName}()`,
          description: 'This function transfers funds or modifies critical state and is publicly accessible without authorization checks.',
          line: lineNum,
          recommendation: 'Implement proper access control using modifiers or require statements.',
          codeSnippet: match[0].substring(0, 120)
        });
      }
    }
  }
}

function detectIntegerOverflow(code: string, _lines: string[], vulnerabilities: Vulnerability[]): void {
  // Check for unchecked arithmetic (less critical in 0.8+)
  const version = code.match(/pragma solidity\s+[\^~]?(\d+\.\d+)/);
  const majorVersion = version ? parseFloat(version[1]) : 0;
  
  if (majorVersion < 0.8) {
    const hasArithmetic = /[\+\-\*]\s*=/.test(code);
    const usesSafeMath = /SafeMath|using\s+\w+\s+for\s+uint/.test(code);
    
    if (hasArithmetic && !usesSafeMath) {
      vulnerabilities.push({
        id: 'OVERFLOW-001',
        type: 'Integer Overflow',
        severity: 'high',
        title: 'Potential Integer Overflow',
        description: 'Contract uses arithmetic operations without SafeMath library in Solidity version < 0.8.0, which can lead to integer overflow/underflow.',
        recommendation: 'Use SafeMath library or upgrade to Solidity 0.8.0+ which has built-in overflow checks.',
      });
    }
  }
}

function detectUncheckedCalls(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  // Check for unchecked low-level calls
  const callPattern = /\.(call|delegatecall|send)\s*\([^)]*\)\s*;/g;
  const matches = code.matchAll(callPattern);
  
  for (const match of matches) {
    const context = code.substring(Math.max(0, match.index! - 100), match.index! + 100);
    const hasCheck = /require\s*\(|if\s*\(/.test(context);
    
    if (!hasCheck) {
      const lineNum = findLineNumber(code, match[0], lines);
      vulnerabilities.push({
        id: 'UNCHECKED-001',
        type: 'Unchecked Call',
        severity: 'medium',
        title: 'Unchecked External Call',
        description: 'Low-level call is not checked for success. Failed calls will not revert the transaction, potentially leading to unexpected behavior.',
        line: lineNum,
        recommendation: 'Always check the return value of low-level calls using require() or handle failures appropriately.',
        codeSnippet: match[0]
      });
    }
  }
}

function detectTxOrigin(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  if (/tx\.origin/.test(code)) {
    const lineNum = findLineNumber(code, 'tx.origin', lines);
    vulnerabilities.push({
      id: 'TXORIGIN-001',
      type: 'tx.origin Usage',
      severity: 'medium',
      title: 'Use of tx.origin for Authorization',
      description: 'Using tx.origin for authorization can make the contract vulnerable to phishing attacks.',
      line: lineNum,
      recommendation: 'Use msg.sender instead of tx.origin for authorization checks.',
    });
  }
}

function detectTimestampDependence(code: string, _lines: string[], vulnerabilities: Vulnerability[]): void {
  const timestampPattern = /block\.timestamp|now/;
  if (timestampPattern.test(code)) {
    const isCritical = /require|if/.test(code.split(timestampPattern)[0].slice(-50));
    
    if (isCritical) {
      vulnerabilities.push({
        id: 'TIMESTAMP-001',
        type: 'Timestamp Dependence',
        severity: 'low',
        title: 'Timestamp Dependence',
        description: 'Contract logic depends on block.timestamp which can be manipulated by miners within a small margin.',
        recommendation: 'Avoid using block.timestamp for critical logic. Use block.number or oracle-based time if precise timing is needed.',
      });
    }
  }
}

function detectUnprotectedSelfDestruct(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  if (/selfdestruct|suicide/.test(code)) {
    const hasProtection = /onlyOwner|require\s*\(msg\.sender/.test(code);
    
    if (!hasProtection) {
      const lineNum = findLineNumber(code, 'selfdestruct', lines);
      vulnerabilities.push({
        id: 'SELFDESTRUCT-001',
        type: 'Unprotected Selfdestruct',
        severity: 'critical',
        title: 'Unprotected Selfdestruct',
        description: 'The selfdestruct function can be called by anyone, allowing contract destruction and fund theft.',
        line: lineNum,
        recommendation: 'Protect selfdestruct with access control modifiers like onlyOwner.',
      });
    }
  }
}

function detectFloatingPragma(code: string, _lines: string[], vulnerabilities: Vulnerability[]): void {
  const pragmaPattern = /pragma solidity\s+[\^~]/;
  if (pragmaPattern.test(code)) {
    vulnerabilities.push({
      id: 'PRAGMA-001',
      type: 'Floating Pragma',
      severity: 'low',
      title: 'Floating Pragma Version',
      description: 'Using a floating pragma (^) can lead to contracts being compiled with different versions, potentially introducing bugs.',
      recommendation: 'Lock pragma to a specific compiler version for production contracts.',
    });
  }
}

function detectDeprecatedFunctions(code: string, _lines: string[], vulnerabilities: Vulnerability[]): void {
  const deprecated = ['suicide', 'throw', 'sha3', 'callcode'];
  
  deprecated.forEach(func => {
    if (new RegExp(`\\b${func}\\b`).test(code)) {
      vulnerabilities.push({
        id: `DEPRECATED-${func.toUpperCase()}`,
        type: 'Deprecated Function',
        severity: 'low',
        title: `Deprecated Function: ${func}`,
        description: `The function ${func} is deprecated and should not be used in modern Solidity.`,
        recommendation: `Replace ${func} with its modern equivalent.`,
      });
    }
  });
}

function detectUninitializedStorage(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  const storagePattern = /(\w+)\s+storage\s+(\w+)\s*;/g;
  const matches = [...code.matchAll(storagePattern)];
  
  for (const match of matches) {
    const varName = match[2];
    const initPattern = new RegExp(`${varName}\\s*=`);
    const lineNum = findLineNumber(code, match[0], lines);
    const context = code.substring(match.index!, match.index! + 200);
    
    if (!initPattern.test(context)) {
      vulnerabilities.push({
        id: `STORAGE-${vulnerabilities.length + 1}`,
        type: 'Uninitialized Storage',
        severity: 'high',
        title: 'Uninitialized Storage Pointer',
        description: `Storage variable '${varName}' may point to uninitialized storage.`,
        line: lineNum,
        recommendation: 'Always initialize storage pointers or use memory for local variables.',
        codeSnippet: match[0]
      });
    }
  }
}

function detectDoSVulnerabilities(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  const loopPattern = /for\s*\([^)]*\.length[^)]*\)/g;
  const matches = [...code.matchAll(loopPattern)];
  
  for (const match of matches) {
    const lineNum = findLineNumber(code, match[0], lines);
    vulnerabilities.push({
      id: `DOS-${vulnerabilities.length + 1}`,
      type: 'DoS Vulnerability',
      severity: 'medium',
      title: 'Potential DoS via Unbounded Loop',
      description: 'Loop iterates over array.length which could grow unbounded.',
      line: lineNum,
      recommendation: 'Limit array sizes or use pagination.',
      codeSnippet: match[0]
    });
  }
}

function detectFrontRunning(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  if (/price|rate|amount/.test(code) && !/commit|reveal|hash/.test(code)) {
    const functionMatches = code.matchAll(/function\s+(\w+).*public[^{]*\{([\s\S]*?)(?=\n\s*function|\n\s*\}[\s\S]*?$)/g);
    
    for (const match of functionMatches) {
      const funcName = match[1];
      const funcBody = match[2];
      
      if (/transfer|send|call/.test(funcBody) && /price|rate|amount/.test(funcBody)) {
        const lineNum = findLineNumber(code, funcName, lines);
        vulnerabilities.push({
          id: `FRONTRUN-${vulnerabilities.length + 1}`,
          type: 'Front-Running',
          severity: 'medium',
          title: `Potential Front-Running in ${funcName}()`,
          description: 'Function performs transactions based on current prices.',
          line: lineNum,
          recommendation: 'Implement commit-reveal schemes or slippage protection.',
          codeSnippet: match[0].substring(0, 100)
        });
      }
    }
  }
}

function calculateRiskScore(vulnerabilities: Vulnerability[]): number {
  let score = 0;
  let criticalCount = 0;
  let highCount = 0;
  
  vulnerabilities.forEach(vuln => {
    switch (vuln.severity) {
      case 'critical': 
        score += 30; 
        criticalCount++;
        break;
      case 'high': 
        score += 18; 
        highCount++;
        break;
      case 'medium': 
        score += 10; 
        break;
      case 'low': 
        score += 4; 
        break;
    }
  });
  
  // Boost score if multiple critical/high issues exist
  if (criticalCount >= 2) score += 15;
  if (criticalCount + highCount >= 3) score += 10;
  
  return Math.min(100, score);
}

function getRiskLevel(score: number): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
  if (score === 0) return 'safe';
  if (score < 20) return 'low';
  if (score < 40) return 'medium';
  if (score < 70) return 'high';
  return 'critical';
}

function calculateComplexity(code: string): number {
  // Simple complexity measure based on control flow statements
  const controlFlow = (code.match(/\b(if|for|while|require|modifier)\b/g) || []).length;
  const functions = (code.match(/function\s+\w+/g) || []).length;
  return controlFlow + functions;
}

function generateRecommendations(vulnerabilities: Vulnerability[], code: string): string[] {
  const recommendations: string[] = [];
  
  if (vulnerabilities.some(v => v.type === 'Reentrancy')) {
    recommendations.push('Implement ReentrancyGuard from OpenZeppelin');
    recommendations.push('Follow the Checks-Effects-Interactions pattern');
  }
  
  if (vulnerabilities.some(v => v.type === 'Access Control')) {
    recommendations.push('Use Ownable or AccessControl from OpenZeppelin');
    recommendations.push('Implement role-based access control for critical functions');
  }
  
  if (vulnerabilities.length > 5) {
    recommendations.push('Consider a professional audit before mainnet deployment');
  }
  
  if (!code.includes('pragma solidity')) {
    recommendations.push('Add proper pragma solidity version declaration');
  }
  
  if (vulnerabilities.length === 0) {
    recommendations.push('Contract looks good! Consider additional testing');
    recommendations.push('Add comprehensive unit tests');
    recommendations.push('Deploy to testnet for thorough testing');
  } else {
    recommendations.push('Fix all critical and high severity issues before deployment');
    recommendations.push('Add extensive test coverage for vulnerable functions');
  }
  
  return recommendations;
}

function extractContractName(code: string): string | undefined {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : undefined;
}

function findLineNumber(code: string, snippet: string, _lines: string[]): number | undefined {
  const index = code.indexOf(snippet);
  if (index === -1) return undefined;
  
  const beforeSnippet = code.substring(0, index);
  const lineNum = beforeSnippet.split('\n').length;
  return lineNum;
}
