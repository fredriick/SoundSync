
import { useState, useEffect, useRef } from "react";
import { Volume2, PlayCircle, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  title: string;
  artist: string;
  imageUrl: string;
  className?: string;
}

export function AudioWaveform({ title, artist, imageUrl, className }: AudioWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  
  // In a real implementation, we would use Web Audio API to analyze the audio
  // and generate the waveform data, but for this demo we'll use random values
  useEffect(() => {
    const generateRandomWaveform = () => {
      const barCount = 40;
      const bars = Array.from({ length: barCount }, () => 
        Math.floor(Math.random() * 80) + 20
      );
      setWaveformBars(bars);
    };
    
    generateRandomWaveform();
  }, []);

  return (
    <div className={cn("flex flex-col bg-card rounded-lg overflow-hidden shadow-md", className)}>
      <div className="relative aspect-square md:aspect-[3/2] overflow-hidden">
        <img 
          src={imageUrl || "https://placehold.co/600x400/252836/8b5cf6"} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-sm">{artist}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-beatforge-500 hover:text-beatforge-600 transition-colors"
        >
          {isPlaying ? (
            <PauseCircle className="h-10 w-10" />
          ) : (
            <PlayCircle className="h-10 w-10" />
          )}
        </button>
        
        <div className="flex-1 flex items-center gap-1 h-12">
          {waveformBars.map((height, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 rounded-full transition-all duration-300", 
                isPlaying 
                  ? "bg-beatforge-500" 
                  : "bg-muted-foreground/40"
              )}
              style={{ 
                height: `${height}%`,
                animationDelay: `${index * 0.05}s`,
                transform: isPlaying ? `scaleY(${1 + Math.sin(index) * 0.1})` : "scaleY(1)"
              }}
            />
          ))}
        </div>
        
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
