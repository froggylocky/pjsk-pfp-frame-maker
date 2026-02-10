
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Download, ZoomIn, ZoomOut, Move, RotateCw, Info, Loader2, Settings2, SlidersHorizontal, Youtube } from 'lucide-react';

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

// Use images.weserv.nl - it's a high-performance image proxy with CORS support
const PRIMARY_PROXY = "https://images.weserv.nl/?url=";
const FALLBACK_PROXY = "https://api.allorigins.win/raw?url=";

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
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CANVAS_SIZE = 400;
  const INNER_RADIUS = (CANVAS_SIZE / 2) - 37;

  // Optimized image loading effect with multiple proxy attempts
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
      
      img.onload = () => {
        if (isMounted) {
          setFrameImage(img);
          setIsFrameLoading(false);
        }
      };
      
      img.onerror = () => {
        if (!useFallback) {
          console.warn(`Primary proxy failed for ${selectedFrame.name}. Trying fallback...`);
          loadWithFallback(true);
        } else {
          console.error(`All proxies failed to load frame: ${selectedFrame.name}`);
          if (isMounted) {
            setFrameImage(null);
            setIsFrameLoading(false);
            // Only alert if both proxies completely failed
            alert(`Could not load frame "${selectedFrame.name}". The image provider may be down or blocking the request.`);
          }
        }
      };
      
      const proxy = useFallback ? FALLBACK_PROXY : PRIMARY_PROXY;
      // weserv works best with encoded URLs
      img.src = `${proxy}${encodeURIComponent(selectedFrame.url)}`;
    };
    
    loadWithFallback();
    
    return () => { isMounted = false; };
  }, [selectedFrame]);

  useEffect(() => {
    drawCanvas();
  }, [userImage, frameImage, zoom, offset, rotation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!userImage) return;
      e.preventDefault();
      const zoomSpeed = 0.001;
      const delta = -e.deltaY;
      setZoom(prev => Math.min(Math.max(0.1, prev + delta * zoomSpeed), 5));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [userImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setUserImage(img);
          autoFill(img);
          setOffset({ x: 0, y: 0 });
          setRotation(0);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const autoFill = (img: HTMLImageElement) => {
    const frameSize = INNER_RADIUS * 2;
    const scaleX = frameSize / img.width;
    const scaleY = frameSize / img.height;
    setZoom(Math.max(scaleX, scaleY) * 1.05);
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
      ctx.font = '16px Silkscreen';
      ctx.textAlign = 'center';
      ctx.fillText('Upload Photo', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

    if (frameImage) {
      ctx.drawImage(frameImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = CANVAS_SIZE / rect.width;
    setDragStart({ 
      x: clientX * scale - offset.x, 
      y: clientY * scale - offset.y 
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = CANVAS_SIZE / rect.width;
      setOffset({
        x: clientX * scale - dragStart.x,
        y: clientY * scale - dragStart.y
      });
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = `pjsk-pfp-400x400.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error("Download failed.", e);
      alert("Export failed. Try refreshing the page or using a different frame.");
    }
  };

  const handleManualValue = (setter: (val: number) => void, val: string, min: number, max: number) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setter(Math.min(max, Math.max(min, num)));
    }
  };

  const NumberInput = ({ value, onChange, min, max, step = 1, suffix = "" }: { value: number, onChange: (v: string) => void, min: number, max: number, step?: number, suffix?: string }) => (
    <div className="flex items-center gap-2">
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="w-full bg-[#002b2b] border-2 border-[#006666] text-[#b2dfdb] px-2 py-1 font-bold text-sm focus:outline-none focus:border-[#4db6ac]"
      />
      {suffix && <span className="text-xs font-bold opacity-60 min-w-[1.5rem]">{suffix}</span>}
    </div>
  );

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
            <h2 className="text-xl font-bold border-b border-[#006666] pb-2">1. Upload Image</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 rustic-button font-bold text-lg flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8" />
              <span>Upload Photo</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </section>

          <section className="rustic-container p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#006666] pb-2">
              <h2 className="text-xl font-bold">2. Adjust Image</h2>
              <button 
                onClick={() => setIsManualInput(!isManualInput)}
                className={`p-1.5 transition-colors ${isManualInput ? 'bg-[#008080] text-white border border-[#4db6ac]' : 'opacity-60 hover:opacity-100'}`}
                title={isManualInput ? "Switch to Sliders" : "Manual Input Mode"}
              >
                {isManualInput ? <SlidersHorizontal className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Zoom Level</span>
                  {!isManualInput && <span>{Math.round(zoom * 100)}%</span>}
                </div>
                {isManualInput ? (
                  <NumberInput 
                    value={zoom} 
                    onChange={(v) => handleManualValue(setZoom, v, 0.1, 5)} 
                    min={0.1} max={5} step={0.01} suffix="x" 
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} />
                    <input 
                      type="range" 
                      min="0.1" 
                      max="5" 
                      step="0.01" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]"
                    />
                    <ZoomIn className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setZoom(z => Math.min(5, z + 0.1))} />
                  </div>
                )}
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Rotation</span>
                  {!isManualInput && <span>{Math.round(rotation)}°</span>}
                </div>
                {isManualInput ? (
                  <NumberInput 
                    value={rotation} 
                    onChange={(v) => handleManualValue(setRotation, v, 0, 360)} 
                    min={0} max={360} suffix="°" 
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <RotateCw className="w-5 h-5 opacity-70" />
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      step="1" 
                      value={rotation} 
                      onChange={(e) => setRotation(parseFloat(e.target.value))}
                      className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]"
                    />
                  </div>
                )}
              </div>

              {/* X Position Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>X Position</span>
                  {!isManualInput && <span>{Math.round(offset.x)}px</span>}
                </div>
                {isManualInput ? (
                  <NumberInput 
                    value={offset.x} 
                    onChange={(v) => handleManualValue((val) => setOffset(p => ({...p, x: val})), v, -CANVAS_SIZE, CANVAS_SIZE)} 
                    min={-CANVAS_SIZE} max={CANVAS_SIZE} suffix="px" 
                  />
                ) : (
                  <input 
                    type="range" 
                    min={-CANVAS_SIZE} 
                    max={CANVAS_SIZE} 
                    step="1" 
                    value={offset.x} 
                    onChange={(e) => setOffset(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]"
                  />
                )}
              </div>

              {/* Y Position Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Y Position</span>
                  {!isManualInput && <span>{Math.round(offset.y)}px</span>}
                </div>
                {isManualInput ? (
                  <NumberInput 
                    value={offset.y} 
                    onChange={(v) => handleManualValue((val) => setOffset(p => ({...p, y: val})), v, -CANVAS_SIZE, CANVAS_SIZE)} 
                    min={-CANVAS_SIZE} max={CANVAS_SIZE} suffix="px" 
                  />
                ) : (
                  <input 
                    type="range" 
                    min={-CANVAS_SIZE} 
                    max={CANVAS_SIZE} 
                    step="1" 
                    value={offset.y} 
                    onChange={(e) => setOffset(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full h-4 bg-[#006666] rounded-none appearance-none cursor-pointer accent-[#4db6ac]"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={() => userImage && autoFill(userImage)}
                  disabled={!userImage}
                  className="py-3 rustic-button text-xs font-bold disabled:opacity-50"
                >
                  Fit Frame
                </button>
                <button 
                  onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setRotation(0); }}
                  className="py-3 rustic-button text-xs font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Center: The Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          {/* Interaction Tooltip */}
          <div className="mb-4 rustic-glass px-4 py-2 flex items-center gap-2 text-xs font-bold tracking-tight animate-pulse border-none rounded-full shadow-lg">
             <Info className="w-4 h-4 text-[#006666]" />
             <span>Drag to move • Scroll to resize</span>
          </div>

          {/* Display container constrained to 400x400 */}
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
            style={{ width: '400px', height: '400px' }}
          >
            {isFrameLoading && (
              <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[#4db6ac]" />
                <span className="font-bold text-sm">Loading Frame...</span>
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              width={CANVAS_SIZE} 
              height={CANVAS_SIZE} 
              className="w-full h-full"
            />
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={downloadImage}
              disabled={!userImage || selectedFrame.id === 'none' || isFrameLoading}
              className="rustic-button py-6 px-12 text-xl font-bold tracking-widest flex items-center gap-4 mx-auto"
            >
              <Download className="w-6 h-6" />
              Download PNG
            </button>
            {selectedFrame.id === 'none' && userImage && (
              <p className="mt-2 text-xs font-bold text-red-400">Please select a frame to export!</p>
            )}
            {isFrameLoading && (
              <p className="mt-2 text-xs font-bold text-[#4db6ac]">Waiting for frame to load...</p>
            )}
          </div>
        </div>

        {/* Right Side: Frames Selection */}
        <div className="lg:col-span-3 space-y-4 order-3">
          <div className="rustic-container p-6 h-[75vh] flex flex-col">
            <h2 className="text-xl font-bold border-b border-[#006666] pb-2 mb-2">3. Select Frame</h2>
            <p className="text-[10px] text-red-600 font-bold mb-4 italic">
              Warning: Frames may take a few seconds to load.
            </p>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-3 flex-1">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => !isFrameLoading && setSelectedFrame(frame)}
                  disabled={isFrameLoading}
                  className={`flex items-center gap-4 p-3 border-4 transition-all ${
                    selectedFrame.id === frame.id 
                      ? 'border-[#006666] bg-[#008080]/30' 
                      : 'border-transparent hover:bg-[#008080]/10'
                  } ${isFrameLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-14 h-14 bg-white/10 flex-shrink-0 border border-[#006666] p-1 flex items-center justify-center overflow-hidden">
                    {frame.url ? (
                      <img 
                        src={frame.url} 
                        alt={frame.name}
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <span className="text-[10px] opacity-40">None</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-left leading-none">{frame.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <footer className="mt-16 mb-8 rustic-container px-8 py-4 rounded-sm flex items-center gap-4 hover:scale-105 transition-transform group">
        <Youtube className="w-6 h-6 text-[#006666] group-hover:text-red-600 transition-colors" />
        <a 
          href="https://www.youtube.com/@Fro-g-lock" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-lg font-bold hover:underline underline-offset-4"
        >
          my youtube channel
        </a>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<PJSKFrameMaker />);
