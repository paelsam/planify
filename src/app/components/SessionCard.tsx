import { Calendar, Clock, Target, CheckCircle2 } from 'lucide-react';
import type { Session, Subject } from '../utils/storage';

interface SessionCardProps {
  session: Session;
  subject: Subject;
  onClick?: () => void;
  onToggleComplete?: (id: string) => void;
}

export function SessionCard({ session, subject, onClick, onToggleComplete }: SessionCardProps) {
  const sessionDate = new Date(session.date);
  const isToday = new Date().toDateString() === sessionDate.toDateString();
  const isPast = sessionDate < new Date() && !isToday;
  
  const formattedDate = sessionDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const completedGoals = session.goals?.filter(g => g.completed).length || 0;
  const totalGoals = session.goals?.length || 0;
  
  // Use text color based on background lightness
  const isDarkBackground = ['#737373', '#525252', '#404040'].includes(subject.color);
  const textColor = isDarkBackground ? 'text-white' : 'text-black';

  return (
    <div
      onClick={onClick}
      className={`border-4 border-black p-4 hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer ${textColor}`}
      style={{ 
        backgroundColor: session.completed ? '#E5E5E5' : subject.color,
        boxShadow: '6px 6px 0px 0px #000000'
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-black mb-1">{subject.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold opacity-80">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formattedDate}
            </span>
            {isToday && (
              <span className="bg-black text-white px-2 py-1 text-xs font-black uppercase">
                HOY
              </span>
            )}
          </div>
        </div>
        
        {session.completed && (
          <div className="p-2 bg-[#6BCB77] border-2 border-black">
            <CheckCircle2 size={20} />
          </div>
        )}
      </div>

      {session.goals && session.goals.length > 0 && (
        <div className="mb-3 p-3 bg-white border-2 border-black">
          <div className="flex items-start gap-2 mb-2">
            <Target size={16} className="mt-0.5 flex-shrink-0" />
            <p className="font-black text-xs uppercase">
              Metas: {completedGoals}/{totalGoals}
            </p>
          </div>
          <ul className="space-y-1 ml-6">
            {session.goals.map((goal, index) => (
              <li 
                key={goal.id} 
                className={`font-bold text-sm list-disc ${goal.completed ? 'line-through opacity-60' : ''}`}
              >
                {goal.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm font-black">
        {session.startTime && session.endTime && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {session.startTime} - {session.endTime}
          </span>
        )}
        <span>{session.duration} min</span>
      </div>
    </div>
  );
}