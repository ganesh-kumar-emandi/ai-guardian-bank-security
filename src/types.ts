export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Security Officer' | 'Bank Employee';
  name: string;
  departmentId?: string;
  status: 'Active' | 'Blocked' | 'Under Investigation';
  lastLogin?: string;
  riskScore: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  os: string;
  browser: string;
  riskScoreDelta: number;
  isAnomaly: boolean;
  details: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'Fraud' | 'Insider Threat' | 'Data Leakage' | 'Anomaly';
  level: 'Green' | 'Yellow' | 'Orange' | 'Red';
  description: string;
  timestamp: string;
  status: 'New' | 'Investigating' | 'Resolved';
}

export interface RiskScoreTrend {
  date: string;
  score: number;
}

export interface FraudCase {
  id: string;
  type: string;
  amount?: number;
  userId: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface DashboardStats {
  employeesOnline: number;
  highRiskEmployees: number;
  blockedUsers: number;
  fraudAlertsToday: number;
  suspiciousLogins: number;
}
