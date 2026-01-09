
import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { CalcMode, HistoryItem } from '../types';
import { safeEvaluate } from '../utils/mathUtils';
import { getMathExplanation } from '../services/geminiService';

interface CalculatorProps {
  onHistoryAdd: (item: HistoryItem) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onHistoryAdd }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isDegrees, setIsDegrees] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleInput = (val: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return val;
      return prev + val;
    });
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setExpression(prev => prev + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    const fullExpr = expression + display;
    const result = safeEvaluate(fullExpr, isDegrees);
    
    if (result !== 'Error') {
      const historyItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        expression: fullExpr,
        result,
        timestamp: new Date()
      };
      onHistoryAdd(historyItem);
    }
    
    setDisplay(result);
    setExpression('');
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setExplanation(null);
  };

  const backspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const explainCurrent = async () => {
    if (display === '0' || display === 'Error') return;
    setIsExplaining(true);
    setExplanation(null);
    const text = await getMathExplanation(expression + display, display);
    setExplanation(text || "No explanation available.");
    setIsExplaining(false);
  };

  const addFunction = (func: string) => {
    setDisplay(prev => `${func}(${prev === '0' ? '' : prev}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Display */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-700/50 shadow-inner flex flex-col items-end min-h-[140px] justify-between overflow-hidden">
        <div className="text-slate-400 text-sm font-mono truncate w-full text-right h-6">
          {expression}
        </div>
        <div className="text-slate-100 text-4xl font-bold mono truncate w-full text-right">
          {display}
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex gap-2 justify-between items-center px-1">
        <button 
          onClick={() => setIsDegrees(!isDegrees)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${isDegrees ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          {isDegrees ? 'DEG' : 'RAD'}
        </button>
        <button 
          onClick={explainCurrent}
          disabled={isExplaining}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors disabled:opacity-50"
        >
          <i className={`fas ${isExplaining ? 'fa-circle-notch fa-spin' : 'fa-brain'}`}></i>
          {isExplaining ? 'ANALYZING...' : 'EXPLAIN RESULT'}
        </button>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1: Scientific Basics */}
        <Button label="sin" onClick={() => addFunction('sin')} variant="secondary" className="text-sm" />
        <Button label="cos" onClick={() => addFunction('cos')} variant="secondary" className="text-sm" />
        <Button label="tan" onClick={() => addFunction('tan')} variant="secondary" className="text-sm" />
        <Button label="AC" onClick={clear} variant="danger" />

        {/* Row 2: Powers/Roots */}
        <Button label="log" onClick={() => addFunction('log')} variant="secondary" className="text-sm" />
        <Button label="ln" onClick={() => addFunction('ln')} variant="secondary" className="text-sm" />
        <Button label="^" onClick={() => handleOperator('^')} variant="secondary" />
        <Button label={<i className="fas fa-backspace"></i>} onClick={backspace} variant="primary" />

        {/* Row 3: Digits & Basic Ops */}
        <Button label="7" onClick={() => handleInput('7')} />
        <Button label="8" onClick={() => handleInput('8')} />
        <Button label="9" onClick={() => handleInput('9')} />
        <Button label="÷" onClick={() => handleOperator('/')} variant="primary" className="text-2xl" />

        {/* Row 4 */}
        <Button label="4" onClick={() => handleInput('4')} />
        <Button label="5" onClick={() => handleInput('5')} />
        <Button label="6" onClick={() => handleInput('6')} />
        <Button label="×" onClick={() => handleOperator('*')} variant="primary" className="text-2xl" />

        {/* Row 5 */}
        <Button label="1" onClick={() => handleInput('1')} />
        <Button label="2" onClick={() => handleInput('2')} />
        <Button label="3" onClick={() => handleInput('3')} />
        <Button label="-" onClick={() => handleOperator('-')} variant="primary" className="text-2xl" />

        {/* Row 6 */}
        <Button label="0" onClick={() => handleInput('0')} />
        <Button label="." onClick={() => handleInput('.')} />
        <Button label="π" onClick={() => handleInput('π')} variant="secondary" />
        <Button label="+" onClick={() => handleOperator('+')} variant="primary" className="text-2xl" />

        {/* Bottom */}
        <Button label="(" onClick={() => handleInput('(')} variant="secondary" />
        <Button label=")" onClick={() => handleInput(')')} variant="secondary" />
        <Button label="=" onClick={calculate} variant="accent" className="col-span-2 text-2xl" />
      </div>

      {/* AI Explanation Modal/Panel */}
      {explanation && (
        <div className="mt-4 p-4 bg-indigo-900/20 rounded-2xl border border-indigo-500/20 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-indigo-400 font-bold flex items-center gap-2">
              <i className="fas fa-sparkles"></i> Nova's Explanation
            </span>
            <button onClick={() => setExplanation(null)} className="text-slate-500 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
