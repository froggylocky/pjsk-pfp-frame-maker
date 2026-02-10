
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Download, ZoomIn, ZoomOut, Move, RotateCw, Info, Loader2, Settings2, SlidersHorizontal, Youtube, ExternalLink, X, Check, Unlock, Lock } from 'lucide-react';

const FRAMES = [
  { id: 'none', name: 'None', url: '' },
  { id: 'ichika', name: 'Ichika Fan', url: 'https://u.cubeupload.com/froglock/frameunite011ichika.png' },
  { id: 'saki', name: 'Saki Fan', url: 'https://u.cubeupload.com/froglock/frameunite012saki.png' },
  { id: 'honami', name: 'Honami Fan', url: 'https://u.cubeupload.com/froglock/frameunite013honami.png' },
  { id: 'shiho', name: 'Shiho Fan', url: 'https://u.cubeupload.com/froglock/frameunite014shiho.png' },
  { id: 'leo_sticks', name: 'Leo/need Fan', url: 'https://u.cubeupload.com/froglock/frameunite01cheer.png' },
  { id: 'minori', name: 'Minori Fan', url: 'https://u.cubeupload.com/froglock/frameunite021minori.png' },
  { id: 'haruka', name: 'Haruka Fan', url: 'https://u.cubeupload.com/froglock/frameunite022haruka.png' },
  { id: 'airi', name: 'Airi Fan', url: 'https://u.cubeupload.com/froglock/frameunite023airi.png' },
  { id: 'shizuku', name: 'Shizuku Fan', url: 'https://u.cubeupload.com/froglock/frameunite024shizuku.png' },
  { id: 'mmj_sticks', name: 'MMJ! Fan', url: 'https://u.cubeupload.com/froglock/frameunite02cheer.png' },
  { id: 'kohane', name: 'Kohane Fan', url: 'https://u.cubeupload.com/froglock/frameunite031kohane.png' },
  { id: 'an', name: 'An Fan', url: 'https://u.cubeupload.com/froglock/frameunite032an.png' },
  { id: 'akito', name: 'Akito Fan', url: 'https://u.cubeupload.com/froglock/frameunite033akito.png' },
  { id: 'toya', name: 'Toya Fan', url: 'https://u.cubeupload.com/froglock/frameunite034toya.png' },
  { id: 'vbs_sticks', name: 'VBS Fan', url: 'https://u.cubeupload.com/froglock/frameunite03cheer.png' },
  { id: 'tsukasa', name: 'Tsukasa Fan', url: 'https://u.cubeupload.com/froglock/frameunite041tsukasa.png' },
  { id: 'emu', name: 'Emu Fan', url: 'https://u.cubeupload.com/froglock/frameunite042emu.png' },
  { id: 'nene', name: 'Nene Fan', url: 'https://u.cubeupload.com/froglock/frameunite043nene.png' },
  { id: 'rui', name: 'Rui Fan', url: 'https://u.cubeupload.com/froglock/frameunite044rui.png' },
  { id: 'wxs_sticks', name: 'WxS Fan', url: 'https://u.cubeupload.com/froglock/frameunite04cheer.png' },
  { id: 'kanade', name: 'Kanade Fan', url: 'https://u.cubeupload.com/froglock/frameunite051kanade.png' },
  { id: 'mafuyu', name: 'Mafuyu Fan', url: 'https://u.cubeupload.com/froglock/frameunite052mafuyu.png' },
  { id: 'ena', name: 'Ena Fan', url: 'https://u.cubeupload.com/froglock/frameunite053ena.png' },
  { id: 'mizuki', name: 'Mizuki Fan', url: 'https://u.cubeupload.com/froglock/frameunite054mizuki.png' },
  { id: 'n25_sticks', name: 'N25 Fan', url: 'https://u.cubeupload.com/froglock/frameunite05cheer.png' },
  { id: 'miku', name: 'Miku Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger1m.png' },
  { id: 'rin', name: 'Rin Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger2r.png' },
  { id: 'len', name: 'Len Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger3l.png' },
  { id: 'luka', name: 'Luka Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger4l.png' },
  { id: 'meiko', name: 'Meiko Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger5m.png' },
  { id: 'kaito', name: 'Kaito Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger6k.png' },
  { id: 'vs_sticks', name: 'VS Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsingerch.png' }
];

const PRIMARY_PROXY = "https://images.weserv.nl/?url=";
const FALLBACK_PROXY = "https://api.allorigins.win/raw?url=";

const CANVAS_SIZE = 400;

// Helper to clamp values
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const PJSKFrameMaker = () => {
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [isFrameLoading, setIsFrameLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isManualInput, setIsManualInput] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  
  // Crop Tool State
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [isCropDragging, setIsCropDragging] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const INNER_RADIUS = (CANVAS_SIZE / 2) - 37;

  // Boundary logic: calculate current limits based on zoom
  const getLimits = useCallback((currentZoom: number) => {
    if (freeMode) {
      // In Free Mode, allow movement across the entire canvas and beyond
      return { min: -CANVAS_SIZE, max: CANVAS_SIZE };
    }
    // The image is now 400x400 squared after the crop step.
    // At zoom = 1, it matches the canvas perfectly.
    // If zoom > 1, the image size is 400 * zoom.
    const limit = (CANVAS_SIZE * currentZoom - CANVAS_SIZE) / 2;
    return { min: -limit, max: limit };
  }, [freeMode]);

  // Clamped setters
  const setClampedZoom = (newZoom: number) => {
    const minZoom = freeMode ? 0.1 : 1;
    const nextZoom = Math.max(minZoom, newZoom);
    setZoom(nextZoom);
    
    // Also re-clamp offsets if zoom decreased or if freeMode changed
    const limits = getLimits(nextZoom);
    setOffset(prev => ({
      x: clamp(prev.x, limits.min, limits.max),
      y: clamp(prev.y, limits.min, limits.max)
    }));
  };

  const setClampedOffset = (newX: number, newY: number) => {
    const limits = getLimits(zoom);
    setOffset({
      x: clamp(newX, limits.min, limits.max),
      y: clamp(newY, limits.min, limits.max)
    });
  };

  useEffect(() => {
    if (selectedFrame.id === 'none' || !selectedFrame.url) {
      setFrameImage(null);
      setIsFrameLoading(false);
      return;
    }
    
    setIsFrameLoading(true);
    let isMounted = true;

    const loadWithFallback = (useFallback: boolean = false) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { if (isMounted) { setFrameImage(img); setIsFrameLoading(false); } };
      img.onerror = () => {
        if (!useFallback) loadWithFallback(true);
        else if (isMounted) { setFrameImage(null); setIsFrameLoading(false); }
      };
      const proxy = useFallback ? FALLBACK_PROXY : PRIMARY_PROXY;
      img.src = `${proxy}${encodeURIComponent(selectedFrame.url)}`;
    };
    loadWithFallback();
    return () => { isMounted = false; };
  }, [selectedFrame]);

  useEffect(() => { drawCanvas(); }, [userImage, frameImage, zoom, offset, rotation]);

  useEffect(() => {
    if ('fonts' in document) { document.fonts.ready.then(() => drawCanvas()); }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (!userImage) return;
      e.preventDefault();
      setClampedZoom(zoom + (-e.deltaY * 0.001));
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [userImage, zoom, freeMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setRawImage(img);
          // Auto-scale to fill crop box initially
          const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
          setCropZoom(scale);
          setCropOffset({ x: 0, y: 0 });
          setShowCropModal(true);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCrop = () => {
    if (!rawImage) return;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = CANVAS_SIZE;
    cropCanvas.height = CANVAS_SIZE;
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const renderWidth = rawImage.width * cropZoom;
    const renderHeight = rawImage.height * cropZoom;
    ctx.drawImage(rawImage, (CANVAS_SIZE / 2) - (renderWidth / 2) + cropOffset.x, (CANVAS_SIZE / 2) - (renderHeight / 2) + cropOffset.y, renderWidth, renderHeight);

    const img = new Image();
    img.onload = () => {
      setUserImage(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      setShowCropModal(false);
    };
    img.src = cropCanvas.toDataURL('image/png');
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `pjsk-frame-${selectedFrame.id}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (userImage) {
      const renderWidth = userImage.width * zoom;
      const renderHeight = userImage.height * zoom;
      ctx.save();
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, INNER_RADIUS + 3, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(CANVAS_SIZE / 2 + offset.x, CANVAS_SIZE / 2 + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(userImage, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
      ctx.restore();
    } else {
      ctx.fillStyle = '#80cbc4';
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, INNER_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#002b2b';
      ctx.font = '700 16px Silkscreen, cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload Photo', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

    if (frameImage) ctx.drawImage(frameImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = CANVAS_SIZE / rect.width;
    setDragStart({ x: clientX * scale - offset.x, y: clientY * scale - offset.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = CANVAS_SIZE / rect.width;
      setClampedOffset(clientX * scale - dragStart.x, clientY * scale - dragStart.y);
    }
  };

  // Crop Interaction
  const handleCropStart = (clientX: number, clientY: number) => {
    setIsCropDragging(true);
    const rect = cropContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = CANVAS_SIZE / rect.width;
    setCropDragStart({ x: clientX * scale - cropOffset.x, y: clientY * scale - cropOffset.y });
  };

  const handleCropMove = (clientX: number, clientY: number) => {
    if (isCropDragging && rawImage) {
      const rect = cropContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = CANVAS_SIZE / rect.width;
      const nextX = clientX * scale - cropDragStart.x;
      const nextY = clientY * scale - cropDragStart.y;
      
      const renderW = rawImage.width * cropZoom;
      const renderH = rawImage.height * cropZoom;
      const limitX = Math.max(0, (renderW - CANVAS_SIZE) / 2);
      const limitY = Math.max(0, (renderH - CANVAS_SIZE) / 2);
      
      setCropOffset({ x: clamp(nextX, -limitX, limitX), y: clamp(nextY, -limitY, limitY) });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 select-none">
      <div className="text-center mb-10 rustic-container px-12 py-6 rounded-sm">
        <h1 className="text-4xl font-bold mb-2">PJSK Frame Maker</h1>
        <p className="text-lg opacity-80">Profile Picture Creator (400x400)</p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Controls */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <section className="rustic-container p-6 space-y-4">
            <h2 className="text-xl font-bold border-b border-[#006666] pb-2 text-[#003333]">1. Upload Image</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 rustic-button font-bold text-lg flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8" />
              <span>Upload Photo</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </section>

          <section className="rustic-container p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#006666] pb-2">
              <h2 className="text-xl font-bold text-[#003333]">2. Adjust Image</h2>
              <div className="flex gap-1">
                <button 
                  onClick={() => setFreeMode(!freeMode)} 
                  className={`p-1.5 transition-colors border ${freeMode ? 'bg-[#ff9800] text-black border-[#e65100]' : 'opacity-60 hover:opacity-100 border-transparent'}`}
                  title={freeMode ? "Disable Free Mode" : "Enable Free Mode (Remove Boundaries)"}
                >
                  {freeMode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsManualInput(!isManualInput)} className={`p-1.5 transition-colors ${isManualInput ? 'bg-[#008080] text-white border border-[#4db6ac]' : 'opacity-60 hover:opacity-100 border-transparent'}`}>
                  {isManualInput ? <SlidersHorizontal className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#003333]">
                  <span>Zoom Level</span>
                  {!isManualInput && <span>{Math.round(zoom * 100)}%</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={zoom} onChange={(e) => setClampedZoom(parseFloat(e.target.value))} min={freeMode ? 0.1 : 1} max={10} step={0.01} className="w-full bg-[#002b2b] border-2 border-[#006666] text-[#b2dfdb] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">x</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setClampedZoom(zoom - 0.1)} />
                    <input type="range" min={freeMode ? 0.1 : 1} max="10" step="0.01" value={zoom} onChange={(e) => setClampedZoom(parseFloat(e.target.value))} className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]" />
                    <ZoomIn className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setClampedZoom(zoom + 0.1)} />
                  </div>
                )}
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#003333]">
                  <span>Rotation</span>
                  {!isManualInput && <span>{Math.round(rotation)}°</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={rotation} onChange={(e) => setRotation(clamp(parseFloat(e.target.value), 0, 360))} min={0} max={360} className="w-full bg-[#002b2b] border-2 border-[#006666] text-[#b2dfdb] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">°</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <RotateCw className="w-5 h-5 opacity-70" />
                    <input type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]" />
                  </div>
                )}
              </div>

              {/* X Position Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#003333]">
                  <span>X Position</span>
                  {!isManualInput && <span>{Math.round(offset.x)}px</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={offset.x} onChange={(e) => setClampedOffset(parseFloat(e.target.value), offset.y)} className="w-full bg-[#002b2b] border-2 border-[#006666] text-[#b2dfdb] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">px</span>
                  </div>
                ) : (
                  <input type="range" min={getLimits(zoom).min} max={getLimits(zoom).max} step="1" value={offset.x} onChange={(e) => setClampedOffset(parseInt(e.target.value), offset.y)} className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]" />
                )}
              </div>

              {/* Y Position Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#003333]">
                  <span>Y Position</span>
                  {!isManualInput && <span>{Math.round(offset.y)}px</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={offset.y} onChange={(e) => setClampedOffset(offset.x, parseFloat(e.target.value))} className="w-full bg-[#002b2b] border-2 border-[#006666] text-[#b2dfdb] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">px</span>
                  </div>
                ) : (
                  <input type="range" min={getLimits(zoom).min} max={getLimits(zoom).max} step="1" value={offset.y} onChange={(e) => setClampedOffset(offset.x, parseInt(e.target.value))} className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]" />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setRotation(0); }} className="py-3 rustic-button text-xs font-bold">Reset Image</button>
              </div>
            </div>
          </section>
        </div>

        {/* Center: The Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className={`mb-4 rustic-glass px-4 py-2 flex items-center gap-2 text-xs font-bold animate-pulse rounded-full shadow-lg ${freeMode ? 'bg-[#ff9800]/20 border-[#e65100]' : 'text-[#003333]'}`}>
             <Info className="w-4 h-4" />
             <span>Drag to move • Scroll to resize • {freeMode ? 'Free Movement Active' : 'Boundary enforced'}</span>
          </div>

          <div 
            ref={containerRef}
            className="relative border-4 border-[#006666] bg-[#002b2b] shadow-2xl p-4 w-[400px] h-[400px] cursor-move overflow-hidden mx-auto"
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {isFrameLoading && (
              <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[#4db6ac]" />
                <span className="font-bold text-sm">Loading Frame...</span>
              </div>
            )}
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-full" />
          </div>
          
          <div className="mt-12 text-center">
            <button onClick={downloadImage} disabled={!userImage || selectedFrame.id === 'none' || isFrameLoading} className="rustic-button py-6 px-12 text-xl font-bold tracking-widest flex items-center gap-4 mx-auto">
              <Download className="w-6 h-6" />
              Download PNG
            </button>
          </div>
        </div>

        {/* Right Side: Frames Selection */}
        <div className="lg:col-span-3 space-y-4 order-3">
          <div className="rustic-container p-6 h-[75vh] flex flex-col">
            <h2 className="text-xl font-bold border-b border-[#006666] pb-2 mb-2 text-[#003333]">3. Select Frame</h2>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-3 flex-1">
              {FRAMES.map((frame) => (
                <button key={frame.id} onClick={() => !isFrameLoading && setSelectedFrame(frame)} disabled={isFrameLoading} className={`flex items-center gap-4 p-3 border-4 transition-all ${selectedFrame.id === frame.id ? 'border-[#006666] bg-[#008080]/30' : 'border-transparent hover:bg-[#008080]/10'} ${isFrameLoading ? 'opacity-50' : ''}`}>
                  <div className="w-14 h-14 bg-white/10 flex-shrink-0 border border-[#006666] p-1 flex items-center justify-center overflow-hidden">
                    {frame.url ? <img src={frame.url} alt={frame.name} className="w-full h-full object-contain" /> : <span className="text-[10px] opacity-40">None</span>}
                  </div>
                  <span className="font-bold text-sm text-left leading-none text-[#003333]">{frame.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="rustic-container max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#006666] pb-4">
              <h2 className="text-2xl font-bold text-[#003333]">Square Crop Tool</h2>
              <button onClick={() => setShowCropModal(false)} className="p-2 hover:bg-black/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <p className="text-sm font-bold opacity-70 text-[#003333]">Adjust your photo to fit the square. This will be your base image.</p>

            <div 
              ref={cropContainerRef}
              className="relative w-[300px] h-[300px] mx-auto border-4 border-[#006666] bg-[#002b2b] overflow-hidden cursor-move"
              onMouseDown={(e) => handleCropStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleCropMove(e.clientX, e.clientY)}
              onMouseUp={() => setIsCropDragging(false)}
              onMouseLeave={() => setIsCropDragging(false)}
            >
              <div 
                className="absolute transition-transform duration-75 pointer-events-none"
                style={{
                  width: rawImage.width * (300/400) * cropZoom,
                  height: rawImage.height * (300/400) * cropZoom,
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${cropOffset.x * (300/400)}px, ${cropOffset.y * (300/400)}px)`,
                }}
              >
                <img src={rawImage.src} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 pointer-events-none border-2 border-[#4db6ac] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <ZoomOut className="w-5 h-5 text-[#003333]" />
                  <input 
                    type="range" 
                    min={Math.max(CANVAS_SIZE / rawImage.width, CANVAS_SIZE / rawImage.height)} 
                    max="5" 
                    step="0.01" 
                    value={cropZoom} 
                    onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                    className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]"
                  />
                  <ZoomIn className="w-5 h-5 text-[#003333]" />
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setShowCropModal(false)} className="flex-1 py-4 rustic-button bg-red-800 border-red-400 font-bold">Cancel</button>
                  <button onClick={confirmCrop} className="flex-1 py-4 rustic-button font-bold flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Confirm Crop
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 mb-12 flex flex-col items-center gap-6">
        <div className="rustic-container px-8 py-4 rounded-sm flex items-center gap-4 hover:scale-105 transition-transform group">
          <Youtube className="w-6 h-6 text-[#006666] group-hover:text-red-600 transition-colors" />
          <a href="https://www.youtube.com/@Fro-g-lock" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline text-[#003333]">my youtube channel</a>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-widest text-center text-[#003333]">Original images from:</div>
          <a href="https://pjsekai.sega.jp/special/download.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold underline hover:text-[#006666] text-[#003333]">pjsekai.sega.jp/special/download.html <ExternalLink className="w-3 h-3" /></a>
        </div>
      </footer>

      {/* Floating GIF */}
      <div className="fixed bottom-2 right-2 z-[100] pointer-events-none drop-shadow-2xl">
        <img 
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmVxdTlmc21mbXhpczhkMGNqYWlscWlodDF5Z2tnaDhxYzJlb2gweiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hlYdK9prwebyiiNAxV/giphy.gif" 
          alt="Dancing PJSK Character"
          className="w-24 md:w-32 h-auto opacity-90 transition-opacity"
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<PJSKFrameMaker />);
