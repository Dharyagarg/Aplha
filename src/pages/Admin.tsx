import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit, LogOut, Image as ImageIcon } from 'lucide-react';
import { useStore, Note, NoteCategory } from '../store/useStore';
import { toast } from 'sonner';

const CATEGORIES: NoteCategory[] = ['Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET'];

export function Admin() {
  const { isAdmin, logoutAdmin, notes, addNote, deleteNote, updateNote } = useStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    description: '',
    category: 'Class 10',
    price: 0,
    isPremium: false,
    imageUrl: '',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      updateNote(editingId, formData);
      toast.success('Note updated successfully');
    } else {
      addNote({
        ...formData,
        id: Date.now().toString(),
      } as Note);
      toast.success('Note added successfully');
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', description: '', category: 'Class 10', price: 0, isPremium: false, imageUrl: '' });
  };

  const handleEdit = (note: Note) => {
    setFormData(note);
    setEditingId(note.id);
    setIsAdding(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold">Admin <span className="text-gradient-gold">Dashboard</span></h1>
          <p className="text-gray-400">Manage your study materials and content.</p>
        </motion.div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
              setFormData({ title: '', description: '', category: 'Class 10', price: 0, isPremium: false, imageUrl: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 text-black font-medium hover:bg-gold-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Cancel' : 'Add Note'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-8 border-gold-500/30"
        >
          <h2 className="text-xl font-semibold mb-6">{editingId ? 'Edit Note' : 'Add New Note'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as NoteCategory })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500/50 [&>option]:bg-neutral-900"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-gold-500/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 glass rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => {
                      const isPremium = e.target.checked;
                      setFormData({ ...formData, isPremium, price: isPremium ? formData.price || 99 : 0 });
                    }}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span className="text-sm font-medium">Premium Content</span>
                </label>
              </div>

              {formData.isPremium && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required={formData.isPremium}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500/50"
                  />
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold hover:scale-[1.02] transition-transform"
              >
                {editingId ? 'Save Changes' : 'Publish Note'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Notes List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{note.title}</td>
                  <td className="px-6 py-4">
                    <span className="glass px-2 py-1 rounded-md text-xs">{note.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {note.isPremium ? (
                      <span className="text-gold-400 text-xs font-bold">Premium</span>
                    ) : (
                      <span className="text-green-400 text-xs font-bold">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-4">₹{note.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this note?')) {
                            deleteNote(note.id);
                            toast.success('Note deleted');
                          }
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No notes available. Add some content!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
