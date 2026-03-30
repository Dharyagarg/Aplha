import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function Music() {
  const { playlist, currentTrackIndex, isPlaying, setIsPlaying, nextTrack, prevTrack, setCurrentTrackIndex } = useStore();
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.audioUrl);
    } else {
      audioRef.current.src = currentTrack.audioUrl;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, isPlaying, nextTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
      {/* Player Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 glass rounded-3xl p-8 flex flex-col items-center"
      >
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mb-8 shadow-2xl shadow-gold-500/20 border-4 border-white/10 relative">
          <motion.img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full border-4 border-white/10" />
        </div>

        <div className="text-center mb-8 w-full">
          <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1">{currentTrack.title}</h2>
          <p className="text-gold-400">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prevTrack} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <SkipBack className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" />
            ) : (
              <Play className="w-8 h-8 text-black ml-1" />
            )}
          </button>
          <button onClick={nextTrack} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <SkipForward className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Playlist Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 glass rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <ListMusic className="w-6 h-6 text-gold-400" />
          <h3 className="text-xl font-semibold">Up Next</h3>
        </div>

        <div className="space-y-2">
          {playlist.map((track, index) => (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors",
                currentTrackIndex === index 
                  ? "bg-gold-500/10 border border-gold-500/20" 
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <img src={track.albumArt} alt={track.title} className="w-12 h-12 rounded-md object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h4 className={cn("font-medium line-clamp-1", currentTrackIndex === index ? "text-gold-400" : "text-white")}>
                  {track.title}
                </h4>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
              {currentTrackIndex === index && isPlaying && (
                <div className="flex gap-1 h-4 items-end">
                  <div className="w-1 bg-gold-400 animate-[bounce_1s_infinite]" style={{ height: '100%' }} />
                  <div className="w-1 bg-gold-400 animate-[bounce_1s_infinite_0.2s]" style={{ height: '60%' }} />
                  <div className="w-1 bg-gold-400 animate-[bounce_1s_infinite_0.4s]" style={{ height: '80%' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
