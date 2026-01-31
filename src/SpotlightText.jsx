import React, { useRef, useState, useEffect } from "react";

const SpotlightText = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-default ${className}`}
      // O truque: Texto base cinzento escuro
      style={{ color: "#333" }} 
    >
      {/* Texto Base (Fundo) */}
      <div className="select-none">{children}</div>

      {/* Camada de "Luz" (Frente) */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          // Máscara que segue o rato
          maskImage: `radial-gradient(circle 250px at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(circle 250px at ${position.x}px ${position.y}px, black, transparent)`,
          // Cor do texto iluminado (Branco puro)
          color: "#fff",
          opacity: opacity,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SpotlightText;