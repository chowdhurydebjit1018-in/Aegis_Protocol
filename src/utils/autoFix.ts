import { Vulnerability } from '../types';

export interface FixResult {
  success: boolean;
  fixedCode: string;
  explanation: string;
  changes: string[];
}

export function generateAutoFix(vulnerability: Vulnerability, originalCode: string): FixResult {
  const fixes: Record<string, (code: string, vuln: Vulnerability) => FixResult> = {
    'Reentrancy': fixReentrancy,
    'Access Control': fixAccessControl,
    'Unprotected Selfdestruct': fixSelfDestruct,
    'Integer Overflow': fixIntegerOverflow,
    'Unchecked Call': fixUncheckedCall,
    'tx.origin Usage': fixTxOrigin,
    'Floating Pragma': fixFloatingPragma,
    'Deprecated Function': fixDeprecatedFunction,
  };

  const fixFunction = fixes[vulnerability.type];
  
  if (fixFunction) {
    return fixFunction(originalCode, vulnerability);
  }

  return {
    success: false,
    fixedCode: originalCode,
    explanation: 'Auto-fix not available for this vulnerability type. Manual review required.',
    changes: []
  };
}

function fixReentrancy(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Add ReentrancyGuard import if not present
  if (!code.includes('ReentrancyGuard') && !code.includes('nonReentrant')) {
    const importStatement = 'import "@openzeppelin/contracts/security/ReentrancyGuard.sol";\n';
    const pragmaMatch = code.match(/pragma solidity[^;]+;/);
    if (pragmaMatch) {
      fixedCode = fixedCode.replace(pragmaMatch[0], pragmaMatch[0] + '\n' + importStatement);
      changes.push('Added OpenZeppelin ReentrancyGuard import');
    }
  }

  // Add ReentrancyGuard to contract inheritance
  const contractMatch = fixedCode.match(/contract\s+(\w+)\s*{/);
  if (contractMatch && !fixedCode.includes('is ReentrancyGuard')) {
    fixedCode = fixedCode.replace(
      contractMatch[0],
      `contract ${contractMatch[1]} is ReentrancyGuard {`
    );
    changes.push(`Added ReentrancyGuard to contract ${contractMatch[1]}`);
  }

  // Find vulnerable function and add nonReentrant modifier
  const functionPattern = /function\s+withdraw\s*\([^)]*\)\s*(public|external)([^{]*)\{/;
  const funcMatch = fixedCode.match(functionPattern);
  if (funcMatch && !funcMatch[2].includes('nonReentrant')) {
    const modifiers = funcMatch[2].trim();
    const newModifiers = modifiers ? `${modifiers} nonReentrant` : 'nonReentrant';
    fixedCode = fixedCode.replace(
      funcMatch[0],
      `function withdraw${funcMatch[0].match(/\([^)]*\)/)![0]} ${funcMatch[1]} ${newModifiers} {`
    );
    changes.push('Added nonReentrant modifier to withdraw function');
  }

  // Move state updates before external calls
  const withdrawFuncMatch = fixedCode.match(/function\s+withdraw[^{]*\{([^}]*)\}/s);
  if (withdrawFuncMatch) {
    let funcBody = withdrawFuncMatch[1];
    
    // Check if state update comes after call
    const callMatch = funcBody.match(/msg\.sender\.call\{value:[^}]+\}\([^)]*\);/);
    const stateUpdateMatch = funcBody.match(/balances\[[^\]]+\]\s*-=\s*[^;]+;/);
    
    if (callMatch && stateUpdateMatch && funcBody.indexOf(callMatch[0]) < funcBody.indexOf(stateUpdateMatch[0])) {
      // Reorder: state update before call
      funcBody = funcBody.replace(stateUpdateMatch[0], '');
      funcBody = funcBody.replace(callMatch[0], stateUpdateMatch[0] + '\n        \n        ' + callMatch[0]);
      
      fixedCode = fixedCode.replace(withdrawFuncMatch[0], `function withdraw${withdrawFuncMatch[0].match(/\([^)]*\)/)![0].replace('function withdraw', '')} {${funcBody}}`);
      changes.push('Moved state update before external call (Checks-Effects-Interactions pattern)');
    }
  }

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Applied ReentrancyGuard pattern from OpenZeppelin. This prevents recursive calls via mutex lock.',
    changes
  };
}

function fixAccessControl(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Add Ownable import
  if (!code.includes('Ownable') && !code.includes('onlyOwner')) {
    const importStatement = 'import "@openzeppelin/contracts/access/Ownable.sol";\n';
    const pragmaMatch = code.match(/pragma solidity[^;]+;/);
    if (pragmaMatch) {
      fixedCode = fixedCode.replace(pragmaMatch[0], pragmaMatch[0] + '\n' + importStatement);
      changes.push('Added OpenZeppelin Ownable import');
    }
  }

  // Add Ownable to contract inheritance
  const contractMatch = fixedCode.match(/contract\s+(\w+)\s*{/);
  if (contractMatch && !fixedCode.includes('is Ownable')) {
    const contractName = contractMatch[1];
    if (fixedCode.includes('is ReentrancyGuard')) {
      fixedCode = fixedCode.replace('is ReentrancyGuard', 'is ReentrancyGuard, Ownable');
    } else {
      fixedCode = fixedCode.replace(contractMatch[0], `contract ${contractName} is Ownable {`);
    }
    changes.push(`Added Ownable to contract ${contractName}`);
  }

  // Find functions that need access control and add onlyOwner
  const criticalFunctions = ['selfdestruct', 'destroy', 'transferOwnership', 'emergencyWithdraw', 'emergencyShutdown'];
  
  criticalFunctions.forEach(funcName => {
    const funcPattern = new RegExp(`function\\s+(\\w*${funcName}\\w*)\\s*\\([^)]*\\)\\s*(public|external)([^{]*){`, 'i');
    const funcMatch = fixedCode.match(funcPattern);
    
    if (funcMatch && !funcMatch[3].includes('onlyOwner')) {
      const modifiers = funcMatch[3].trim();
      const newModifiers = modifiers ? `${modifiers} onlyOwner` : 'onlyOwner';
      fixedCode = fixedCode.replace(
        funcMatch[0],
        `function ${funcMatch[1]}${funcMatch[0].match(/\([^)]*\)/)![0]} ${funcMatch[2]} ${newModifiers} {`
      );
      changes.push(`Added onlyOwner modifier to ${funcMatch[1]}() function`);
    }
  });

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Added OpenZeppelin Ownable pattern with onlyOwner modifier to restrict critical functions.',
    changes
  };
}

function fixSelfDestruct(code: string, vuln: Vulnerability): FixResult {
  return fixAccessControl(code, vuln); // Same fix as access control
}

function fixIntegerOverflow(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Upgrade pragma to 0.8.0+
  const pragmaMatch = code.match(/pragma solidity\s+[\^~]?(\d+\.\d+)/);
  if (pragmaMatch) {
    const version = parseFloat(pragmaMatch[1]);
    if (version < 0.8) {
      fixedCode = fixedCode.replace(pragmaMatch[0], 'pragma solidity ^0.8.0');
      changes.push('Upgraded Solidity version to 0.8.0+ (built-in overflow protection)');
    }
  }

  // Alternative: Add SafeMath if staying on old version
  if (changes.length === 0 && !code.includes('SafeMath')) {
    const importStatement = 'import "@openzeppelin/contracts/utils/math/SafeMath.sol";\n';
    const pragmaMatch = code.match(/pragma solidity[^;]+;/);
    if (pragmaMatch) {
      fixedCode = fixedCode.replace(pragmaMatch[0], pragmaMatch[0] + '\n' + importStatement);
      changes.push('Added SafeMath library import (for pre-0.8 Solidity)');
    }

    // Add using SafeMath for uint
    const contractMatch = fixedCode.match(/contract\s+\w+[^{]*{/);
    if (contractMatch) {
      fixedCode = fixedCode.replace(contractMatch[0], contractMatch[0] + '\n    using SafeMath for uint256;\n');
      changes.push('Added "using SafeMath for uint256" directive');
    }
  }

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Upgraded to Solidity 0.8.0+ with built-in overflow checks, or added SafeMath library.',
    changes
  };
}

function fixUncheckedCall(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Find unchecked .call, .send, .delegatecall patterns
  const patterns = [
    /(\w+)\.call\{[^}]+\}\([^)]*\);/g,
    /(\w+)\.send\([^)]*\);/g,
    /(\w+)\.delegatecall\([^)]*\);/g
  ];

  patterns.forEach(pattern => {
    const matches = [...code.matchAll(pattern)];
    matches.forEach(match => {
      // Check if result is already captured
      const context = code.substring(Math.max(0, match.index! - 50), match.index! + 50);
      if (!context.includes('bool') && !context.includes('require')) {
        // Add require check
        fixedCode = fixedCode.replace(
          match[0],
          `(bool success, ) = ${match[0]}\n        require(success, "Call failed");`
        );
        changes.push(`Added success check for ${match[0].substring(0, 30)}...`);
      }
    });
  });

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Added require() checks to validate low-level call return values.',
    changes
  };
}

function fixTxOrigin(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Replace tx.origin with msg.sender
  const txOriginPattern = /tx\.origin/g;
  if (txOriginPattern.test(code)) {
    fixedCode = fixedCode.replace(txOriginPattern, 'msg.sender');
    changes.push('Replaced tx.origin with msg.sender for authorization checks');
  }

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Replaced tx.origin with msg.sender to prevent phishing attacks.',
    changes
  };
}

function fixFloatingPragma(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  // Lock pragma version
  const pragmaMatch = code.match(/pragma solidity\s+([\^~])(\d+\.\d+\.\d+)/);
  if (pragmaMatch) {
    const version = pragmaMatch[2];
    fixedCode = fixedCode.replace(pragmaMatch[0], `pragma solidity ${version}`);
    changes.push(`Locked pragma to specific version ${version} (removed ${pragmaMatch[1]})`);
  }

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Locked pragma to specific compiler version for consistent builds.',
    changes
  };
}

function fixDeprecatedFunction(code: string, _vuln: Vulnerability): FixResult {
  let fixedCode = code;
  const changes: string[] = [];

  const replacements: Record<string, string> = {
    'suicide': 'selfdestruct',
    'throw': 'revert',
    'sha3': 'keccak256',
    'callcode': 'delegatecall'
  };

  Object.entries(replacements).forEach(([deprecated, modern]) => {
    const pattern = new RegExp(`\\b${deprecated}\\b`, 'g');
    if (pattern.test(code)) {
      fixedCode = fixedCode.replace(pattern, modern);
      changes.push(`Replaced deprecated "${deprecated}" with "${modern}"`);
    }
  });

  return {
    success: changes.length > 0,
    fixedCode,
    explanation: 'Replaced deprecated Solidity functions with modern equivalents.',
    changes
  };
}
