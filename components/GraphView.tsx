
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getPointsForGraph } from '../utils/mathUtils';

interface GraphViewProps {
  expression: string;
}

const GraphView: React.FC<GraphViewProps> = ({ expression }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !expression) return;

    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xRange: [number, number] = [-10, 10];
    const data = getPointsForGraph(expression, xRange, 200);

    if (data.length === 0) return;

    const x = d3.scaleLinear()
      .domain(xRange)
      .range([margin.left, width - margin.right]);

    const yExtent = d3.extent(data, d => d.y) as [number, number];
    const y = d3.scaleLinear()
      .domain([Math.min(yExtent[0], -1), Math.max(yExtent[1], 1)])
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
      .attr("color", "#475569");

    svg.append("g")
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(y).ticks(10).tickSizeOuter(0))
      .attr("color", "#475569");

    // Grid
    svg.append("g")
      .attr("class", "grid")
      .attr("stroke", "#1e293b")
      .attr("stroke-opacity", 0.1)
      .call(d3.axisBottom(x).tickSize(height).tickFormat(() => ""));

    // Line
    const line = d3.line<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 2.5)
      .attr("d", line);

  }, [expression]);

  return (
    <div className="flex flex-col items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
      <div className="mb-2 text-xs text-slate-400 font-mono">y = {expression || 'f(x)'}</div>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        className="max-w-full h-auto"
      />
      <div className="mt-2 text-[10px] text-slate-500">Range: [-10, 10]</div>
    </div>
  );
};

export default GraphView;
