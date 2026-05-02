# 🎬 Sentinel-Chain Demo Guide

## Step-by-Step Walkthrough

### 🏠 Step 1: Landing Page

When you first open Sentinel-Chain, you'll see:

1. **Hero Section**
   - Main tagline: "AI-Powered Smart Contract Security"
   - Two CTA buttons: "Start Scanning" and "View Features"

2. **Problem Statement**
   - Statistics on Web3 hacks
   - Current security challenges

3. **Solution Overview**
   - 3 layers of defense
   - Key features

4. **Stats Section**
   - Contracts audited
   - Detection rate
   - Assets protected

---

### 🔍 Step 2: Run Your First Analysis

#### Option A: Use Example Contract

1. Click **"Start Scanning"** button
2. You'll see the Scanner interface with a code editor
3. Click **"📝 Load Example"** button (top of editor)
4. The vulnerable contract will auto-populate
5. Click **"Analyze Contract"** button
6. Watch the progress bar (takes ~2 seconds)

**Expected Results:**
```
Risk Score: 70-80 (CRITICAL)
Vulnerabilities Found: 4-6
- Reentrancy Attack (Critical)
- Unprotected Selfdestruct (Critical)
- Missing Access Control (High)
- tx.origin Usage (Medium)
```

#### Option B: Test Custom Code

1. Paste your own Solidity contract
2. Click **"Analyze Contract"**
3. Review the results

---

### 📊 Step 3: Understanding the Dashboard

After analysis completes, you'll see:

#### 1. AI Analysis Summary
```
🤖 AI Security Analysis Complete
Detected X vulnerabilities using advanced pattern matching
Shows: All vulnerability types found
```

#### 2. Risk Score Card
```
┌──────────────────────────┐
│    Risk Score: 75/100    │
│      CRITICAL RISK       │
├──────────────────────────┤
│ Critical: 2              │
│ High: 1                  │
│ Medium: 1                │
│ Low: 0                   │
└──────────────────────────┘
```

#### 3. Circuit Breaker Status
```
🚨 Circuit Breaker: BLOCKED
Status: Contract deployment blocked due to critical issues
```

#### 4. Code Analysis Stats
```
📊 Code Analysis
- Lines of Code: XX
- Functions: X
- Complexity Score: XX
```

#### 5. Vulnerability Details

Each vulnerability card shows:
- **Severity Badge** (Critical/High/Medium/Low)
- **Title** - e.g., "Reentrancy Vulnerability in withdraw()"
- **Description** - What the issue is and why it's dangerous
- **Line Number** - Where the vulnerability exists
- **Code Snippet** - Actual vulnerable code
- **Recommendation** - How to fix it

**Example Card:**
```
┌─────────────────────────────────────────┐
│ 🔴 CRITICAL                             │
│ Reentrancy Vulnerability in withdraw() │
├─────────────────────────────────────────┤
│ Description:                            │
│ This function modifies state AFTER      │
│ making an external call...              │
│                                         │
│ 📍 Line: 23                             │
│                                         │
│ Code:                                   │
│ ```solidity                             │
│ msg.sender.call{value: _amount}("");    │
│ balances[msg.sender] -= _amount;        │
│ ```                                     │
│                                         │
│ 💡 Recommendation:                      │
│ 1. Move state changes BEFORE calls      │
│ 2. Use ReentrancyGuard                  │
│ 3. Use .transfer() for simple ETH       │
└─────────────────────────────────────────┘
```

---

### 🧪 Step 4: Test Different Scenarios

#### Scenario 1: Critical Risk Contract
```solidity
// Load the example contract
// Expected: 70+ risk score
// Issues: Reentrancy, Unprotected functions
```

#### Scenario 2: Safe Contract
```solidity
pragma solidity 0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 _amount) public nonReentrant {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount; // State change FIRST
        payable(msg.sender).transfer(_amount);
    }
}
```
**Expected: Low risk score (0-10)**

#### Scenario 3: Medium Risk Contract
```solidity
pragma solidity ^0.8.0; // Floating pragma

contract MediumRisk {
    mapping(address => uint) public balances;
    
    function transfer(uint amount) public {
        // Missing checks
        balances[msg.sender] -= amount;
    }
}
```
**Expected: Medium risk score (20-40)**

---

### 🎯 Step 5: Explore Features Page

Click **"View Features"** to see:

1. **Core Features**
   - AI Scanner details
   - Real-time guard
   - Smart contract firewall
   - Developer dashboard

2. **Tech Stack**
   - Languages & frameworks used
   - AI models
   - Blockchain tools

3. **Defense Layers**
   - Pre-deployment audit
   - Risk scoring
   - Circuit breaker

---

## 🔬 Testing the AI Detection

### Test 1: Reentrancy Detection

**Vulnerable Code:**
```solidity
function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount);
    msg.sender.call{value: _amount}("");
    balances[msg.sender] -= _amount; // ❌ After call
}
```

**✅ AI Should Detect:**
- Type: Reentrancy
- Severity: Critical
- Line: Function declaration
- Fix: Move state change before call

---

### Test 2: Access Control Detection

**Vulnerable Code:**
```solidity
function destroy() public {
    selfdestruct(payable(msg.sender)); // ❌ No access control
}
```

**✅ AI Should Detect:**
- Type: Unprotected Selfdestruct
- Severity: Critical
- Fix: Add onlyOwner modifier

---

### Test 3: tx.origin Detection

**Vulnerable Code:**
```solidity
function transfer(address to, uint amount) public {
    require(tx.origin == owner); // ❌ Using tx.origin
    balances[to] += amount;
}
```

**✅ AI Should Detect:**
- Type: tx.origin Usage
- Severity: Medium
- Fix: Use msg.sender instead

---

## 📈 Understanding Risk Levels

### 🟢 Safe (0)
- No vulnerabilities found
- Contract follows best practices
- Still recommend testing!

### 🔵 Low Risk (1-19)
- Minor issues
- Mostly style/convention problems
- Safe to deploy after fixes

### 🟡 Medium Risk (20-39)
- Some security concerns
- Should be addressed before deployment
- May not be critical but important

### 🟠 High Risk (40-69)
- Serious vulnerabilities
- Could lead to exploits
- Fix ALL issues before deployment

### 🔴 Critical Risk (70-100)
- Severe security flaws
- **DO NOT DEPLOY TO MAINNET**
- Contract is highly vulnerable
- Requires complete rewrite

---

## 🎓 Learning Opportunities

### For Beginners
1. Load the example contract
2. Read each vulnerability description
3. Understand WHY it's dangerous
4. Learn the recommended fixes
5. Try fixing and re-scanning

### For Intermediate Developers
1. Test your own contracts
2. Compare different patterns
3. Learn about edge cases
4. Explore the tech stack

### For Advanced Users
1. Review the analyzer logic
2. Contribute new detection patterns
3. Improve accuracy
4. Add custom rules

---

## 🐛 Troubleshooting

### Issue: "No vulnerabilities detected" on vulnerable code
**Solution:** Make sure the code pattern matches detection rules. Some complex logic bugs may not be caught by static analysis.

### Issue: Too many false positives
**Solution:** Review the specific vulnerability. Some patterns may be intentional in your design. Always verify recommendations.

### Issue: Analysis taking too long
**Solution:** Check code size. Very large contracts (1000+ lines) may take longer. Consider breaking into smaller modules.

---

## 🚀 Next Steps

1. ✅ Run analysis on example contract
2. ✅ Understand vulnerability types
3. ✅ Test your own contracts
4. ✅ Learn about fixes
5. 📚 Read the full documentation
6. 🔧 Implement recommended fixes
7. 🧪 Test on testnets
8. 🎯 Get professional audit for production

---

## 💡 Pro Tips

1. **Always fix Critical and High issues** before deployment
2. **Use OpenZeppelin libraries** for proven security patterns
3. **Test on testnets** (Sepolia, Goerli) before mainnet
4. **Get professional audits** for high-value contracts
5. **Stay updated** on new vulnerability types
6. **Join security communities** to learn from others

---

## 📞 Need Help?

- Read the **AI_ANALYSIS_GUIDE.md** for detailed detection info
- Check **README.md** for full documentation
- Review source code in `src/utils/analyzer.ts`
- Join our community for support

---

<div align="center">

**Happy Auditing! 🛡️**

*Securing Web3, One Contract at a Time*

</div>
