import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Lock, Unlock, Search, BookOpen } from 'lucide-react';
import { useStore, NoteCategory } from '../store/useStore';
import { toast } from 'sonner';

const CATEGORIES: NoteCategory[] = ['Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET'];

export function Home() {
  const { notes, addDownload, downloadedNotes } = useStore();
  const [activeCategory, setActiveCategory] = useState<NoteCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = activeCategory === 'All' || note.category === activeCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (noteId: string, isPremium: boolean, price: number) => {
    if (isPremium && price > 0) {
      toast.error('Premium content', {
        description: `Please purchase this note for ₹${price} to download.`,
      });
      return;
    }
    
    addDownload(noteId);
    toast.success('Downloaded successfully', {
      description: 'You can access this note offline in the Downloads section.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 pt-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Master Your <span className="text-gradient-gold">Exams</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          One Stop Solution for Class 10, 11, 12, JEE & NEET. Premium study materials curated by experts.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === 'All' ? 'bg-gold-500 text-black' : 'glass hover:bg-white/10'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-gold-500 text-black' : 'glass hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No notes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden group hover:border-gold-500/30 transition-colors"
            >
              <div className="h-48 bg-white/5 relative overflow-hidden">
                {note.imageUrl ? (
                  <img src={note.imageUrl} alt={note.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-500/20 to-transparent">
                    <BookOpen className="w-12 h-12 text-gold-500/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {note.isPremium ? (
                    <div className="glass-gold px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gold-400">
                      <Lock className="w-3 h-3" /> Premium
                    </div>
                  ) : (
                    <div className="glass px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-green-400">
                      <Unlock className="w-3 h-3" /> Free
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="glass px-2 py-1 rounded-md text-xs font-medium text-gray-200">
                    {note.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">{note.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{note.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">
                    {note.price === 0 ? 'Free' : `₹${note.price}`}
                  </span>
                  
                  <button
                    onClick={() => handleDownload(note.id, note.isPremium, note.price)}
                    disabled={downloadedNotes.includes(note.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      downloadedNotes.includes(note.id)
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:scale-105'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {downloadedNotes.includes(note.id) ? 'Downloaded' : 'Download'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
