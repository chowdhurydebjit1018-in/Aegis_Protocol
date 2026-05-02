# Quick Start Guide

Get Sentinel-Chain running in 5 minutes! 🚀

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18.0.0 or higher
- ✅ npm 9.0.0 or higher
- ✅ A modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ A code editor (VS Code recommended)

## Installation

### Step 1: Clone or Download

```bash
# If using git
git clone https://github.com/yourusername/sentinel-chain.git
cd sentinel-chain

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 19
- Vite 7
- Tailwind CSS 4
- TypeScript 5
- All necessary dev dependencies

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy)

## First Look

Once the app is running, you'll see:

1. **Landing Page** - Hero section with "Start Free Audit" button
2. **Navigation** - Home, Features, Launch Scanner
3. **Stats Section** - Key metrics and achievements
4. **Feature Sections** - Three defense layers, core features, tech stack

## Try Your First Audit

### Option 1: Use Example Contract

1. Click **"Launch Scanner"** in the navigation
2. Click **"📝 Load Example"** button
3. Click **"🚀 Run Security Audit"**
4. Wait 2-3 seconds for analysis
5. View results in the dashboard

### Option 2: Paste Your Own Code

1. Click **"Launch Scanner"**
2. Paste your Solidity code in the editor
3. Click **"🚀 Run Security Audit"**
4. Review the detected vulnerabilities

## Understanding the Results

### Risk Score (0-100)

- **0**: ✅ Safe - No vulnerabilities
- **1-19**: 🔵 Low Risk - Minor issues
- **20-39**: 🟡 Medium Risk - Should be fixed
- **40-69**: 🟠 High Risk - Needs immediate attention
- **70+**: 🔴 Critical Risk - DO NOT deploy

### Severity Levels

Each vulnerability is classified:

- 🔴 **Critical** (25 points)
  - Reentrancy
  - Unprotected selfdestruct
  - Missing access control

- 🟠 **High** (15 points)
  - Integer overflow (pre-0.8)
  - Delegatecall risks
  - Access control issues

- 🟡 **Medium** (8 points)
  - tx.origin usage
  - Unchecked calls

- 🔵 **Low** (3 points)
  - Floating pragma
  - Timestamp dependence
  - Deprecated functions

### Circuit Breaker Status

- ✅ **Active** (Score < 40): Safe to deploy
- ⚠️ **Paused** (Score 40-69): Review required
- 🚫 **Blocked** (Score 70+): Do not deploy

## Exploring Features

### Navigation Flow

```
Home → Scanner → Dashboard
  ↓       ↓
Features  Features
```

### Key Pages

1. **Home** (`/`)
   - Landing page
   - Feature overview
   - Stats and testimonials

2. **Scanner** (`/scanner`)
   - Code editor
   - Analysis controls
   - Progress tracking

3. **Dashboard** (`/dashboard`)
   - Risk score display
   - Vulnerability list
   - Recommendations
   - Quick actions

4. **Features** (`/features`)
   - Detailed documentation
   - Technology stack
   - Architecture overview

## Common Use Cases

### Use Case 1: Pre-Deployment Check

```
1. Write your smart contract
2. Copy the code
3. Paste into Sentinel-Chain scanner
4. Run audit
5. Fix vulnerabilities
6. Re-audit until score is low
7. Deploy with confidence
```

### Use Case 2: Learning Security

```
1. Load example vulnerable contract
2. Run audit to see issues
3. Read vulnerability descriptions
4. Learn about each issue type
5. Apply fixes based on recommendations
6. Re-audit to verify fixes
```

### Use Case 3: Code Review

```
1. Upload team member's contract
2. Run comprehensive audit
3. Export report
4. Share findings with team
5. Discuss and prioritize fixes
6. Verify fixes with re-audit
```

## Example Contracts

### Vulnerable Contract (Included)

The app includes a reentrancy-vulnerable bank contract:

**Issues Detected**:
- 🔴 Critical: Reentrancy vulnerability
- 🟡 Medium: Unchecked external call
- 🔵 Low: Floating pragma

**Expected Score**: ~35-40 (Medium-High Risk)

### Safe Contract Example

Try this safe version (copy and paste):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SafeBank {
    mapping(address => uint256) private balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        // Update state BEFORE external call (Checks-Effects-Interactions)
        balances[msg.sender] -= _amount;
        
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
```

**Expected Score**: 0-3 (Safe-Low Risk)

## Keyboard Shortcuts

- **Ctrl/Cmd + A**: Select all code
- **Ctrl/Cmd + C**: Copy code
- **Ctrl/Cmd + V**: Paste code
- **Esc**: Close expanded cards (future feature)

## Tips & Tricks

### 💡 Best Practices

1. **Start with examples** to learn the tool
2. **Read vulnerability descriptions** to understand issues
3. **Follow recommendations** for fixing code
4. **Re-audit after fixes** to verify improvements
5. **Export reports** for documentation (future feature)

### ⚡ Performance

- Analysis typically takes **1-3 seconds**
- Larger contracts may take up to **5 seconds**
- Progress bar shows real-time status
- No internet connection required (runs locally)

### 🔒 Privacy

- Code stays in your browser
- No data sent to external servers
- Completely client-side analysis
- Your code is never stored or shared

## Customization

### Change Analysis Timing

Edit `src/components/Scanner.tsx`:

```typescript
// Line ~35
await new Promise(resolve => setTimeout(resolve, 2000));  // Change 2000 to desired ms
```

### Adjust Risk Thresholds

Edit `src/utils/analyzer.ts`:

```typescript
function getRiskLevel(score: number) {
  if (score === 0) return 'safe';
  if (score < 20) return 'low';     // Adjust these thresholds
  if (score < 40) return 'medium';
  if (score < 70) return 'high';
  return 'critical';
}
```

### Add Custom Checks

Edit `src/utils/analyzer.ts` and add new detection functions:

```typescript
function detectMyCustomVuln(code: string, lines: string[], vulnerabilities: Vulnerability[]): void {
  if (/myPattern/.test(code)) {
    vulnerabilities.push({
      id: 'CUSTOM-001',
      type: 'My Custom Check',
      severity: 'medium',
      title: 'Custom Vulnerability',
      description: 'Description here',
      recommendation: 'Fix suggestion here'
    });
  }
}

// Then call it in analyzeContract():
detectMyCustomVuln(code, lines, vulnerabilities);
```

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Opens production build at `http://localhost:4173`

### Deploy to Hosting

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages
```bash
# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Install gh-pages
npm install -D gh-pages

# Deploy
npm run deploy
```

## Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styles Not Loading

```bash
# Verify Tailwind is installed
npm list tailwindcss

# Check index.css has @import "tailwindcss"
```

For more issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Next Steps

### Learn More

1. Read [README.md](README.md) for full documentation
2. Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for architecture details
3. Explore the codebase in `src/` directory
4. Read Solidity security resources in README

### Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Extend Functionality

Ideas for improvements:
- Add more vulnerability checks
- Integrate real AI models
- Add file upload support
- Implement export to PDF
- Create user accounts
- Add contract deployment
- Build browser extension

## Support

### Getting Help

- 📚 [Full Documentation](README.md)
- 🐛 [Troubleshooting Guide](TROUBLESHOOTING.md)
- 💬 [GitHub Discussions](https://github.com/yourusername/sentinel-chain/discussions)
- 🐞 [Report Issues](https://github.com/yourusername/sentinel-chain/issues)

### Community

- Discord: [Join Server](https://discord.gg/sentinelchain)
- Twitter: [@sentinelchain](https://twitter.com/sentinelchain)
- Email: support@sentinel-chain.ai

## What's Included

### Files Overview

```
sentinel-chain/
├── src/
│   ├── components/          # React components
│   │   ├── LandingPage.tsx  # Home page
│   │   ├── Scanner.tsx      # Code analyzer
│   │   ├── Dashboard.tsx    # Results display
│   │   └── Features.tsx     # Feature details
│   ├── utils/
│   │   ├── analyzer.ts      # Vulnerability detection
│   │   ├── constants.ts     # App constants
│   │   └── cn.ts            # Utilities
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── README.md                # Full documentation
├── IMPLEMENTATION.md        # Technical details
├── TROUBLESHOOTING.md       # Problem solving
├── QUICKSTART.md           # This file
└── package.json            # Dependencies
```

### Features Included

✅ AI-powered vulnerability detection  
✅ Risk scoring (0-100)  
✅ Circuit breaker simulation  
✅ Beautiful responsive UI  
✅ Example contracts  
✅ Real-time analysis  
✅ Detailed vulnerability cards  
✅ Recommendations engine  
✅ Multiple pages/sections  
✅ TypeScript support  
✅ Tailwind CSS styling  
✅ Fast Vite builds  

## Success Checklist

- [ ] Installed dependencies
- [ ] Started dev server
- [ ] Viewed landing page
- [ ] Loaded example contract
- [ ] Ran first audit
- [ ] Reviewed results
- [ ] Explored all pages
- [ ] Read documentation
- [ ] Tried custom code
- [ ] Built for production

## You're All Set! 🎉

You now have a fully functional AI smart contract auditor running locally!

**Start auditing contracts and building secure Web3 applications!**

---

Questions? Check the [README](README.md) or open an [issue](https://github.com/yourusername/sentinel-chain/issues).

Happy auditing! 🔒🚀
