import { motion } from 'motion/react';
import { BookOpen, Trash2, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Downloads() {
  const { notes, downloadedNotes, removeDownload } = useStore();

  const downloadedNotesData = notes.filter((note) => downloadedNotes.includes(note.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Your <span className="text-gradient-gold">Downloads</span></h1>
        <p className="text-gray-400">Access your study materials offline anytime.</p>
      </motion.div>

      {downloadedNotesData.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <BookOpen className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No downloads yet</h2>
          <p className="text-gray-400">Explore notes and download them for offline access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloadedNotesData.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <button
                  onClick={() => removeDownload(note.id)}
                  className="p-2 hover:bg-red-500/20 rounded-full transition-colors group"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{note.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{note.description}</p>
              
              <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                Open Note
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
