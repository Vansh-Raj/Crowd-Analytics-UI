import { useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: number;
  count: number;
}

interface CountGraphProps {
  data: DataPoint[];
}

function CountGraph({ data }: CountGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    if (data.length < 2) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for data...', width / 2, height / 2);
      return;
    }

    const maxCount = Math.max(...data.map(d => d.count), 10);
    const minCount = Math.min(...data.map(d => d.count), 0);
    const countRange = maxCount - minCount || 1;

    const xScale = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / countRange;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.count - minCount) * yScale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    data.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.count - minCount) * yScale;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - padding * 2) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = Math.round(maxCount - (countRange * i / 5));
      const y = padding + (height - padding * 2) * (i / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Count', 0, 0);
    ctx.restore();

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      className="w-full h-full"
    />
  );
}

export default CountGraph;
