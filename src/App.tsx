/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Download, 
  Settings, 
  ChevronRight, 
  BrainCircuit, 
  Fish, 
  Table, 
  RefreshCw, 
  Target, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  PlayCircle,
  Zap,
  Minus,
  Loader2,
  Globe,
  FileSpreadsheet,
  Presentation,
  Sun,
  Moon,
  Search,
  Plus,
  Calendar,
  Clock,
  ListTodo,
  GanttChartSquare,
  MoreVertical,
  Trash2,
  Edit,
  ArrowRight,
  Link,
  X,
  Copy,
  User,
  Menu,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';
import * as d3 from 'd3';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { Toaster, toast } from 'sonner';
import { ToolType, performAnalysis, AnalysisResult, enhanceProblemStatement, generatePresentationContent } from './lib/gemini';
import { exportToExcel, exportToPPT } from './lib/export';
import { generatePresentation } from './lib/presentation';
import { extractTextFromFile } from './lib/fileParser';

// --- Sub-components ---

interface LandingPageProps {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ theme, language, onStart }) => {
  const isRTL = language === 'ar';

  const features = [
    {
      icon: Fish,
      title: language === 'en' ? 'Fishbone Analysis' : 'مخطط عظمة السمكة',
      desc: language === 'en' ? 'Identify root causes systematically across multiple categories.' : 'تحديد الأسباب الجذرية بشكل منهجي عبر فئات متعددة.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      icon: Table,
      title: language === 'en' ? 'FMEA Analysis' : 'تحليل FMEA',
      desc: language === 'en' ? 'Evaluate failure modes and their effects to prioritize risks.' : 'تقييم أوضاع الفشل وآثارها لتحديد أولويات المخاطر.',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    {
      icon: Target,
      title: language === 'en' ? 'SWOT Analysis' : 'تحليل SWOT',
      desc: language === 'en' ? 'Strategic planning tool for strengths, weaknesses, opportunities, and threats.' : 'أداة التخطيط الاستراتيجي لنقاط القوة والضعف والفرص والتهديدات.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: RefreshCw,
      title: language === 'en' ? 'DMAIC & PDCA' : 'DMAIC و PDCA',
      desc: language === 'en' ? 'Continuous improvement methodologies for process excellence.' : 'منهجيات التحسين المستمر للتميز في العمليات.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: HelpCircle,
      title: language === 'en' ? '5 Whys' : 'لماذا الـ 5',
      desc: language === 'en' ? 'Iterative interrogative technique used to explore cause-and-effect.' : 'تقنية استجواب تكرارية تستخدم لاستكشاف السبب والنتيجة.',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      icon: FileText,
      title: language === 'en' ? 'Document AI' : 'ذكاء المستندات',
      desc: language === 'en' ? 'Analyze PDFs, Word, and Excel files with advanced AI insights.' : 'تحليل ملفات PDF و Word و Excel مع رؤى متقدمة من الذكاء الاصطناعي.',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              "text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}
          >
            {language === 'en' ? (
              <>
                The Professional <span className="text-blue-600">Analysis Hub</span> <br />
                for Modern Management
              </>
            ) : (
              <>
                مركز <span className="text-blue-600">التحليل الاحترافي</span> <br />
                للإدارة الحديثة
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "text-lg md:text-xl max-w-3xl mx-auto leading-relaxed",
              theme === 'dark' ? "text-slate-400" : "text-slate-600"
            )}
          >
            {language === 'en' 
              ? 'TG365 empowers leaders and quality professionals with AI-driven tools to solve complex problems, analyze risks, and drive strategic growth.'
              : 'TG365 يمكن القادة ومحترفي الجودة بأدوات مدعومة بالذكاء الاصطناعي لحل المشكلات المعقدة، وتحليل المخاطر، وقيادة النمو الاستراتيجي.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {language === 'en' ? 'Start Analysis' : 'ابدأ التحليل'}
              <ArrowRight className={cn("w-5 h-5", isRTL ? "rotate-180" : "")} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={cn(
        "py-24 px-4 border-y",
        theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-8 rounded-3xl border transition-all hover:shadow-xl group",
                  theme === 'dark' ? "bg-slate-950 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-100 hover:border-blue-200"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                  <feature.icon className={cn("w-7 h-7", feature.color)} />
                </div>
                <h3 className={cn("text-xl font-bold mb-3", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface NavbarProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  activeTab: 'home' | 'input' | 'documents' | 'analysis';
  setActiveTab: (tab: 'home' | 'input' | 'documents' | 'analysis') => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  onOpenSettings
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = language === 'ar';

  const navLinks = [
    { id: 'home', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { id: 'input', label: language === 'en' ? 'Analysis' : 'التحليل' },
    { id: 'documents', label: language === 'en' ? 'Documents' : 'المستندات' },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300",
      theme === 'dark' ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 group-hover:rotate-6 transition-transform">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className={cn("text-xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-800")}>
              TG365
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === link.id
                      ? (theme === 'dark' ? "text-blue-400 bg-blue-400/10" : "text-blue-600 bg-blue-50")
                      : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900")
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-3">
              <button 
                onClick={onOpenSettings}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  theme === 'dark' ? "border-slate-800 hover:bg-slate-900 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                )}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  theme === 'dark' ? "border-slate-800 hover:bg-slate-900 text-yellow-400" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                )}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium",
                  theme === 'dark' ? "border-slate-800 hover:bg-slate-900 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                )}
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={onOpenSettings} className="p-2 text-slate-600 dark:text-slate-400"><Settings className="w-5 h-5" /></button>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 text-slate-600 dark:text-slate-400">{theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("md:hidden border-t overflow-hidden", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200")}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id as any); setIsMenuOpen(false); }}
                  className={cn("block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all", activeTab === link.id ? (theme === 'dark' ? "bg-blue-600/10 text-blue-400" : "bg-blue-50 text-blue-600") : (theme === 'dark' ? "text-slate-400 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-50"), isRTL ? "text-right" : "text-left")}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface GanttChartProps {
  tasks: any[];
  theme: 'light' | 'dark';
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, theme }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || tasks.length === 0) return;

    const margin = { top: 20, right: 100, bottom: 30, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = (tasks.length * 40) + margin.top + margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain([
        d3.min(tasks, d => new Date(d.start)) as Date,
        d3.max(tasks, d => new Date(d.end)) as Date
      ])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(tasks.map(d => d.name))
      .range([0, tasks.length * 40])
      .padding(0.2);

    // Dependency lines
    tasks.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          const depTask = tasks.find(t => t.id === depId);
          if (depTask) {
            const startX = x(new Date(depTask.end));
            const startY = (y(depTask.name) as number) + y.bandwidth() / 2;
            const endX = x(new Date(task.start));
            const endY = (y(task.name) as number) + y.bandwidth() / 2;

            svg.append("path")
              .attr("d", `M${startX},${startY} L${startX + 10},${startY} L${startX + 10},${endY} L${endX},${endY}`)
              .attr("fill", "none")
              .attr("stroke", theme === 'dark' ? "#475569" : "#cbd5e1")
              .attr("stroke-width", 1.5)
              .attr("marker-end", "url(#arrowhead)");
          }
        });
      }
    });

    // Arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", theme === 'dark' ? "#475569" : "#cbd5e1");

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${tasks.length * 40})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickSize(-tasks.length * 40)
        .tickFormat(() => "")
      )
      .style("stroke", theme === 'dark' ? "#1e293b" : "#f1f5f9")
      .style("stroke-opacity", 0.5);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${tasks.length * 40})`)
      .call(d3.axisBottom(x).ticks(5))
      .style("color", theme === 'dark' ? "#94a3b8" : "#64748b");

    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .style("color", theme === 'dark' ? "#94a3b8" : "#64748b");

    // Bars
    const bars = svg.selectAll(".bar")
      .data(tasks)
      .enter()
      .append("g")
      .attr("class", "bar");

    // Background bar
    bars.append("rect")
      .attr("x", d => x(new Date(d.start)))
      .attr("y", d => y(d.name) as number)
      .attr("width", d => Math.max(5, x(new Date(d.end)) - x(new Date(d.start))))
      .attr("height", y.bandwidth())
      .attr("rx", 6)
      .attr("fill", theme === 'dark' ? "#1e293b" : "#f1f5f9")
      .attr("stroke", theme === 'dark' ? "#334155" : "#e2e8f0")
      .attr("stroke-width", 1);

    // Progress bar
    bars.append("rect")
      .attr("x", d => x(new Date(d.start)))
      .attr("y", d => y(d.name) as number)
      .attr("width", d => Math.max(0, (x(new Date(d.end)) - x(new Date(d.start))) * (d.progress / 100)))
      .attr("height", y.bandwidth())
      .attr("rx", 6)
      .attr("fill", d => {
        if (d.progress === 100) return '#10b981';
        if (d.progress > 0) return '#3b82f6';
        return '#94a3b8';
      })
      .attr("opacity", 0.9);

    // Progress percentage text
    bars.append("text")
      .attr("x", d => x(new Date(d.start)) + (x(new Date(d.end)) - x(new Date(d.start))) / 2)
      .attr("y", d => (y(d.name) as number) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "middle")
      .text(d => `${d.progress}%`)
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .style("pointer-events", "none")
      .style("display", d => (x(new Date(d.end)) - x(new Date(d.start))) > 30 ? "block" : "none");

    // Owner Label
    bars.append("text")
      .attr("x", d => x(new Date(d.end)) + 10)
      .attr("y", d => (y(d.name) as number) + (y.bandwidth() / 2) + 4)
      .attr("fill", theme === 'dark' ? "#94a3b8" : "#64748b")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => d.owner ? `👤 ${d.owner}` : "");

  }, [tasks, theme]);

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
};

interface FooterProps {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ theme, language }) => {
  const year = new Date().getFullYear();
  return (
    <footer className={cn("border-t py-12 px-4", theme === 'dark' ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600")}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><BrainCircuit className="text-white w-5 h-5" /></div>
          <span className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>TG365</span>
        </div>
        <p className="text-sm">© {year} TG365 Analysis Hub. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
        <div className="flex items-center gap-4">
          <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          <Github className="w-5 h-5 cursor-pointer hover:text-blue-500" />
        </div>
      </div>
    </footer>
  );
};

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  summary: string;
  keyPoints: {
    point: string;
    aiOpinion: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  createdAt: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function App() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'input' | 'documents' | 'analysis'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [projectSettings, setProjectSettings] = useState({
    projectName: localStorage.getItem('PROJECT_NAME') || '',
    projectGoal: localStorage.getItem('PROJECT_GOAL') || '',
    constraints: localStorage.getItem('PROJECT_CONSTRAINTS') || '',
    methodology: localStorage.getItem('PROJECT_METHODOLOGY') || ''
  });
  const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [tempSettings, setTempSettings] = useState(projectSettings);

  const openSettings = () => {
    setTempApiKey(localStorage.getItem('GEMINI_API_KEY') || '');
    setTempSettings(projectSettings);
    setIsSettingsOpen(true);
  };

  const saveSettings = () => {
    localStorage.setItem('GEMINI_API_KEY', tempApiKey);
    localStorage.setItem('PROJECT_NAME', tempSettings.projectName);
    localStorage.setItem('PROJECT_GOAL', tempSettings.projectGoal);
    localStorage.setItem('PROJECT_CONSTRAINTS', tempSettings.constraints);
    localStorage.setItem('PROJECT_METHODOLOGY', tempSettings.methodology);
    
    setProjectSettings(tempSettings);
    setIsSettingsOpen(false);
    toast.success(language === 'en' ? 'Settings saved successfully' : 'تم حفظ الإعدادات بنجاح');
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [documentAnalyses, setDocumentAnalyses] = useState<DocumentAnalysis[]>([]);
  const [selectedDocAnalysis, setSelectedDocAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [selectedAnalysisDetail, setSelectedAnalysisDetail] = useState<any | null>(null);

  // Language detection
  React.useEffect(() => {
    const arabicRegex = /[\u0600-\u06FF]/;
    if (input && arabicRegex.test(input) && language !== 'ar') {
      setLanguage('ar');
    }
  }, [input, language]);

  const handleEnhanceProblem = async () => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(language === 'en' ? 'Please set your Gemini API Key in Settings first' : 'يرجى تعيين مفتاح Gemini API في الإعدادات أولاً');
      openSettings();
      return;
    }

    if (!input.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceProblemStatement(input, language);
      setInput(enhanced);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await extractTextFromFile(file);
      setInput(text);
      
      // Automatically trigger analysis for document analysis tool if in documents tab
      if (activeTab === 'documents') {
        handleAnalysis('document_analysis', file.name, text);
      }
    } catch (error) {
      console.error('File extraction failed:', error);
      alert(language === 'en' ? 'Failed to extract text from file.' : 'فشل استخراج النص من الملف.');
    } finally {
      setIsUploading(false);
    }
  }, [activeTab, language]);

  const onDropRejected = useCallback((fileRejections: any) => {
    const error = fileRejections[0]?.errors[0];
    if (error?.code === 'file-invalid-type') {
      alert(language === 'en' ? 'Unsupported file format. Please upload PDF, Word, Excel, or PowerPoint files.' : 'تنسيق الملف غير مدعوم. يرجى رفع ملفات PDF أو Word أو Excel أو PowerPoint.');
    } else {
      alert(language === 'en' ? 'Failed to upload file.' : 'فشل رفع الملف.');
    }
  }, [language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    onDropRejected,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
  });

  const handleAnalysis = async (tool: ToolType, fileName?: string, customInput?: string) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(language === 'en' ? 'Please set your Gemini API Key in Settings first' : 'يرجى تعيين مفتاح Gemini API في الإعدادات أولاً');
      openSettings();
      return;
    }

    const analysisInput = customInput || input;
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    
    if (tool === 'document_analysis') {
      setActiveTab('analysis');
    } else {
      setActiveTab('analysis');
    }

    try {
      const res = await performAnalysis(tool, analysisInput, language, projectSettings);
      setResult(res);
      
      if (tool === 'document_analysis' && res.documentAnalysis) {
        const newDocAnalysis: DocumentAnalysis = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: fileName || (language === 'en' ? 'Untitled Document' : 'مستند بدون عنوان'),
          fileType: fileName?.split('.').pop()?.toUpperCase() || 'TXT',
          summary: res.documentAnalysis.summary,
          keyPoints: res.documentAnalysis.keyPoints,
          createdAt: new Date().toISOString()
        };
        setDocumentAnalyses(prev => [newDocAnalysis, ...prev]);
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreatePresentation = async () => {
    if (!result) return;
    setIsGeneratingPresentation(true);
    const toastId = toast.loading(language === 'en' ? 'Generating presentation...' : 'جاري إنشاء العرض التقديمي...');
    try {
      await generatePresentation(result, language);
      toast.success(language === 'en' ? 'Presentation generated successfully!' : 'تم إنشاء العرض التقديمي بنجاح!', { id: toastId });
    } catch (error) {
      console.error('Presentation generation failed:', error);
      toast.error(language === 'en' ? 'Failed to generate presentation. Please try again.' : 'فشل إنشاء العرض التقديمي. يرجى المحاولة مرة أخرى.', { id: toastId });
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-blue-100 transition-colors duration-300 flex flex-col",
      theme === 'dark' ? "dark bg-slate-950 text-slate-50" : "bg-[#f8fafc] text-slate-900",
      isRTL ? "font-arabic" : ""
    )} dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position={isRTL ? 'top-left' : 'top-right'} richColors />
      
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        language={language} 
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={openSettings}
      />

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "w-full max-w-2xl p-6 rounded-2xl shadow-2xl border my-8",
                theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  {language === 'en' ? 'Settings' : 'الإعدادات'}
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                      {language === 'en' ? 'API Configuration' : 'إعدادات API'}
                    </h4>
                    <div>
                      <label className={cn("block text-xs font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                        {language === 'en' ? 'Gemini API Key' : 'مفتاح Gemini API'}
                      </label>
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder={language === 'en' ? 'Enter your API key' : 'أدخل مفتاح API الخاص بك'}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                          theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                      {language === 'en' ? 'Project Context' : 'سياق المشروع'}
                    </h4>
                    <div>
                      <label className={cn("block text-xs font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                        {language === 'en' ? 'Project Name' : 'اسم المشروع'}
                      </label>
                      <input
                        type="text"
                        value={tempSettings.projectName}
                        onChange={(e) => setTempSettings({...tempSettings, projectName: e.target.value})}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                          theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={cn("block text-xs font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                      {language === 'en' ? 'Project Goal' : 'هدف المشروع'}
                    </label>
                    <textarea
                      value={tempSettings.projectGoal}
                      onChange={(e) => setTempSettings({...tempSettings, projectGoal: e.target.value})}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-20 resize-none",
                        theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={cn("block text-xs font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                        {language === 'en' ? 'Constraints' : 'القيود'}
                      </label>
                      <input
                        type="text"
                        value={tempSettings.constraints}
                        onChange={(e) => setTempSettings({...tempSettings, constraints: e.target.value})}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                          theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn("block text-xs font-medium mb-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                        {language === 'en' ? 'Preferred Methodology' : 'المنهجية المفضلة'}
                      </label>
                      <input
                        type="text"
                        value={tempSettings.methodology}
                        onChange={(e) => setTempSettings({...tempSettings, methodology: e.target.value})}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm",
                          theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex gap-3">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold transition-all",
                      theme === 'dark' ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    onClick={saveSettings}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                  >
                    {language === 'en' ? 'Save Settings' : 'حفظ الإعدادات'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tool Navigation Tabs (Internal) */}
          <div className="flex items-center justify-center mb-12">
            <nav className={cn("flex items-center gap-1 p-1 rounded-2xl", theme === 'dark' ? "bg-slate-900 border border-slate-800" : "bg-slate-100 border border-slate-200")}>
              <button 
                onClick={() => setActiveTab('home')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'home' 
                    ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white shadow-md text-blue-600") 
                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                )}
              >
                {language === 'en' ? 'Home' : 'الرئيسية'}
              </button>
              <button 
                onClick={() => setActiveTab('input')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'input' 
                    ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white shadow-md text-blue-600") 
                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                )}
              >
                {language === 'en' ? 'Input' : 'المدخلات'}
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'analysis' 
                    ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white shadow-md text-blue-600") 
                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                )}
              >
                {language === 'en' ? 'Analysis' : 'التحليل'}
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'documents' 
                    ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white shadow-md text-blue-600") 
                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                )}
              >
                {language === 'en' ? 'Documents' : 'المستندات'}
              </button>
            </nav>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LandingPage 
                  theme={theme} 
                  language={language} 
                  onStart={() => setActiveTab('input')} 
                />
              </motion.div>
            )}
                {activeTab === 'input' && (
                  <motion.div 
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className={cn("text-4xl font-extrabold tracking-tight sm:text-5xl", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  {language === 'en' ? 'Professional Problem Analysis' : 'تحليل المشكلات باحترافية'}
                </h1>
                <p className={cn("text-lg", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                  {language === 'en' 
                    ? 'Upload your data or describe your problem to get deep insights using industry-standard quality tools.' 
                    : 'ارفع بياناتك أو صف مشكلتك للحصول على رؤى عميقة باستخدام أدوات الجودة العالمية.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className={cn(
                    "rounded-2xl shadow-sm border overflow-hidden transition-colors",
                    theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  )}>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className={cn("text-sm font-semibold flex items-center gap-2", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                          <FileText className="w-4 h-4 text-blue-500" />
                          {language === 'en' ? 'Problem Statement / Data' : 'وصف المشكلة / البيانات'}
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleEnhanceProblem}
                            disabled={isEnhancing || !input.trim()}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
                              theme === 'dark' 
                                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" 
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100",
                              (isEnhancing || !input.trim()) && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isEnhancing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <BrainCircuit className="w-3 h-3" />
                            )}
                            {language === 'en' ? 'Enhance Statement' : 'تحسين الوصف'}
                          </button>
                          <span className="text-xs text-slate-400">
                            {input.length} / 5000
                          </span>
                        </div>
                      </div>
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={language === 'en' ? "Describe the issue or paste data here..." : "صف المشكلة أو الصق البيانات هنا..."}
                        className={cn(
                          "w-full h-64 p-4 rounded-xl border outline-none transition-all resize-none",
                          theme === 'dark' 
                            ? "bg-slate-950 border-slate-800 text-slate-200 focus:ring-blue-500/50" 
                            : "bg-slate-50/50 border-slate-200 text-slate-900 focus:ring-blue-500"
                        )}
                      />
                    </div>
                    
                    <div {...getRootProps()} className={cn(
                      "p-8 border-t border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                      theme === 'dark' ? "border-slate-800" : "border-slate-200",
                      isDragActive 
                        ? (theme === 'dark' ? "bg-blue-900/20 border-blue-500" : "bg-blue-50 border-blue-300") 
                        : (theme === 'dark' ? "hover:bg-slate-800/50" : "hover:bg-slate-50")
                    )}>
                      <input {...getInputProps()} />
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", theme === 'dark' ? "bg-blue-900/30" : "bg-blue-100")}>
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className={cn("text-sm font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                          {language === 'en' ? 'Click or drag files to upload' : 'اضغط أو اسحب الملفات للرفع'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Excel, CSV, PDF, TXT (Max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={cn("rounded-2xl shadow-sm border p-6 transition-colors", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                    <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      {language === 'en' ? 'Select Analysis Tool' : 'اختر أداة التحليل'}
                    </h3>
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                      className="grid grid-cols-1 gap-3"
                    >
                      {[
                        { id: 'document_analysis', name: language === 'en' ? 'Document Analysis' : 'تحليل المستندات', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', darkBg: 'bg-blue-600/10' },
                        { id: 'fishbone', name: language === 'en' ? 'Fishbone' : 'مخطط إيشيكاوا (عظمة السمكة)', icon: Fish, color: 'text-orange-500', bg: 'bg-orange-50', darkBg: 'bg-orange-500/10' },
                        { id: 'fmea', name: language === 'en' ? 'FMEA Analysis' : 'تحليل FMEA', icon: Table, color: 'text-red-500', bg: 'bg-red-50', darkBg: 'bg-red-500/10' },
                        { id: 'dmaic', name: language === 'en' ? 'DMAIC Analysis' : 'تحليل DMAIC', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50', darkBg: 'bg-blue-500/10' },
                        { id: 'pdca', name: language === 'en' ? 'PDCA Cycle' : 'دورة PDCA', icon: RefreshCw, color: 'text-green-500', bg: 'bg-green-50', darkBg: 'bg-green-500/10' },
                        { id: 'swot', name: language === 'en' ? 'SWOT Analysis' : 'تحليل SWOT', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50', darkBg: 'bg-purple-500/10' },
                        { id: 'five_why', name: language === 'en' ? '5 WHY Analysis' : 'تحليل لماذا الـ 5', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50', darkBg: 'bg-amber-500/10' },
                      ].map((tool) => (
                        <motion.button
                          key={tool.id}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          whileHover={{ scale: 1.02, x: isRTL ? -4 : 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnalysis(tool.id as ToolType)}
                          disabled={!input.trim() || isAnalyzing}
                          className={cn(
                            "group flex items-center justify-between p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            theme === 'dark' 
                              ? "border-slate-800 hover:border-blue-500/50 hover:bg-slate-800" 
                              : "border-slate-100 hover:border-blue-200 hover:bg-blue-50/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", theme === 'dark' ? tool.darkBg : tool.bg)}>
                              <tool.icon className={cn("w-5 h-5", tool.color)} />
                            </div>
                            <span className={cn("text-sm font-semibold", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>{tool.name}</span>
                          </div>
                          <ChevronRight className={cn("w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors", isRTL ? "rotate-180" : "")} />
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white"
                  >
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5" />
                      {language === 'en' ? 'Smart Suggestion' : 'اقتراح ذكي'}
                    </h4>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      {language === 'en' 
                        ? 'Our AI suggests using Fishbone for root cause identification based on your description.' 
                        : 'يقترح نظامنا استخدام Fishbone لتحديد الأسباب الجذرية بناءً على وصفك.'}
                    </p>
                  </motion.div>
                </div>
              </div>

            </motion.div>
          )}


          {activeTab === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    {language === 'en' ? 'Analysis Result' : 'نتائج التحليل'}
                  </h2>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    {language === 'en' ? 'Detailed insights generated by AI based on your input.' : 'رؤى تفصيلية تم إنشاؤها بواسطة الذكاء الاصطناعي بناءً على مدخلاتك.'}
                  </p>
                </div>
                
                {result && (
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreatePresentation}
                      disabled={isGeneratingPresentation}
                      className={cn(
                        "relative group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold shadow-lg overflow-hidden",
                        theme === 'dark' 
                          ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-purple-900/20" 
                          : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-200"
                      )}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      {isGeneratingPresentation ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Presentation className="w-5 h-5 animate-bounce" />
                      )}
                      <span className="relative z-10">
                        {isGeneratingPresentation 
                          ? (language === 'en' ? 'Generating...' : 'جاري الإنشاء...') 
                          : (language === 'en' ? 'Create Presentation' : 'إنشاء عرض تقديمي')}
                      </span>
                      {!isGeneratingPresentation && (
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Zap className="w-4 h-4 text-yellow-300" />
                        </motion.div>
                      )}
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => exportToExcel(result)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors text-sm font-semibold",
                        theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      {language === 'en' ? 'Export Excel' : 'تصدير إكسيل'}
                    </motion.button>
                  </div>
                )}
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <BrainCircuit className="text-white w-14 h-14 relative z-10" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h3 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {language === 'en' ? 'Analyzing Problem...' : 'جاري تحليل المشكلة...'}
                    </h3>
                    <p className={cn("text-lg animate-pulse", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                      {language === 'en' ? 'Our AI is generating deep insights for you.' : 'يقوم الذكاء الاصطناعي بتوليد رؤى عميقة لك.'}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", theme === 'dark' ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700")}>
                        {result.tool}
                      </span>
                      <span className={cn("text-sm font-medium", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                        {result.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-sm text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {language === 'en' ? 'Clear Results' : 'مسح النتائج'}
                    </button>
                  </div>
                  {renderAnalysisData(result, theme, language, searchTerm, setSelectedAnalysisDetail)}

                  {/* Analysis Summary & Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className={cn(
                      "lg:col-span-2 p-6 rounded-3xl border",
                      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                    )}>
                      <h4 className={cn("text-lg font-bold mb-4 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                        <FileText className="w-5 h-5 text-blue-500" />
                        {language === 'en' ? 'Analysis Summary' : 'ملخص التحليل'}
                      </h4>
                      <div className={cn("prose prose-sm max-w-none leading-relaxed", theme === 'dark' ? "prose-invert text-slate-300" : "text-slate-600")}>
                        <ReactMarkdown>{result.summary}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className={cn(
                        "p-6 rounded-3xl border",
                        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                      )}>
                        <h4 className={cn("text-lg font-bold mb-4 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                          <Zap className="w-5 h-5 text-amber-500" />
                          {language === 'en' ? 'Key Insights' : 'رؤى رئيسية'}
                        </h4>
                        <div className="space-y-4">
                          {result.insights.map((insight, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{insight.kpi}</p>
                                <p className={cn("text-sm font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{insight.value}</p>
                              </div>
                              {insight.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : insight.trend === 'down' ? (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              ) : (
                                <Minus className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={cn(
                        "p-6 rounded-3xl border",
                        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                      )}>
                        <h4 className={cn("text-lg font-bold mb-4 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                          <Lightbulb className="w-5 h-5 text-blue-500" />
                          {language === 'en' ? 'Recommendations' : 'التوصيات'}
                        </h4>
                        <ul className="space-y-3">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm font-medium flex items-start gap-2 text-slate-500">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn("p-12 rounded-3xl border border-dashed text-center space-y-4", theme === 'dark' ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white")}>
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {language === 'en' ? 'No Analysis Yet' : 'لا يوجد تحليل بعد'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {language === 'en' ? 'Go to the Input tab and select a tool to start your analysis.' : 'انتقل إلى تبويب المدخلات واختر أداة لبدء تحليلك.'}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('input')}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      {language === 'en' ? 'Go to Input' : 'الذهاب للمدخلات'}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div 
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    {language === 'en' ? 'Document Analysis' : 'تحليل المستندات'}
                  </h2>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                    {language === 'en' ? 'Upload and analyze your documents (PDF, Word, Excel, PPT).' : 'ارفع وحلل مستنداتك (PDF, Word, Excel, PPT).'}
                  </p>
                </div>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {language === 'en' ? 'Analyze New Document' : 'تحليل مستند جديد'}
                  </motion.button>
                </div>
              </div>

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40"
                  >
                    <FileText className="text-white w-14 h-14" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h3 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {language === 'en' ? 'Analyzing Document...' : 'جاري تحليل المستند...'}
                    </h3>
                    <p className={cn("text-lg animate-pulse", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                      {language === 'en' ? 'Extracting key points and generating AI insights.' : 'استخراج النقاط الرئيسية وتوليد رؤى الذكاء الاصطناعي.'}
                    </p>
                  </div>
                </div>
              )}

              {!isAnalyzing && documentAnalyses.length === 0 ? (
                <div className={cn("p-12 rounded-3xl border border-dashed text-center space-y-6", theme === 'dark' ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white")}>
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {language === 'en' ? 'No Documents Analyzed' : 'لا توجد مستندات محللة'}
                    </h3>
                    <p className="text-slate-500">
                      {language === 'en' 
                        ? 'Upload a PDF, Word, Excel, or PowerPoint file to get a comprehensive summary and AI-powered insights for each key point.' 
                        : 'ارفع ملف PDF أو Word أو Excel أو PowerPoint للحصول على ملخص شامل ورؤى مدعومة بالذكاء الاصطناعي لكل نقطة رئيسية.'}
                    </p>
                  </div>
                  <div {...getRootProps()} className="inline-block">
                    <input {...getInputProps()} />
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      {language === 'en' ? 'Upload Document' : 'رفع مستند'}
                    </button>
                  </div>
                </div>
              ) : !isAnalyzing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentAnalyses.map((doc, idx) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                      onClick={() => {
                        setResult({
                          tool: 'document_analysis',
                          title: doc.fileName,
                          summary: doc.summary,
                          insights: [],
                          recommendations: [],
                          data: { summary: doc.summary, keyPoints: doc.keyPoints },
                          documentAnalysis: { summary: doc.summary, keyPoints: doc.keyPoints }
                        });
                        setActiveTab('analysis');
                      }}
                      className={cn(
                        "group p-6 rounded-2xl border shadow-sm cursor-pointer transition-all hover:border-blue-500/50",
                        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", 
                          doc.fileType === 'PDF' ? "bg-red-100 text-red-600" : 
                          doc.fileType === 'DOCX' ? "bg-blue-100 text-blue-600" :
                          doc.fileType === 'XLSX' ? "bg-green-100 text-green-600" :
                          "bg-orange-100 text-orange-600"
                        )}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase", theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
                          {doc.fileType}
                        </div>
                      </div>
                      <h4 className={cn("font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-1", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        {doc.fileName}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-3 mb-6">
                        {doc.summary}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                          {language === 'en' ? 'View Analysis' : 'عرض التحليل'}
                          <ChevronRight className={cn("w-3.5 h-3.5", isRTL ? "rotate-180" : "")} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>

      {/* Deep Analysis Detail Modal */}
      <AnimatePresence>
        {selectedAnalysisDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedAnalysisDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col",
                theme === 'dark' ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"
              )}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    {selectedAnalysisDetail.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{selectedAnalysisDetail.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const content = `
${selectedAnalysisDetail.title}
${selectedAnalysisDetail.subtitle}

Detailed Analysis:
${selectedAnalysisDetail.deepAnalysis?.content || ''}

Expert Opinion:
${selectedAnalysisDetail.deepAnalysis?.expertOpinion || ''}

Proposed Solution:
${selectedAnalysisDetail.deepAnalysis?.proposedSolution || ''}

Summary:
${selectedAnalysisDetail.deepAnalysis?.summary || ''}
                      `.trim();
                      navigator.clipboard.writeText(content);
                      toast.success(language === 'en' ? 'Copied to clipboard' : 'تم النسخ إلى الحافظة');
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center shadow-lg"
                    title={language === 'en' ? 'Copy to clipboard' : 'نسخ إلى الحافظة'}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedAnalysisDetail(null)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Deep Analysis Content */}
                {selectedAnalysisDetail.deepAnalysis?.content && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        {language === 'en' ? 'Detailed Analysis' : 'تحليل تفصيلي'}
                      </h4>
                      <div className={cn(
                        "prose prose-sm max-w-none leading-relaxed p-8 rounded-3xl border shadow-inner",
                        theme === 'dark' ? "prose-invert text-slate-300 bg-slate-950/50 border-slate-800" : "text-slate-600 bg-slate-50 border-slate-100"
                      )}>
                        <ReactMarkdown>{selectedAnalysisDetail.deepAnalysis.content}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedAnalysisDetail.deepAnalysis.expertOpinion && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {language === 'en' ? 'Expert Opinion' : 'رأي الخبير'}
                          </h4>
                          <div className={cn(
                            "p-6 rounded-3xl border-l-8 shadow-sm relative overflow-hidden group",
                            theme === 'dark' ? "bg-amber-500/5 border-amber-500/50 text-slate-300" : "bg-amber-50 border-amber-500 text-slate-700"
                          )}>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                              <BrainCircuit className="w-24 h-24" />
                            </div>
                            <p className="text-sm leading-relaxed italic relative z-10">"{selectedAnalysisDetail.deepAnalysis.expertOpinion}"</p>
                          </div>
                        </div>
                      )}

                      {selectedAnalysisDetail.deepAnalysis.proposedSolution && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {language === 'en' ? 'Proposed Solution' : 'الحل المقترح'}
                          </h4>
                          <div className={cn(
                            "p-6 rounded-3xl border-l-8 shadow-sm relative overflow-hidden group",
                            theme === 'dark' ? "bg-green-500/5 border-green-500/50 text-slate-300" : "bg-green-50 border-green-500 text-slate-700"
                          )}>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Zap className="w-24 h-24" />
                            </div>
                            <p className="text-sm leading-relaxed font-medium relative z-10">{selectedAnalysisDetail.deepAnalysis.proposedSolution}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Summary Section */}
                {selectedAnalysisDetail.deepAnalysis?.summary && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-purple-500 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {language === 'en' ? 'Analysis Summary' : 'ملخص التحليل'}
                    </h4>
                    <div className={cn(
                      "p-8 rounded-3xl border leading-relaxed shadow-sm",
                      theme === 'dark' ? "bg-purple-500/5 border-purple-500/20 text-slate-300" : "bg-purple-50 border-purple-100 text-slate-700"
                    )}>
                      <p className="text-sm font-bold leading-relaxed">{selectedAnalysisDetail.deepAnalysis.summary}</p>
                    </div>
                  </div>
                )}

                {/* Fallback if no deep analysis */}
                {!selectedAnalysisDetail.deepAnalysis && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-300">No Deep Analysis Available</p>
                      <p className="text-sm text-slate-500">This item doesn't have additional detailed data.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 flex justify-end bg-slate-900/30">
                <button
                  onClick={() => setSelectedAnalysisDetail(null)}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer theme={theme} language={language} />
    </div>
  );
}

function renderAnalysisData(result: AnalysisResult, theme: 'light' | 'dark', language: 'ar' | 'en', searchTerm: string = '', onCardClick?: (detail: any) => void) {
  const { tool, data } = result;
  const s = searchTerm.toLowerCase();
  const isRTL = language === 'ar';

  switch (tool) {
    case 'document_analysis':
      const filteredKeyPoints = data.keyPoints.filter((kp: any) => 
        kp.point.toLowerCase().includes(s) || 
        kp.aiOpinion.toLowerCase().includes(s)
      );
      return (
        <div className="space-y-8">
          <div className={cn("p-6 rounded-2xl border", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
            <h4 className={cn("text-lg font-bold mb-4 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
              <FileText className="w-5 h-5 text-blue-500" />
              {language === 'en' ? 'Document Summary' : 'ملخص المستند'}
            </h4>
            <div className={cn("prose prose-sm max-w-none leading-relaxed", theme === 'dark' ? "prose-invert text-slate-300" : "text-slate-600")}>
              <ReactMarkdown>{data.summary}</ReactMarkdown>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={cn("text-lg font-bold flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
              <BrainCircuit className="w-5 h-5 text-blue-500" />
              {language === 'en' ? 'Key Points & AI Insights' : 'النقاط الرئيسية ورؤى الذكاء الاصطناعي'}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {filteredKeyPoints.map((kp: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onCardClick?.({ 
                    ...kp, 
                    title: kp.point, 
                    subtitle: language === 'en' ? 'Document Key Point Analysis' : 'تحليل النقطة الرئيسية للمستند',
                    deepAnalysis: { 
                      content: kp.point, 
                      expertOpinion: kp.aiOpinion, 
                      proposedSolution: kp.proposedSolution,
                      summary: kp.summary || ''
                    } 
                  })}
                  className={cn(
                    "p-6 rounded-2xl border flex flex-col md:flex-row gap-6 transition-all cursor-pointer hover:shadow-xl group",
                    theme === 'dark' ? "bg-slate-900 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-200 shadow-sm hover:border-blue-500/50"
                  )}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className={cn("font-bold text-lg group-hover:text-blue-500 transition-colors", theme === 'dark' ? "text-white" : "text-slate-900")}>{kp.point}</h5>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                        kp.importance === 'high' ? "bg-red-500/10 text-red-500" :
                        kp.importance === 'medium' ? "bg-orange-500/10 text-orange-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {kp.importance}
                      </span>
                    </div>
                    <div className={cn("text-sm leading-relaxed p-4 rounded-xl", theme === 'dark' ? "bg-slate-800/50 text-slate-300" : "bg-slate-50 text-slate-600")}>
                      <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                        <BrainCircuit className="w-3 h-3" />
                        {language === 'en' ? 'AI Opinion' : 'رأي الذكاء الاصطناعي'}
                      </div>
                      <ReactMarkdown>{kp.aiOpinion}</ReactMarkdown>
                    </div>
                    {kp.proposedSolution && (
                      <div className={cn("text-sm leading-relaxed p-4 rounded-xl border-l-4 border-green-500", theme === 'dark' ? "bg-green-500/5 text-slate-300" : "bg-green-50 text-slate-600")}>
                        <div className="flex items-center gap-2 mb-2 text-green-500 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'en' ? 'Proposed Solution' : 'الحل المقترح'}
                        </div>
                        <ReactMarkdown>{kp.proposedSolution}</ReactMarkdown>
                      </div>
                    )}
                    <div className="flex items-center justify-end text-[10px] font-bold text-blue-500 uppercase tracking-widest gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'en' ? 'View Deep Analysis' : 'عرض التحليل العميق'}
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'fishbone':
      const filteredCategories = data.categories.map((cat: any) => ({
        ...cat,
        causes: cat.causes.filter((cause: string) => cause.toLowerCase().includes(s))
      })).filter((cat: any) => cat.name.toLowerCase().includes(s) || cat.causes.length > 0);

      return (
        <div className="relative p-8 overflow-x-auto min-w-[800px]">
          {/* Main Spine */}
          <div className={cn("absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full", theme === 'dark' ? "bg-slate-700" : "bg-slate-300")} />
          
          {/* Head */}
          <div className={cn("absolute top-1/2 -translate-y-1/2 w-48 p-4 rounded-xl border-2 text-center z-10 shadow-lg", isRTL ? "left-0" : "right-0", theme === 'dark' ? "bg-blue-600 border-blue-500 text-white" : "bg-blue-600 border-blue-500 text-white")}>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{language === 'en' ? 'Problem' : 'المشكلة'}</h4>
            <p className="text-xs font-medium line-clamp-2">{data.rootCause}</p>
          </div>

          <div className="grid grid-cols-3 gap-y-24 gap-x-12 relative">
            {/* Top Categories */}
            {filteredCategories.slice(0, 3).map((cat: any, i: number) => (
              <div key={i} className="relative flex flex-col items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onCardClick?.({ 
                    ...cat, 
                    title: cat.name, 
                    subtitle: language === 'en' ? 'Fishbone Category Analysis' : 'تحليل فئة مخطط عظمة السمكة',
                    deepAnalysis: cat.deepAnalysis
                  })}
                  className={cn("w-full p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-xl z-10", theme === 'dark' ? "bg-slate-800 border-slate-700 hover:border-blue-500" : "bg-white border-slate-200 hover:border-blue-500")}
                >
                  <h4 className="font-bold text-blue-500 mb-3 text-sm uppercase tracking-wider text-center">{cat.name}</h4>
                  <ul className="space-y-2">
                    {cat.causes.map((cause: string, j: number) => (
                      <li key={j} className={cn("text-xs flex items-start gap-2", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                {/* Diagonal Bone */}
                <div className={cn("absolute bottom-0 left-1/2 w-0.5 h-12 -translate-x-1/2 translate-y-full origin-top", isRTL ? "-rotate-[30deg]" : "rotate-[30deg]", theme === 'dark' ? "bg-slate-700" : "bg-slate-300")} />
              </div>
            ))}

            {/* Bottom Categories */}
            {filteredCategories.slice(3, 6).map((cat: any, i: number) => (
              <div key={i} className="relative flex flex-col items-center mt-12">
                {/* Diagonal Bone */}
                <div className={cn("absolute top-0 left-1/2 w-0.5 h-12 -translate-x-1/2 -translate-y-full origin-bottom", isRTL ? "-rotate-[30deg]" : "rotate-[30deg]", theme === 'dark' ? "bg-slate-700" : "bg-slate-300")} />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onCardClick?.({ 
                    ...cat, 
                    title: cat.name, 
                    subtitle: language === 'en' ? 'Fishbone Category Analysis' : 'تحليل فئة مخطط عظمة السمكة',
                    deepAnalysis: cat.deepAnalysis
                  })}
                  className={cn("w-full p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-xl z-10", theme === 'dark' ? "bg-slate-800 border-slate-700 hover:border-blue-500" : "bg-white border-slate-200 hover:border-blue-500")}
                >
                  <h4 className="font-bold text-blue-500 mb-3 text-sm uppercase tracking-wider text-center">{cat.name}</h4>
                  <ul className="space-y-2">
                    {cat.causes.map((cause: string, j: number) => (
                      <li key={j} className={cn("text-xs flex items-start gap-2", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'fmea':
      const filteredFmea = data.filter((row: any) => 
        row.failureMode.toLowerCase().includes(s) || 
        row.cause.toLowerCase().includes(s) || 
        row.effect.toLowerCase().includes(s)
      );
      
      const chartData = filteredFmea.map((row: any) => ({
        name: row.failureMode.length > 20 ? row.failureMode.substring(0, 20) + '...' : row.failureMode,
        rpn: row.rpn
      })).sort((a: any, b: any) => b.rpn - a.rpn);

      return (
        <div className="space-y-8">
          <div className={cn("p-6 rounded-2xl border", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
            <h4 className={cn("text-lg font-bold mb-6 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
              <BarChart3 className="w-5 h-5 text-blue-500" />
              {language === 'en' ? 'RPN Risk Distribution' : 'توزيع مخاطر RPN'}
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="rpn" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.rpn > 100 ? '#ef4444' : entry.rpn > 50 ? '#f59e0b' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cn("overflow-hidden rounded-xl border transition-colors shadow-sm", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className={cn("border-b transition-colors", theme === 'dark' ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-200")}>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{language === 'en' ? 'Failure Mode' : 'وضع الفشل'}</th>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider border-x", theme === 'dark' ? "text-slate-400 border-slate-800 bg-slate-800/30" : "text-slate-500 border-slate-200 bg-slate-200/30")}>{language === 'en' ? 'Cause & Effect' : 'السبب والأثر'}</th>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider text-center", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{language === 'en' ? 'S' : 'الشدة'}</th>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider text-center", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{language === 'en' ? 'O' : 'التكرار'}</th>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider text-center", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{language === 'en' ? 'D' : 'الاكتشاف'}</th>
                <th className={cn("py-4 px-6 text-xs font-bold uppercase tracking-wider text-right", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{language === 'en' ? 'RPN' : 'RPN'}</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y transition-colors", theme === 'dark' ? "divide-slate-800" : "divide-slate-100")}>
              {filteredFmea.map((row: any, i: number) => {
                const rpnColor = row.rpn > 100 
                  ? 'text-red-600 bg-red-500/10 ring-1 ring-red-500/20' 
                  : row.rpn >= 50 
                    ? 'text-orange-600 bg-orange-500/10 ring-1 ring-orange-500/20' 
                    : 'text-yellow-600 bg-yellow-500/10 ring-1 ring-yellow-500/20';
                return (
                  <tr 
                    key={i} 
                    onClick={() => onCardClick?.({ 
                      ...row, 
                      title: row.failureMode, 
                      subtitle: language === 'en' ? 'FMEA Detailed Analysis' : 'تحليل FMEA التفصيلي',
                      deepAnalysis: row.deepAnalysis
                    })}
                    className={cn("group transition-all cursor-pointer", theme === 'dark' ? "hover:bg-slate-800 even:bg-slate-900/50" : "hover:bg-slate-100 even:bg-slate-50/30")}
                  >
                    <td className="py-5 px-6 align-top">
                      <div className={cn("text-sm font-bold", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>{row.failureMode}</div>
                    </td>
                    <td className={cn("py-5 px-6 align-top border-x", theme === 'dark' ? "border-slate-800 bg-slate-800/10" : "border-slate-100 bg-slate-50/30")}>
                      <div className="space-y-1">
                        <div className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-600")}><span className="font-semibold text-slate-400 text-[10px] uppercase mr-1">{language === 'en' ? 'Cause:' : 'السبب:'}</span> {row.cause}</div>
                        <div className={cn("text-sm italic", theme === 'dark' ? "text-slate-500" : "text-slate-500")}><span className="font-semibold text-slate-400 text-[10px] uppercase mr-1">{language === 'en' ? 'Effect:' : 'الأثر:'}</span> {row.effect}</div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center align-top">
                      <span className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold", theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600")}>{row.severity}</span>
                    </td>
                    <td className="py-5 px-6 text-center align-top">
                      <span className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold", theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600")}>{row.occurrence}</span>
                    </td>
                    <td className="py-5 px-6 text-center align-top">
                      <span className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold", theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600")}>{row.detection}</span>
                    </td>
                    <td className="py-5 px-6 text-right align-top">
                      <div className={cn("inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-black shadow-sm", rpnColor)}>
                        {row.rpn}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );

    case 'swot':
      const swotSections = [
        { key: 'strengths', label: language === 'en' ? 'Strengths' : 'نقاط القوة', data: data.strengths, color: theme === 'dark' ? 'bg-green-900/20 text-green-400 border-green-900/30 hover:border-green-500/50' : 'bg-green-50 text-green-700 border-green-100 hover:border-green-200', icon: TrendingUp, chartColor: '#22c55e' },
        { key: 'weaknesses', label: language === 'en' ? 'Weaknesses' : 'نقاط الضعف', data: data.weaknesses, color: theme === 'dark' ? 'bg-red-900/20 text-red-400 border-red-900/30 hover:border-red-500/50' : 'bg-red-50 text-red-700 border-red-100 hover:border-red-200', icon: TrendingDown, chartColor: '#ef4444' },
        { key: 'opportunities', label: language === 'en' ? 'Opportunities' : 'الفرص', data: data.opportunities, color: theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border-blue-900/30 hover:border-blue-500/50' : 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-200', icon: Lightbulb, chartColor: '#3b82f6' },
        { key: 'threats', label: language === 'en' ? 'Threats' : 'التهديدات', data: data.threats, color: theme === 'dark' ? 'bg-orange-900/20 text-orange-400 border-orange-900/30 hover:border-orange-500/50' : 'bg-orange-50 text-orange-700 border-orange-100 hover:border-orange-200', icon: AlertTriangle, chartColor: '#f59e0b' },
      ];

      const swotChartData = swotSections.map(s => ({
        name: s.label,
        value: s.data.items.length,
        color: s.chartColor
      }));

      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cn("p-6 rounded-2xl border", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
              <h4 className={cn("text-lg font-bold mb-6 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                <BarChart3 className="w-5 h-5 text-blue-500" />
                {language === 'en' ? 'SWOT Distribution' : 'توزيع SWOT'}
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={swotChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {swotChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                        borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                        color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {swotChartData.map((item, i) => (
                <div key={i} className={cn("p-4 rounded-2xl border flex flex-col items-center justify-center text-center", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
                  <span className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.value}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-3xl overflow-hidden shadow-xl">
          {swotSections.map((section, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02, zIndex: 10 }}
              onClick={() => onCardClick?.({ 
                ...section.data, 
                title: section.label, 
                subtitle: language === 'en' ? 'SWOT Analysis Detail' : 'تفاصيل تحليل SWOT',
                deepAnalysis: section.data.deepAnalysis
              })}
              className={cn(
                "p-8 border transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden group",
                section.color,
                i === 0 ? "border-t-0 border-l-0" : 
                i === 1 ? "border-t-0 border-r-0" :
                i === 2 ? "border-b-0 border-l-0" :
                "border-b-0 border-r-0"
              )}
            >
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <section.icon className="w-48 h-48" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", theme === 'dark' ? "bg-slate-900/50" : "bg-white/80")}>
                  <section.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tighter">{section.label}</h4>
              </div>
              <ul className="space-y-3 relative z-10">
                {section.data.items.filter((item: string) => item.toLowerCase().includes(s)).map((item: string, j: number) => (
                  <li key={j} className="text-sm font-medium flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    );

    case 'five_why':
      const filteredFiveWhy = data.filter((why: any) => 
        why.question.toLowerCase().includes(s) || 
        why.answer.toLowerCase().includes(s)
      );
      return (
        <div className={cn("space-y-6 relative before:absolute before:inset-inline-start-4 before:top-4 before:bottom-4 before:w-0.5", theme === 'dark' ? "before:bg-slate-800" : "before:bg-slate-100")}>
          {filteredFiveWhy.map((why: any, i: number) => (
            <div key={i} className="relative ps-10">
              <div className={cn("absolute inset-inline-start-0 top-0 w-8 h-8 border-2 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors", theme === 'dark' ? "bg-slate-950 border-blue-500 text-blue-400" : "bg-white border-blue-500 text-blue-600")}>
                {why.level}
              </div>
              <motion.div 
                whileHover={{ x: 5 }}
                onClick={() => onCardClick?.({ 
                  ...why, 
                  title: `Level ${why.level}: ${why.question}`, 
                  subtitle: language === 'en' ? 'Root Cause Analysis Detail' : 'تفاصيل تحليل السبب الجذري',
                  deepAnalysis: why.deepAnalysis
                })}
                className={cn("p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-blue-500/50", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}
              >
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{why.question}</h4>
                <p className={cn("text-sm font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>{why.answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      );

    case 'dmaic':
      const dmaicEntries = Object.entries(data).filter(([key, value]) => 
        key.toLowerCase().includes(s) || (value as any).summary.toLowerCase().includes(s)
      );
      const dmaicConfig: Record<string, { styles: string, icon: any, color: string }> = {
        define: { 
          styles: theme === 'dark' ? 'border-blue-900/30 bg-blue-900/20 text-blue-400 hover:border-blue-500/50' : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300',
          icon: Target,
          color: 'text-blue-500'
        },
        measure: { 
          styles: theme === 'dark' ? 'border-green-900/30 bg-green-900/20 text-green-400 hover:border-green-500/50' : 'border-green-200 bg-green-50 text-green-700 hover:border-green-300',
          icon: BarChart3,
          color: 'text-green-500'
        },
        analyze: { 
          styles: theme === 'dark' ? 'border-amber-900/30 bg-amber-900/20 text-amber-400 hover:border-amber-500/50' : 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300',
          icon: BrainCircuit,
          color: 'text-amber-500'
        },
        improve: { 
          styles: theme === 'dark' ? 'border-purple-900/30 bg-purple-900/20 text-purple-400 hover:border-purple-500/50' : 'border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-300',
          icon: TrendingUp,
          color: 'text-purple-500'
        },
        control: { 
          styles: theme === 'dark' ? 'border-rose-900/30 bg-rose-900/20 text-rose-400 hover:border-rose-500/50' : 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300',
          icon: CheckCircle2,
          color: 'text-rose-500'
        }
      };
      const dmaicPhaseNames: Record<string, string> = {
        define: language === 'en' ? 'Define' : 'التعريف',
        measure: language === 'en' ? 'Measure' : 'القياس',
        analyze: language === 'en' ? 'Analyze' : 'التحليل',
        improve: language === 'en' ? 'Improve' : 'التحسين',
        control: language === 'en' ? 'Control' : 'التحكم'
      };

      return (
        <div className="space-y-8">
          {data.ganttTasks && data.ganttTasks.length > 0 && (
            <div className={cn("p-6 rounded-2xl border", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
              <h4 className={cn("text-lg font-bold mb-6 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                <Calendar className="w-5 h-5 text-blue-500" />
                {language === 'en' ? 'Project Timeline (Gantt)' : 'الجدول الزمني للمشروع (جانت)'}
              </h4>
              <div className="overflow-x-auto">
                <GanttChart tasks={data.ganttTasks} theme={theme} />
              </div>
            </div>
          )}
          <div className="space-y-4 relative">
            {dmaicEntries.map(([key, value]: [string, any], i: number) => {
            const config = dmaicConfig[key.toLowerCase()] || { styles: 'border-slate-200 bg-slate-50 text-slate-700', icon: RefreshCw, color: 'text-slate-500' };
            return (
              <div key={key} className="relative">
                {i < dmaicEntries.length - 1 && (
                  <div className={cn("absolute left-8 top-16 bottom-0 w-0.5 z-0", theme === 'dark' ? "bg-slate-800" : "bg-slate-100")} />
                )}
                <motion.div 
                  whileHover={{ scale: 1.01, x: 5 }}
                  onClick={() => onCardClick?.({ 
                    ...value, 
                    title: dmaicPhaseNames[key.toLowerCase()] || key.toUpperCase(), 
                    subtitle: language === 'en' ? 'DMAIC Phase Analysis' : 'تحليل مرحلة DMAIC',
                    deepAnalysis: value.deepAnalysis
                  })}
                  className={cn(
                    "relative z-10 p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-6",
                    config.styles
                  )}
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", theme === 'dark' ? "bg-slate-900/50" : "bg-white/80")}>
                    <config.icon className={cn("w-8 h-8", config.color)} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black uppercase tracking-tighter">{dmaicPhaseNames[key.toLowerCase()] || key}</h4>
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md", theme === 'dark' ? "bg-slate-900/50" : "bg-white/50")}>
                        {language === 'en' ? 'Phase' : 'المرحلة'} {i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90 line-clamp-2">{value.summary}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
          </div>
        </div>
      );

    case 'pdca':
      const pdcaEntries = Object.entries(data).filter(([key, value]) => 
        key.toLowerCase().includes(s) || (value as any).summary.toLowerCase().includes(s)
      );
      const pdcaConfig: Record<string, { styles: string, icon: any, color: string }> = {
        plan: { 
          styles: theme === 'dark' ? 'border-blue-900/30 bg-blue-900/20 text-blue-400 hover:border-blue-500/50' : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300',
          icon: FileText,
          color: 'text-blue-500'
        },
        do: { 
          styles: theme === 'dark' ? 'border-emerald-900/30 bg-emerald-900/20 text-emerald-400 hover:border-emerald-500/50' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300',
          icon: RefreshCw,
          color: 'text-emerald-500'
        },
        check: { 
          styles: theme === 'dark' ? 'border-amber-900/30 bg-amber-900/20 text-amber-400 hover:border-amber-500/50' : 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300',
          icon: BarChart3,
          color: 'text-amber-500'
        },
        act: { 
          styles: theme === 'dark' ? 'border-indigo-900/30 bg-indigo-900/20 text-indigo-400 hover:border-indigo-500/50' : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300',
          icon: Target,
          color: 'text-indigo-500'
        }
      };
      const pdcaPhaseNames: Record<string, string> = {
        plan: language === 'en' ? 'Plan' : 'التخطيط',
        do: language === 'en' ? 'Do' : 'التنفيذ',
        check: language === 'en' ? 'Check' : 'التحقق',
        act: language === 'en' ? 'Act' : 'التصحيح'
      };

      return (
        <div className="space-y-8">
          {data.ganttTasks && data.ganttTasks.length > 0 && (
            <div className={cn("p-6 rounded-2xl border", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
              <h4 className={cn("text-lg font-bold mb-6 flex items-center gap-2", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                <Calendar className="w-5 h-5 text-blue-500" />
                {language === 'en' ? 'Project Timeline (Gantt)' : 'الجدول الزمني للمشروع (جانت)'}
              </h4>
              <div className="overflow-x-auto">
                <GanttChart tasks={data.ganttTasks} theme={theme} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Connecting Circle in Middle */}
          <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 z-20 hidden md:flex items-center justify-center font-black text-xl shadow-2xl", theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-300")}>
            PDCA
          </div>
          
          {pdcaEntries.map(([key, value]: [string, any], i: number) => {
            const config = pdcaConfig[key.toLowerCase()] || { styles: 'border-slate-200 bg-slate-50 text-slate-700', icon: RefreshCw, color: 'text-slate-500' };
            return (
              <motion.div 
                key={key} 
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -1 : 1 }}
                onClick={() => onCardClick?.({ 
                  ...value, 
                  title: pdcaPhaseNames[key.toLowerCase()] || key.toUpperCase(), 
                  subtitle: language === 'en' ? 'PDCA Cycle Analysis' : 'تحليل دورة PDCA',
                  deepAnalysis: value.deepAnalysis
                })}
                className={cn(
                  "p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 relative shadow-lg",
                  config.styles
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", theme === 'dark' ? "bg-slate-900/50" : "bg-white/80")}>
                    <config.icon className={cn("w-7 h-7", config.color)} />
                  </div>
                  <span className="text-4xl font-black opacity-10 uppercase">{key[0]}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">{pdcaPhaseNames[key.toLowerCase()] || key}</h4>
                  <p className="text-sm font-medium leading-relaxed opacity-90 line-clamp-3">{value.summary}</p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      );

    default:
      return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
  }
}
