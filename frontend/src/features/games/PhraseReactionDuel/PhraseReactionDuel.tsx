import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export interface PhraseOption {
  id: string;
  text: string;
}

export interface PhraseReactionDuelProps {
  audioUrl: string;
  phraseText?: string;
  options: PhraseOption[];
  correctAnswerId: string;
  onAnswer?: (isCorrect: boolean, reactionTimeMs: number) => void;
  onNext?: () => void;
}

export const PhraseReactionDuel: React.FC<PhraseReactionDuelProps> = ({
  audioUrl,
  phraseText,
  options,
  correctAnswerId,
  onAnswer,
  onNext,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [score, setScore] = useState(0);
  const [reactionTier, setReactionTier] = useState<{ text: string, color: string, points: number } | null>(null);
  const [energy, setEnergy] = useState(50);
  const [shake, setShake] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);

  const playDing = (ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const playThud = (ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  // Initialize and load audio
  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      try {
        setIsReady(false);
        setError(null);

        // Initialize AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();

        // Fetch audio
        const response = await fetch(audioUrl);
        if (!response.ok) throw new Error('Failed to load audio');
        const arrayBuffer = await response.arrayBuffer();

        // Decode audio
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        if (isMounted) {
          setIsReady(true);
        }
      } catch (err) {
        console.error('Error loading audio:', err);
        // Do not update state if unmounted to avoid leaks
        if (isMounted) setError('Failed to load audio. Please check the URL.');
      }
    };

    if (audioUrl) {
        initAudio();
    }

    return () => {
      isMounted = false;
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch (e) {}
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close().catch(() => {});
      }
    };
  }, [audioUrl]);

  const getReactionTier = (rt: number, combo: number) => {
    // Dynamic difficulty: shrink window by 5% per combo, up to 50% max reduction
    const multiplier = Math.max(0.5, 1 - (combo * 0.05));
    const perfectThreshold = 500 * multiplier;
    const greatThreshold = 1000 * multiplier;
  
    if (rt <= perfectThreshold) return { text: 'Perfect!', points: 3, color: 'text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]' };
    if (rt <= greatThreshold) return { text: 'Great!', points: 2, color: 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' };
    return { text: 'Good', points: 1, color: 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]' };
  };

  const startRound = useCallback(() => {
    if (!isReady || !audioContextRef.current || !audioBufferRef.current) return;
    
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    try {
      // Create and connect source node
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
      };

      sourceNodeRef.current = source;
      
      // Start playback and timer simultaneously
      const now = performance.now();
      source.start(0);
      startTimeRef.current = now;
      
      setIsPlaying(true);
      setHasStarted(true);
      setIsGameOver(false);
      setSelectedOptionId(null);
      setReactionTime(null);
      setReactionTier(null);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  }, [isReady]);

  const handleOptionClick = (optionId: string) => {
    if (!hasStarted || isGameOver) return;

    const clickTime = performance.now();
    const rt = clickTime - startTimeRef.current;
    
    setIsGameOver(true);
    setSelectedOptionId(optionId);
    setReactionTime(rt);
    setIsPlaying(false);

    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
    }

    const isCorrect = optionId === correctAnswerId;
    
    if (isCorrect) {
      if (audioContextRef.current) playDing(audioContextRef.current);
      
      const newCombo = comboCount + 1;
      const tier = getReactionTier(rt, newCombo);
      setReactionTier(tier);
      setComboCount(newCombo);
      setScore(prev => prev + tier.points);
      setEnergy(prev => Math.min(100, prev + 15));

      if (newCombo === 5 || newCombo === 10 || newCombo === 20) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else {
      if (audioContextRef.current) playThud(audioContextRef.current);
      
      setReactionTier(null);
      setComboCount(0);
      setEnergy(prev => Math.max(0, prev - 40));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    if (onAnswer) {
      onAnswer(isCorrect, Math.round(rt));
    }
  };

  const isCorrect = selectedOptionId === correctAnswerId;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[500px] bg-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden font-sans">
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
      
      {/* Header */}
      <motion.div 
        className="w-full flex-1 flex flex-col z-10 relative"
        animate={shake ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
      >
        <div className="w-full flex justify-between items-start mb-4 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-wider uppercase">
                Phrase Reaction
              </h2>
              <AnimatePresence>
                {comboCount > 1 && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`px-3 py-1 rounded-full font-bold text-sm tracking-widest text-white ${
                      comboCount >= 5 
                        ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-[0_0_25px_rgba(239,68,68,0.8)] border border-yellow-300 animate-pulse'
                        : 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                    }`}
                  >
                    {comboCount}x COMBO
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-xl font-bold text-slate-300">
              Score: <span className="text-white">{score}</span>
            </div>
          </div>

          {reactionTime !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-3xl font-black ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} flex flex-col items-end`}
            >
              <div>{Math.round(reactionTime)}<span className="text-sm font-medium opacity-80">ms</span></div>
            </motion.div>
          )}
        </div>

        {/* Energy Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700/50 shadow-inner">
          <motion.div 
            className={`h-full ${energy > 20 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-rose-500 to-red-500 animate-pulse'}`}
            initial={{ width: '50%' }}
            animate={{ width: `${energy}%` }}
            transition={{ type: "spring", bounce: 0.4 }}
          />
        </div>

        {/* Main Play Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 relative z-10">
        {/* Animated Reaction Popup */}
        <AnimatePresence>
          {isGameOver && reactionTier && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50, rotate: -10 }}
              animate={{ opacity: 1, scale: 1.2, y: 0, rotate: [-5, 5, 0] }}
              exit={{ opacity: 0, scale: 0, y: -50 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none ${reactionTier.color}`}
            >
              <span className="text-6xl font-black italic tracking-tighter">{reactionTier.text}</span>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white/90 font-bold"
              >
                +{reactionTier.points}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 px-4 py-3 rounded-lg">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : !hasStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRound}
            disabled={!isReady}
            className={`
              relative group w-32 h-32 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isReady 
                ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
            `}
          >
            {isReady ? (
              <>
                <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                <Play className="w-12 h-12 text-white ml-2" fill="currentColor" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            )}
          </motion.button>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Audio Indicator */}
            <motion.div 
              animate={{ 
                scale: isPlaying ? [1, 1.2, 1] : 1,
                opacity: isPlaying ? 1 : 0.5 
              }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.5 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isPlaying ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Volume2 className="w-12 h-12" />
            </motion.div>

            {/* Revealed Phrase */}
            <div className="h-20 flex items-center justify-center">
              <AnimatePresence>
                {isGameOver && phraseText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-sm text-slate-400 mb-1 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                      <Volume2 size={14} /> Phrase
                    </p>
                    <p className="text-3xl font-bold text-white tracking-wide">"{phraseText}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Options Grid */}
            <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mt-2">
              <AnimatePresence mode="popLayout">
                {options.map((option, index) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectOption = option.id === correctAnswerId;
                  
                  let btnStateClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
                  
                  if (isGameOver) {
                    if (isCorrectOption) {
                      btnStateClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                    } else if (isSelected) {
                      btnStateClass = 'bg-rose-500/20 text-rose-300 border-rose-500/50';
                    } else {
                      btnStateClass = 'bg-slate-800/50 text-slate-600 border-slate-800/50';
                    }
                  }

                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        boxShadow: (isPlaying && !isGameOver) ? ["0px 0px 0px rgba(34,211,238,0)", "0px 0px 20px rgba(34,211,238,0.4)", "0px 0px 0px rgba(34,211,238,0)"] : "0px 0px 0px rgba(0,0,0,0)"
                      }}
                      transition={{ 
                        delay: index * 0.1, 
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                        y: { duration: 0.3 },
                        boxShadow: {
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }
                      }}
                      whileHover={!isGameOver && isPlaying ? { scale: 1.03 } : undefined}
                      whileTap={!isGameOver && isPlaying ? { scale: 0.95 } : undefined}
                      onClick={() => handleOptionClick(option.id)}
                      disabled={isGameOver || !isPlaying}
                      className={`
                        relative flex flex-col items-center justify-center p-6 rounded-xl border-2
                        transition-all duration-300 min-h-[120px] shadow-lg
                        ${btnStateClass}
                        ${!isGameOver && isPlaying ? 'cursor-pointer hover:shadow-[0_8px_30px_rgba(34,211,238,0.2)] hover:border-cyan-500/50 text-white' : ''}
                        ${!isPlaying && !isGameOver ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-xl font-semibold text-center">{option.text}</span>
                      
                      {isGameOver && isCorrectOption && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 text-emerald-400">
                          <CheckCircle2 size={24} />
                        </motion.div>
                      )}
                      {isGameOver && isSelected && !isCorrectOption && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 text-rose-400">
                          <XCircle size={24} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      </motion.div>

      {/* Footer Controls */}
      <div className="h-16 mt-6 flex items-center justify-center w-full z-10">
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                onClick={() => {
                  setHasStarted(false);
                  setIsGameOver(false);
                  setReactionTime(null);
                  setSelectedOptionId(null);
                  onNext?.();
                }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-lg tracking-wide hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Next Round
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
