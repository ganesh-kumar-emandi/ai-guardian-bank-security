import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import { mockUsers, mockActivityLogs, mockAlerts, mockDepartments, mockFraudCases } from './server/db.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'super_secret_jwt_key_mock_only';

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (error) {
  console.warn('Could not initialize Gemini SDK. API key may be missing.');
}

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// API Routes
// ==========================================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock login: ignore password, just find user by email
  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user });
});

// Get Current User
app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = mockUsers.find((u) => u.id === req.user.id);
  res.json(user);
});

// Admin Dashboard Stats
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  const stats = {
    employeesOnline: 245,
    highRiskEmployees: mockUsers.filter(u => u.riskScore >= 71).length,
    blockedUsers: mockUsers.filter(u => u.status === 'Blocked').length,
    fraudAlertsToday: mockAlerts.filter(a => a.type === 'Fraud').length + mockFraudCases.length,
    suspiciousLogins: 12
  };
  res.json(stats);
});

// Admin: Get all employees
app.get('/api/admin/employees', authenticateToken, (req, res) => {
  const employees = mockUsers.filter(u => u.role === 'Bank Employee').map(u => {
    const dept = mockDepartments.find(d => d.id === u.departmentId);
    return { ...u, departmentName: dept?.name };
  });
  res.json(employees);
});

// Employee Dashboard
app.get('/api/employee/dashboard/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const user = mockUsers.find(u => u.id === userId);
  const dept = mockDepartments.find(d => d.id === user?.departmentId);
  const logs = mockActivityLogs.filter(log => log.userId === userId).slice(0, 10);
  res.json({ user, departmentName: dept?.name, recentLogs: logs });
});

// Admin: Alerts
app.get('/api/admin/alerts', authenticateToken, (req, res) => {
  const alerts = mockAlerts.map(a => {
    const user = mockUsers.find(u => u.id === a.userId);
    return { ...a, userName: user?.name, userEmail: user?.email };
  });
  res.json(alerts);
});

// AI Chatbot
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI service unavailable' });
  try {
    const { message } = req.body;
    
    // Provide system context containing our mock data state so Gemini can answer
    const context = `
      You are the GenAI Security Assistant for AI Guardian, a banking security platform.
      Current System State:
      - Employees: ${JSON.stringify(mockUsers)}
      - Recent Alerts: ${JSON.stringify(mockAlerts)}
      - Fraud Cases: ${JSON.stringify(mockFraudCases)}
      
      Respond professionally to the user's query based on the data above. Keep answers concise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: context,
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// AI Risk Explanation
app.post('/api/ai/explain-risk', authenticateToken, async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI service unavailable' });
  try {
    const { userId } = req.body;
    const user = mockUsers.find(u => u.id === userId);
    const logs = mockActivityLogs.filter(log => log.userId === userId);
    
    const context = `
      You are an AI Risk Engine. Analyze this user and their logs and explain why they have their current risk score (${user?.riskScore}/100).
      User: ${JSON.stringify(user)}
      Activity Logs: ${JSON.stringify(logs)}
      Provide a bulleted list of reasons for the score.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Explain the risk score for this employee.",
      config: { systemInstruction: context }
    });

    res.json({ explanation: response.text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ==========================================
// Vite Middleware & Static Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
