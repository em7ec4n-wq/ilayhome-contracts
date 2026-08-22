'use client'

import React, { useRef, useEffect, useState } from 'react';
import SignaturePadLibrary from 'signature_pad';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLibrary | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Make canvas responsive and handle high DPI
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const data = padRef.current?.toData();
      
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      
      padRef.current?.clear();
      if (data) {
        padRef.current?.fromData(data);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    
    padRef.current = new SignaturePadLibrary(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
    });

    padRef.current.addEventListener('beginStroke', () => setIsEmpty(false));
    
    // Initial resize
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      padRef.current?.off();
    };
  }, []);

  const handleClear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      const data = padRef.current.toDataURL('image/png');
      onSave(data);
    }
  };

  // Prevent scroll when drawing on touch devices
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const preventScroll = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', preventScroll, { passive: false });
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', preventScroll);
      canvas.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white touch-none">
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
            Parmağınızla imzanızı buraya atın
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="flex w-full gap-2">
        <button 
          type="button" 
          onClick={handleClear} 
          className="btn-secondary flex-1 py-2 text-sm font-medium"
        >
          Temizle
        </button>
        <button 
          type="button" 
          onClick={handleSave} 
          disabled={isEmpty}
          className="btn-primary flex-1 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          İmzayı Kaydet
        </button>
      </div>
    </div>
  );
}
