import { parseSearchQuery } from "@/components/search-page";
import { useInfiniteQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { trpc } from "./trpc-client";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";

type AudioPlayerState = {
  query?: string;
  currentTrackId?: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  isLoading: boolean;
  repeat: "none" | "one" | "all";
  shuffle: boolean;
};

type AudioPlayerActions = {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setIsLoading: (loading: boolean) => void;
  setRepeat: (mode: "none" | "one" | "all") => void;
  toggleShuffle: () => void;
  playTrack: (trackId: number, query: string) => void;
};

/** Zustand store for audio player state. */
const useAudioPlayerStore = create<AudioPlayerState & AudioPlayerActions>()(
  // check this method ---v
  subscribeWithSelector((set, get) => ({
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    isLoading: false,
    repeat: "none",
    shuffle: false,

    play: () => set({ isPlaying: true }),

    pause: () => set({ isPlaying: false }),

    togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

    setCurrentTime: (time) => set({ currentTime: time }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    setRepeat: (mode) => set({ repeat: mode }),

    toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

    playTrack: (trackId, query) =>
      set({
        query,
        currentTrackId: trackId,
        isPlaying: true,
        currentTime: 0,
        isLoading: true,
      }),
  })),
);

/**
 * Hook to manage all relevant audio player state and data by combining a Zustand store and React
 * Query for fetching tracks.
 */
export const useAudioPlayer = () => {
  const audioPlayerStore = useAudioPlayerStore();

  const { search, sort, seed } = parseSearchQuery(
    new URLSearchParams(audioPlayerStore.query),
  );

  // For the player we need at least two things: the current track data and a way to get the
  // next/previous track as they appear in the current search/sort context. We could take a snapshot
  // at the moment the track is first played, but that could be millions of ids and it would not
  // live update if tracks are added, deleted or tags modified. For the same reason, the current
  // index is also not stable. Instead we re-run the search query with the same parameters as it was
  // originally created when the user clicked "play". Since that action needs to happen, we assume
  // that the current track is part of the cached data for that infinite query. If the user changes
  // the track list in the search page, a button will appear to copy the new search params to the
  // player if they want to.
  const {
    data: tracksData,
    isPending,
    isPlaceholderData,
    isFetchingNextPage,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    hasNextPage,
  } = useInfiniteQuery(
    trpc.music.list.infiniteQueryOptions(
      {
        direction: "forward",
        search: search.filter((q) => q.length > 0),
        seed: sort === "random" ? seed : undefined,
        sort,
      },
      {
        // TODO: I plan to have SSE updates for server-side changes so we should not need revalidations?
        staleTime: Infinity,
        getNextPageParam: (lastPage, pages) =>
          // TODO: This fetches one more empty page if the cutoff is exactly the page size.
          lastPage.length === INFINITE_SCROLL_PAGE_SIZE
            ? pages.length * INFINITE_SCROLL_PAGE_SIZE
            : undefined,
        placeholderData: (prev) => prev,
      },
    ),
  );

  const data = tracksData?.pages.flat();

  let currentIndex = -1;
  const currentTrack = data?.find((t, index) => {
    if (t.fileId === audioPlayerStore.currentTrackId) {
      currentIndex = index;
      return true;
    }
  });

  if (currentIndex === -1 && audioPlayerStore.currentTrackId !== undefined) {
    // TODO: This needs to be reported somehow.
    console.warn(
      "Current track not found in fetched data. This should not happen.",
      audioPlayerStore.currentTrackId,
    );
  }

  const hasNext = hasNextPage || (data && currentIndex < data.length - 1);
  const hasPrevious = hasPreviousPage || (data && currentIndex > 0);

  return {
    ...audioPlayerStore,
    partialPlaylist: data,
    currentTrack,
    hasNext,
    hasPrevious,
  };
};
