# TG365 - Professional Analysis Hub

A professional platform for problem analysis using management and quality tools like Fishbone, FMEA, DMAIC, and SWOT.

## Features

- **Fishbone Diagram**: Visualize cause-and-effect relationships.
- **FMEA (Failure Mode and Effects Analysis)**: Identify and prioritize potential failures.
- **DMAIC (Define, Measure, Analyze, Improve, Control)**: Structured problem-solving methodology.
- **SWOT Analysis**: Evaluate Strengths, Weaknesses, Opportunities, and Threats.
- **PDCA (Plan-Do-Check-Act)**: Continuous improvement cycle.
- **5 Whys**: Root cause analysis.
- **Document Analysis**: Analyze PDF, DOCX, and XLSX files using AI.

## Deployment on Vercel

1. Push this repository to GitHub.
2. Connect your GitHub repository to Vercel.
3. Add the following environment variable in Vercel:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Vercel will automatically detect the Vite configuration and deploy the app.

## Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your `GEMINI_API_KEY`.
4. Run the development server:
   ```bash
   npm run dev
   ```
