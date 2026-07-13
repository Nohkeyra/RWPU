import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Tv, 
  MousePointer, 
  Subtitles, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  Check, 
  Building, 
  Info
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type SceneId = 'landing' | 'order_form' | 'success_checklist' | 'member_portal';

interface WalkthroughStep {
  time: number; // in seconds
  scene: SceneId;
  action: string;
  subtitlesEn: string;
  subtitlesBm: string;
  typingText?: {
    field: string;
    value: string;
  };
  scrollPos?: number; // percentage
  clickTarget?: string; // id of simulated button
}

export function PromoStudio() {
  const { language } = useLanguage();
  const [activeScene, setActiveScene] = useState<SceneId>('landing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  
  // Simulation states
  const [simName, setSimName] = useState('');
  const [simCompany, setSimCompany] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [successChecked, setSuccessChecked] = useState<boolean[]>([false, false, false]);

  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Script definitions for the automated video campaign walkthrough
  const scriptSteps: WalkthroughStep[] = [
    {
      time: 0,
      scene: 'landing',
      action: 'Showcase beautiful hero visual and auto-scroll',
      subtitlesEn: 'Planning an event or private banquet? Booking catering is now easier than ever.',
      subtitlesBm: 'Merancang majlis korporat atau kenduri peribadi? Tempahan katering kini jauh lebih mudah.',
      scrollPos: 0
    },
    {
      time: 5,
      scene: 'landing',
      action: 'Scroll down to menu packages',
      subtitlesEn: 'Discover our customizable buffet selections and authentic local heritage menus.',
      subtitlesBm: 'Terokai pelbagai hidangan bufet tempatan yang lazat dan boleh disesuaikan.',
      scrollPos: 40
    },
    {
      time: 10,
      scene: 'landing',
      action: 'Click order button',
      subtitlesEn: 'Tap the Book Now button to launch our smart catering engine.',
      subtitlesBm: 'Tekan butang Tempah Sekarang untuk memulakan sistem tempahan pintar kami.',
      scrollPos: 90,
      clickTarget: 'book_now_btn'
    },
    {
      time: 14,
      scene: 'order_form',
      action: 'Load form & start filling name',
      subtitlesEn: 'Fill in your billing and event details directly in under two minutes.',
      subtitlesBm: 'Isi butiran majlis dan profil pengebilan anda dalam masa kurang dari 2 minit.',
      typingText: { field: 'name', value: 'Mohammad Nor' }
    },
    {
      time: 18,
      scene: 'order_form',
      action: 'Fill company details',
      subtitlesEn: 'Add your company name for custom corporate invoicing.',
      subtitlesBm: 'Masukkan nama organisasi anda untuk invois korporat rasmi.',
      typingText: { field: 'company', value: 'Amanah Capital Berhad' }
    },
    {
      time: 23,
      scene: 'order_form',
      action: 'Choose menu packages & pax size',
      subtitlesEn: 'Select your package and adjust guest numbers. Our pricing is fully transparent.',
      subtitlesBm: 'Pilih pakej sajian dan jumlah tetamu. Harga dipaparkan secara telus.',
      clickTarget: 'premium_package'
    },
    {
      time: 28,
      scene: 'order_form',
      action: 'Submit booking order',
      subtitlesEn: 'Confirm and submit. No long calls, no paperwork delays.',
      subtitlesBm: 'Sahkan dan hantar tempahan anda secara terus tanpa sebarang kelambatan.',
      clickTarget: 'submit_btn'
    },
    {
      time: 32,
      scene: 'success_checklist',
      action: 'Display success validation screen',
      subtitlesEn: 'Success! Our system immediately starts processing your automated catering request.',
      subtitlesBm: 'Selesai! Sistem kami mula memproses pesanan katering anda secara serta-merta.',
    },
    {
      time: 36,
      scene: 'success_checklist',
      action: 'Verify instant PDF generated',
      subtitlesEn: 'First, a professional preliminary PDF invoice is generated instantly.',
      subtitlesBm: 'Pertama, sebut harga dan invois PDF rasmi dijana secara terus.',
    },
    {
      time: 41,
      scene: 'success_checklist',
      action: 'Trigger direct email delivery confirmation',
      subtitlesEn: 'Second, a secure invoice receipt is delivered straight to your email inbox.',
      subtitlesBm: 'Kedua, salinan invois dihantar terus ke peti masuk emel anda.',
    },
    {
      time: 46,
      scene: 'member_portal',
      action: 'Open exclusive member dashboard',
      subtitlesEn: 'Create a membership to secure your booking histories and manage multiple business profiles.',
      subtitlesBm: 'Daftar sebagai ahli untuk menyimpan sejarah tempahan dan mengurus profil syarikat.',
      scrollPos: 0
    },
    {
      time: 51,
      scene: 'member_portal',
      action: 'Scroll through corporate profiles',
      subtitlesEn: 'Switch billing PIC details instantly and track pending order statuses in one secure hub.',
      subtitlesBm: 'Tukar butiran pembayar dengan mudah dan jejaki status tempahan terkini anda.',
      scrollPos: 60
    },
    {
      time: 56,
      scene: 'member_portal',
      action: 'Outro promo display',
      subtitlesEn: 'Catering made effortless. Experience Restoran Wawasan Catering Portal today!',
      subtitlesBm: 'Tempahan katering tanpa sempadan. Cubalah Portal Restoran Wawasan hari ini!',
      scrollPos: 100
    }
  ];

  // Current active step calculation
  const currentStepIndex = scriptSteps.reduce((acc, step, index) => {
    if (currentTime >= step.time) return index;
    return acc;
  }, 0);
  const currentStep = scriptSteps[currentStepIndex];

  // Play / Pause timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1000 / speed;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 60) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  const triggerSimulatedClick = useCallback((delayMs: number) => {
    setTimeout(() => {
      setIsCursorClicking(true);
      setTimeout(() => setIsCursorClicking(false), 200);
    }, delayMs);
  }, []);

  // Handle side-effects of step transitions (automatic screen rendering in mockup)
  useEffect(() => {
    if (!currentStep) return;

    // Switch scene automatically
    if (currentStep.scene !== activeScene) {
      setActiveScene(currentStep.scene);
    }

    // Typing simulated text
    if (currentStep.typingText) {
      const { field, value } = currentStep.typingText;
      let i = 0;
      const interval = setInterval(() => {
        if (i <= value.length) {
          if (field === 'name') setSimName(value.slice(0, i));
          if (field === 'company') setSimCompany(value.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 70);
      return () => clearInterval(interval);
    } else {
      // Clear or set defaults
      if (currentStep.scene === 'landing') {
        setSimName('');
        setSimCompany('');
        setSuccessChecked([false, false, false]);
      }
    }

    // Checklist triggers
    if (currentStep.scene === 'success_checklist') {
      const elapsed = currentTime - currentStep.time;
      if (elapsed >= 0) {
        setSuccessChecked([true, false, false]);
      }
      if (elapsed >= 3) {
        setSuccessChecked([true, true, false]);
      }
      if (elapsed >= 6) {
        setSuccessChecked([true, true, true]);
      }
    }

    // Cursor position simulation
    if (showCursor) {
      if (currentStep.clickTarget === 'book_now_btn') {
        setCursorPos({ x: 50, y: 85 });
        triggerSimulatedClick(300);
      } else if (currentStep.clickTarget === 'premium_package') {
        setCursorPos({ x: 65, y: 60 });
        triggerSimulatedClick(300);
      } else if (currentStep.clickTarget === 'submit_btn') {
        setCursorPos({ x: 50, y: 90 });
        triggerSimulatedClick(300);
      } else {
        // Random slight wander for realistic look
        setCursorPos({ x: 45 + Math.random() * 10, y: 40 + Math.random() * 20 });
      }
    }
  }, [currentStepIndex, currentTime, showCursor, currentStep, activeScene, triggerSimulatedClick]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveScene('landing');
    setSimName('');
    setSimCompany('');
    setSuccessChecked([false, false, false]);
  };

  return (
    <div className="bg-[#121214] rounded-2xl border border-warm-gold/15 overflow-hidden shadow-2xl">
      {/* Title Header */}
      <div className="p-6 bg-deep-brown border-b border-warm-gold/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-warm-gold/10 rounded text-warm-gold">
              <Tv className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-display font-bold text-deep-forest">
              Ad Video & Walkthrough Recording Studio
            </h3>
          </div>
          <p className="text-xs text-deep-forest/50 mt-1">
            Auto-generate perfect, high-fidelity screen recordings of your catering portal. Perfect for TikTok, Reels, or corporate promos!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`border-warm-gold/20 text-deep-forest h-9 ${showSubtitles ? 'bg-warm-gold/10 text-warm-gold border-warm-gold/40' : ''}`}
          >
            <Subtitles className="w-4 h-4 mr-1.5" />
            {showSubtitles ? 'Subtitles On' : 'Subtitles Off'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowCursor(!showCursor)}
            className={`border-warm-gold/20 text-deep-forest h-9 ${showCursor ? 'bg-warm-gold/10 text-warm-gold border-warm-gold/40' : ''}`}
          >
            <MousePointer className="w-4 h-4 mr-1.5" />
            {showCursor ? 'Taps Visible' : 'Taps Hidden'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
        
        {/* Left Control Panel: Script Guide & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Playback HUD */}
          <div className="p-5 bg-charcoal/40 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-warm-gold/60 uppercase tracking-widest font-bold">
                Walkthrough Timeline
              </span>
              <span className="text-sm font-mono text-deep-forest font-semibold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                00:{currentTime.toString().padStart(2, '0')} / 00:60
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full bg-charcoal h-2 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="bg-gradient-to-r from-warm-gold via-[#E0BC74] to-[#C5A059] h-full"
                animate={{ width: `${(currentTime / 60) * 100}%` }}
                transition={{ ease: 'linear', duration: isPlaying ? 1 / speed : 0.2 }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  className="bg-warm-gold text-charcoal hover:bg-[#E0BC74] transition-all duration-300 w-11 h-11 rounded-full shadow-lg shadow-warm-gold/15"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-charcoal" /> : <Play className="w-5 h-5 fill-charcoal ml-0.5" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/10 text-deep-forest hover:bg-white/5 w-11 h-11 rounded-full"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {/* Speed Buttons */}
              <div className="flex bg-black/45 rounded-lg p-0.5 border border-white/5">
                {([1, 1.5, 2] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                      speed === s ? 'bg-warm-gold text-charcoal' : 'text-deep-forest/50 hover:text-deep-forest'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Script Card */}
          <div className="p-5 bg-deep-brown rounded-xl border border-warm-gold/5 space-y-4 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-warm-gold">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Active Ad Script Scene ({currentStepIndex + 1}/{scriptSteps.length})</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-display font-semibold text-deep-forest capitalize">
                {activeScene.replace('_', ' ')} Walkthrough
              </h4>
              <p className="text-xs text-deep-forest/60">
                <strong className="text-warm-gold">Simulated Event:</strong> {currentStep?.action}
              </p>
            </div>

            {/* Highlighted Live Subtitles/Voiceover Draft */}
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-warm-gold/60 font-bold uppercase tracking-wider block">
                  ENGLISH VOICEOVER & SUBTITLE
                </span>
                <p className="text-xs text-deep-forest leading-relaxed font-body">
                  "{currentStep?.subtitlesEn}"
                </p>
              </div>
              <div className="border-t border-white/5 pt-2 space-y-1">
                <span className="text-[10px] font-mono text-[#E0BC74]/60 font-bold uppercase tracking-wider block">
                  BAHASA MELAYU LOCALIZED
                </span>
                <p className="text-xs text-deep-forest/80 leading-relaxed font-body italic">
                  "{currentStep?.subtitlesBm}"
                </p>
              </div>
            </div>

            {/* Quick Scene Manual Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-deep-forest/40 uppercase tracking-widest block font-bold">
                Jump To App Scene
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['landing', 'order_form', 'success_checklist', 'member_portal'] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      setActiveScene(sc);
                      const matchedStep = scriptSteps.find(step => step.scene === sc);
                      if (matchedStep) {
                        setCurrentTime(matchedStep.time);
                      }
                    }}
                    className={`p-2 rounded-lg text-[11px] font-semibold text-left border transition-all ${
                      activeScene === sc 
                        ? 'bg-warm-gold/10 text-warm-gold border-warm-gold/30 shadow-md' 
                        : 'bg-black/20 text-deep-forest/60 border-white/5 hover:text-deep-forest hover:bg-black/30'
                    }`}
                  >
                    {sc === 'landing' && '⭐ Landing Page'}
                    {sc === 'order_form' && '⏱️ Catering Form'}
                    {sc === 'success_checklist' && '✓ Success Invoicing'}
                    {sc === 'member_portal' && '💼 Member Dashboard'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recording Guide Banner */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 text-xs leading-relaxed text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 text-blue-400 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-200">How to Record This Video:</p>
              <p className="mt-1">
                1. Set up any screen recording app (e.g. OBS, AZ Screen Recorder on mobile, or built-in browser recorder).<br />
                2. Select English or BM subtitles, hit <strong>Play</strong>, and watch the mock phone frame on the right auto-scroll and fill out details flawlessly at 60 FPS!<br />
                3. Crop the video to the device frame, overlay the audio, and your pro ad is ready!
              </p>
            </div>
          </div>
          
        </div>

        {/* Right Panel: Shiny Smartphone Device Mockup Frame */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          
          <div className="relative w-full max-w-[340px] aspect-[9/19] bg-[#141416] rounded-[48px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-[#2c2c31]">
            
            {/* Phone Screen Notch / Camera Punch hole */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#141416] rounded-full z-50 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/5 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/60" />
              </div>
              <div className="w-10 h-1 bg-[#222] rounded-full ml-2" />
            </div>

            {/* Phone Status Bar */}
            <div className="absolute top-3.5 left-8 right-8 h-6 flex items-center justify-between text-[10px] font-mono text-white/60 z-40 px-1">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="w-5 h-2.5 border border-white/40 rounded p-0.5 flex items-center">
                  <div className="w-3.5 h-full bg-white rounded-xs" />
                </div>
              </div>
            </div>

            {/* Core Phone Screen View */}
            <div 
              ref={phoneScreenRef}
              className="w-full h-full bg-[#141417] rounded-[36px] overflow-hidden relative border border-white/5 select-none pt-7 pb-4 flex flex-col font-sans"
            >
              
              {/* VIRTUAL CURSOR CLICK DOT INDICATOR */}
              {showCursor && (
                <motion.div
                  className="absolute pointer-events-none z-50 rounded-full"
                  animate={{ 
                    x: `${cursorPos.x}%`, 
                    y: `${cursorPos.y}%`,
                    scale: isCursorClicking ? [1, 1.8, 1] : 1,
                    opacity: isCursorClicking ? [0.8, 0.4, 0.8] : 0.6
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'rgba(197, 160, 89, 0.4)',
                    border: '2px solid #C5A059',
                    marginLeft: '-12px',
                    marginTop: '-12px',
                    boxShadow: '0 0 10px rgba(197, 160, 89, 0.6)'
                  }}
                />
              )}

              {/* MAIN SIMULATED SCREEN CANVAS */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative h-full scrollbar-none">
                
                {/* 1. LANDING PAGE SCENE */}
                {activeScene === 'landing' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col text-deep-forest text-left"
                  >
                    {/* Hero Header */}
                    <div className="relative h-44 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/catering/400/300"
                        alt="Catering Feast"
                        className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-charcoal/80 to-[#141417]" />
                      
                      <div className="relative z-10 text-center px-4 space-y-1">
                        <img 
                          src="https://picsum.photos/seed/logo/80/80" 
                          alt="Logo"
                          className="w-10 h-10 rounded-full mx-auto border border-warm-gold/30 mb-1"
                          referrerPolicy="no-referrer"
                        />
                        <h1 className="font-display font-bold text-lg text-warm-gold tracking-wide leading-tight">
                          Restoran Wawasan
                        </h1>
                        <p className="text-[10px] text-deep-forest/70 font-mono tracking-widest uppercase">
                          Pak Usop Catering
                        </p>
                      </div>
                    </div>

                    {/* About Tagline */}
                    <div className="px-5 py-4 space-y-2">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warm-gold/10 border border-warm-gold/20 text-[9px] text-warm-gold font-bold">
                        <Sparkles className="w-2.5 h-2.5" />
                        PREMIUM CORPORATE CATERER
                      </div>
                      <h2 className="text-sm font-display font-bold text-deep-forest tracking-tight leading-snug">
                        Sajian Warisan Tradisi, Katering Profesional Lancar Serta-merta
                      </h2>
                      <p className="text-[11px] text-deep-forest/50 leading-relaxed font-body">
                        Authentic culinary expertise serving perfect corporate banquets and private functions across Kuala Lumpur.
                      </p>
                    </div>

                    {/* Menu Package showcase */}
                    <div className="px-5 py-3 space-y-3 bg-white/5 border-y border-white/5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-warm-gold/60">
                        Our Signature Catering Packages
                      </span>

                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-charcoal border border-white/5 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-semibold text-deep-forest">Pakej Platinum Buffet</h4>
                            <p className="text-[9px] text-deep-forest/40">Premium 12 Dish feast, fully customized</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-warm-gold">RM35/pax</span>
                        </div>
                        <div className="p-3 rounded-xl bg-warm-gold/5 border border-warm-gold/20 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-semibold text-warm-gold">Pakej Premium Wawasan</h4>
                            <p className="text-[9px] text-warm-gold/60">Signature local heritage favorite</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-warm-gold">RM25/pax</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="p-5 mt-4">
                      <button 
                        id="book_now_btn"
                        className="w-full h-11 bg-warm-gold text-charcoal font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-warm-gold/20 hover:bg-[#E0BC74] transition-all"
                      >
                        Book Catering Online Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. ORDER FORM SCENE */}
                {activeScene === 'order_form' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 text-deep-forest text-left space-y-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-warm-gold tracking-widest font-bold uppercase">
                        CATERING CALCULATOR
                      </span>
                      <h3 className="text-base font-display font-bold text-deep-forest">
                        Create Your Catering Booking
                      </h3>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-deep-forest/40">CUSTOMER / PIC NAME</label>
                        <div className="h-10 px-3 bg-white/5 border border-white/10 rounded-lg flex items-center text-xs font-semibold">
                          {simName || <span className="text-deep-forest/20">e.g. Ahmad Kamal</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-deep-forest/40">COMPANY / ORGANIZATION</label>
                        <div className="h-10 px-3 bg-white/5 border border-white/10 rounded-lg flex items-center text-xs font-semibold">
                          {simCompany || <span className="text-deep-forest/20">e.g. Enterprise Sdn Bhd</span>}
                        </div>
                      </div>

                      {/* Package Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-deep-forest/40">CATERING PACKAGE</label>
                        <div 
                          id="premium_package"
                          className="p-3 bg-warm-gold/5 border border-warm-gold/30 rounded-lg flex justify-between items-center text-xs font-semibold"
                        >
                          <div>
                            <span className="text-warm-gold font-bold">✓ </span>
                            <span className="text-deep-forest">Pakej Premium (RM25/pax)</span>
                          </div>
                        </div>
                      </div>

                      {/* Guest Slider */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-deep-forest/40">TOTAL GUEST COUNT</span>
                          <span className="font-bold text-warm-gold">150 Pax</span>
                        </div>
                        <div className="relative w-full h-1 bg-white/10 rounded-full">
                          <div className="absolute top-0 left-0 w-[70%] h-full bg-warm-gold rounded-full" />
                          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-warm-gold border-2 border-charcoal shadow-md" />
                        </div>
                      </div>

                      {/* Price summary */}
                      <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center mt-2">
                        <span className="text-[10px] text-deep-forest/50 font-semibold">Estimated Billing Total:</span>
                        <span className="text-sm font-mono font-bold text-warm-gold">RM 3,750.00</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        id="submit_btn"
                        className="w-full h-11 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/10"
                      >
                        Hantar Tempahan Katering
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. SUCCESS CHECKLIST SCENE */}
                {activeScene === 'success_checklist' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 text-center space-y-5 h-full flex flex-col justify-center"
                  >
                    <div className="flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Check className="w-7 h-7" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-display font-bold text-deep-forest">
                        Tempahan Berjaya Dihantar!
                      </h3>
                      <p className="text-[11px] text-deep-forest/50">
                        Order submitted successfully!
                      </p>
                    </div>

                    {/* Progress checklist panel */}
                    <div className="bg-charcoal/80 rounded-2xl border border-white/5 p-4 text-left space-y-3 shadow-md max-w-[280px] mx-auto">
                      <span className="text-[9px] font-mono text-warm-gold/60 font-bold uppercase tracking-wider block">
                        Catering Validation Actions:
                      </span>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-deep-forest/80">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            successChecked[0] ? 'bg-emerald-500 text-white' : 'border border-white/20 text-white/20'
                          }`}>
                            ✓
                          </div>
                          <span className={successChecked[0] ? 'text-deep-forest font-semibold' : 'text-deep-forest/40'}>
                            ✓ PDF Invoice Generated
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-deep-forest/80">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            successChecked[1] ? 'bg-emerald-500 text-white animate-pulse' : 'border border-white/20 text-white/20'
                          }`}>
                            ✓
                          </div>
                          <span className={successChecked[1] ? 'text-deep-forest font-semibold' : 'text-deep-forest/40'}>
                            ✓ Email Invoice Dispatched
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-deep-forest/80">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            successChecked[2] ? 'bg-emerald-500 text-white' : 'border border-white/20 text-white/20'
                          }`}>
                            ✓
                          </div>
                          <span className={successChecked[2] ? 'text-deep-forest font-semibold' : 'text-deep-forest/40'}>
                            ✓ Sync to Staff Calendar Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-deep-forest/40 leading-relaxed max-w-[240px] mx-auto">
                      Your preliminary invoice is ready to download. A formal copy was sent to mohd.nor@amanah.com.
                    </p>
                  </motion.div>
                )}

                {/* 4. MEMBER PORTAL SCENE */}
                {activeScene === 'member_portal' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 text-deep-forest text-left space-y-4"
                  >
                    {/* Member Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-warm-gold/10 border border-warm-gold/20 flex items-center justify-center text-warm-gold text-xs font-bold">
                          MN
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-deep-forest">Mohammad Nor</h4>
                          <span className="text-[9px] text-warm-gold">Gold Member • Amanah Cap</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-mono text-deep-forest/60 border border-white/10">
                        Portal Ahli
                      </span>
                    </div>

                    {/* Member Billing Profiles card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#C5A059]/10 via-[#C5A059]/5 to-transparent border border-warm-gold/10 space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-warm-gold tracking-wider uppercase">
                        <Building className="w-3.5 h-3.5" />
                        Billing Profile Details
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-body text-deep-forest/70">
                        <div>
                          <span className="text-[9px] text-deep-forest/40 block">PIC NAME</span>
                          <strong>En. Mohammad Nor</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-deep-forest/40 block">COMPANY/ORG</span>
                          <strong>Amanah Capital Berhad</strong>
                        </div>
                        <div className="col-span-2 border-t border-white/5 pt-1.5 mt-0.5">
                          <span className="text-[9px] text-deep-forest/40 block">ATTENTION DEPT</span>
                          <strong>Accounts Payable Division</strong>
                        </div>
                      </div>
                    </div>

                    {/* Order History listing */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-deep-forest/40 tracking-wider uppercase">
                        <span>Catering Order History</span>
                        <span>View All</span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-deep-forest/40">ORD-2026-8802</span>
                            <h5 className="text-[11px] font-bold text-deep-forest">Hari Raya Feast • 150 pax</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/20 font-bold">
                            DELIVERED
                          </span>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-deep-forest/40">ORD-2026-9531</span>
                            <h5 className="text-[11px] font-bold text-deep-forest">Board Meeting Buffet • 80 pax</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[9px] border border-blue-500/20 font-bold">
                            CONFIRMED
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* OVERLAY DYNAMIC SUBTITLES */}
              {showSubtitles && (
                <div className="absolute bottom-5 left-4 right-4 bg-black/85 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center z-50 text-[10.5px] leading-relaxed shadow-lg">
                  <p className="text-white font-medium font-body">
                    {language === 'en' ? currentStep?.subtitlesEn : currentStep?.subtitlesBm}
                  </p>
                </div>
              )}

              {/* Home Indicator line */}
              <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mt-auto" />
            </div>
            
          </div>

          <div className="mt-4 flex items-center gap-1 text-[11px] text-deep-forest/40">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulated Native Android Device (Wawasan App Layout)</span>
          </div>

        </div>

      </div>
    </div>
  );
}
