import { useState, useEffect } from 'react';
import { Target, Clock, Calendar as CalendarIcon, Database, Tag, BookOpen, Play, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router';
import { MetricCard } from '../components/MetricCard';
import { SubjectCard } from '../components/SubjectCard';
import { SessionCard } from '../components/SessionCard';
import { WeeklyProgress } from '../components/WeeklyProgress';
import { AddSubjectModal } from '../components/AddSubjectModal';
import { EditSubjectModal } from '../components/EditSubjectModal';
import { CreateSessionModal } from '../components/CreateSessionModal';
import { EditSessionModal } from '../components/EditSessionModal';
import { getSubjects, getSessions, getCategories, autoCompleteSessions, loadTestData, initializeSampleData } from '../utils/storage';
import type { Subject, Session } from '../utils/storage';
import { toast } from 'sonner';

export function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [refresh, setRefresh] = useState(0);

  // Banco de frases motivacionales
  const motivationalQuotes = [
    "El éxito es la suma de pequeños esfuerzos diarios.",
    "Ser mejor que ayer ya es avanzar.",
    "Cada logro empieza con la decisión de intentarlo.",
    "Hoy basta con avanzar un paso.",
    "La disciplina conecta tus metas con tus logros.",
    "No cuentes los días: haz que cuenten.",
    "La constancia abre camino al aprendizaje.",
    "Cada página leída te acerca a tu meta.",
    "Las metas sin acción se quedan en deseos.",
    "Estudiar hoy es ahorrarte estrés mañana.",
    "El esfuerzo de hoy es el resultado de mañana.",
    "Empezar es la parte más difícil. Ya empezaste.",
    "Convierte cada obstáculo en una pregunta nueva.",
    "Cada sesión cuenta. Estás construyendo tu progreso.",
    "Aprender es un tesoro que se queda contigo."
  ];

  const [dailyQuote] = useState(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem('dailyQuote');
    const savedDate = localStorage.getItem('dailyQuoteDate');
    
    if (savedDate === today && savedQuote) {
      return savedQuote;
    }
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    localStorage.setItem('dailyQuote', randomQuote);
    localStorage.setItem('dailyQuoteDate', today);
    return randomQuote;
  });

  useEffect(() => {
    autoCompleteSessions();
    setSubjects(getSubjects());
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = autoCompleteSessions();
      if (updated) {
        setRefresh(prev => prev + 1);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const sessions = getSessions();
  const categories = getCategories();

  const completedSessions = sessions.filter(s => s.completed).length;

  const achievedGoals = sessions.reduce((total, session) => {
    const completedGoalsInSession = session.goals?.filter(g => g.completed).length || 0;
    return total + completedGoalsInSession;
  }, 0);

  const upcomingSessions = sessions
    .filter(s => !s.completed && new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const handleSessionClick = (session: Session) => {
    setEditingSession(session);
  };

  const handleSubjectClick = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const getSubjectById = (id: string) => {
    return subjects.find(s => s.id === id);
  };

  const handleLoadTestData = () => {
    loadTestData();
    setRefresh(prev => prev + 1);
    toast.success('Datos de ejemplo cargados. Bórralos cuando quieras.');
  };

  // Determine onboarding state
  const hasCategories = categories.length > 0;
  const hasSubjects = subjects.length > 0;
  const hasSessions = sessions.length > 0;
  const isOnboarding = !hasSubjects || !hasSessions;

  const onboardingSteps = [
    {
      number: 1,
      label: 'Crear una Categoría',
      description: 'Organiza tus materias por área de estudio.',
      done: hasCategories,
      active: !hasCategories,
    },
    {
      number: 2,
      label: 'Agregar una Materia',
      description: 'Define la materia a la que dedicarás tiempo.',
      done: hasSubjects,
      active: hasCategories && !hasSubjects,
    },
    {
      number: 3,
      label: 'Planear tu primera sesión',
      description: 'Define cuándo estudiarás y qué meta quieres alcanzar.',
      done: hasSessions,
      active: hasSubjects && !hasSessions,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div
            className="bg-white border-4 border-black p-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{ boxShadow: '8px 8px 0px 0px #000000' }}
          >
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">PLANIFY</h1>
              <p className="text-lg font-bold opacity-70">Tu semana de estudio</p>
            </div>

            <div className="bg-[#FFD93D] border-4 border-black p-4 flex items-center justify-center" style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
              <p className="text-sm md:text-base font-black text-center leading-tight">
                "{dailyQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* ── ONBOARDING GUIDE ── */}
        {isOnboarding && (
          <div
            className="border-4 border-black bg-white p-6 md:p-8 mb-8"
            style={{ boxShadow: '8px 8px 0px 0px #000000' }}
          >
            <div className="mb-6">
              <span className="inline-block bg-black text-white font-black text-xs uppercase px-3 py-1 mb-3">
                Primeros pasos
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase">Configura Planify en 3 pasos</h2>
              <p className="font-bold opacity-60 mt-1">
                Crea una categoría, agrega una materia y planea tu primera sesión.
              </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {onboardingSteps.map((step, idx) => (
                <div key={step.number} className="flex md:flex-col flex-row gap-3 flex-1 relative">
                  {/* Connector line (only between steps) */}
                  {idx < onboardingSteps.length - 1 && (
                    null
                  )}

                  <div
                    className={`border-4 border-black p-4 flex-1 relative z-10 ${
                      step.done
                        ? 'bg-[#6BCB77]'
                        : step.active
                        ? 'bg-[#FFD93D]'
                        : 'bg-gray-100 opacity-50'
                    }`}
                    style={{ boxShadow: step.active ? '6px 6px 0px 0px #000000' : '4px 4px 0px 0px #000000' }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {step.done ? (
                        <CheckCircle2 size={28} strokeWidth={3} className="flex-shrink-0" />
                      ) : (
                        <div className={`w-7 h-7 rounded-full border-4 border-black flex items-center justify-center flex-shrink-0 ${step.active ? 'bg-black text-white' : 'bg-white'}`}>
                          <span className="font-black text-sm">{step.number}</span>
                        </div>
                      )}
                      <span className={`font-black text-sm uppercase ${step.done ? 'line-through opacity-70' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className={`font-bold text-sm ${step.done ? 'opacity-50' : 'opacity-70'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active step CTA */}
            {!hasCategories && (
              <Link
                to="/categorias"
                className="inline-flex items-center gap-3 bg-black text-white border-4 border-black px-6 py-4 font-black text-base uppercase hover:bg-gray-800 transition-colors"
                style={{ boxShadow: '6px 6px 0px 0px #FFD93D' }}
              >
                <Tag size={20} />
                Crear mi primera categoría
                <ChevronRight size={20} />
              </Link>
            )}

            {hasCategories && !hasSubjects && (
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="inline-flex items-center gap-3 bg-black text-white border-4 border-black px-6 py-4 font-black text-base uppercase hover:bg-gray-800 transition-colors"
                style={{ boxShadow: '6px 6px 0px 0px #FFD93D' }}
              >
                <BookOpen size={20} />
                Agregar mi primera materia
                <ChevronRight size={20} />
              </button>
            )}

            {hasSubjects && !hasSessions && (
              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="inline-flex items-center gap-3 bg-black text-white border-4 border-black px-6 py-4 font-black text-base uppercase hover:bg-gray-800 transition-colors"
                style={{ boxShadow: '6px 6px 0px 0px #6BCB77' }}
              >
                <Play size={20} />
                Planear mi primera sesión
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {/* ── DASHBOARD CONTENT (only when there's data) ── */}
        {hasSubjects && (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MetricCard
                title="Sesiones Realizadas"
                value={completedSessions}
                color="#E5E5E5"
                icon={<Clock />}
              />
              <MetricCard
                title="Metas Cumplidas"
                value={achievedGoals}
                color="#06B6D4"
                icon={<Target />}
              />
            </div>

            {/* "Create first session" banner — shown when subjects exist but no sessions yet */}
            {!hasSessions && (
              <div
                className="border-4 border-black bg-[#FFD93D] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ boxShadow: '8px 8px 0px 0px #000000' }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-black text-[#FFD93D] border-4 border-black p-3">
                    <Play size={28} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-black text-xl uppercase">Tus materias están listas</p>
                    <p className="font-bold opacity-70">Planea cuándo estudiarlas para empezar la semana.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSessionModalOpen(true)}
                  className="flex-shrink-0 bg-black text-white border-4 border-black px-6 py-3 font-black text-sm uppercase hover:bg-gray-800 flex items-center gap-2"
                  style={{ boxShadow: '6px 6px 0px 0px #000000' }}
                >
                  <Play size={18} />
                  Crear Sesión
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Upcoming Sessions Preview */}
            {upcomingSessions.length > 0 && (
              <div className="mb-8">
                <div
                  className="bg-white border-4 border-black p-6"
                  style={{ boxShadow: '8px 8px 0px 0px #000000' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-black uppercase flex items-center gap-2">
                      <CalendarIcon size={32} />
                      Próximas Sesiones
                    </h2>
                    <Link
                      to="/sesiones"
                      className="bg-black text-white border-4 border-black px-4 py-2 font-black text-sm uppercase hover:bg-gray-800"
                      style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                    >
                      Ver Todas
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingSessions.map(session => {
                      const subject = getSubjectById(session.subjectId);
                      if (!subject) return null;
                      return (
                        <SessionCard
                          key={session.id}
                          session={session}
                          subject={subject}
                          onClick={() => handleSessionClick(session)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Progress */}
            {hasSessions && (
              <div className="mb-8">
                <WeeklyProgress onSessionClick={handleSessionClick} />
              </div>
            )}

            {/* Subjects Section */}
            <div
              className="bg-white border-4 border-black p-6 mb-8"
              style={{ boxShadow: '8px 8px 0px 0px #000000' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black uppercase">Mis Materias</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSessionModalOpen(true)}
                    className="bg-black text-white border-4 border-black px-2 md:px-4 py-2 font-black text-xs md:text-sm uppercase hover:bg-gray-800"
                    style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                  >
                    <span className="hidden sm:inline">+ Sesión</span>
                    <span className="sm:hidden">+S</span>
                  </button>
                  <button
                    onClick={() => setIsSubjectModalOpen(true)}
                    className="bg-black text-white border-4 border-black px-2 md:px-4 py-2 font-black text-xs md:text-sm uppercase hover:bg-gray-800"
                    style={{ boxShadow: '4px 4px 0px 0px #000000' }}
                  >
                    <span className="hidden sm:inline">+ Materia</span>
                    <span className="sm:hidden">+M</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <SubjectCard
                    key={`${subject.id}-${subject.category}-${refresh}`}
                    subject={subject}
                    onClick={() => handleSubjectClick(subject)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <AddSubjectModal
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          onSubjectAdded={() => setRefresh(prev => prev + 1)}
        />

        <EditSubjectModal
          isOpen={!!editingSubject}
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSubjectUpdated={() => setRefresh(prev => prev + 1)}
          onSubjectDeleted={() => setRefresh(prev => prev + 1)}
        />

        <CreateSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          onSessionAdded={() => setRefresh(prev => prev + 1)}
        />

        <EditSessionModal
          isOpen={!!editingSession}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSessionUpdated={() => setRefresh(prev => prev + 1)}
        />

        <button
          onClick={handleLoadTestData}
          className="bg-blue-500 text-white border-4 border-black px-4 py-2 font-black text-sm uppercase hover:bg-blue-700 flex items-center gap-2"
          style={{ boxShadow: '4px 4px 0px 0px #000000' }}
        >
          <Database size={16} />
          Cargar Datos de Prueba
        </button>
      </div>
    </div>
  );
}