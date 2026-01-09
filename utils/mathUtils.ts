
export const safeEvaluate = (expression: string, isDegrees: boolean): string => {
  try {
    // Basic sanitization
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');

    // Handle trigonometry
    const trigFuncs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
    trigFuncs.forEach(func => {
      const regex = new RegExp(`${func}\\(`, 'g');
      if (isDegrees) {
        sanitized = sanitized.replace(regex, `Math.${func}(Math.PI/180*`);
      } else {
        sanitized = sanitized.replace(regex, `Math.${func}(`);
      }
    });

    // Handle other functions
    sanitized = sanitized
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/\^/g, '**');

    // Direct evaluation for simple expressions
    // In a production app, use a library like mathjs. 
    // Here we use Function for simplicity as allowed in this specific scope.
    const result = new Function(`return ${sanitized}`)();
    
    if (isNaN(result) || !isFinite(result)) return "Error";
    
    // Formatting numbers
    const num = Number(result);
    if (Math.abs(num) < 1e-10 && Math.abs(num) > 0) return "0";
    return num.toString().length > 12 ? num.toExponential(6) : num.toString();
  } catch (err) {
    return "Error";
  }
};

export const getPointsForGraph = (expression: string, range: [number, number], steps: number = 100) => {
  const points: { x: number; y: number }[] = [];
  const [min, max] = range;
  const stepSize = (max - min) / steps;

  for (let x = min; x <= max; x += stepSize) {
    try {
      // Replace x with the value, wrapping in parens to handle negative numbers
      const evalExpr = expression.replace(/x/g, `(${x})`);
      const yStr = safeEvaluate(evalExpr, false);
      const y = parseFloat(yStr);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x, y });
      }
    } catch {
      continue;
    }
  }
  return points;
};
