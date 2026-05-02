# 📄 File Upload Feature Guide

## Overview

Aegis Protocol now supports **direct file upload** for smart contract analysis, making it easier to audit your contracts without copy-pasting code.

---

## ✨ Supported File Types

- **`.sol`** - Solidity smart contract files
- **`.txt`** - Text files containing Solidity code

---

## 🚀 How to Use

### Method 1: Upload via Button

1. **Navigate to Scanner**
   - Click "Start Scanning" on homepage
   - Or click "Launch Scanner" in navigation

2. **Click Upload Button**
   - Look for "Upload File (.sol, .txt)" button
   - Located below the code editor

3. **Select Your File**
   - Choose a `.sol` or `.txt` file from your computer
   - File name will appear after successful upload

4. **Analyze Contract**
   - Code automatically populates in the editor
   - Click "🚀 Run Security Audit"
   - Review results in the dashboard

### Method 2: Drag & Drop (Browser Default)

1. Open the Scanner page
2. Drag your `.sol` file over the upload button
3. Drop to upload
4. File content loads automatically

---

## 📝 File Upload Flow

```
User selects file
       ↓
File validation (.sol or .txt)
       ↓
Read file content
       ↓
Populate code editor
       ↓
User clicks "Analyze Contract"
       ↓
AI analysis runs (same as pasted code)
       ↓
Results displayed in dashboard
```

---

## 🎯 Example Files to Test

### Example 1: Simple Vulnerable Contract

Create a file `VulnerableBank.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Reentrancy vulnerability!
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);
        
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        
        balances[msg.sender] -= _amount;
    }
}
```

**Expected Results:**
- Risk Score: 30-40
- Vulnerabilities: Reentrancy, Floating Pragma
- Severity: Critical/Medium

---

### Example 2: Access Control Issue

Create a file `UnsafeAdmin.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnsafeAdmin {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Missing access control!
    function destroy() public {
        selfdestruct(payable(msg.sender));
    }
    
    // tx.origin vulnerability
    function transferOwnership(address newOwner) public {
        require(tx.origin == owner);
        owner = newOwner;
    }
}
```

**Expected Results:**
- Risk Score: 60-70
- Vulnerabilities: Unprotected selfdestruct, tx.origin usage
- Severity: Critical/Medium

---

### Example 3: Safe Contract

Create a file `SafeBank.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeBank is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be > 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 _amount) public nonReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        balances[msg.sender] -= _amount; // State change first!
        
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
        
        emit Withdrawal(msg.sender, _amount);
    }
}
```

**Expected Results:**
- Risk Score: 0-5
- Vulnerabilities: None or minimal
- Severity: Safe/Low

---

## 🔧 Technical Implementation

### File Reader Logic

```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file extension
  const fileName = file.name;
  const validExtensions = ['.sol', '.txt'];
  const isValid = validExtensions.some(ext => 
    fileName.toLowerCase().endsWith(ext)
  );

  if (!isValid) {
    alert('Please upload a .sol or .txt file');
    return;
  }

  // Read file content
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    setCode(content); // Populate editor
    setUploadedFileName(fileName); // Show filename
  };
  reader.readAsText(file);
};
```

### Analysis Process

Once file is uploaded:
1. Content appears in code editor
2. Same AI analysis runs as pasted code
3. All 13 vulnerability checks execute
4. Results display in dashboard
5. User can edit code before re-analyzing

---

## 💡 Best Practices

### For Users

1. **File Size**
   - Keep files under 100KB for best performance
   - Very large contracts may take longer to analyze

2. **File Format**
   - UTF-8 encoding recommended
   - Remove any special characters that might cause parsing issues

3. **Multiple Files**
   - Currently supports single file upload
   - For projects with multiple contracts, combine into one file or analyze separately

4. **Privacy**
   - Files are processed **client-side only**
   - Code never leaves your browser
   - No data sent to external servers

### For Developers

1. **Testing**
   - Upload your contract before deployment
   - Fix all Critical and High issues
   - Re-upload to verify fixes

2. **Version Control**
   - Keep analyzed contracts in version control
   - Track security improvements over time

3. **Documentation**
   - Add comments explaining why certain patterns are used
   - Document any intentional "vulnerabilities" (e.g., upgradeability patterns)

---

## 🐛 Troubleshooting

### Issue: "Please upload a .sol or .txt file"

**Cause:** Invalid file extension

**Solution:**
- Ensure file ends with `.sol` or `.txt`
- Rename file if necessary
- Check file isn't corrupted

### Issue: File uploads but editor is empty

**Cause:** File encoding issue

**Solution:**
- Save file as UTF-8
- Avoid special characters
- Try opening file in text editor first to verify content

### Issue: Analysis fails after upload

**Cause:** Invalid Solidity syntax

**Solution:**
- Check file contains valid Solidity code
- Verify pragma declaration exists
- Look for syntax errors in the editor

### Issue: Upload button not responding

**Cause:** Analysis in progress

**Solution:**
- Wait for current analysis to complete
- Upload button is disabled during analysis
- Clear code and try again

---

## 📊 Supported Contract Sizes

| Contract Size | Analysis Time | Performance |
|--------------|---------------|-------------|
| < 500 lines | < 2 seconds | Excellent |
| 500-1000 lines | 2-4 seconds | Good |
| 1000-2000 lines | 4-6 seconds | Acceptable |
| > 2000 lines | 6+ seconds | May be slow |

**Recommendation:** For very large contracts (>2000 lines), consider splitting into modules or analyzing key functions separately.

---

## 🔒 Security & Privacy

### Client-Side Processing
- ✅ All file reading happens in your browser
- ✅ No files uploaded to external servers
- ✅ Code stays on your machine
- ✅ Analysis runs locally

### Data Protection
- ✅ No file storage or logging
- ✅ Temporary memory only during analysis
- ✅ Cleared when page refreshes
- ✅ No tracking or analytics on uploaded code

---

## 🎓 Educational Use Cases

### For Students
1. Upload homework assignments
2. Check for common vulnerabilities
3. Learn secure coding patterns
4. Compare safe vs. unsafe implementations

### For Instructors
1. Analyze student submissions
2. Demonstrate security concepts
3. Create teaching examples
4. Grade security aspects

### For Researchers
1. Analyze real-world contracts
2. Study vulnerability patterns
3. Test detection accuracy
4. Contribute improvements

---

## 🚀 Future Enhancements

### Coming Soon
- [ ] **Batch Upload** - Analyze multiple files at once
- [ ] **ZIP Support** - Upload entire projects
- [ ] **Import Resolution** - Handle contract dependencies
- [ ] **Syntax Highlighting** - Better code visualization
- [ ] **File History** - Track previously analyzed files
- [ ] **Export Results** - Save analysis to PDF/JSON

### Advanced Features (Roadmap)
- [ ] **GitHub Integration** - Analyze repos directly
- [ ] **CI/CD Hooks** - Automated testing
- [ ] **Team Sharing** - Collaborate on audits
- [ ] **Version Comparison** - Track security improvements

---

## 📞 Support

Need help with file uploads?

- 📚 Check [README.md](README.md) for general docs
- 🐛 Report issues on GitHub
- 💬 Join our Discord community
- 📧 Email: support@aegis-protocol.io

---

<div align="center">

**🛡️ Aegis Protocol**

*Making Smart Contract Security Accessible to Everyone*

[Try Scanner](#) | [View Examples](#) | [Report Bug](#)

</div>
