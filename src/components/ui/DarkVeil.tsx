import { useRef, useEffect } from "react";
import "./DarkVeil.css";

export default function DarkVeil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const drawVeil = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create multiple animated gradients for a more vibrant effect
      const gradient1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.001) * 100,
        height * 0.3 + Math.cos(time * 0.001) * 100,
        0,
        width * 0.3,
        height * 0.3,
        Math.max(width, height) * 0.6
      );

      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 0.0015) * 80,
        height * 0.7 + Math.sin(time * 0.0015) * 80,
        0,
        width * 0.7,
        height * 0.7,
        Math.max(width, height) * 0.5
      );

      // More vibrant colors with higher opacity
      const hue1 = (time * 0.05) % 360;
      const hue2 = (hue1 + 120) % 360;
      const hue3 = (hue2 + 120) % 360;

      gradient1.addColorStop(0, `hsla(${hue1}, 80%, 60%, 0.15)`);
      gradient1.addColorStop(0.4, `hsla(${hue2}, 70%, 50%, 0.1)`);
      gradient1.addColorStop(0.8, `hsla(${hue3}, 60%, 40%, 0.05)`);
      gradient1.addColorStop(1, `hsla(${hue1}, 50%, 30%, 0.02)`);

      gradient2.addColorStop(0, `hsla(${hue2}, 75%, 55%, 0.12)`);
      gradient2.addColorStop(0.5, `hsla(${hue3}, 65%, 45%, 0.08)`);
      gradient2.addColorStop(1, `hsla(${hue1}, 55%, 35%, 0.03)`);

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Add animated floating particles
      for (let i = 0; i < 30; i++) {
        const x = (Math.sin(time * 0.0008 + i * 0.3) * 0.6 + 0.5) * width;
        const y = (Math.cos(time * 0.0006 + i * 0.2) * 0.6 + 0.5) * height;
        const size = Math.sin(time * 0.002 + i * 0.5) * 3 + 4;
        const opacity = Math.sin(time * 0.003 + i * 0.7) * 0.4 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue1 + i * 15}, 80%, 70%, ${opacity})`;
        ctx.fill();
      }

      // Add flowing lines
      for (let i = 0; i < 8; i++) {
        const startX = (Math.sin(time * 0.0005 + i * 0.8) * 0.5 + 0.5) * width;
        const startY = (Math.cos(time * 0.0007 + i * 0.6) * 0.5 + 0.5) * height;
        const endX = startX + Math.sin(time * 0.001 + i) * 200;
        const endY = startY + Math.cos(time * 0.001 + i) * 200;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `hsla(${hue2 + i * 30}, 70%, 60%, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      time += 16;
      animationId = requestAnimationFrame(drawVeil);
    };

    resizeCanvas();
    drawVeil();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="darkveil-canvas" />;
}


