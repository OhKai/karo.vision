"use client";

import { useAudioPlayer } from "@/lib/use-audio-player";
import { fileURL } from "@/lib/utils";
import { createContext, useEffect, useRef } from "react";

export const AudioElementContext = createContext<{
  getAudioElement: () => HTMLAudioElement | null;
  getAudioContext: () => AudioContext | null;
  getAudioSource: () => MediaElementAudioSourceNode | null;
}>({
  getAudioElement: () => null,
  getAudioContext: () => null,
  getAudioSource: () => null,
});

const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioPlayer = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const lastInternalUpdate = useRef(0);

  // TODO: These effects could be removed by moving the audio element control logic into the
  // useAudioPlayer hook. It could read the audio element context and use that directly.
  useEffect(() => {
    const el = audioRef.current;
    // Calling play() before the audio is ready stops playback even with autoPlay.
    if (!el || el.readyState === 0) return;

    audioPlayer.isPlaying ? el.play() : el.pause();
  }, [audioPlayer.isPlaying]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Prevent feedback loop when syncing currentTime between Zustand state and audio element.
    if (lastInternalUpdate.current === audioPlayer.currentTime) return;

    el.currentTime = audioPlayer.currentTime;
  }, [audioPlayer.currentTime]);

  return (
    <AudioElementContext.Provider
      value={{
        getAudioElement: () => audioRef.current,
        getAudioContext: () => audioContextRef.current,
        getAudioSource: () => audioSourceRef.current,
      }}
    >
      {children}
      {audioPlayer.currentTrackId !== undefined && (
        <audio
          ref={(el) => {
            // Initialize AudioContext and MediaElementSourceNode only once per audio element.
            if (el !== audioRef.current) {
              audioContextRef.current = new AudioContext();
              audioSourceRef.current =
                audioContextRef.current.createMediaElementSource(el!);
            }

            audioRef.current = el;

            const handlePlay = () => {
              if (!audioPlayer.isPlaying) audioPlayer.play();
            };
            const handlePause = () => {
              if (audioPlayer.isPlaying) audioPlayer.pause();
            };
            const handleEnded = () => {
              if (audioPlayer.isPlaying) audioPlayer.pause();
            };
            const handleTimeUpdate = () => {
              const currentTime = el!.currentTime;
              lastInternalUpdate.current = currentTime;
              audioPlayer.setCurrentTime(currentTime);
            };
            const handleWaiting = () => {
              if (!audioPlayer.isLoading) audioPlayer.setIsLoading(true);
            };
            const handlePlaying = () => {
              if (audioPlayer.isLoading) audioPlayer.setIsLoading(false);
            };

            el!.addEventListener("play", handlePlay);
            el!.addEventListener("pause", handlePause);
            el!.addEventListener("ended", handleEnded);
            el!.addEventListener("timeupdate", handleTimeUpdate);
            el!.addEventListener("waiting", handleWaiting);
            el!.addEventListener("playing", handlePlaying);

            return () => {
              el!.removeEventListener("play", handlePlay);
              el!.removeEventListener("pause", handlePause);
              el!.removeEventListener("ended", handleEnded);
              el!.removeEventListener("timeupdate", handleTimeUpdate);
              el!.removeEventListener("waiting", handleWaiting);
              el!.removeEventListener("playing", handlePlaying);
              // Note: Cannot unset audioContext and audioSource here as they can only be created
              // once per audio element lifecycle. And we need audioRef to know when a new audio
              // element is created.
            };
          }}
          src={fileURL(audioPlayer.currentTrackId)}
          autoPlay
          crossOrigin="anonymous"
          onLoadStart={() => audioPlayer.setIsLoading(true)}
          onLoadedMetadata={() => {
            audioPlayer.setIsLoading(false);
          }}
        />
      )}
    </AudioElementContext.Provider>
  );
};

export default AudioPlayerProvider;
