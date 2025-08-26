import React, { useEffect, useState } from "react";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { FaEnvelope, FaKey } from "react-icons/fa"; // Email + Password icons

// Combine icons from lucide-react + react-icons
const icons = [Shield, Lock, Eye, Database, FaEnvelope, FaKey];

const AnimatedBackground = () => {
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    // Generate random icons
    const generatedIcons = Array.from({ length: 8 }, () => {
      const Icon = icons[Math.floor(Math.random() * icons.length)];
      return {
        id: Math.random(),
        Icon,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 2,
      };
    });
    setFloatingIcons(generatedIcons);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setFloatingIcons((prev) =>
        prev.map((icon) => {
          let newX = icon.x + icon.speedX;
          let newY = icon.y + icon.speedY;

          if (newX < 0 || newX > window.innerWidth - icon.size) icon.speedX *= -1;
          if (newY < 0 || newY > window.innerHeight - icon.size) icon.speedY *= -1;

          return {
            ...icon,
            x: newX,
            y: newY,
            rotation: icon.rotation + icon.rotationSpeed,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#0f3460] to-[#16213e]">
      {/* Node connections */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f7ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {floatingIcons.map((a, i) =>
          floatingIcons.map((b, j) => {
            if (i < j) {
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 220) {
                return (
                  <g key={`${i}-${j}`}>
                    {/* Glowing connection line */}
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="url(#lineGradient)"
                      strokeWidth="1"
                      opacity={0.4}
                    />
                    {/* Node circles at connection points */}
                    <circle cx={a.x} cy={a.y} r="2" fill="#00f7ff" opacity="0.8" />
                    <circle cx={b.x} cy={b.y} r="2" fill="#00ff88" opacity="0.8" />
                  </g>
                );
              }
              return null;
            }
            return null;
          })
        )}
      </svg>

      {/* Floating icons */}
      {floatingIcons.map((icon) => (
        <icon.Icon
          key={icon.id}
          className="absolute text-cyan-400 opacity-80 drop-shadow-lg"
          style={{
            left: icon.x,
            top: icon.y,
            width: icon.size,
            height: icon.size,
            transform: `rotate(${icon.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
