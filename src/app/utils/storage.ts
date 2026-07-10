export interface Subject {
  id: string;
  name: string;
  category: string;
  color: string;
  createdAt: string;
}

export interface SessionGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Session {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  completed: boolean;
  goals: SessionGoal[];
  startTime?: string;
  endTime?: string;
  reminderEnabled?: boolean;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Goal {
  id: string;
  subjectId: string;
  description: string;
  achieved: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

// Storage keys
const KEYS = {
  USER: 'session_user',
  SUBJECTS: 'session_subjects',
  SESSIONS: 'session_sessions',
  TASKS: 'session_tasks',
  GOALS: 'session_goals',
  CATEGORIES: 'session_categories',
};

// User functions
export const saveUser = (user: User) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem(KEYS.USER);
};

// Subject functions
export const getSubjects = (): Subject[] => {
  const data = localStorage.getItem(KEYS.SUBJECTS);
  return data ? JSON.parse(data) : [];
};

export const saveSubject = (subject: Subject) => {
  const subjects = getSubjects();
  subjects.push(subject);
  localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
};

export const deleteSubject = (id: string) => {
  const subjects = getSubjects().filter(s => s.id !== id);
  localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
};

export const updateSubject = (id: string, updates: Partial<Subject>) => {
  const subjects = getSubjects();
  const index = subjects.findIndex(s => s.id === id);
  if (index !== -1) {
    subjects[index] = { ...subjects[index], ...updates };
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  }
};

// Category functions
export const getCategories = (): Category[] => {
  const data = localStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

export const saveCategory = (name: string) => {
  const categories = getCategories();
  const newCategory: Category = {
    id: Date.now().toString(),
    name
  };
  categories.push(newCategory);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
};

export const updateCategory = (id: string, name: string) => {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  if (category) {
    const oldName = category.name;
    category.name = name;
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    
    // Update all subjects that use this category
    const subjects = getSubjects();
    subjects.forEach(subject => {
      if (subject.category === oldName) {
        subject.category = name;
      }
    });
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  }
};

export const deleteCategory = (id: string) => {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  
  if (category) {
    // Check if any subjects use this category
    const subjects = getSubjects();
    const hasSubjects = subjects.some(s => s.category === category.name);
    
    if (hasSubjects) {
      return false; // Cannot delete category in use
    }
    
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
    return true;
  }
  
  return false;
};

// Session functions
export const getSessions = (): Session[] => {
  const data = localStorage.getItem(KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: Session) => {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

export const updateSession = (id: string, updates: Partial<Session>) => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  }
};

export const deleteSession = (id: string) => {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

// Auto-complete sessions based on time or goals
export const autoCompleteSessions = () => {
  const sessions = getSessions();
  let updated = false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  sessions.forEach(session => {
    if (session.completed) return; // Skip already completed sessions
    
    const sessionDate = new Date(session.date).toISOString().split('T')[0];
    
    // Check if all goals are completed
    const allGoalsCompleted = session.goals.length > 0 && session.goals.every(g => g.completed);
    
    // Check if session time has passed (only for today's sessions)
    let timePassed = false;
    if (session.endTime && sessionDate === currentDate) {
      const [endHour, endMinute] = session.endTime.split(':').map(Number);
      const sessionEndTime = endHour * 60 + endMinute;
      timePassed = currentTime > sessionEndTime;
    } else if (sessionDate < currentDate) {
      // Session was in the past
      timePassed = true;
    }
    
    // Auto-complete if conditions are met
    if (allGoalsCompleted || timePassed) {
      session.completed = true;
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  }
  
  return updated;
};

// Task functions
export const getTasks = (): Task[] => {
  const data = localStorage.getItem(KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const saveTask = (task: Task) => {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const toggleTaskComplete = (id: string) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }
};

// Goal functions
export const getGoals = (): Goal[] => {
  const data = localStorage.getItem(KEYS.GOALS);
  return data ? JSON.parse(data) : [];
};

export const saveGoal = (goal: Goal) => {
  const goals = getGoals();
  goals.push(goal);
  localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
};

export const toggleGoalAchieved = (id: string) => {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);
  if (goal) {
    goal.achieved = !goal.achieved;
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  }
};

// Initialize sample data
export const initializeSampleData = () => {
  // No longer loads data automatically - app starts empty
};

// Load test data (can be called manually via button)
export const loadTestData = () => {
  // Clear existing data first
  clearAllData();
  
  // Initialize categories
  const defaultCategories: Category[] = [
    { id: '1', name: 'Ciencias Exactas' },
    { id: '2', name: 'Humanidades' },
    { id: '3', name: 'Tecnología' },
    { id: '4', name: 'Artes' },
    { id: '5', name: 'Deportes' },
    { id: '6', name: 'Idiomas' },
  ];
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCategories));

  const sampleSubjects: Subject[] = [
    {
      id: '1',
      name: 'Matemáticas Avanzadas',
      category: 'Ciencias Exactas',
      color: '#EF4444',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Historia Contemporánea',
      category: 'Humanidades',
      color: '#F97316',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Programación Web',
      category: 'Tecnología',
      color: '#3B82F6',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Física Cuántica',
      category: 'Ciencias Exactas',
      color: '#8B5CF6',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Literatura Española',
      category: 'Humanidades',
      color: '#EC4899',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Inglés Avanzado',
      category: 'Idiomas',
      color: '#10B981',
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Química Orgánica',
      category: 'Ciencias Exactas',
      color: '#14B8A6',
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      name: 'Diseño Gráfico',
      category: 'Artes',
      color: '#F59E0B',
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      name: 'Base de Datos',
      category: 'Tecnología',
      color: '#6366F1',
      createdAt: new Date().toISOString(),
    },
    {
      id: '10',
      name: 'Filosofía Moderna',
      category: 'Humanidades',
      color: '#84CC16',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(sampleSubjects));

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const sampleSessions: Session[] = [
    { 
      id: '1', 
      subjectId: '1', 
      date: twoDaysAgo.toISOString(), 
      duration: 60, 
      completed: true,
      goals: [
        { id: '1-1', text: 'Resolver ejercicios de derivadas', completed: true },
        { id: '1-2', text: 'Revisar teoremas fundamentales', completed: true },
      ],
      startTime: '09:00',
      endTime: '10:00'
    },
    { 
      id: '2', 
      subjectId: '2', 
      date: twoDaysAgo.toISOString(), 
      duration: 45, 
      completed: true,
      goals: [
        { id: '2-1', text: 'Leer capítulo sobre Guerra Fría', completed: true },
      ],
      startTime: '14:00',
      endTime: '14:45'
    },
    { 
      id: '3', 
      subjectId: '6', 
      date: yesterday.toISOString(), 
      duration: 90, 
      completed: true,
      goals: [
        { id: '3-1', text: 'Practicar conversación', completed: true },
        { id: '3-2', text: 'Estudiar vocabulario unidad 8', completed: true },
        { id: '3-3', text: 'Hacer ejercicios de gramática', completed: true },
      ],
      startTime: '16:00',
      endTime: '17:30',
      reminderEnabled: false
    },
    { 
      id: '4', 
      subjectId: '4', 
      date: yesterday.toISOString(), 
      duration: 120, 
      completed: true,
      goals: [
        { id: '4-1', text: 'Estudiar principio de incertidumbre', completed: true },
        { id: '4-2', text: 'Resolver problemas del cuaderno', completed: true },
      ],
      startTime: '10:00',
      endTime: '12:00'
    },
    { 
      id: '5', 
      subjectId: '3', 
      date: today.toISOString(), 
      duration: 90, 
      completed: false,
      goals: [
        { id: '5-1', text: 'Implementar sistema de autenticación', completed: false },
        { id: '5-2', text: 'Crear componentes reutilizables', completed: false },
      ],
      startTime: '10:00',
      endTime: '11:30',
      reminderEnabled: true
    },
    { 
      id: '6', 
      subjectId: '8', 
      date: today.toISOString(), 
      duration: 60, 
      completed: false,
      goals: [
        { id: '6-1', text: 'Diseñar mockups para proyecto', completed: false },
      ],
      startTime: '15:00',
      endTime: '16:00',
      reminderEnabled: true
    },
    { 
      id: '7', 
      subjectId: '5', 
      date: today.toISOString(), 
      duration: 75, 
      completed: false,
      goals: [
        { id: '7-1', text: 'Analizar poema de García Lorca', completed: false },
        { id: '7-2', text: 'Escribir ensayo sobre el Romanticismo', completed: false },
      ],
      startTime: '18:00',
      endTime: '19:15',
      reminderEnabled: false
    },
    { 
      id: '8', 
      subjectId: '7', 
      date: tomorrow.toISOString(), 
      duration: 90, 
      completed: false,
      goals: [
        { id: '8-1', text: 'Estudiar reacciones de sustitución', completed: false },
        { id: '8-2', text: 'Practicar nomenclatura IUPAC', completed: false },
        { id: '8-3', text: 'Preparar material para laboratorio', completed: false },
      ],
      startTime: '09:00',
      endTime: '10:30',
      reminderEnabled: true
    },
    { 
      id: '9', 
      subjectId: '9', 
      date: tomorrow.toISOString(), 
      duration: 120, 
      completed: false,
      goals: [
        { id: '9-1', text: 'Diseñar esquema entidad-relación', completed: false },
        { id: '9-2', text: 'Normalizar base de datos', completed: false },
      ],
      startTime: '14:00',
      endTime: '16:00',
      reminderEnabled: true
    },
    { 
      id: '10', 
      subjectId: '1', 
      date: tomorrow.toISOString(), 
      duration: 60, 
      completed: false,
      goals: [
        { id: '10-1', text: 'Resolver integrales múltiples', completed: false },
      ],
      startTime: '17:00',
      endTime: '18:00',
      reminderEnabled: false
    },
    { 
      id: '11', 
      subjectId: '10', 
      date: dayAfter.toISOString(), 
      duration: 90, 
      completed: false,
      goals: [
        { id: '11-1', text: 'Leer textos de Kant', completed: false },
        { id: '11-2', text: 'Debate sobre ética moderna', completed: false },
      ],
      startTime: '11:00',
      endTime: '12:30',
      reminderEnabled: true
    },
    { 
      id: '12', 
      subjectId: '6', 
      date: dayAfter.toISOString(), 
      duration: 45, 
      completed: false,
      goals: [
        { id: '12-1', text: 'Estudiar phrasal verbs', completed: false },
      ],
      startTime: '16:00',
      endTime: '16:45',
      reminderEnabled: false
    },
    { 
      id: '13', 
      subjectId: '4', 
      date: dayAfter.toISOString(), 
      duration: 120, 
      completed: false,
      goals: [
        { id: '13-1', text: 'Resolver ecuación de Schrödinger', completed: false },
        { id: '13-2', text: 'Estudiar dualidad onda-partícula', completed: false },
        { id: '13-3', text: 'Preparar presentación', completed: false },
      ],
      startTime: '09:00',
      endTime: '11:00',
      reminderEnabled: true
    },
  ];
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sampleSessions));

  const sampleTasks: Task[] = [
    { id: '1', subjectId: '1', title: 'Resolver ejercicios cap. 5', completed: true, dueDate: new Date().toISOString() },
    { id: '2', subjectId: '2', title: 'Leer páginas 45-67', completed: false, dueDate: new Date().toISOString() },
    { id: '3', subjectId: '3', title: 'Proyecto final', completed: false, dueDate: new Date().toISOString() },
  ];
  localStorage.setItem(KEYS.TASKS, JSON.stringify(sampleTasks));

  const sampleGoals: Goal[] = [
    { id: '1', subjectId: '1', description: 'Estudiar 3 veces por semana', achieved: true },
    { id: '2', subjectId: '2', description: 'Completar todas las lecturas', achieved: false },
  ];
  localStorage.setItem(KEYS.GOALS, JSON.stringify(sampleGoals));
};

// Clear all application data (useful for testing)
export const clearAllData = () => {
  localStorage.removeItem(KEYS.SUBJECTS);
  localStorage.removeItem(KEYS.SESSIONS);
  localStorage.removeItem(KEYS.TASKS);
  localStorage.removeItem(KEYS.GOALS);
  localStorage.removeItem(KEYS.CATEGORIES);
};