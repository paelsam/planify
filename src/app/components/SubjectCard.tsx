import { BookOpen } from 'lucide-react';
import type { Subject } from '../utils/storage';

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  // Use text color based on background lightness
  const isDarkBackground = ['#737373', '#525252', '#404040'].includes(subject.color);
  const textColor = isDarkBackground ? 'text-white' : 'text-black';
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full border-4 border-black p-6 text-left hover:translate-x-1 hover:translate-y-1 transition-transform ${textColor}`}
        style={{ 
          backgroundColor: subject.color,
          boxShadow: '6px 6px 0px 0px #000000'
        }}
      >
        <div className="flex items-start gap-4">
          <div className={`${isDarkBackground ? 'bg-white text-black' : 'bg-black text-white'} p-3 border-2 border-black`}>
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black mb-1">{subject.name}</h3>
            <p className="text-sm uppercase tracking-wide opacity-80">{subject.category}</p>
          </div>
        </div>
      </button>
    </div>
  );
}