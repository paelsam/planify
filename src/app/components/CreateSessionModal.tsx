import { useState } from 'react';
import { X, Bell, BellOff, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveSession, getSubjects } from '../utils/storage';
import { toast } from 'sonner';
import type { SessionGoal } from '../utils/storage';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionAdded: () => void;
}

export function CreateSessionModal({ isOpen, onClose, onSessionAdded }: CreateSessionModalProps) {
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [goalTexts, setGoalTexts] = useState<string[]>(['']);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const subjects = getSubjects();

  const addGoal = () => {
    setGoalTexts([...goalTexts, '']);
  };

  const removeGoal = (index: number) => {
    if (goalTexts.length > 1) {
      setGoalTexts(goalTexts.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goalTexts];
    newGoals[index] = value;
    setGoalTexts(newGoals);
    
    // Clear goal errors when user starts typing
    setErrors(prev => {
      const { goals: _, ...rest } = prev;
      return rest;
    });
  };

  const validateTimeRange = (): boolean => {
    if (!startTime || !endTime) return true;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
      setErrors(prev => ({ ...prev, endTime: 'La hora de fin debe ser después de la hora de inicio.' }));
      return false;
    }
    
    setErrors(prev => {
      const { endTime, ...rest } = prev;
      return rest;
    });
    return true;
  };

  const calculateDuration = (): number => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        toast.error('Recordatorios desactivados. Para activarlos, permite las notificaciones desde tu navegador.');
        setReminderEnabled(false);
      } else if (permission === 'granted') {
        toast.success('Recordatorios activados.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newErrors: Record<string, string> = {};
    
    if (!subjectId) newErrors.subjectId = 'Selecciona una materia';
    if (!date) {
      newErrors.date = 'Selecciona una fecha';
    } else {
      // Validate that date is in the future (after today)
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.date = 'Elige una fecha a partir de mañana.';
      }
    }
    if (!startTime) newErrors.startTime = 'Indica a qué hora empiezas.';
    if (!endTime) newErrors.endTime = 'Indica a qué hora terminas.';
    
    const validGoalTexts = goalTexts.filter(g => g.trim() !== '');
    if (validGoalTexts.length === 0) {
      newErrors.goals = 'Agrega al menos una meta para esta sesión.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      toast.error('Revisa los campos marcados.');
      return;
    }
    
    if (!validateTimeRange()) {
      setIsSaving(false);
      toast.error('Revisa los campos marcados.');
      return;
    }

    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      setIsSaving(false);
      toast.error('No pudimos guardar. Revisa tu conexión e inténtalo de nuevo. Tus datos no se perdieron.', {
        action: {
          label: 'Reintentar',
          onClick: () => handleSubmit(e),
        },
      });
      return;
    }

    const duration = calculateDuration();
    
    // Convert goal texts to SessionGoal objects
    const goals: SessionGoal[] = validGoalTexts.map((text, index) => ({
      id: `${Date.now()}-${index}`,
      text: text.trim(),
      completed: false,
    }));
    
    const newSession = {
      id: Date.now().toString(),
      subjectId,
      date: new Date(date).toISOString(),
      duration,
      completed: false,
      goals,
      startTime,
      endTime,
      reminderEnabled,
    };

    saveSession(newSession);
    
    toast.success('Sesión planeada. La verás en tu semana.', {
      action: {
        label: 'Ver sesiones',
        onClick: () => {
          window.location.href = '/sesiones';
        },
      },
    });
    
    // Reset form
    setSubjectId('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setGoalTexts(['']);
    setReminderEnabled(false);
    setErrors({});
    setIsSaving(false);
    
    onSessionAdded();
    onClose();
  };

  const handleReminderToggle = () => {
    if (!reminderEnabled) {
      requestNotificationPermission();
    }
    setReminderEnabled(!reminderEnabled);
  };

  return (
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
            className="bg-white border-4 border-black max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '12px 12px 0px 0px #000000' }}
          >
            <div className="flex items-center justify-between p-6 border-b-4 border-black bg-[#E5E5E5]">
              <h2 className="text-2xl font-black uppercase text-black">Crear Sesión</h2>
              <button
                onClick={onClose}
                className="bg-white text-black p-2 border-4 border-black hover:bg-gray-100"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Subject Selection */}
              <div className="mb-4">
                <label className="block font-bold mb-2 uppercase text-sm">Materia *</label>
                <select
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value);
                    setErrors(prev => {
                      const { subjectId, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                >
                  <option value="">Elige la materia que estudiarás</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="mt-2 text-red-600 font-bold text-sm">{errors.subjectId}</p>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block font-bold mb-2 uppercase text-sm">Fecha *</label>
                <input
                  type="date"
                  value={date}
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors(prev => {
                      const { date, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                />
                {errors.date && (
                  <p className="mt-2 text-red-600 font-bold text-sm">{errors.date}</p>
                )}
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">Hora Inicio *</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setErrors(prev => {
                        const { startTime, ...rest } = prev;
                        return rest;
                      });
                    }}
                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                  />
                  {errors.startTime && (
                    <p className="mt-2 text-red-600 font-bold text-xs">{errors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">Hora Fin *</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      validateTimeRange();
                    }}
                    onBlur={validateTimeRange}
                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                  />
                  {errors.endTime && (
                    <p className="mt-2 text-red-600 font-bold text-xs">{errors.endTime}</p>
                  )}
                </div>
              </div>

              {/* Duration Display */}
              {startTime && endTime && calculateDuration() > 0 && (
                <div className="mb-4 p-3 bg-[#FFD93D] border-4 border-black">
                  <p className="font-black text-sm">
                    Duración: {calculateDuration()} minutos
                  </p>
                </div>
              )}

              {/* Goals */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold uppercase text-sm">Metas de la Sesión *</label>
                  <button
                    type="button"
                    onClick={addGoal}
                    className="bg-white border-4 border-black p-1 font-black hover:bg-gray-200"
                    style={{ boxShadow: '2px 2px 0px 0px #000000' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {goalTexts.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        className="flex-1 border-4 border-black p-3 font-bold focus:outline-none focus:ring-0"
                        placeholder={`Meta ${index + 1}`}
                      />
                      {goalTexts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGoal(index)}
                          className="bg-red-500 border-4 border-black p-3 font-black hover:bg-red-600"
                          style={{ boxShadow: '3px 3px 0px 0px #000000' }}
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {errors.goals && (
                  <p className="mt-2 text-red-600 font-bold text-sm">{errors.goals}</p>
                )}
                
                <p className="mt-2 text-xs font-bold opacity-60">
                  Define al menos una meta concreta (ej.: terminar el capítulo 2).
                </p>
              </div>

              {/* Reminder Toggle */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleReminderToggle}
                  className={`w-full border-4 border-black p-4 font-black uppercase flex items-center justify-center gap-2 ${
                    reminderEnabled ? 'bg-[#6BCB77]' : 'bg-gray-200'
                  }`}
                  style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                >
                  {reminderEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                  {reminderEnabled ? 'Recordatorio Activado' : 'Activar Recordatorio'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-black text-white border-4 border-black p-4 font-black text-lg uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '6px 6px 0px 0px #000000' }}
              >
                {isSaving ? 'Guardando…' : 'Planear sesión'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}