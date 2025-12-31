import React from 'react';

const Fireworks: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-yellow-400 opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '4px',
            height: '4px',
            boxShadow: `
              0 0 10px #fff,
              ${Math.random() * 100 - 50}px ${Math.random() * 100 - 50}px 0 #ff0,
              ${Math.random() * 100 - 50}px ${Math.random() * 100 - 50}px 0 #f0f,
              ${Math.random() * 100 - 50}px ${Math.random() * 100 - 50}px 0 #0ff
            `,
            animation: `firework ${2 + Math.random() * 2}s infinite ${Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};
export default Fireworks;
