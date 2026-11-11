'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Code,
  Table,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Database,
  Sparkles,
} from 'lucide-react';
import { executeSQLQuery, SQLQueryResult } from '@/lib/sql-sandbox-engine';

interface CodeSandboxProps {
  initialLanguage?: 'sql' | 'javascript';
  initialCode?: string;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  initialLanguage = 'sql',
  initialCode = 'SELECT region, SUM(amount) AS total_revenue\nFROM orders\nWHERE status = \'Completed\'\nGROUP BY region;',
}) => {
  const [language, setLanguage] = useState<'sql' | 'javascript'>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode);
  const [sqlResult, setSqlResult] = useState<SQLQueryResult | null>(null);
  const [jsOutput, setJsOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    if (language === 'sql') {
      const res = executeSQLQuery(code);
      setSqlResult(res);
      setJsOutput(null);
    } else {
      // JavaScript Evaluation
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.join(' ')),
        };

        const fn = new Function('console', code);
        fn(customConsole);

        setJsOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no console output).');
        setSqlResult(null);
      } catch (err: any) {
        setJsOutput(`JavaScript Error: ${err.message}`);
        setSqlResult(null);
      }
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setSqlResult(null);
    setJsOutput(null);
  };

  const loadSample = (sampleType: string) => {
    if (sampleType === 'groupby') {
      setCode('SELECT region, SUM(amount) AS total_revenue, COUNT(*) AS total_sales\nFROM sales\nGROUP BY region\nORDER BY total_revenue DESC;');
    } else if (sampleType === 'filter') {
      setCode("SELECT order_id, customer_id, amount, status\nFROM orders\nWHERE status = 'Completed'\nORDER BY amount DESC;");
    } else if (sampleType === 'customers') {
      setCode('SELECT * FROM customers;');
    } else if (sampleType === 'join') {
      setCode("SELECT c.customer_name, c.tier, o.order_id, o.amount, o.status\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed';");
    } else if (sampleType === 'case') {
      setCode("SELECT product_name, category, price,\n  CASE \n    WHEN price > 400 THEN 'Premium'\n    WHEN price > 100 THEN 'Mid-Tier'\n    ELSE 'Budget'\n  END AS price_category\nFROM products\nORDER BY price DESC;");
    } else if (sampleType === 'employees') {
      setCode('SELECT department, COUNT(*) AS headcount, ROUND(AVG(salary), 0) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 60000;');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
      {/* Sandbox Header Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Database className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-100 flex items-center gap-2">
              <span>INTERACTIVE CODE SANDBOX</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full uppercase">
                {language}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Live in-browser relational execution console (customers, orders, products, employees, sales)</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Queries Bar (for SQL) */}
      {language === 'sql' && (
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[10px]">
          <span className="text-slate-500 font-bold px-2 whitespace-nowrap">Quick Samples:</span>
          <button
            onClick={() => loadSample('groupby')}
            className="bg-slate-900 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg hover:border-cyan-400/40 transition-colors whitespace-nowrap"
          >
            Sales by Region
          </button>
          <button
            onClick={() => loadSample('join')}
            className="bg-slate-900 border border-slate-800 text-amber-300 px-2.5 py-1 rounded-lg hover:border-amber-400/40 transition-colors whitespace-nowrap"
          >
            Customer Orders (JOIN)
          </button>
          <button
            onClick={() => loadSample('case')}
            className="bg-slate-900 border border-slate-800 text-pink-300 px-2.5 py-1 rounded-lg hover:border-pink-400/40 transition-colors whitespace-nowrap"
          >
            Product Pricing (CASE)
          </button>
          <button
            onClick={() => loadSample('employees')}
            className="bg-slate-900 border border-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg hover:border-emerald-400/40 transition-colors whitespace-nowrap"
          >
            Dept Headcount (HAVING)
          </button>
          <button
            onClick={() => loadSample('customers')}
            className="bg-slate-900 border border-slate-800 text-purple-300 px-2.5 py-1 rounded-lg hover:border-purple-400/40 transition-colors whitespace-nowrap"
          >
            Customers Table
          </button>
        </div>
      )}

      {/* CODE EDITOR TEXTAREA */}
      <div className="p-4 bg-slate-950 font-mono text-xs text-cyan-200">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
          placeholder="Write SQL or JS code here..."
        />
      </div>

      {/* EXECUTION OUTPUT CONSOLE / RESULT DATA TABLE */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 min-h-[160px]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            Execution Output
          </span>

          {sqlResult && (
            <span className="text-[10px] font-mono text-emerald-400">
              {sqlResult.rowCount} rows returned in {sqlResult.executionTimeMs}ms
            </span>
          )}
        </div>

        {/* SQL Data Table Output */}
        {sqlResult && !sqlResult.error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-cyan-400 font-bold uppercase text-[10px]">
                  {sqlResult.columns.map((col, idx) => (
                    <th key={idx} className="p-2.5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sqlResult.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-800/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-2.5 font-mono text-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SQL Error */}
        {sqlResult?.error && (
          <div className="p-3 bg-rose-950/90 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{sqlResult.error}</span>
          </div>
        )}

        {/* JS Output */}
        {jsOutput && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-line">
            {jsOutput}
          </div>
        )}

        {!sqlResult && !jsOutput && (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Click &quot;Run Code&quot; above to execute your code snippet live in the browser.
          </p>
        )}
      </div>
    </div>
  );
};
