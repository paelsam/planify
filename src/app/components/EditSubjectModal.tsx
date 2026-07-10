import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { updateSubject, getCategories, deleteSubject } from '../utils/storage';
import type { Subject } from '../utils/storage';
import { toast } from 'sonner';
import { ConfirmationModal } from './ConfirmationModal';

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectUpdated: () => void;
  onSubjectDeleted?: () => void;
  subject: Subject | null;
}

const COLORS = [
  // Monocromáticos
  '#FFFFFF', '#F5F5F5', '#E5E5E5', '#D4D4D4', '#A3A3A3', '#737373', '#525252', '#404040',
  // Colores vibrantes
  '#FF6B6B', '#FF8C42', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', 
  '#FF69B4', '#FF6347', '#FFA500', '#32CD32', '#00CED1', '#9370DB',
  '#FF1493', '#FF4500', '#FFD700', '#00FA9A', '#1E90FF', '#BA55D3'
];

export function EditSubjectModal({ isOpen, onClose, onSubjectUpdated, onSubjectDeleted, subject }: EditSubjectModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState(() => getCategories());

  // Update categories when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategories(getCategories());
    }
  }, [isOpen]);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setCategory(subject.category);
      setSelectedColor(subject.color);
    }
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject) {
      setError('Error: No se pudo encontrar la materia');
      return;
    }
    
    if (!name.trim()) {
      setError('Escribe un nombre para la materia');
      return;
    }

    updateSubject(subject.id, {
      name: name.trim(),
      category: category || categories[0]?.name || 'Sin categoría',
      color: selectedColor,
    });

    toast.success('Materia actualizada');
    setError('');
    onClose();
    onSubjectUpdated();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteSubject(subject.id);
    toast.success('Materia eliminada');
    onSubjectDeleted?.();
    onClose();
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && subject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-black max-w-md w-full max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: '12px 12px 0px 0px #000000' }}
            >
              <div className="flex items-center justify-between p-6 border-b-4 border-black bg-[#4D96FF]">
                <h2 className="text-2xl font-black uppercase text-white">Editar Materia</h2>
                <button
                  onClick={onClose}
                  className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block font-bold mb-2 uppercase text-sm">Nombre *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                    placeholder="Ej: Matemáticas"
                  />
                  {error && (
                    <p className="mt-2 text-red-600 font-bold text-sm">{error}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-2 uppercase text-sm">Categoría</label>
                  
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs font-bold opacity-70">
                    Ve a la sección "Categorías" para gestionar tus categorías
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-2 uppercase text-sm">Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-12 border-4 border-black ${selectedColor === color ? 'ring-4 ring-black' : ''}`}
                        style={{ 
                          backgroundColor: color,
                          boxShadow: selectedColor === color ? '4px 4px 0px 0px #000000' : '2px 2px 0px 0px #000000'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-gray-800 transition-colors mb-3"
                  style={{ boxShadow: '6px 6px 0px 0px #4D96FF' }}
                >
                  Guardar Cambios
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  style={{ boxShadow: '6px 6px 0px 0px #000000' }}
                >
                  <Trash2 size={20} />
                  Eliminar Materia
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Eliminar Materia"
        message="¿Estás seguro de que quieres eliminar esta materia? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}