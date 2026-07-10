import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  getSessions,
  getSubjects,
  updateSession,
} from "../utils/storage";
import { SessionCard } from "../components/SessionCard";
import { CreateSessionModal } from "../components/CreateSessionModal";
import { EditSessionModal } from "../components/EditSessionModal";
import type { Session, Subject } from "../utils/storage";

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] =
    useState<Session | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const allSessions = getSessions();
    // Sort by date (upcoming first)
    const sortedSessions = allSessions.sort((a, b) => {
      return (
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
    setSessions(sortedSessions);
    setSubjects(getSubjects());
  }, [refresh]);

  const handleSessionClick = (session: Session) => {
    setEditingSession(session);
  };

  const getSubjectById = (id: string) => {
    return subjects.find((s) => s.id === id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div
            className="bg-white border-4 border-black p-6"
            style={{ boxShadow: "8px 8px 0px 0px #000000" }}
          >
            <div className="flex items-center justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">
                  Sesiones
                </h1>
                <p className="text-lg font-bold opacity-70">
                  Organiza tu semana y avanza con foco.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white border-4 border-black px-4 md:px-6 py-3 font-black text-sm md:text-base uppercase hover:bg-gray-800 flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ boxShadow: "4px 4px 0px 0px #000000" }}
              >
                <Plus size={20} />
                Crear Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {sessions.length === 0 ? (
          <div
            className="border-4 border-black p-12 text-center bg-[#ffffff]"
            style={{ boxShadow: "8px 8px 0px 0px #000000" }}
          >
            <p className="text-2xl font-black mb-2">
              Aún no tienes sesiones
            </p>
            <p className="text-lg font-bold mb-6 opacity-70">
              Planea tu primera sesión y empieza a estudiar con foco.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white border-4 border-black px-8 py-4 font-black text-lg uppercase hover:bg-gray-800"
              style={{ boxShadow: "6px 6px 0px 0px #000000" }}
            >
              + Planear sesión
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming Sessions */}
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase mb-4">
                Próximas Sesiones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions
                  .filter(
                    (session) => {
                      const todayBogota = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
                      const sessionDateStr = session.date.split('T')[0];
                      return !session.completed && sessionDateStr >= todayBogota;
                    }
                  )
                  .map((session) => {
                    const subject = getSubjectById(
                      session.subjectId,
                    );
                    if (!subject) return null;
                    return (
                      <SessionCard
                        key={session.id}
                        session={session}
                        subject={subject}
                        onClick={() =>
                          handleSessionClick(session)
                        }
                      />
                    );
                  })}
              </div>
              {sessions.filter(
                (session) => {
                  const todayBogota = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
                  const sessionDateStr = session.date.split('T')[0];
                  return !session.completed && sessionDateStr >= todayBogota;
                }
              ).length === 0 && (
                <div
                  className="bg-white border-4 border-black p-8 text-center"
                  style={{
                    boxShadow: "6px 6px 0px 0px #000000",
                  }}
                >
                  <p className="text-lg font-bold opacity-60">
                    Esta semana no tienes sesiones próximas. Crea una para mantener tu ritmo.
                  </p>
                </div>
              )}
            </div>

            {/* Completed Sessions */}
            <div>
              <h2 className="text-3xl font-black uppercase mb-4">
                Sesiones Completadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions
                  .filter((session) => session.completed)
                  .map((session) => {
                    const subject = getSubjectById(
                      session.subjectId,
                    );
                    if (!subject) return null;
                    return (
                      <SessionCard
                        key={session.id}
                        session={session}
                        subject={subject}
                        onClick={() =>
                          handleSessionClick(session)
                        }
                      />
                    );
                  })}
              </div>
              {sessions.filter((session) => session.completed)
                .length === 0 && (
                <div
                  className="bg-white border-4 border-black p-8 text-center"
                  style={{
                    boxShadow: "6px 6px 0px 0px #000000",
                  }}
                >
                  <p className="text-lg font-bold opacity-60">
                    Aún no completas sesiones. Cada una suma a tus metas.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <CreateSessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSessionAdded={() => setRefresh((prev) => prev + 1)}
        />

        <EditSessionModal
          isOpen={!!editingSession}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSessionUpdated={() =>
            setRefresh((prev) => prev + 1)
          }
        />
      </div>
    </div>
  );
}