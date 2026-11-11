'use client';

import React from 'react';
import { Table, CheckCircle2, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { SpreadsheetVisualData } from '@/lib/topic-content-engine';

interface InteractiveSpreadsheetVisualProps {
  data: SpreadsheetVisualData;
}

export const InteractiveSpreadsheetVisual: React.FC<InteractiveSpreadsheetVisualProps> = ({
  data,
}) => {
  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
          <FileSpreadsheet className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{data.title}</span>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
          Active Cell Focus: {data.targetCell}
        </span>
      </div>

      {/* FORMULA BAR SIMULATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3 text-xs font-mono">
        <div className="bg-slate-950 border border-slate-800 text-cyan-400 font-extrabold text-[11px] px-2.5 py-1 rounded-md shrink-0">
          {data.targetCell}
        </div>
        <div className="text-slate-500 font-bold shrink-0">fx</div>
        <div className="text-emerald-300 font-bold bg-slate-950/80 px-3 py-1 rounded-md border border-slate-800 flex-1 overflow-x-auto whitespace-nowrap">
          {data.formulaEntered}
        </div>
      </div>

      {/* INTERACTIVE SPREADSHEET GRID TABLE */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/90 shadow-inner">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="p-2.5 w-12 text-center border-r border-slate-800 bg-slate-950/90 text-slate-500 font-bold">
                #
              </th>
              {data.headers.map((hdr, hIdx) => (
                <th key={hIdx} className="p-2.5 border-r border-slate-800/80 text-slate-300 font-bold">
                  {hdr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rIdx) => {
              const rowNum = rIdx + 2; // Rows start at 2 below header
              return (
                <tr key={rIdx} className="border-b border-slate-800/60 hover:bg-slate-900/60 transition-colors">
                  {/* Row Number */}
                  <td className="p-2.5 text-center border-r border-slate-800 font-mono text-[11px] text-slate-500 bg-slate-950/50 font-bold">
                    {rowNum}
                  </td>
                  {/* Cell Data */}
                  {data.headers.map((hdr, hIdx) => {
                    const colLetter = String.fromCharCode(65 + hIdx); // A, B, C...
                    const cellAddress = `${colLetter}${rowNum}`;
                    const isTarget = cellAddress === data.targetCell;
                    const value = row[hdr];

                    return (
                      <td
                        key={hIdx}
                        className={`p-2.5 border-r border-slate-800/60 font-medium ${
                          isTarget
                            ? 'bg-cyan-950/80 border-2 border-cyan-400 font-bold text-cyan-200 shadow-md shadow-cyan-500/10 relative'
                            : 'text-slate-200'
                        }`}
                      >
                        {isTarget ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-cyan-300 font-extrabold">{value}</span>
                            <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40 shrink-0 animate-pulse">
                              Result
                            </span>
                          </div>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EXPLANATION FOOTER CARD */}
      <div className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>Formula to Cell Mapping:</span>
        </div>
        <p className="leading-relaxed text-slate-300">{data.explanation}</p>
      </div>
    </div>
  );
};
