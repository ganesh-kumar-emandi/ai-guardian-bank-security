import { User, ActivityLog, Alert, Department, FraudCase } from '../src/types.js';

export const mockDepartments: Department[] = [
  { id: 'dept-1', name: 'Retail Banking' },
  { id: 'dept-2', name: 'Investment Banking' },
  { id: 'dept-3', name: 'Customer Service' },
  { id: 'dept-4', name: 'IT Security' },
];

export const mockUsers: User[] = [
  { id: 'u-1', email: 'admin@aiguardian.com', name: 'Alice Admin', role: 'Admin', status: 'Active', riskScore: 5 },
  { id: 'u-2', email: 'officer@aiguardian.com', name: 'Bob Security', role: 'Security Officer', status: 'Active', riskScore: 12 },
  { id: 'u-101', email: 'emp101@bank.com', name: 'John Doe', role: 'Bank Employee', departmentId: 'dept-1', status: 'Active', riskScore: 25 },
  { id: 'u-102', email: 'emp102@bank.com', name: 'Jane Smith', role: 'Bank Employee', departmentId: 'dept-2', status: 'Under Investigation', riskScore: 92 },
  { id: 'u-103', email: 'emp103@bank.com', name: 'Mike Johnson', role: 'Bank Employee', departmentId: 'dept-3', status: 'Blocked', riskScore: 98 },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1', userId: 'u-102', action: 'Mass Download', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    ipAddress: '192.168.1.55', location: 'Unknown (VPN)', device: 'Unknown Device', os: 'Windows', browser: 'Chrome',
    riskScoreDelta: 45, isAnomaly: true, details: 'Downloaded 850 customer records'
  },
  {
    id: 'log-2', userId: 'u-102', action: 'Late Night Login', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    ipAddress: '192.168.1.55', location: 'Unknown (VPN)', device: 'Unknown Device', os: 'Windows', browser: 'Chrome',
    riskScoreDelta: 30, isAnomaly: true, details: 'Logged in outside office hours (02:15 AM)'
  },
  {
    id: 'log-3', userId: 'u-101', action: 'Database Query', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    ipAddress: '10.0.0.12', location: 'New York Office', device: 'Work Laptop', os: 'macOS', browser: 'Safari',
    riskScoreDelta: 0, isAnomaly: false, details: 'Queried standard customer profile'
  },
  {
    id: 'log-4', userId: 'u-103', action: 'USB Connected', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    ipAddress: '10.0.0.44', location: 'New York Office', device: 'Work Desktop', os: 'Windows', browser: 'Edge',
    riskScoreDelta: 50, isAnomaly: true, details: 'Unauthorized USB mass storage connected'
  },
];

export const mockAlerts: Alert[] = [
  { id: 'alert-1', userId: 'u-102', type: 'Data Leakage', level: 'Red', description: 'Mass download of VIP records detected.', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), status: 'New' },
  { id: 'alert-2', userId: 'u-103', type: 'Insider Threat', level: 'Red', description: 'USB connected and clipboard copied.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'Investigating' },
  { id: 'alert-3', userId: 'u-102', type: 'Anomaly', level: 'Orange', description: 'Login from unknown device and location.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), status: 'New' },
];

export const mockFraudCases: FraudCase[] = [
  { id: 'fc-1', type: 'Rapid Fund Transfers', amount: 50000, userId: 'u-102', description: 'Multiple transfers just under reporting threshold.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'Open' },
  { id: 'fc-2', type: 'Money Laundering Pattern', amount: 250000, userId: 'u-103', description: 'Complex web of transactions matching known ML patterns.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'Under Review' },
];
