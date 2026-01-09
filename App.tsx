
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import GraphView from './components/GraphView';
import { HistoryItem, CalcMode } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'graph' | 'history'>('calc');
  const [graphExpr, setGraphExpr] = useState('Math.sin(x)');

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          NOVA SCIENTIFIC
        </h1>
        <p className="text-slate-400 text-sm">Professional Mathematics Engine</p>
      </header>

      {/* Main Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Main Calculator Interface */}
        <div className="lg:col-span-7 bg-slate-800/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
          <Calculator onHistoryAdd={addHistory} />
        </div>

        {/* Right Section: Tools & Insights */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Navigation Tabs */}
          <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-700/50">
            {(['calc', 'graph', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'calc' && (
              <div className="flex flex-col gap-4 bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 h-full">
                <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i> Quick Guide
                </h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-3">
                    <span className="text-indigo-500 font-mono">01</span>
                    <span>Use <code className="bg-slate-900 px-1 rounded text-indigo-400">sin</code>, <code className="bg-slate-900 px-1 rounded text-indigo-400">cos</code> with RAD/DEG toggles.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-indigo-500 font-mono">02</span>
                    <span>Switch to <strong>Graph</strong> tab to visualize functions in real-time.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-indigo-500 font-mono">03</span>
                    <span>Ask <strong>Nova AI</strong> to explain your results step-by-step.</span>
                  </li>
                </ul>
                <div className="mt-auto pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Memory</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors">MC</button>
                    <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors">MR</button>
                    <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors">M+</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'graph' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                  <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-chart-line"></i> Function Grapher
                  </h3>
                  <div className="mb-4">
                    <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Function f(x)</label>
                    <input 
                      type="text" 
                      value={graphExpr}
                      onChange={(e) => setGraphExpr(e.target.value)}
                      placeholder="e.g. sin(x) * 2"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <GraphView expression={graphExpr} />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="flex flex-col gap-4 bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 h-[480px] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-indigo-400 font-bold flex items-center gap-2">
                    <i className="fas fa-history"></i> Session History
                  </h3>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto pr-2 space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic text-sm">
                      No calculations yet.
                    </div>
                  ) : (
                    history.map(item => (
                      <div key={item.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30 group">
                        <div className="text-[10px] text-slate-500 mb-1">{item.timestamp.toLocaleTimeString()}</div>
                        <div className="text-slate-400 text-sm font-mono truncate mb-1">{item.expression} =</div>
                        <div className="text-slate-100 font-bold mono text-lg">{item.result}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        Designed for High Performance • Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;
