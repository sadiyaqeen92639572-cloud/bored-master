import { useState, useEffect, useRef } from 'react';
import { Shield, FileSpreadsheet, Code2, AlertTriangle, X } from 'lucide-react';

interface StealthModeProps {
  onClose: () => void;
}

const FAKE_CODE = `import { useState, useEffect } from 'react';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function DashboardController() {
  const [metrics, setMetrics] = useState<DailyReport[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    async function loadFinances() {
      setStatus('loading');
      try {
        const response = await fetch('/api/v2/finance/reports?quarter=Q2');
        const data = await response.json();
        setMetrics(data.filter((item: any) => item.revenue > 120000));
        setStatus('success');
      } catch (err) {
        console.error('System compilation failed on thread ID #4092');
        setStatus('idle');
      }
    }
    loadFinances();
  }, []);

  const totalCalculatedYTD = metrics.reduce((acc, curr) => acc + curr.margin, 0);

  return (
    <div className="flex flex-col gap-6 p-8 bg-zinc-950 text-zinc-100 min-h-screen">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-tight">Enterprise Ledger Core v4.19</h1>
          <p className="text-xs text-zinc-500 font-mono">Status: Connected to Prod-Db-Clustered-03 (latency: 14ms)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">Syncing Cloud Assets...</span>
        </div>
      </header>
    </div>
  );
}`;

const FAKE_EXCEL_ROWS = [
  { ref: 'PROJ-904', client: 'Aether Corp', q1: 142050, q2: 189200, status: 'Completed', margin: '42%' },
  { ref: 'PROJ-905', client: 'Nebula Biotech', q1: 89400, q2: 95100, status: 'In Review', margin: '28%' },
  { ref: 'PROJ-908', client: 'Vertex Global', q1: 310900, q2: 420800, status: 'Active', margin: '51%' },
  { ref: 'PROJ-911', client: 'Quantum Dynamics', q1: 52100, q2: 68400, status: 'Completed', margin: '15%' },
  { ref: 'PROJ-912', client: 'Starlight Retail', q1: 215400, q2: 245000, status: 'Pending Approval', margin: '33%' },
  { ref: 'PROJ-915', client: 'Nova Logistics', q1: 185600, q2: 191000, status: 'Active', margin: '24%' },
  { ref: 'PROJ-920', client: 'Prism Labs Inc', q1: 450000, q2: 512000, status: 'Completed', margin: '58%' },
];

export function StealthMode({ onClose }: StealthModeProps) {
  const [mode, setMode] = useState<'excel' | 'code'>('excel');
  const [typedCode, setTypedCode] = useState('');
  const [codeIndex, setCodeIndex] = useState(0);
  const [excelRows, setExcelRows] = useState(FAKE_EXCEL_ROWS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Key press listener to fake typing
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // If user types, simulate writing code or updating excel
      if (mode === 'code') {
        // Grab next 4 characters to look fast and responsive
        const nextChars = FAKE_CODE.substring(codeIndex, codeIndex + 5);
        if (codeIndex < FAKE_CODE.length) {
          setTypedCode(prev => prev + nextChars);
          setCodeIndex(prev => prev + 5);
        } else {
          // loop back
          setTypedCode('');
          setCodeIndex(0);
        }
      } else {
        // Randomly adjust financial margins/data in excel to simulate manual entry
        setExcelRows(prev =>
          prev.map((row, idx) => {
            if (idx === Math.floor(Math.random() * prev.length)) {
              const q2Add = Math.floor(Math.random() * 500) - 200;
              return {
                ...row,
                q2: Math.max(10000, row.q2 + q2Add),
              };
            }
            return row;
          })
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    if (containerRef.current) {
      containerRef.current.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codeIndex, mode, onClose]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col font-mono text-xs select-none outline-none"
      id="stealth-mode-overlay"
    >
      {/* Top Warning Control Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-200">Boredom OS : Stealth Mode</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
            BOSS DETECTOR ACTIVE
          </span>
          <span className="text-zinc-600 hidden md:inline">|</span>
          <span className="text-zinc-500 hidden md:inline">Type anywhere on your keyboard to simulate real activity</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('excel')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              mode === 'excel'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                : 'hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Financial Spreadsheet</span>
          </button>
          <button
            onClick={() => setMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              mode === 'code'
                ? 'bg-zinc-800 text-sky-400 border border-zinc-700'
                : 'hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Source Code IDE</span>
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 bg-red-950 text-red-400 px-3 py-1 rounded border border-red-800 hover:bg-red-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-auto bg-zinc-950 text-zinc-300">
        {mode === 'excel' ? (
          <div className="p-4 md:p-8 bg-[#1f2937] min-h-full font-sans text-sm text-zinc-100">
            {/* Fake Google Sheets / MS Excel Interface */}
            <div className="flex items-center gap-4 mb-4 border-b border-zinc-700 pb-3">
              <div className="bg-emerald-600 text-white p-2 rounded">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-white">Q2_Enterprise_Performance_Analysis.xlsx</h2>
                  <span className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">Read-Write</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-4">
                  <span>Modified 2 seconds ago by <b>Me</b></span>
                  <span>• Autoprotect: ON</span>
                  <span className="text-emerald-400">● Cloud Synced</span>
                </div>
              </div>
            </div>

            {/* Excel Formula bar */}
            <div className="bg-zinc-800 border border-zinc-700 p-1.5 flex items-center gap-2 font-mono text-xs rounded mb-4 text-zinc-200">
              <span className="font-bold text-zinc-500 border-r border-zinc-700 pr-3">fx</span>
              <span className="text-zinc-400 select-all w-full">
                =SUMPRODUCT(H2:H28, J2:J28) / TOTAL_YTD_CONTRIBUTION_MARGIN * 100
              </span>
            </div>

            {/* Grid Table */}
            <div className="overflow-x-auto border border-zinc-700 rounded bg-zinc-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-800 text-zinc-400 border-b border-zinc-700 font-mono text-xs select-none">
                    <th className="py-2 px-3 border-r border-zinc-700 w-12 text-center bg-zinc-850"></th>
                    <th className="py-2 px-4 border-r border-zinc-700">A: PROJECT REF</th>
                    <th className="py-2 px-4 border-r border-zinc-700">B: CLIENT ENTITY</th>
                    <th className="py-2 px-4 border-r border-zinc-700 text-right">C: Q1 REVENUE ($)</th>
                    <th className="py-2 px-4 border-r border-zinc-700 text-right">D: Q2 REVENUE ($)</th>
                    <th className="py-2 px-4 border-r border-zinc-700 text-center">E: COMPLIANCE STATUS</th>
                    <th className="py-2 px-4 text-right">F: NET MARGIN (%)</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {excelRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-850 text-zinc-200">
                      <td className="py-2 px-3 text-center bg-zinc-800 border-r border-zinc-700 text-zinc-500 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 border-r border-zinc-800 text-sky-400 font-bold">{row.ref}</td>
                      <td className="py-2 px-4 border-r border-zinc-800 font-sans text-sm font-semibold">{row.client}</td>
                      <td className="py-2 px-4 border-r border-zinc-800 text-right text-emerald-400 font-semibold">
                        {row.q1.toLocaleString()} $
                      </td>
                      <td className="py-2 px-4 border-r border-zinc-800 text-right text-emerald-400 font-semibold animate-pulse-subtle">
                        {row.q2.toLocaleString()} $
                      </td>
                      <td className="py-2 px-4 border-r border-zinc-800 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            row.status === 'Completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                              : row.status === 'In Review'
                              ? 'bg-amber-950 text-amber-400 border border-amber-900'
                              : 'bg-sky-950 text-sky-400 border border-sky-900'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right text-purple-400 font-bold">{row.margin}</td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-zinc-850 font-bold border-t border-zinc-700">
                    <td className="py-2 px-3 text-center bg-zinc-800 border-r border-zinc-700 text-zinc-500">
                      Σ
                    </td>
                    <td className="py-2 px-4 border-r border-zinc-800 text-zinc-400">YTD Cumulative Total</td>
                    <td className="py-2 px-4 border-r border-zinc-800"></td>
                    <td className="py-2 px-4 border-r border-zinc-800 text-right text-emerald-400 text-sm">
                      {excelRows.reduce((acc, row) => acc + row.q1, 0).toLocaleString()} $
                    </td>
                    <td className="py-2 px-4 border-r border-zinc-800 text-right text-emerald-400 text-sm">
                      {excelRows.reduce((acc, row) => acc + row.q2, 0).toLocaleString()} $
                    </td>
                    <td className="py-2 px-4 border-r border-zinc-800 text-center">
                      <span className="text-zinc-500 text-[10px]">Auto-calculated</span>
                    </td>
                    <td className="py-2 px-4 text-right text-purple-400 text-sm">
                      39.2%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Status bar */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400">✔ Ready</span>
                <span>Sum: {excelRows.reduce((acc, row) => acc + row.q2, 0).toLocaleString()} $</span>
                <span>Count: 7 Rows</span>
                <span>Average: 246,150 $</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span>Excel Engine Node v19.42</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-6 bg-zinc-950 text-zinc-300 font-mono text-sm leading-relaxed min-h-full">
            {/* VS Code Style Header */}
            <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-3 mb-4 select-none">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-4 text-xs text-zinc-400">src/components/DashboardController.tsx - Visual Studio Code</span>
            </div>

            <div className="flex gap-4">
              {/* Fake Directory Sidebar */}
              <div className="w-48 border-r border-zinc-850 pr-4 text-xs text-zinc-500 select-none hidden md:block">
                <div className="font-bold text-zinc-400 mb-2 uppercase tracking-wider text-[10px]">Explorer</div>
                <div className="pl-2 flex flex-col gap-1.5">
                  <div className="text-zinc-300 font-semibold flex items-center gap-1">📁 src</div>
                  <div className="pl-3 text-zinc-400 flex items-center gap-1">📁 components</div>
                  <div className="pl-6 text-sky-400 font-semibold flex items-center gap-1">
                    📄 DashboardController.tsx <span className="text-[9px] text-emerald-400 font-bold">•</span>
                  </div>
                  <div className="pl-6 text-zinc-500 flex items-center gap-1">📄 MetricPanel.tsx</div>
                  <div className="pl-3 text-zinc-500 flex items-center gap-1">📁 db</div>
                  <div className="pl-6 text-zinc-500 flex items-center gap-1">📄 schema.ts</div>
                  <div className="pl-2 text-zinc-500 flex items-center gap-1">📄 package.json</div>
                  <div className="pl-2 text-zinc-500 flex items-center gap-1">📄 tsconfig.json</div>
                </div>
              </div>

              {/* Code text content area */}
              <div className="flex-1 font-mono text-xs md:text-sm">
                <pre className="whitespace-pre-wrap font-mono text-emerald-400 leading-6">
                  {typedCode || '// Start pressing keys on your keyboard to write code...'}
                  <span className="w-1.5 h-4 bg-zinc-100 inline-block animate-pulse ml-0.5 vertical-middle" />
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Panic Info */}
      <div className="bg-red-950/90 border-t border-red-900 text-red-200 px-4 py-3 flex items-center justify-between text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          <span>
            <b>TOTAL STEALTH MODE ACTIVE :</b> Your screen looks like an advanced enterprise productivity tool. 
            No entertainment data is shown.
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-red-800 text-white font-bold px-4 py-1.5 rounded shadow hover:bg-red-700 transition-transform hover:scale-105"
        >
          Exit Safely (Esc)
        </button>
      </div>
    </div>
  );
}
