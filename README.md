# AI Guardian 🛡️
**Real-Time Insider Threat & Fraud Detection Platform for Banks**

## 📖 Overview
AI Guardian is a cutting-edge, AI-powered banking security platform designed to detect insider threats, suspicious employee activities, data leakage, and fraudulent behavior using machine learning and behavioral analytics.

## 🎯 Problem Statement
Banks and financial institutions face massive financial and reputational losses due to:
- **Insider Threats:** Malicious or negligent employees accessing or leaking sensitive customer data.
- **Fraudulent Transactions:** Rapid fund transfers, money laundering, and unauthorized access.
- **Delayed Detection:** Traditional security systems rely on static rules, missing complex behavioral anomalies until the damage is done.

## 💡 Our Solution
AI Guardian provides a proactive, real-time command center for security officers. It continuously monitors employee activity, calculates dynamic risk scores, and uses Generative AI to explain anomalies and recommend immediate actions.

## ✨ Key Features
- **Real-Time Risk Scoring:** Dynamic 0-100 risk scoring based on behavioral patterns (location, time, data volume).
- **GenAI Security Assistant:** Ask the AI in natural language about specific alerts, employee behaviors, or mitigation strategies.
- **Data Leak Prevention (DLP):** Monitors for mass downloads, USB connections, and unusual database queries.
- **Behavioral Analytics:** Detects anomalies like late-night logins, unknown device access, and irregular navigation patterns.
- **Role-Based Dashboards:** Distinct views for Administrators (Security Command Center) and Employees (Profile & Status).
- **Fraud Detection:** Flags patterns indicative of money laundering or rapid fund transfers.

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, React Router, Recharts, Lucide Icons, Vite
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Gemini 3.5 Flash (via `@google/genai` SDK)
* **Authentication:** JWT (JSON Web Tokens)
* **Styling Theme:** "Bento Grid" Institutional Security design

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-guardian
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Demo Credentials
- **Admin/Security Officer:** `admin@aiguardian.com` / `password123`
- **Employee (Safe):** `emp101@bank.com` / `password123`
- **Employee (High Risk):** `emp102@bank.com` / `password123`

## 🔮 Future Roadmap
- Integration with real SIEM (Security Information and Event Management) tools (e.g., Splunk).
- Implementation of a dedicated Python/FastAPI AI engine with Isolation Forests for unsupervised anomaly detection.
- Real-time WebSocket alerts for immediate incident response.
- Advanced endpoint monitoring agents.

---
*Built with ❤️ for the Hackathon*
