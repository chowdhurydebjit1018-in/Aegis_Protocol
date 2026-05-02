// Application constants

export const APP_NAME = 'Aegis Protocol';
export const APP_TAGLINE = 'AI Smart Contract Auditor';

// Risk levels and their properties
export const RISK_LEVELS = {
  safe: {
    label: 'Safe',
    color: 'green',
    description: 'No vulnerabilities detected',
    threshold: 0
  },
  low: {
    label: 'Low Risk',
    color: 'blue',
    description: 'Minor issues that should be addressed',
    threshold: 1
  },
  medium: {
    label: 'Medium Risk',
    color: 'yellow',
    description: 'Significant vulnerabilities that need fixing',
    threshold: 20
  },
  high: {
    label: 'High Risk',
    color: 'orange',
    description: 'Serious vulnerabilities requiring immediate attention',
    threshold: 40
  },
  critical: {
    label: 'Critical Risk',
    color: 'red',
    description: 'Severe vulnerabilities - DO NOT deploy',
    threshold: 70
  }
} as const;

// Severity levels
export const SEVERITY_LEVELS = {
  critical: {
    label: 'Critical',
    icon: '🔴',
    score: 25,
    color: 'red'
  },
  high: {
    label: 'High',
    icon: '🟠',
    score: 15,
    color: 'orange'
  },
  medium: {
    label: 'Medium',
    icon: '🟡',
    score: 8,
    color: 'yellow'
  },
  low: {
    label: 'Low',
    icon: '🔵',
    score: 3,
    color: 'blue'
  }
} as const;

// Vulnerability types
export const VULNERABILITY_TYPES = {
  REENTRANCY: 'Reentrancy',
  ACCESS_CONTROL: 'Access Control',
  INTEGER_OVERFLOW: 'Integer Overflow',
  UNCHECKED_CALL: 'Unchecked Call',
  TX_ORIGIN: 'tx.origin Usage',
  TIMESTAMP: 'Timestamp Dependence',
  DELEGATECALL: 'Delegatecall',
  SELFDESTRUCT: 'Unprotected Selfdestruct',
  FLOATING_PRAGMA: 'Floating Pragma',
  DEPRECATED: 'Deprecated Function'
} as const;

// Analysis stages
export const ANALYSIS_STAGES = [
  { threshold: 30, message: '🔍 Parsing contract structure...' },
  { threshold: 60, message: '🤖 Running AI vulnerability detection...' },
  { threshold: 90, message: '📊 Calculating risk score...' },
  { threshold: 100, message: '✅ Finalizing audit report...' }
] as const;

// Stats for landing page
export const STATS = [
  { number: '10,000+', label: 'Contracts Audited' },
  { number: '99.7%', label: 'Vulnerability Detection' },
  { number: '<2min', label: 'Average Audit Time' },
  { number: '$500M+', label: 'Assets Protected' }
] as const;

// Defense layers
export const DEFENSE_LAYERS = [
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
] as const;

// Core features
export const CORE_FEATURES = [
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
] as const;

// Tech stack
export const TECH_STACK = [
  { name: 'CodeLlama', category: 'AI Model' },
  { name: 'Solidity 0.8+', category: 'Smart Contracts' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Hardhat', category: 'Development' },
  { name: 'ethers.js', category: 'Web3' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Caching' },
  { name: 'Sepolia', category: 'Testnet' }
] as const;

// Example vulnerable contract
export const EXAMPLE_VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// ⚠️  WARNING: This contract contains MULTIPLE vulnerabilities!
// DO NOT deploy to mainnet! Educational purposes only.

contract VulnerableBank {
    mapping(address => uint) public balances;
    address public owner;
    uint public totalDeposits;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
    }
    
    // 🔴 CRITICAL: Reentrancy vulnerability!
    // State updated AFTER external call
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);
        
        // External call before state update - VULNERABLE!
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        
        balances[msg.sender] -= _amount; // State change after call!
    }
    
    // 🔴 CRITICAL: Anyone can destroy the contract!
    function emergencyShutdown() public {
        selfdestruct(payable(msg.sender));
    }
    
    // 🟠 HIGH: No access control - anyone can change owner!
    function transferOwnership(address newOwner) public {
        owner = newOwner;
    }
    
    // 🟡 MEDIUM: Using tx.origin (phishing vulnerable)
    function adminTransfer(address to, uint amount) public {
        require(tx.origin == owner);
        balances[to] += amount;
    }
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}`;

// Example safe contract
export const EXAMPLE_SAFE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureBank is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 _amount) public nonReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        
        balances[msg.sender] -= _amount;
        
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
        
        emit Withdrawal(msg.sender, _amount);
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}`;

// Format utilities
export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const formatRiskScore = (score: number): string => {
  return `${score}/100`;
};

export const getRiskLevelFromScore = (score: number): keyof typeof RISK_LEVELS => {
  if (score === 0) return 'safe';
  if (score < 20) return 'low';
  if (score < 40) return 'medium';
  if (score < 70) return 'high';
  return 'critical';
};
