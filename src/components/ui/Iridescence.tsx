import { useEffect, useRef, useState } from "react";
import './Iridescence.css';

// Pure CSS-based Iridescence component (no WebGL dependency)
export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!mouseReact || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseReact]);

  return (
    <div
      ref={containerRef}
      className="iridescence-fallback"
      style={{
        '--speed': speed,
        '--amplitude': amplitude,
        '--mouse-x': mousePos.x,
        '--mouse-y': mousePos.y,
      } as React.CSSProperties}
      {...rest}
    >
      <div className="iridescence-layer layer-1"></div>
      <div className="iridescence-layer layer-2"></div>
      <div className="iridescence-layer layer-3"></div>
      <div className="iridescence-layer layer-4"></div>
    </div>
  );
}
