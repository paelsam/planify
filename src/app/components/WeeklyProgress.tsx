import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { getSessions, getSubjects } from '../utils/storage';
import type { Session } from '../utils/storage';

export function WeeklyProgress({ onSessionClick }: { onSessionClick?: (session: Session) => void }) {
  const [selectedSessions, setSelectedSessions] = useState<{ sessions: Session[]; subjectName: string } | null>(null);
  
  const sessions = getSessions();
  const subjects = getSubjects();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate <= now;
  });

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  // Group sessions by day and subject
  const sessionsByDay: { [key: number]: { subjectId: string; sessions: Session[] }[] } = {};
  
  thisWeekSessions.forEach(session => {
    const day = new Date(session.date).getDay();
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = [];
    }
    
    const existing = sessionsByDay[day].find(s => s.subjectId === session.subjectId);
    if (existing) {
      existing.sessions.push(session);
    } else {
      sessionsByDay[day].push({ subjectId: session.subjectId, sessions: [session] });
    }
  });

  // Calculate max sessions for scaling
  const maxSessions = Math.max(
    ...Object.values(sessionsByDay).map(day => 
      day.reduce((sum, s) => sum + s.sessions.length, 0)
    ),
    1
  );

  const handleSessionSegmentClick = (sessionData: { subjectId: string; sessions: Session[] }) => {
    const subject = subjects.find(s => s.id === sessionData.subjectId);
    
    if (sessionData.sessions.length === 1) {
      // Si solo hay 1 sesión, abrirla directamente
      onSessionClick?.(sessionData.sessions[0]);
    } else {
      // Si hay 2 o más sesiones, mostrar el modal
      setSelectedSessions({
        sessions: sessionData.sessions,
        subjectName: subject?.name || 'Materia'
      });
    }
  };

  const handleSessionItemClick = (session: Session) => {
    setSelectedSessions(null);
    onSessionClick?.(session);
  };

  return (
    <>
      <div className="border-4 border-black p-6 bg-white" style={{ boxShadow: '8px 8px 0px 0px #000000' }}>
        <h2 className="text-2xl font-black mb-6 uppercase">Progreso Semanal</h2>
        
        {thisWeekSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg opacity-60">No hay progresos registrados esta semana</p>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-48">
            {daysOfWeek.map((day, index) => {
              const daySessions = sessionsByDay[index] || [];
              const totalCount = daySessions.reduce((sum, s) => sum + s.sessions.length, 0);
              const height = (totalCount / maxSessions) * 100;
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                    {totalCount > 0 && (
                      <div
                        className="w-full border-4 border-black flex flex-col-reverse relative"
                        style={{ 
                          height: `${height}%`,
                          boxShadow: '4px 4px 0px 0px #000000',
                          minHeight: '40px'
                        }}
                      >
                        {daySessions.map((sessionData, idx) => {
                          const subject = subjects.find(s => s.id === sessionData.subjectId);
                          const segmentHeight = (sessionData.sessions.length / totalCount) * 100;
                          const isDarkBg = ['#737373', '#525252', '#404040'].includes(subject?.color || '');
                          
                          return (
                            <div
                              key={idx}
                              onClick={() => handleSessionSegmentClick(sessionData)}
                              className={`flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${idx > 0 ? 'border-t-4 border-black' : ''} ${isDarkBg ? 'text-white' : 'text-black'}`}
                              style={{ 
                                backgroundColor: subject?.color || '#E5E5E5',
                                height: `${segmentHeight}%`,
                                minHeight: '24px'
                              }}
                            >
                              <span className="font-black text-sm">{sessionData.sessions.length}</span>
                            </div>
                          );
                        })}
                        {/* Total count at the top */}
                        {daySessions.length > 1 && (
                          <div className="hidden md:block absolute -top-6 left-0 right-0 bg-black text-white text-center py-1 border-4 border-black" style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
                            <span className="font-black text-xs">Total: {totalCount}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-sm uppercase">{day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de lista de sesiones */}
      <AnimatePresence>
        {selectedSessions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSessions(null)}
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
                <h2 className="text-2xl font-black uppercase text-white">
                  {selectedSessions.subjectName}
                </h2>
                <button
                  onClick={() => setSelectedSessions(null)}
                  className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <p className="font-bold mb-4 uppercase text-sm opacity-70">
                  {selectedSessions.sessions.length} {selectedSessions.sessions.length === 1 ? 'Sesión' : 'Sesiones'}
                </p>
                
                <div className="space-y-3">
                  {selectedSessions.sessions.map((session, idx) => {
                    const sessionDate = new Date(session.date);
                    const timeStr = session.startTime || '';
                    
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSessionItemClick(session)}
                        className="border-4 border-black p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-lg">#{idx + 1}</span>
                          <span className={`font-bold text-sm px-2 py-1 border-2 border-black ${session.completed ? 'bg-[#6BCB77] text-white' : 'bg-[#FFD93D] text-black'}`}>
                            {session.completed ? 'COMPLETADA' : 'PENDIENTE'}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-bold text-sm">
                            📅 {sessionDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                          {timeStr && (
                            <p className="font-bold text-sm">
                              🕒 {timeStr}
                            </p>
                          )}
                          {session.goals && session.goals.length > 0 && (
                            <p className="font-bold text-sm">
                              🎯 {session.goals.filter(g => g.completed).length}/{session.goals.length} metas completadas
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}