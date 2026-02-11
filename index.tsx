
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Download, ZoomIn, ZoomOut, Move, RotateCw, Info, Loader2, Settings2, SlidersHorizontal, Youtube, ExternalLink, X, Check, Unlock, Lock, Scissors, Palette, Link as LinkIcon } from 'lucide-react';

const FRAMES = [
  { id: 'none', name: 'None', url: '', unit: 'None' },
  { id: 'ichika', name: 'Ichika Fan', url: 'https://u.cubeupload.com/froglock/frameunite011ichika.png', unit: 'Leo/need' },
  { id: 'saki', name: 'Saki Fan', url: 'https://u.cubeupload.com/froglock/frameunite012saki.png', unit: 'Leo/need' },
  { id: 'honami', name: 'Honami Fan', url: 'https://u.cubeupload.com/froglock/frameunite013honami.png', unit: 'Leo/need' },
  { id: 'shiho', name: 'Shiho Fan', url: 'https://u.cubeupload.com/froglock/frameunite014shiho.png', unit: 'Leo/need' },
  { id: 'leo_sticks', name: 'Leo/need Fan', url: 'https://u.cubeupload.com/froglock/frameunite01cheer.png', unit: 'Leo/need' },
  { id: 'minori', name: 'Minori Fan', url: 'https://u.cubeupload.com/froglock/frameunite021minori.png', unit: 'MORE MORE JUMP!' },
  { id: 'haruka', name: 'Haruka Fan', url: 'https://u.cubeupload.com/froglock/frameunite022haruka.png', unit: 'MORE MORE JUMP!' },
  { id: 'airi', name: 'Airi Fan', url: 'https://u.cubeupload.com/froglock/frameunite023airi.png', unit: 'MORE MORE JUMP!' },
  { id: 'shizuku', name: 'Shizuku Fan', url: 'https://u.cubeupload.com/froglock/frameunite024shizuku.png', unit: 'MORE MORE JUMP!' },
  { id: 'mmj_sticks', name: 'MMJ! Fan', url: 'https://u.cubeupload.com/froglock/frameunite02cheer.png', unit: 'MORE MORE JUMP!' },
  { id: 'kohane', name: 'Kohane Fan', url: 'https://u.cubeupload.com/froglock/frameunite031kohane.png', unit: 'Vivid BAD SQUAD' },
  { id: 'an', name: 'An Fan', url: 'https://u.cubeupload.com/froglock/frameunite032an.png', unit: 'Vivid BAD SQUAD' },
  { id: 'akito', name: 'Akito Fan', url: 'https://u.cubeupload.com/froglock/frameunite033akito.png', unit: 'Vivid BAD SQUAD' },
  { id: 'toya', name: 'Toya Fan', url: 'https://u.cubeupload.com/froglock/frameunite034toya.png', unit: 'Vivid BAD SQUAD' },
  { id: 'vbs_sticks', name: 'VBS Fan', url: 'https://u.cubeupload.com/froglock/frameunite03cheer.png', unit: 'Vivid BAD SQUAD' },
  { id: 'tsukasa', name: 'Tsukasa Fan', url: 'https://u.cubeupload.com/froglock/frameunite041tsukasa.png', unit: 'Wonderlands x Showtime' },
  { id: 'emu', name: 'Emu Fan', url: 'https://u.cubeupload.com/froglock/frameunite042emu.png', unit: 'Wonderlands x Showtime' },
  { id: 'nene', name: 'Nene Fan', url: 'https://u.cubeupload.com/froglock/frameunite043nene.png', unit: 'Wonderlands x Showtime' },
  { id: 'rui', name: 'Rui Fan', url: 'https://u.cubeupload.com/froglock/frameunite044rui.png', unit: 'Wonderlands x Showtime' },
  { id: 'wxs_sticks', name: 'WxS Fan', url: 'https://u.cubeupload.com/froglock/frameunite04cheer.png', unit: 'Wonderlands x Showtime' },
  { id: 'kanade', name: 'Kanade Fan', url: 'https://u.cubeupload.com/froglock/frameunite051kanade.png', unit: 'Nightcord at 25:00' },
  { id: 'mafuyu', name: 'Mafuyu Fan', url: 'https://u.cubeupload.com/froglock/frameunite052mafuyu.png', unit: 'Nightcord at 25:00' },
  { id: 'ena', name: 'Ena Fan', url: 'https://u.cubeupload.com/froglock/frameunite053ena.png', unit: 'Nightcord at 25:00' },
  { id: 'mizuki', name: 'Mizuki Fan', url: 'https://u.cubeupload.com/froglock/frameunite054mizuki.png', unit: 'Nightcord at 25:00' },
  { id: 'n25_sticks', name: 'N25 Fan', url: 'https://u.cubeupload.com/froglock/frameunite05cheer.png', unit: 'Nightcord at 25:00' },
  { id: 'miku', name: 'Miku Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger1m.png', unit: 'Virtual Singer' },
  { id: 'rin', name: 'Rin Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger2r.png', unit: 'Virtual Singer' },
  { id: 'len', name: 'Len Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger3l.png', unit: 'Virtual Singer' },
  { id: 'luka', name: 'Luka Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger4l.png', unit: 'Virtual Singer' },
  { id: 'meiko', name: 'Meiko Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger5m.png', unit: 'Virtual Singer' },
  { id: 'kaito', name: 'Kaito Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsinger6k.png', unit: 'Virtual Singer' },
  { id: 'vs_sticks', name: 'VS Fan', url: 'https://u.cubeupload.com/froglock/framevirtualsingerch.png', unit: 'Virtual Singer' }
];

const PRIMARY_PROXY = "https://images.weserv.nl/?url=";
const FALLBACK_PROXY = "https://api.allorigins.win/raw?url=";

const CANVAS_SIZE = 400;

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const BackgroundAnimation = ({ theme }: { theme: 'rustic' | 'original' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;

    const triangles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      points: { x: number, y: number }[];
    }[] = [];

    const colors = theme === 'original' 
      ? ['#008080', '#4db6ac', '#004d4d', '#003333'] 
      : ['#525D37', '#5A604B', '#45483F', '#61685C'];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const createTriangle = (isInitial = false) => {
      const size = Math.random() * 100 + 30;
      let x, y;
      if (isInitial) {
        x = Math.random() * w;
        y = Math.random() * h;
      } else {
        if (Math.random() > 0.5) {
          x = w + size;
          y = Math.random() * (h + size);
        } else {
          x = Math.random() * (w + size);
          y = h + size;
        }
      }
      
      return {
        x,
        y,
        size,
        speed: Math.random() * 1.2 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        opacity: Math.random() * 0.12 + 0.04,
        points: (Array.from({ length: 3 }) as any[]).map(() => ({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        }))
      };
    };

    const init = () => {
      resize();
      triangles.length = 0;
      for (let i = 0; i < 45; i++) {
        triangles.push(createTriangle(true));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      triangles.forEach((t, i) => {
        t.x -= t.speed;
        t.y -= t.speed;
        t.rotation += t.rotationSpeed;

        if (t.x < -t.size || t.y < -t.size) {
          triangles[i] = createTriangle();
        }

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        ctx.beginPath();
        
        const color = colors[i % colors.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = t.opacity;

        ctx.moveTo(t.points[0].x * t.size, t.points[0].y * t.size);
        ctx.lineTo(t.points[1].x * t.size, t.points[1].y * t.size);
        ctx.lineTo(t.points[2].x * t.size, t.points[2].y * t.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => {
        resize();
        while (triangles.length < 45) triangles.push(createTriangle(true));
    });
    
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

// Raw URLs for the logos
const RAW_MIKU_LOGO_URL = 'https://u.cubeupload.com/froglock/289logoPJSKpfpframemake.png';
const RAW_FROG_LOGO_URL = 'https://u.cubeupload.com/froglock/logoPJSKpfpframemake.png';

const PJSKFrameMaker = () => {
  const [theme, setTheme] = useState<'rustic' | 'original'>(() => {
    return (localStorage.getItem('pjsk-theme') as 'rustic' | 'original') || 'original';
  });

  const [isFontLoaded, setIsFontLoaded] = useState(false);
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
  const [autoCrop, setAutoCrop] = useState(true);

  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [isCropDragging, setIsCropDragging] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });

  // State for proxied logo URLs - now initialized directly
  const [mikuLogoSrc] = useState(
    `${PRIMARY_PROXY}${encodeURIComponent(RAW_MIKU_LOGO_URL)}`
  );
  const [frogLogoSrc] = useState(
    `${PRIMARY_PROXY}${encodeURIComponent(RAW_FROG_LOGO_URL)}`
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const INNER_RADIUS = (CANVAS_SIZE / 2) - 37;

  // Handle global font preloading
  useEffect(() => {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setIsFontLoaded(true);
      });
    } else {
      // Fallback for browsers that don't support Font Loading API
      setIsFontLoaded(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pjsk-theme', theme);
  }, [theme]);

  const getLimits = useCallback((currentZoom: number) => {
    if (freeMode || !userImage) {
      return { xMin: -CANVAS_SIZE * 2, xMax: CANVAS_SIZE * 2, yMin: -CANVAS_SIZE * 2, yMax: CANVAS_SIZE * 2 };
    }
    const w = userImage.width * currentZoom;
    const h = userImage.height * currentZoom;
    const limitX = Math.max(0, (w - CANVAS_SIZE) / 2);
    const limitY = Math.max(0, (h - CANVAS_SIZE) / 2);
    return { xMin: -limitX, xMax: limitX, yMin: -limitY, yMax: limitY };
  }, [freeMode, userImage]);

  const setClampedZoom = (newZoom: number) => {
    const minZoomNeeded = userImage 
      ? Math.max(CANVAS_SIZE / userImage.width, CANVAS_SIZE / userImage.height)
      : 1;
    const minZoom = freeMode ? 0.01 : minZoomNeeded;
    const nextZoom = Math.max(minZoom, newZoom);
    setZoom(nextZoom);
    const limits = getLimits(nextZoom);
    setOffset(prev => ({
      x: clamp(prev.x, limits.xMin, limits.xMax),
      y: clamp(prev.y, limits.yMin, limits.yMax)
    }));
  };

  const setClampedOffset = (newX: number, newY: number) => {
    const limits = getLimits(zoom);
    setOffset({
      x: clamp(newX, limits.xMin, limits.xMax),
      y: clamp(newY, limits.yMin, limits.yMax)
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

  useEffect(() => { drawCanvas(); }, [userImage, frameImage, zoom, offset, rotation, theme, isFontLoaded]);

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
          if (autoCrop) {
            setRawImage(img);
            const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
            setCropZoom(scale);
            setCropOffset({ x: 0, y: 0 });
            setShowCropModal(true);
          } else {
            setUserImage(img);
            const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
            setZoom(scale);
            setOffset({ x: 0, y: 0 });
            setRotation(0);
          }
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
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim();
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
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--placeholder').trim() || '#61685C';
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, INNER_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#f0f0f0';
      ctx.font = '700 16px PJSKFont, sans-serif';
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

  const groupedFrames = useMemo(() => {
    const groups: Record<string, typeof FRAMES> = {};
    FRAMES.forEach(frame => {
      if (!groups[frame.unit]) groups[frame.unit] = [];
      groups[frame.unit].push(frame);
    });
    return groups;
  }, []);

  const currentLimits = getLimits(zoom);

  // Main initial loading screen
  if (!isFontLoaded) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-main)] flex flex-col items-center justify-center gap-6 z-[9999]">
        <div className="text-4xl font-bold animate-pulse tracking-widest text-[var(--text-main)]">PJSK</div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-bold opacity-60 uppercase tracking-[0.2em]">Loading Assets</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 select-none relative overflow-hidden">
      <BackgroundAnimation theme={theme} />
      
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setTheme(theme === 'rustic' ? 'original' : 'rustic')}
          className="rustic-button flex items-center gap-2 px-4 py-2 text-sm font-bold"
        >
          <Palette className="w-4 h-4" />
          {theme === 'rustic' ? 'Switch to Miku Mode' : 'Switch to Frog Mode'}
        </button>
      </div>

      {/* Logos moved to the very top and increased size */}
      <div className="relative w-full h-[240px] mx-auto text-center mb-10 z-10">
        <img
          src={mikuLogoSrc}
          alt="PJSK Frame Maker Miku Mode Logo"
          className={`absolute inset-0 mx-auto h-full object-contain transition-opacity duration-500 ${theme === 'original' ? 'opacity-100' : 'opacity-0'}`}
        />
        <img
          src={frogLogoSrc}
          alt="PJSK Frame Maker Frog Mode Logo"
          className={`absolute inset-0 mx-auto h-full object-contain transition-opacity duration-500 ${theme === 'rustic' ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <section className="rustic-container p-6 space-y-4">
            <h2 className="text-xl font-bold border-b border-[var(--border-main)] pb-2">1. Upload Image</h2>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 rustic-button font-bold text-lg flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8" />
                <span>Upload Photo</span>
              </button>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={autoCrop} 
                    onChange={() => setAutoCrop(!autoCrop)} 
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${autoCrop ? 'bg-[var(--accent)]' : 'bg-[var(--border-main)]'}`}></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoCrop ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold flex items-center gap-1">
                    <Scissors className="w-3 h-3" /> Enable Cropping
                  </span>
                </div>
              </label>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </section>

          <section className="rustic-container p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-2">
              <h2 className="text-xl font-bold">2. Adjust Image</h2>
              <div className="flex gap-1">
                <button 
                  onClick={() => setFreeMode(!freeMode)} 
                  className={`p-1.5 transition-colors border ${freeMode ? 'bg-yellow-500 text-black border-yellow-600' : 'opacity-60 hover:opacity-100 border-transparent'}`}
                  title={freeMode ? "Disable Free Mode" : "Enable Free Mode"}
                >
                  {freeMode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsManualInput(!isManualInput)} className={`p-1.5 transition-colors ${isManualInput ? 'bg-[var(--accent)] text-white border border-[var(--bg-button-hover)]' : 'opacity-60 hover:opacity-100 border-transparent'}`}>
                  {isManualInput ? <SlidersHorizontal className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                  <span>Zoom Level</span>
                  {!isManualInput && <span>{Math.round(zoom * 100)}%</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={zoom} onChange={(e) => setClampedZoom(parseFloat(e.target.value))} min={0.01} max={10} step={0.01} className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">x</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setClampedZoom(zoom - 0.1)} />
                    <input type="range" min="0.01" max="10" step="0.01" value={zoom} onChange={(e) => setClampedZoom(parseFloat(e.target.value))} className="w-full h-4 rounded-none appearance-none cursor-pointer" />
                    <ZoomIn className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setClampedZoom(zoom + 0.1)} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                  <span>Rotation</span>
                  {!isManualInput && <span>{Math.round(rotation)}°</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={rotation} onChange={(e) => setRotation(clamp(parseFloat(e.target.value), 0, 360))} min={0} max={360} className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">°</span>
                  </div>
                ) : (
                  <input type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="w-full h-4 rounded-none appearance-none cursor-pointer" />
                  )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                  <span>X Position</span>
                  {!isManualInput && <span>{Math.round(offset.x)}px</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={offset.x} onChange={(e) => setClampedOffset(parseFloat(e.target.value), offset.y)} className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">px</span>
                  </div>
                ) : (
                  <input type="range" min={currentLimits.xMin} max={currentLimits.xMax} step="1" value={offset.x} onChange={(e) => setClampedOffset(parseInt(e.target.value), offset.y)} className="w-full h-4 rounded-none appearance-none cursor-pointer" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                  <span>Y Position</span>
                  {!isManualInput && <span>{Math.round(offset.y)}px</span>}
                </div>
                {isManualInput ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={offset.y} onChange={(e) => setClampedOffset(offset.x, parseFloat(e.target.value))} className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] px-2 py-1 font-bold text-sm focus:outline-none" />
                    <span className="text-xs font-bold opacity-60">px</span>
                  </div>
                ) : (
                  <input type="range" min={currentLimits.yMin} max={currentLimits.yMax} step="1" value={offset.y} onChange={(e) => setClampedOffset(offset.x, parseInt(e.target.value))} className="w-full h-4 rounded-none appearance-none cursor-pointer" />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setRotation(0); }} className="py-3 rustic-button text-xs font-bold">Reset Image</button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className={`mb-4 rustic-glass px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-full shadow-lg transition-colors ${freeMode ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-100 shadow-yellow-400/20' : (theme === 'rustic' ? 'bg-[var(--accent)]/30 border-[var(--bg-button-hover)]' : '')}`}>
             <Info className="w-4 h-4" />
             <span>Drag to move • Scroll to resize • {freeMode ? 'Free Mode' : 'Boundary Mode'}</span>
          </div>

          <div 
            ref={containerRef}
            className="relative border-4 border-[var(--border-main)] bg-[var(--bg-main)] shadow-2xl p-4 w-[400px] h-[400px] cursor-move overflow-hidden mx-auto transition-colors duration-300"
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {isFrameLoading && (
              <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-white gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)]" />
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

        <div className="lg:col-span-3 space-y-4 order-3">
          <div className="rustic-container p-6 h-[75vh] flex flex-col">
            <h2 className="text-xl font-bold border-b border-[var(--border-main)] pb-2 mb-2">3. Select Frame</h2>
            <div className="overflow-y-auto pr-3 flex-1 space-y-6">
              {(Object.entries(groupedFrames) as [string, typeof FRAMES][]).map(([unitName, frames]) => (
                <div key={unitName} className="space-y-3">
                  <div className="sticky top-0 z-10 bg-[var(--bg-container)] border-b-2 border-[var(--border-main)] py-1 mb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-60">{unitName}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {(frames as any[]).map((frame) => (
                      <button 
                        key={frame.id} 
                        onClick={() => !isFrameLoading && setSelectedFrame(frame)} 
                        disabled={isFrameLoading} 
                        className={`flex items-center gap-4 p-2 border-4 transition-all ${selectedFrame.id === frame.id ? 'border-[var(--accent)] bg-[var(--accent)]/30' : 'border-transparent hover:bg-[var(--accent)]/10'} ${isFrameLoading ? 'opacity-50' : ''}`}
                      >
                        <div className="w-12 h-12 bg-white/10 flex-shrink-0 border border-[var(--border-main)] p-1 flex items-center justify-center overflow-hidden">
                          {frame.url ? <img src={frame.url} alt={frame.name} className="w-full h-full object-contain" /> : <span className="text-[10px] opacity-40">None</span>}
                        </div>
                        <span className="font-bold text-xs text-left leading-tight">{frame.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCropModal && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="rustic-container max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-4">
              <h2 className="text-2xl font-bold">Square Crop Tool</h2>
              <button onClick={() => setShowCropModal(false)} className="p-2 hover:bg-black/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <p className="text-sm font-bold opacity-70">Adjust your photo to fit the square.</p>

            <div 
              ref={cropContainerRef}
              className="relative w-[300px] h-[300px] mx-auto border-4 border-[var(--border-main)] bg-[var(--bg-main)] overflow-hidden cursor-move transition-colors duration-300"
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
              <div className="absolute inset-0 pointer-events-none border-2 border-[var(--accent)] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <ZoomOut className="w-5 h-5" />
                  <input 
                    type="range" 
                    min={Math.max(CANVAS_SIZE / rawImage.width, CANVAS_SIZE / rawImage.height)} 
                    max="5" 
                    step="0.01" 
                    value={cropZoom} 
                    onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                    className="w-full h-4 rounded-none appearance-none cursor-pointer"
                  />
                  <ZoomIn className="w-5 h-5" />
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setShowCropModal(false)} className="flex-1 py-4 rustic-button bg-red-900 border-red-400 font-bold">Cancel</button>
                  <button onClick={confirmCrop} className="flex-1 py-4 rustic-button font-bold flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Confirm Crop
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 mb-12 flex flex-col items-center gap-6 relative z-10">
        <div className="rustic-container px-8 py-4 rounded-sm flex items-center gap-4 hover:scale-105 transition-transform group">
          <LinkIcon className="w-6 h-6 group-hover:text-[var(--accent)] transition-colors" />
          <a href="https://linktr.ee/froggolock" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">my links</a>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-widest text-center">Original images from:</div>
          <a href="https://pjsekai.sega.jp/special/download.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold underline hover:text-[var(--accent)]">pjsekai.sega.jp/special/download.html <ExternalLink className="w-3 h-3" /></a>
        </div>
      </footer>

      <div className="fixed bottom-2 right-2 z-[100] pointer-events-none drop-shadow-2xl">
        <img 
          src={theme === 'rustic' 
            ? "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTM0d2l4ZHd3Y29qbGc2eG9haHJ4NGYyODkycHR1aTI0ZG9nNHNmNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NuEDbNMHnCCaj08amo/giphy.gif"
            : "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHBuZ3d0aGVvYjJzbmp3cm53anN2MHZicHN0bmcweXUxNTZ2Ym1yYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Hz0bSgnAydGFvzDewo/giphy.gif"
          } 
          alt="Dancing Character"
          className="w-24 md:w-32 h-auto opacity-90 transition-opacity"
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<PJSKFrameMaker />);
