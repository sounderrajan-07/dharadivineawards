import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function DivineCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Disable custom cursor on touch devices to match standard mobile behavior
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable/interactive elements
      const target = e.target;
      if (target && target instanceof Element) {
        const isClickable = target.closest('a, button, select, input, textarea, [role="button"], .cursor-pointer, .btn');
        setIsHovered(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mounted]);

  if (!mounted) return null;

  const baseColor = '#094f4b'; // Teal color from the old site

  return createPortal(
    <div style={{ pointerEvents: 'none' }}>
      {/* Outer circle trailing the mouse with a 200ms transition lag */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '25px',
          height: '25px',
          borderRadius: '100%',
          border: `1px solid ${baseColor}`,
          backgroundColor: isHovered ? baseColor : 'transparent',
          opacity: isHovered ? 0.4 : 1,
          pointerEvents: 'none',
          zIndex: 999991,
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`,
          transition: 'transform 200ms ease-out, background-color 0.3s, opacity 0.3s, width 0.3s, height 0.3s',
        }}
      />
      {/* Inner solid dot staying exactly at the mouse tip */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: (isHovered || isClicked) ? '25px' : '10px',
          height: (isHovered || isClicked) ? '25px' : '10px',
          borderRadius: '100%',
          backgroundColor: baseColor,
          opacity: (isHovered || isClicked) ? 0.4 : 0.3,
          pointerEvents: 'none',
          zIndex: 999991,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        }}
      />
    </div>,
    document.documentElement
  );
}
