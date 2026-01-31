import React, { useRef, useEffect } from 'react';

const AudioWaveform = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Configurações da Onda
    const lines = 40; 
    const gap = 40; 
    const amplitude = 50; 
    const speed = 0.002; 

    const draw = () => {
      // Limpar o canvas mantendo transparência
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1;
      
      const perspective = 300;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      time += speed;

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const alpha = (i / lines); 
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;

        for (let x = -canvas.width; x < canvas.width; x += 20) {
            const yOffset = 
                Math.sin(x * 0.003 + time * 5 + i * 0.5) * amplitude * Math.sin(time) +
                Math.cos(x * 0.01 + time) * 20;

            const z = i * gap - (time * 100) % gap;
            const scale = perspective / (perspective + z + 400);
            
            const x2d = centerX + x * scale;
            const y2d = centerY + 100 + yOffset * scale * 2;

            if (x === -canvas.width) {
                ctx.moveTo(x2d, y2d);
            } else {
                ctx.lineTo(x2d, y2d);
            }
        }
        ctx.stroke();
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
    />
  );
};

export default AudioWaveform;