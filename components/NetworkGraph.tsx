
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    // Generate 120+ nodes to simulate a dense agentic market
    const nodes: any[] = [];
    
    // Named Core Nodes
    const coreNodes = [
      { id: 'Builder', group: 1, radius: 22, label: 'Builder' },
      { id: 'Knowledge-Hub', group: 5, radius: 26, label: 'Knowledge-Hub' },
      { id: 'Agent-D1', group: 2, radius: 14, label: 'Agent-D1' },
      { id: 'Agent-D2', group: 2, radius: 14, label: 'Agent-D2' },
      { id: 'Agent-R1', group: 3, radius: 16, label: 'Agent-R1' },
      { id: 'Agent-R2', group: 3, radius: 16, label: 'Agent-R2' },
      { id: 'Expert-1', group: 4, radius: 18, label: 'Expert-1' },
      { id: 'Expert-2', group: 4, radius: 18, label: 'Expert-2' },
    ];
    nodes.push(...coreNodes);

    // Generate 112+ anonymous background agents
    for (let i = 0; i < 112; i++) {
      nodes.push({
        id: `anon-agent-${i}`,
        group: Math.floor(Math.random() * 4) + 2, // Groups 2-5
        radius: Math.random() * 4 + 3,
        isAnon: true
      });
    }

    const links: any[] = [];
    
    // Core Links
    links.push(
      { source: 'Builder', target: 'Agent-D1' },
      { source: 'Builder', target: 'Agent-D2' },
      { source: 'Agent-D1', target: 'Agent-R1' },
      { source: 'Agent-D2', target: 'Agent-R2' },
      { source: 'Agent-R1', target: 'Knowledge-Hub' },
      { source: 'Agent-R2', target: 'Knowledge-Hub' },
      { source: 'Knowledge-Hub', target: 'Expert-1' },
      { source: 'Knowledge-Hub', target: 'Expert-2' },
      { source: 'Expert-1', target: 'Builder' },
    );

    // Dynamic Swarm Links
    nodes.forEach((node, i) => {
      if (node.isAnon) {
        // Connect each anonymous agent to 1 or 2 other nodes
        const targetCount = Math.random() > 0.7 ? 2 : 1;
        for(let j = 0; j < targetCount; j++) {
          const targetIndex = Math.floor(Math.random() * (nodes.length / 2)); // Bias towards core or early anon nodes
          if (targetIndex !== i) {
            links.push({ source: node.id, target: nodes[targetIndex].id });
          }
        }
      }
    });

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(d => d.source.isAnon || d.target.isAnon ? 40 : 100))
      .force('charge', d3.forceManyBody().strength(d => d.isAnon ? -15 : -400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 2));

    const link = svg.append('g')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => d.source.isAnon || d.target.isAnon ? 0.5 : 1.5);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        if (d.group === 1) return '#6366f1';
        if (d.group === 2) return '#10b981';
        if (d.group === 3) return '#f59e0b';
        if (d.group === 4) return '#ec4899';
        return '#8b5cf6';
      })
      .attr('fill-opacity', d => d.isAnon ? 0.6 : 1)
      .attr('stroke', d => d.isAnon ? 'none' : '#fff')
      .attr('stroke-width', 2)
      .call(d3.drag<SVGCircleElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes.filter(n => !n.isAnon))
      .join('text')
      .text(d => d.label)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .attr('dx', d => d.radius + 5)
      .attr('dy', 4);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <div className="w-full h-[450px] glass rounded-2xl overflow-hidden relative border border-slate-800/50 group">
      <div 
        className="absolute top-6 left-6 z-10 flex flex-col gap-1 cursor-pointer"
        onClick={() => navigate('/market-pulse')}
      >
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:text-white transition-colors">
          Live Market Network
        </h3>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">120+ Active Agents</span>
        </div>
        <p className="text-[9px] font-bold text-indigo-500/0 group-hover:text-indigo-500 transition-all uppercase tracking-widest mt-1">
          Click to view activities →
        </p>
      </div>
      <svg ref={svgRef} className="cursor-move" />
    </div>
  );
};

export default NetworkGraph;
