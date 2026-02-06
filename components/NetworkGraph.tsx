
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    const nodes = [
      { id: 'Builder', group: 1, radius: 25 },
      { id: 'Agent-D1', group: 2, radius: 15 },
      { id: 'Agent-D2', group: 2, radius: 15 },
      { id: 'Agent-R1', group: 3, radius: 18 },
      { id: 'Agent-R2', group: 3, radius: 18 },
      { id: 'Expert-1', group: 4, radius: 20 },
      { id: 'Expert-2', group: 4, radius: 20 },
      { id: 'Knowledge-Hub', group: 5, radius: 30 },
    ];

    const links = [
      { source: 'Builder', target: 'Agent-D1' },
      { source: 'Builder', target: 'Agent-D2' },
      { source: 'Agent-D1', target: 'Agent-R1' },
      { source: 'Agent-D2', target: 'Agent-R2' },
      { source: 'Agent-R1', target: 'Knowledge-Hub' },
      { source: 'Agent-R2', target: 'Knowledge-Hub' },
      { source: 'Knowledge-Hub', target: 'Expert-1' },
      { source: 'Knowledge-Hub', target: 'Expert-2' },
      { source: 'Expert-1', target: 'Builder' },
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1.5);

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
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(d3.drag<SVGCircleElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.id)
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('dx', 15)
      .attr('dy', 5);

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
    <div className="w-full h-[400px] glass rounded-2xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Network Topography</h3>
      </div>
      <svg ref={svgRef} className="cursor-move" />
    </div>
  );
};

export default NetworkGraph;
