'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Download, Settings2, AlertCircle, FileCheck, ShieldCheck } from 'lucide-react';

type Preset = {
  id: string;
  label: string;
  width: number;
  height: number;
  maxKB: number;
  minKB?: number;
};

const PRESETS: Preset[] = [
  { id: 'ssc_photo', label: 'SSC Photo (20-50KB, 3.5x4.5cm)', width: 350, height: 450, maxKB: 50, minKB: 20 },
  { id: 'ssc_sig', label: 'SSC Signature (10-20KB, 4.0x2.0cm)', width: 400, height: 200, maxKB: 20, minKB: 10 },
  { id: 'ibps_photo', label: 'IBPS/Bank Photo (20-50KB)', width: 450, height: 450, maxKB: 50, minKB: 20 },
  { id: 'ibps_sig', label: 'IBPS Signature (10-20KB)', width: 400, height: 200, maxKB: 20, minKB: 10 },
  { id: 'upsc_photo', label: 'UPSC Photo (20-300KB)', width: 350, height: 350, maxKB: 300, minKB: 20 },
  { id: 'custom', label: 'Custom Size', width: 400, height: 400, maxKB: 50 },
];

export default function ImageResizerTool() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedSizeKB, setProcessedSizeKB] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG).');
      return;
    }

    setError(null);
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setProcessedImage(null);
  };

  const processImage = useCallback(async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = selectedImage;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = activePreset.width;
      canvas.height = activePreset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Fill with white background (in case of transparent PNGs)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple contain/cover logic
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Iterative compression to find the best quality that fits the maxKB
      let quality = 1.0;
      let blob: Blob | null = null;
      const maxBytes = activePreset.maxKB * 1024;
      const minBytes = (activePreset.minKB || 0) * 1024;

      while (quality > 0.05) {
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob && blob.size <= maxBytes) {
          // If it's also above minBytes, or we can't do anything about minBytes easily
          if (blob.size >= minBytes || quality === 1.0) {
             break;
          }
        }
        quality -= 0.05;
      }

      if (blob) {
        setProcessedSizeKB(Math.round(blob.size / 1024));
        const reader = new FileReader();
        reader.onloadend = () => setProcessedImage(reader.result as string);
        reader.readAsDataURL(blob);
      } else {
        throw new Error('Failed to compress image.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, activePreset]);

  // Trigger processing automatically when preset or image changes
  React.useEffect(() => {
    if (selectedImage) {
      processImage();
    }
  }, [selectedImage, activePreset, processImage]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const suffix = activePreset.id.includes('sig') ? 'signature' : 'photo';
    link.download = `SelectionSure_${suffix}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold text-secondary border-b border-border-custom pb-2">
            Photo & Signature Resizer
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Perfectly resize and compress your photos and signatures for SSC, UPSC, Bank, and other Govt job forms. 100% Secure & Client-side.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Left Col: Upload & Preview */}
          <div className="space-y-6">
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:bg-blue-50 hover:border-primary transition group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp"
                className="hidden" 
              />
              <div className="mx-auto w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-secondary">Click to upload image</h3>
              <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG (Max 5MB)</p>
              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-success font-semibold bg-green-50 px-4 py-2 rounded-full w-max mx-auto border border-green-200 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                100% Private: We don&apos;t store your images on our servers.
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 border border-border-custom flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-700">Original Image</span>
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setProcessedImage(null);
                    setOriginalFile(null);
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Change Image
                </button>
              </div>
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 shadow-inner">
                <img src={selectedImage} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-xs text-gray-500 mt-3 font-medium">Original File: {originalFile?.name}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm font-semibold rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Right Col: Settings & Output */}
        <div className="bg-gray-50 p-5 rounded-xl border border-border-custom space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-secondary flex items-center gap-2 text-sm uppercase tracking-wider">
              <Settings2 className="w-4 h-4 text-primary" />
              Select Preset
            </h3>
            <div className="space-y-2">
              {PRESETS.map(preset => (
                <label 
                  key={preset.id} 
                  className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition ${activePreset.id === preset.id ? 'border-primary bg-blue-50/50' : 'border-border-custom bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="preset" 
                      checked={activePreset.id === preset.id} 
                      onChange={() => setActivePreset(preset)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="font-bold text-sm text-secondary leading-tight">{preset.label}</span>
                  </div>
                  <div className="ml-6 mt-1 text-[11px] text-gray-500 font-medium">
                    Target: {preset.width}x{preset.height}px
                  </div>
                </label>
              ))}
              
              {activePreset.id === 'custom' && (
                <div className="mt-4 p-3 bg-white border border-border-custom rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1">
                      <span className="text-xs font-bold text-gray-500">Width (px)</span>
                      <input 
                        type="number" 
                        value={activePreset.width}
                        onChange={(e) => setActivePreset({ ...activePreset, width: Number(e.target.value) || 100 })}
                        className="w-full px-2 py-1.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-bold text-gray-500">Height (px)</span>
                      <input 
                        type="number" 
                        value={activePreset.height}
                        onChange={(e) => setActivePreset({ ...activePreset, height: Number(e.target.value) || 100 })}
                        className="w-full px-2 py-1.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </label>
                  </div>
                  <label className="space-y-1 block">
                    <span className="text-xs font-bold text-gray-500">Max File Size (KB)</span>
                    <input 
                      type="number" 
                      value={activePreset.maxKB}
                      onChange={(e) => setActivePreset({ ...activePreset, maxKB: Number(e.target.value) || 10 })}
                      className="w-full px-2 py-1.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border-custom pt-5">
            <h3 className="font-bold text-secondary flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
              <FileCheck className="w-4 h-4 text-success" />
              Final Result
            </h3>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-bold animate-pulse">Processing image...</p>
              </div>
            ) : processedImage ? (
              <div className="flex flex-col items-center">
                <div className="relative bg-white border border-dashed border-gray-300 p-2 shadow-sm rounded-md mb-4 flex items-center justify-center">
                  {/* Visual indication of aspect ratio output */}
                  <img src={processedImage} alt="Processed" className="max-w-[200px] max-h-[150px] object-contain" />
                </div>
                
                <div className="w-full flex items-center justify-between bg-white px-3 py-2 border border-border-custom rounded-md text-sm mb-4 shadow-sm">
                  <span className="text-gray-500 font-medium">Final Size:</span>
                  <span className={`font-bold ${processedSizeKB <= activePreset.maxKB ? 'text-success' : 'text-red-500'}`}>
                    {processedSizeKB} KB
                  </span>
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md shadow-primary/20"
                >
                  <Download className="w-5 h-5" />
                  Download Ready
                </button>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg text-gray-400 bg-white">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Upload an image to see the result here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
