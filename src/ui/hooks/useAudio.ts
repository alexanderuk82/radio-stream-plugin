import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
  play: (url: string) => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  currentUrl: string | null;
}

export function useAudio(initialVolume = 0.7): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const prevVolumeRef = useRef(initialVolume);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audio.volume = initialVolume;
    audioRef.current = audio;

    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError("Stream unavailable");
    };
    const onStalled = () => {
      setIsLoading(true);
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
      audio.pause();
      audio.src = "";
    };
  }, [initialVolume]);

  const play = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      setError(null);
      setIsLoading(true);
      setCurrentUrl(url);

      audio.pause();
      audio.src = url;
      audio.volume = isMuted ? 0 : volume;
      audio.load();

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          setError("Playback blocked - click play");
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    },
    [volume, isMuted]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused && currentUrl) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          setError("Playback blocked - click play");
        });
      }
    } else {
      audio.pause();
    }
  }, [currentUrl]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : clamped;
      }
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          prevVolumeRef.current = volume;
          audioRef.current.volume = 0;
        } else {
          audioRef.current.volume = prevVolumeRef.current;
        }
      }
      return next;
    });
  }, [volume]);

  return {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    error,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    currentUrl,
  };
}
