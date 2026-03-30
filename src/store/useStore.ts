import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteCategory = 'Class 10' | 'Class 11' | 'Class 12' | 'JEE' | 'NEET';

export interface Note {
  id: string;
  title: string;
  description: string;
  category: NoteCategory;
  price: number; // 0 means free
  isPremium: boolean;
  fileUrl?: string; // Mock URL for now
  imageUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
}

interface AppState {
  // Admin Auth
  isAdmin: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;

  // Notes
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Downloads
  downloadedNotes: string[]; // Array of Note IDs
  addDownload: (id: string) => void;
  removeDownload: (id: string) => void;

  // Music Player
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  setPlaylist: (tracks: Track[]) => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Physics Mechanics - JEE Advanced',
    description: 'Complete mechanics notes with PYQs and detailed solutions.',
    category: 'JEE',
    price: 499,
    isPremium: true,
    imageUrl: 'https://picsum.photos/seed/physics/400/300',
  },
  {
    id: '2',
    title: 'Biology NCERT Highlights',
    description: 'Line by line NCERT highlights for NEET biology.',
    category: 'NEET',
    price: 0,
    isPremium: false,
    imageUrl: 'https://picsum.photos/seed/biology/400/300',
  },
  {
    id: '3',
    title: 'Class 10 Math Formula Sheet',
    description: 'All formulas for board exams in one place.',
    category: 'Class 10',
    price: 0,
    isPremium: false,
    imageUrl: 'https://picsum.photos/seed/math10/400/300',
  },
];

const initialPlaylist: Track[] = [
  {
    id: '1',
    title: 'Lofi Study Beats',
    artist: 'Chillhop',
    albumArt: 'https://picsum.photos/seed/lofi1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Deep Focus',
    artist: 'Ambient Vibes',
    albumArt: 'https://picsum.photos/seed/lofi2/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Late Night Coding',
    artist: 'Synthwave',
    albumArt: 'https://picsum.photos/seed/lofi3/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      loginAdmin: () => set({ isAdmin: true }),
      logoutAdmin: () => set({ isAdmin: false }),

      notes: initialNotes,
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updatedNote) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...updatedNote } : n)),
        })),
      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),

      downloadedNotes: [],
      addDownload: (id) =>
        set((state) => ({
          downloadedNotes: state.downloadedNotes.includes(id)
            ? state.downloadedNotes
            : [...state.downloadedNotes, id],
        })),
      removeDownload: (id) =>
        set((state) => ({
          downloadedNotes: state.downloadedNotes.filter((noteId) => noteId !== id),
        })),

      playlist: initialPlaylist,
      currentTrackIndex: 0,
      isPlaying: false,
      setPlaylist: (tracks) => set({ playlist: tracks }),
      setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      nextTrack: () => {
        const { currentTrackIndex, playlist } = get();
        set({ currentTrackIndex: (currentTrackIndex + 1) % playlist.length });
      },
      prevTrack: () => {
        const { currentTrackIndex, playlist } = get();
        set({
          currentTrackIndex:
            currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1,
        });
      },
    }),
    {
      name: 'alpha-notes-storage',
      partialize: (state) => ({
        downloadedNotes: state.downloadedNotes,
        isAdmin: state.isAdmin,
        notes: state.notes, // Persist notes so admin changes stay
      }),
    }
  )
);
