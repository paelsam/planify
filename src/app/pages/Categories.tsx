import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategories, saveCategory, updateCategory, deleteCategory, getSubjects } from '../utils/storage';
import type { Category } from '../utils/storage';
import { toast } from 'sonner';
import { ConfirmationModal } from '../components/ConfirmationModal';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    setCategories(getCategories());
  }, [refresh]);

  const handleAddCategory = (name: string) => {
    if (!name.trim()) {
      toast.error('Escribe un nombre para la categoría.');
      return;
    }

    const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast.error('Ya tienes una categoría con ese nombre. Usa otro.');
      return;
    }

    saveCategory(name.trim());
    toast.success('Categoría creada. Úsala al agregar tus materias.');
    setIsAddModalOpen(false);
    setRefresh(prev => prev + 1);
  };

  const handleUpdateCategory = (id: string, name: string) => {
    if (!name.trim()) {
      toast.error('Escribe un nombre para la categoría.');
      return;
    }

    const exists = categories.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast.error('Ya tienes una categoría con ese nombre. Usa otro.');
      return;
    }

    updateCategory(id, name.trim());
    toast.success('Categoría actualizada.');
    setEditingCategory(null);
    setRefresh(prev => prev + 1);
  };

  const handleDeleteCategory = (category: Category) => {
    const subjects = getSubjects();
    const hasSubjects = subjects.some(s => s.category === category.name);

    if (hasSubjects) {
      toast.error('Esta categoría tiene materias asociadas. Reasígnalas antes de eliminarla.');
      return;
    }

    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      const success = deleteCategory(categoryToDelete.id);
      if (success) {
        toast.success('Categoría eliminada.');
        setRefresh(prev => prev + 1);
      } else {
        toast.error('No pudimos eliminar la categoría. Inténtalo de nuevo.');
      }
    }
    setCategoryToDelete(null);
  };

  const getCategoryUsageCount = (categoryName: string) => {
    const subjects = getSubjects();
    return subjects.filter(s => s.category === categoryName).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div 
          className="bg-white border-4 border-black p-4 md:p-6 mb-6 md:mb-8"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 flex items-center gap-2 md:gap-3">
                <Tag size={32} className="md:w-10 md:h-10" />
                Categorías
              </h1>
              <p className="text-base md:text-lg font-bold opacity-70">
                Agrupa tus materias por área para encontrarlas más rápido.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-black text-white border-4 border-black px-4 md:px-6 py-3 font-black text-base md:text-lg uppercase hover:bg-gray-800 flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{ boxShadow: '6px 6px 0px 0px #000000' }}
            >
              <Plus size={20} />
              Nueva
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div 
          className="bg-white border-4 border-black p-4 md:p-6"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg md:text-xl font-black opacity-70">
                Aún no tienes categorías
              </p>
              <p className="text-xs md:text-sm font-bold opacity-50 mt-2">
                Crea la primera para agrupar tus materias por área.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => {
                const usageCount = getCategoryUsageCount(category.name);
                const isInUse = usageCount > 0;

                return (
                  <div
                    key={category.id}
                    className="bg-gray-100 border-4 border-black p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-black">{category.name}</h3>
                      <p className="text-xs md:text-sm font-bold opacity-70 mt-1">
                        {usageCount} {usageCount === 1 ? 'materia' : 'materias'}
                      </p>
                    </div>

                    <div className="flex gap-2 sm:gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="flex-1 sm:flex-none bg-white border-4 border-black px-3 md:px-4 py-2 font-black text-xs md:text-sm uppercase hover:bg-gray-200 flex items-center justify-center gap-2"
                        style={{ boxShadow: '3px 3px 0px 0px #000000' }}
                      >
                        <Edit2 size={16} />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        disabled={isInUse}
                        className={`flex-1 sm:flex-none border-4 border-black px-3 md:px-4 py-2 font-black text-xs md:text-sm uppercase flex items-center justify-center gap-2 ${
                          isInUse 
                            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        style={{ boxShadow: '3px 3px 0px 0px #000000' }}
                        title={isInUse ? 'No se puede eliminar una categoría en uso' : 'Eliminar categoría'}
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div 
          className="bg-yellow-100 border-4 border-black p-4 mt-6 flex gap-3"
          style={{ boxShadow: '4px 4px 0px 0px #000000' }}
        >
          <AlertCircle size={24} className="flex-shrink-0 mt-1" />
          <div>
            <p className="font-black text-sm">
              Las categorías en uso no se pueden eliminar
            </p>
            <p className="text-sm font-bold opacity-70 mt-1">
              Para eliminar una categoría, primero debes eliminar o reasignar todas las materias que la usan.
            </p>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <CategoryModal
          title="Nueva Categoría"
          initialValue=""
          onSave={handleAddCategory}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryModal
          title="Editar Categoría"
          initialValue={editingCategory.name}
          onSave={(name) => handleUpdateCategory(editingCategory.id, name)}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {/* Confirmation Modal */}
      {categoryToDelete && (
        <ConfirmationModal
          isOpen={!!categoryToDelete}
          title="Eliminar Categoría"
          message={`Vas a eliminar la categoría "${categoryToDelete.name}". Esta acción no se puede deshacer.`}
          onConfirm={confirmDeleteCategory}
          onClose={() => setCategoryToDelete(null)}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      )}
    </div>
  );
}

interface CategoryModalProps {
  title: string;
  initialValue: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

function CategoryModal({ title, initialValue, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }
    setError('');
    onSave(name);
  };

  return (
    <AnimatePresence>
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
          className="bg-white border-4 border-black p-6 w-full max-w-md"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <h2 className="text-2xl font-black uppercase mb-6">{title}</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-black mb-2 uppercase">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setError(''); }}
                className={`w-full border-4 ${error ? 'border-red-500' : 'border-black'} p-3 font-bold focus:outline-none focus:ring-4 focus:ring-black`}
                placeholder="Ej: Ciencias, Arte, Deportes..."
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-600 font-black text-sm">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-gray-800 transition-colors"
                style={{ boxShadow: '6px 6px 0px 0px #4D96FF' }}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-gray-200 transition-colors"
                style={{ boxShadow: '6px 6px 0px 0px #000000' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}