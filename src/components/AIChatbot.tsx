import React, { useState, useRef, useEffect } from 'react';
import { Vulnerability, AuditResult } from '../types';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  contractCode: string;
  vulnerabilities: Vulnerability[];
  auditResult: AuditResult | null;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose, contractCode, vulnerabilities, auditResult }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hello! I'm your Aegis Protocol AI Security Assistant. I've analyzed your smart contract and can help you understand:\n\n• Detected vulnerabilities\n• Security best practices\n• Fix recommendations\n• Code optimization\n• Gas optimization tips\n\nWhat would you like to know about your contract?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Contract analysis context
  const getContractContext = () => {
    const contractName = contractCode.match(/contract\s+(\w+)/)?.[1] || 'Unknown';
    const functionCount = (contractCode.match(/function\s+\w+/g) || []).length;
    const lineCount = contractCode.split('\n').length;
    
    return {
      name: contractName,
      functions: functionCount,
      lines: lineCount,
      vulnerabilities: vulnerabilities.length,
      riskScore: auditResult?.riskScore || 0,
      riskLevel: auditResult?.riskLevel || 'unknown'
    };
  };

  const generateResponse = (userMessage: string): string => {
    const context = getContractContext();
    const lowerMessage = userMessage.toLowerCase();

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! I'm here to help you understand your smart contract security.\n\nYour contract "${context.name}" has:\n• ${context.functions} functions\n• ${context.lines} lines of code\n• ${context.vulnerabilities} vulnerabilities detected\n• Risk Level: ${context.riskLevel.toUpperCase()}\n\nWhat would you like to know?`;
    }

    // Vulnerability-related questions
    if (lowerMessage.includes('vulnerabilit') || lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('risk')) {
      if (vulnerabilities.length === 0) {
        return "✅ Great news! No vulnerabilities were detected in your contract. However, I still recommend:\n\n1. Thorough testing on testnets\n2. Professional security audit before mainnet deployment\n3. Gas optimization review\n4. Adding comprehensive documentation";
      }

      let response = `🔍 I found **${vulnerabilities.length} vulnerability/vulnerabilities** in your contract:\n\n`;
      
      vulnerabilities.forEach((vuln, idx) => {
        response += `**${idx + 1}. ${vuln.title}**\n`;
        response += `   • Severity: ${vuln.severity.toUpperCase()}\n`;
        response += `   • Type: ${vuln.type}\n`;
        if (vuln.line) response += `   • Line: ${vuln.line}\n`;
        response += `   • ${vuln.description.substring(0, 150)}...\n\n`;
      });

      response += "Would you like me to explain how to fix any specific vulnerability?";
      return response;
    }

    // Critical vulnerabilities
    if (lowerMessage.includes('critical') || lowerMessage.includes('severe')) {
      const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
      if (criticalVulns.length === 0) {
        return "✅ No critical vulnerabilities found! Your contract doesn't have any immediate security threats that could lead to fund loss.";
      }

      let response = `⚠️ **${criticalVulns.length} CRITICAL vulnerability/vulnerabilities found:**\n\n`;
      criticalVulns.forEach((vuln, idx) => {
        response += `**${idx + 1}. ${vuln.title}**\n`;
        response += `   ${vuln.description}\n\n`;
        response += `   **Fix:** ${vuln.recommendation}\n\n`;
      });

      response += "🚨 **CRITICAL:** These vulnerabilities should be fixed BEFORE deploying to mainnet. They could lead to complete loss of funds.";
      return response;
    }

    // Reentrancy questions
    if (lowerMessage.includes('reentranc')) {
      const reentrancyVulns = vulnerabilities.filter(v => v.type === 'Reentrancy');
      if (reentrancyVulns.length === 0) {
        return "✅ Your contract doesn't have reentrancy vulnerabilities. Good job!\n\nReentrancy occurs when a function makes an external call before updating state, allowing attackers to recursively call the function and drain funds.";
      }

      return `⚠️ **Reentrancy vulnerability detected!**\n\n**What is Reentrancy**?\nReentrancy occurs when a function makes an external call (like sending ETH) BEFORE updating the contract's state. An attacker can exploit this by calling the function recursively before the state is updated.\n\n**Example Attack**:\n1. Attacker calls withdraw()\n2. Contract sends ETH to attacker\n3. Attacker's fallback calls withdraw() again\n4. Contract sends ETH again (state not updated yet)\n5. Repeat until all funds drained\n\n**How to Fix**:\n1. Use OpenZeppelin's ReentrancyGuard\n2. Follow Checks-Effects-Interactions pattern\n3. Update state BEFORE external calls\n\nWould you like me to show you the exact fix for your code?`;
    }

    // Access control questions
    if (lowerMessage.includes('access') || lowerMessage.includes('owner') || lowerMessage.includes('permission') || lowerMessage.includes('onlyowner')) {
      const accessVulns = vulnerabilities.filter(v => v.type === 'Access Control' || v.type === 'Unprotected Selfdestruct');
      if (accessVulns.length === 0) {
        return "✅ Your contract has proper access control! Critical functions are protected.";
      }

      return `⚠️ **Access Control Issues Found**\n\n**Problem**:\nSome critical functions in your contract can be called by anyone, not just the owner. This includes functions that could:\n• Destroy the contract (selfdestruct)\n• Transfer ownership\n• Withdraw funds\n• Change critical parameters\n\n**How to Fix**:\n1. Import OpenZeppelin's Ownable: \`import "@openzeppelin/contracts/access/Ownable.sol";\`\n2. Inherit Ownable: \`contract MyContract is Ownable\`\n3. Add onlyOwner modifier: \`function criticalFunc() public onlyOwner\`\n\nThis ensures only the contract owner can execute sensitive operations.`;
    }

    // Gas optimization
    if (lowerMessage.includes('gas') || lowerMessage.includes('optimiz') || lowerMessage.includes('expensive')) {
      return `⛽ **Gas Optimization Tips for Your Contract**:\n\n**General Tips**:\n1. Use \`uint256\` instead of smaller uints (saves gas on operations)\n2. Use \`calldata\` instead of \`memory\` for function parameters\n3. Batch operations when possible\n4. Use events instead of storage for historical data\n5. Avoid loops over dynamic arrays\n\n**Your Contract Specific**:\n• Functions: ${context.functions}\n• Lines: ${context.lines}\n• Estimated deployment cost: ${(context.lines * 200).toLocaleString()} gas\n\n**Quick Wins**:\n• Use \`unchecked\` for safe arithmetic (Solidity 0.8+)\n• Cache array lengths in loops\n• Use short-circuit evaluation in require statements\n\nWould you like specific optimization suggestions for your code?`;
    }

    // Fix recommendations
    if (lowerMessage.includes('fix') || lowerMessage.includes('repair') || lowerMessage.includes('solve') || lowerMessage.includes('solution')) {
      if (vulnerabilities.length === 0) {
        return "✅ No fixes needed! Your contract passed all security checks. Consider:\n\n1. Adding comprehensive tests\n2. Getting a professional audit\n3. Deploying to testnet first\n4. Setting up monitoring";
      }

      let response = `🔧 **Fix Recommendations**:\n\n`;
      
      vulnerabilities.slice(0, 3).forEach((vuln, idx) => {
        response += `**${idx + 1}. ${vuln.title}**\n`;
        response += `   ${vuln.recommendation}\n\n`;
      });

      if (vulnerabilities.length > 3) {
        response += `...and ${vulnerabilities.length - 3} more vulnerabilities.\n\n`;
      }

      response += "💡 **Pro Tip**: Use the 'Apply Auto-Fix' button on each vulnerability card to automatically fix common issues!";
      return response;
    }

    // Best practices
    if (lowerMessage.includes('best practice') || lowerMessage.includes('recommendation') || lowerMessage.includes('should i')) {
      return `📚 **Smart Contract Security Best Practices**:\n\n**Before Deployment**:\n1. ✅ Run comprehensive tests (aim for >90% coverage)\n2. ✅ Deploy to testnet first (Sepolia, Goerli)\n3. ✅ Get a professional security audit\n4. ✅ Set up bug bounty program\n5. ✅ Use established libraries (OpenZeppelin)\n\n**Code Quality**:\n1. ✅ Follow Checks-Effects-Interactions pattern\n2. ✅ Use explicit visibility modifiers\n3. ✅ Add comprehensive NatSpec documentation\n4. ✅ Use meaningful variable names\n5. ✅ Keep functions small and focused\n\n**Security**:\n1. ✅ Use ReentrancyGuard for state-changing functions\n2. ✅ Implement proper access control\n3. ✅ Validate all inputs\n4. ✅ Handle edge cases\n5. ✅ Use events for important state changes\n\n**Your Contract Status**: ${context.riskLevel === 'safe' || context.riskLevel === 'low' ? '✅ Good' : '⚠️ Needs Attention'}`;
    }

    // Contract overview
    if (lowerMessage.includes('overview') || lowerMessage.includes('summary') || lowerMessage.includes('about') || lowerMessage.includes('contract')) {
      return `📊 **Contract Analysis Summary**:\n\n**Contract Name**: ${context.name}\n**Functions**: ${context.functions}\n**Lines of Code**: ${context.lines}\n\n**Security Status**:\n• Risk Score: ${context.riskScore}/100\n• Risk Level: ${context.riskLevel.toUpperCase()}\n• Vulnerabilities: ${context.vulnerabilities}\n\n**Vulnerability Breakdown**:\n• Critical: ${vulnerabilities.filter(v => v.severity === 'critical').length}\n• High: ${vulnerabilities.filter(v => v.severity === 'high').length}\n• Medium: ${vulnerabilities.filter(v => v.severity === 'medium').length}\n• Low: ${vulnerabilities.filter(v => v.severity === 'low').length}\n\n**Recommendation**: ${context.riskScore < 40 ? '✅ Ready for testnet deployment' : context.riskScore < 70 ? '⚠️ Fix high severity issues before deployment' : '🚨 Critical issues - DO NOT deploy'}`;
    }

    // Deployment questions
    if (lowerMessage.includes('deploy') || lowerMessage.includes('mainnet') || lowerMessage.includes('production')) {
      if (context.riskScore >= 70) {
        return `🚨 **DO NOT DEPLOY TO MAINNET**!\n\nYour contract has a risk score of ${context.riskScore}/100 with critical vulnerabilities.\n\n**Before deploying**:\n1. Fix ALL critical vulnerabilities\n2. Fix ALL high severity vulnerabilities\n3. Test on testnet for at least 1 week\n4. Get a professional security audit\n5. Set up monitoring and emergency controls\n\n**Current Issues**:\n${vulnerabilities.filter(v => v.severity === 'critical').length} critical, ${vulnerabilities.filter(v => v.severity === 'high').length} high severity issues found.\n\nFix these first, then we can talk about deployment!`;
      }

      if (context.riskScore >= 40) {
        return `⚠️ **Not Ready for Mainnet Yet**\n\nYour contract has a risk score of ${context.riskScore}/100.\n\n**Recommended Steps**:\n1. Fix remaining vulnerabilities\n2. Deploy to Sepolia testnet\n3. Run extensive tests\n4. Get community feedback\n5. Consider professional audit\n\nThen you'll be ready for mainnet!`;
      }

      return `✅ **Ready for Testnet Deployment**!\n\nYour contract looks good with a risk score of ${context.riskScore}/100.\n\n**Deployment Checklist**:\n1. ✅ Security analysis passed\n2. ⏳ Deploy to Sepolia testnet\n3. ⏳ Test all functions thoroughly\n4. ⏳ Get community review\n5. ⏳ Professional audit (recommended)\n6. ⏳ Set up monitoring\n7. ⏳ Deploy to mainnet\n\nGood luck with your deployment!`;
    }

    // OpenZeppelin questions
    if (lowerMessage.includes('openzeppelin') || lowerMessage.includes('library') || lowerMessage.includes('import')) {
      return `📦 **OpenZeppelin Contracts**:\n\nOpenZeppelin is the industry standard for secure smart contract libraries.\n\n**Common Imports**:\n\`\`\`solidity\n// Security\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\n\n// Access Control\nimport "@openzeppelin/contracts/access/Ownable.sol";\nimport "@openzeppelin/contracts/access/AccessControl.sol";\n\n// Tokens\nimport "@openzeppelin/contracts/token/ERC20/ERC20.sol";\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\n\n// Utils\nimport "@openzeppelin/contracts/utils/math/SafeMath.sol";\n\`\`\`\n\n**Installation**:\n\`\`\`bash\nnpm install @openzeppelin/contracts\n\`\`\`\n\n**Your contract should use**:\n${vulnerabilities.some(v => v.type === 'Reentrancy') ? '• ReentrancyGuard ✅' : ''}\n${vulnerabilities.some(v => v.type.includes('Access')) ? '• Ownable ✅' : ''}\n${vulnerabilities.some(v => v.type === 'Integer Overflow') ? '• Built-in checks (Solidity 0.8+)' : ''}`;
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can') || lowerMessage.includes('how to use')) {
      return `🤖 **I can help you with**:\n\n**Security Analysis**:\n• Explain detected vulnerabilities\n• Show how attacks work\n• Provide fix recommendations\n• Review security patterns\n\n**Code Review**:\n• Best practices\n• Gas optimization\n• Code quality suggestions\n• Standard compliance\n\n**Deployment Guidance**:\n• Testnet deployment\n• Mainnet readiness\n• Audit preparation\n• Monitoring setup\n\n**Just ask me about**:\n• "What vulnerabilities were found?"\n• "How do I fix reentrancy?"\n• "Is my contract ready to deploy?"\n• "Show me gas optimization tips"\n• "Explain access control"\n\nWhat would you like to know?`;
    }

    // Default response
    return `I understand you're asking about: "${userMessage}"\n\nHere's what I can tell you about your contract:\n\n**Contract**: ${context.name}\n**Security Status**: ${context.riskLevel.toUpperCase()} (${context.riskScore}/100)\n**Vulnerabilities**: ${context.vulnerabilities} found\n\n**Try asking me about**:\n• "What vulnerabilities were found?"\n• "How do I fix critical issues?"\n• "Is my contract safe to deploy?"\n• "Show me best practices"\n• "Explain reentrancy attacks"\n• "Gas optimization tips"\n\nI'm here to help you write secure smart contracts! 🛡️`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Aegis AI Assistant</h3>
            <p className="text-purple-200 text-xs">Smart Contract Security Expert</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-800 text-gray-100 border border-purple-500/20'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t border-purple-500/20">
        <div className="flex flex-wrap gap-2">
          {['What vulnerabilities?', 'How to fix?', 'Is it safe?', 'Best practices'].map((question) => (
            <button
              key={question}
              onClick={() => setInputValue(question)}
              className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full transition-all border border-purple-500/30"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-500/20">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your contract..."
            className="flex-1 bg-slate-800 text-white border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 resize-none text-sm"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
