import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { updateSession, deleteSession, getSubjects, autoCompleteSessions } from '../utils/storage';
import { toast } from 'sonner';
import type { Session, SessionGoal } from '../utils/storage';
import { ConfirmationModal } from './ConfirmationModal';

interface EditSessionModalProps {
  isOpen: boolean;
  session: Session | null;
  onClose: () => void;
  onSessionUpdated: () => void;
}

export function EditSessionModal({ isOpen, session, onClose, onSessionUpdated }: EditSessionModalProps) {
  const [goals, setGoals] = useState<SessionGoal[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const subjects = getSubjects();
  
  // Update goals when session changes
  useEffect(() => {
    if (session?.goals) {
      setGoals(session.goals);
    }
  }, [session]);

  const toggleGoalComplete = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    
    updateSession(session.id, { goals: updatedGoals });
    
    // Check if session should be auto-completed
    const allGoalsCompleted = updatedGoals.every(g => g.completed);
    if (allGoalsCompleted) {
      updateSession(session.id, { completed: true });
      toast.success('¡Sesión completada automáticamente! Todas las metas cumplidas');
      onSessionUpdated();
      setTimeout(() => onClose(), 1500);
    } else {
      toast.success('Meta actualizada');
      onSessionUpdated();
    }
  };

  const handleMarkSessionComplete = () => {
    const allGoalsCompleted = goals.every(g => g.completed);
    
    if (!allGoalsCompleted) {
      toast.error('Debes completar todas las metas primero');
      return;
    }
    
    updateSession(session.id, { completed: true });
    onSessionUpdated();
    toast.success('¡Sesión completada!');
    onClose();
  };

  const handleDeleteSession = () => {
    deleteSession(session.id);
    onSessionUpdated();
    toast.success('Sesión eliminada');
    onClose();
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  if (!session) return null;

  const subject = subjects.find(s => s.id === session.subjectId);
  
  // Extraer solo la parte YYYY-MM-DD para evitar conversión UTC→local que retrocede el día
  const datePart = session.date.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  const sessionDate = new Date(year, month - 1, day);
  const formattedDate = sessionDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota'
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: '12px 12px 0px 0px #000000' }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b-4 border-black"
                style={{ backgroundColor: subject?.color || '#6BCB77' }}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase mb-1">{subject?.name}</h2>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <Calendar size={14} />
                    {formattedDate}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Session Info */}
                <div className="mb-6 p-4 bg-gray-100 border-4 border-black">
                  <div className="flex items-center gap-4 text-sm font-black">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {session.startTime} - {session.endTime}
                    </span>
                    <span>{session.duration} minutos</span>
                    {session.completed && (
                      <span className="bg-[#6BCB77] px-3 py-1 text-xs uppercase">
                        Completada
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-black uppercase text-sm">Progreso de Metas</p>
                    <p className="font-black text-sm">{completedGoals}/{goals.length}</p>
                  </div>
                  <div className="h-4 bg-gray-200 border-4 border-black">
                    <div 
                      className="h-full bg-[#6BCB77] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Goals List */}
                <div className="mb-6">
                  <h3 className="font-black uppercase text-xl mb-4 bg-black text-white p-3 border-4 border-black" style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
                    Metas de la Sesión ({goals.length})
                  </h3>
                  {goals.length === 0 ? (
                    <div className="text-center py-8 border-4 border-black bg-gray-100">
                      <p className="font-bold text-lg opacity-60">No hay metas en esta sesión</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div
                          key={goal.id}
                          className="border-4 border-black p-5 flex items-start gap-4 hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer"
                          onClick={() => toggleGoalComplete(goal.id)}
                          style={{ 
                            backgroundColor: goal.completed ? '#06B6D4' : '#F5F5F5',
                            boxShadow: '6px 6px 0px 0px #000000'
                          }}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 border-4 border-black flex items-center justify-center ${
                              goal.completed ? 'bg-white' : 'bg-white'
                            }`}
                            style={{ boxShadow: '3px 3px 0px 0px #000000' }}
                          >
                            {goal.completed && (
                              <X size={24} strokeWidth={4} className="text-[#06B6D4]" />
                            )}
                          </div>
                          <p className={`flex-1 font-black text-lg pt-0.5 ${goal.completed ? 'line-through opacity-80' : ''}`}>
                            {goal.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!session.completed && (
                    <button
                      onClick={handleMarkSessionComplete}
                      className="w-full bg-[#6BCB77] text-black border-4 border-black p-4 font-black text-lg uppercase hover:bg-[#5AB567]"
                      style={{ boxShadow: '6px 6px 0px 0px #000000' }}
                    >
                      Marcar Sesión como Completada
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full bg-[#EF4444] text-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-red-600 flex items-center justify-center gap-2"
                    style={{ boxShadow: '6px 6px 0px 0px #000000' }}
                  >
                    <Trash2 size={20} />
                    Eliminar Sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSession}
        title="Eliminar Sesión"
        message="¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}