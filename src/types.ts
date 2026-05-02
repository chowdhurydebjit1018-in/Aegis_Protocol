export interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  line?: number;
  recommendation: string;
  codeSnippet?: string;
}

export interface AuditResult {
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: Vulnerability[];
  contractName?: string;
  timestamp: string;
  codeAnalysis: {
    linesOfCode: number;
    complexity: number;
    functions: number;
  };
  recommendations: string[];
  circuitBreakerStatus: 'active' | 'paused' | 'blocked';
}
