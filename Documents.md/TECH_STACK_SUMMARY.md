# 📚 Aegis Protocol - Tech Stack Quick Reference

## 🎯 Overview

This document provides a quick reference to all technologies used in Aegis Protocol, extracted from the complete system architecture.

---

## 🖥️ Frontend Stack

### Core Framework
```
React: 19.2.3
TypeScript: 5.9.3
Vite: 7.2.4
Tailwind CSS: 4.1.17
```

### Supporting Libraries
```
react-dom: 19.2.3
clsx: 2.1.1
tailwind-merge: 3.4.0
```

### Browser APIs
```
FileReader API (file upload)
Local Storage (future)
Web Workers (future)
```

### Build Tools
```
@vitejs/plugin-react: 5.1.1
vite-plugin-singlefile: 2.3.0
@tailwindcss/vite: 4.1.17
```

---

## ⚙️ Backend Stack

### Current: Client-Side Only
```
Status: No backend deployed
All processing: Browser-based
Privacy: Client-side only
```

### Future Backend (Planned)
```
FastAPI (Python)
Node.js (Web3 interactions)
uvicorn (ASGI server)
Python 3.10+
```

---

## 🤖 AI/ML Stack

### Current Implementation
```
Pattern Matching: TypeScript RegEx
Algorithms: 13 detection functions
Risk Scoring: Weighted algorithm
Analysis: AST-like parsing
```

### Algorithm Categories
```
- Reentrancy Detection
- Access Control Analysis
- Integer Overflow Check
- Unchecked Call Detection
- tx.origin Validation
- Timestamp Dependence
- Uninitialized Storage
- DoS Detection
- Front-Running Analysis
- Pragma Checking
- Deprecated Function Detection
```

### Future AI (Planned)
```
CodeLlama (Fine-tuned LLM)
DeepSeek-Coder
PyTorch
HuggingFace Transformers
OpenAI GPT-4
```

---

## ⛓️ Blockchain Stack

### Smart Contracts (Documented)
```
Solidity: 0.8.19+
Framework: Hardhat / Foundry
Testing: Foundry + Hardhat
```

### Contracts
```
SentinelProxy.sol (routing)
PatchManager.sol (control)
ReentrancyPatch.sol
AccessControlPatch.sol
RateLimiterPatch.sol
```

### Web3 Libraries (Planned)
```
ethers.js: v6
wagmi: React hooks
viem: TypeScript library
```

### Networks
```
Testnet: Sepolia
Mainnet: Ethereum
L2: Polygon, Arbitrum, Base
```

### RPC Providers
```
Alchemy
Infura
```

---

## 🔒 Cybersecurity Stack

### Vulnerability Detection
```
SWC Registry Integration
Pattern Matching Algorithms
13 Detection Types
Confidence Scoring
```

### SWC IDs Detected
```
SWC-107: Reentrancy
SWC-105: Unprotected Function
SWC-101: Integer Overflow
SWC-104: Unchecked Call Return
SWC-115: tx.origin Usage
SWC-116: Timestamp Dependence
SWC-109: Uninitialized Storage
SWC-128: DoS with Gas Limit
SWC-103: Floating Pragma
SWC-111: Deprecated Functions
```

### Security Frameworks
```
OpenZeppelin Contracts
SWC Registry
OWASP Guidelines
```

### Input Validation
```
File type checking
Size limits
Code sanitization
XSS prevention (React)
```

---

## 💾 Database Stack

### Current: None (Client-Side)

### Future (Planned)
```
PostgreSQL: 15
Redis: 7
IPFS: Distributed storage
```

### Schema (Planned)
```
Tables:
- audits
- vulnerabilities
- patches
- users
- contracts
```

---

## 📜 Smart Contract Stack

### Development Tools
```
Hardhat: Development framework
Foundry: Testing framework
Remix: Online IDE
Tenderly: Debugging & forking
OpenZeppelin SDK: Secure libraries
```

### Contract Architecture
```
Proxy Pattern: Delegatecall routing
Upgradeable: Via proxy
Pausable: Emergency controls
Access Control: Multi-sig ready
```

### Audit Sources
```
OpenZeppelin v4.9.0
  - ReentrancyGuard.sol ✅
  - Ownable.sol ✅
  - AccessControl.sol ✅

Custom Modules
  - RateLimiter.sol ✅
  - InputValidator.sol ✅
```

---

## 🛡️ Security Layer Stack

### Confidence System
```
≥ 0.85: Auto-apply
0.75-0.84: Auto-apply with logging
< 0.75: Manual approval
< 0.50: Block + escalate
```

### Patch Strategies
```
REENTRANCY_GUARD
ACCESS_CONTROL
RATE_LIMIT
INPUT_VALIDATION
NONE (if no safe patch)
```

### Simulation Framework
```
Chain Forking: Tenderly/Hardhat
Attack Replay: Test transactions
Regression Testing: Legitimate flows
Gas Analysis: Impact measurement
```

---

## 🚀 DevOps Stack

### Package Management
```
npm: 9.0.0+
Node.js: 18.0.0+
```

### Build System
```
Vite: 7.2.4
TypeScript Compiler: 5.9.3
Tailwind CLI: 4.1.17
```

### Scripts
```
npm run dev     → Development server
npm run build   → Production build
npm run preview → Preview build
```

### CI/CD (Planned)
```
GitHub Actions
Automated testing
Build verification
Deployment automation
```

### Deployment Platforms
```
Primary: Vercel
Backup: Netlify
Enterprise: AWS S3 + CloudFront
Web3: IPFS
```

### Monitoring (Planned)
```
Sentry: Error tracking
Google Analytics: Usage
Mixpanel: User behavior
Datadog: Performance
```

---

## 📊 Performance Specs

### Build Metrics
```
Bundle Size: 327.03 KB
Gzipped: 87.90 KB
Build Time: ~1.5s
Modules: 36
```

### Runtime Performance
```
Analysis Time: < 2s (simple)
File Upload: Instant
Page Navigation: Instant
Simulation: ~5s (with delays)
```

---

## 🔑 Key Technologies by Category

### **Must-Know**
```
✅ React 19
✅ TypeScript 5.9
✅ Tailwind CSS 4
✅ Vite 7
✅ Solidity 0.8+
```

### **Important**
```
📌 FileReader API
📌 Pattern Matching
📌 SWC Registry
📌 OpenZeppelin
📌 ethers.js (future)
```

### **Nice-to-Have**
```
💡 FastAPI (future)
💡 PostgreSQL (future)
💡 CodeLlama (future)
💡 Redis (future)
```

---

## 📈 Technology Maturity

### Production-Ready
```
✅ React
✅ TypeScript
✅ Tailwind CSS
✅ Vite
✅ Solidity
✅ OpenZeppelin
```

### In Development
```
🔄 AI/ML integration
🔄 Backend API
🔄 Blockchain deployment
🔄 Database layer
```

### Planned
```
📅 Multi-chain support
📅 DAO governance
📅 Insurance integration
📅 Community patches
```

---

## 🎓 Learning Path

### For Frontend Developers
```
1. React 19 (Hooks, Context)
2. TypeScript (Advanced types)
3. Tailwind CSS (Utility-first)
4. Vite (Build optimization)
```

### For Blockchain Developers
```
1. Solidity 0.8+ (Smart contracts)
2. Hardhat/Foundry (Development)
3. OpenZeppelin (Security patterns)
4. ethers.js (Web3 integration)
```

### For Security Engineers
```
1. SWC Registry (Weakness patterns)
2. Static analysis (Pattern matching)
3. Vulnerability detection (Algorithms)
4. Audit methodologies
```

### For AI/ML Engineers
```
1. CodeLlama (LLM fine-tuning)
2. PyTorch (ML framework)
3. HuggingFace (Model deployment)
4. Pattern recognition
```

---

## 📚 Documentation Links

### Official Docs
```
React: https://react.dev
TypeScript: https://typescriptlang.org
Tailwind: https://tailwindcss.com
Vite: https://vitejs.dev
Solidity: https://soliditylang.org
OpenZeppelin: https://openzeppelin.com
```

### Security Resources
```
SWC Registry: https://swcregistry.io
OWASP: https://owasp.org
Trail of Bits: https://trailofbits.com
Consensys: https://consensys.net
```

---

## 🎯 Quick Stats

```
Total Technologies: 40+
Languages: 3 (TypeScript, Solidity, Python)
Frameworks: 5 (React, Vite, Tailwind, Hardhat, FastAPI)
Libraries: 15+
Platforms: 4 (Vercel, Netlify, AWS, IPFS)
Networks: 5 (Sepolia, Ethereum, Polygon, Arbitrum, Base)
```

---

<div align="center">

## 🛡️ Aegis Protocol

**Modern Tech Stack for Maximum Security**

*Every technology chosen for a reason.*

[View Full Architecture](ARCHITECTURE.md) | [Read Docs](README.md)

</div>
