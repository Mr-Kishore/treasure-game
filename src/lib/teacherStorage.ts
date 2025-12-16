export interface TeacherQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  questions: TeacherQuestion[];
  createdAt: number;
}

const STORAGE_KEY = 'math_adventure_question_sets';
const TEACHER_AUTH_KEY = 'math_adventure_teacher_auth';

export const getQuestionSets = (): QuestionSet[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveQuestionSet = (questionSet: QuestionSet): void => {
  const sets = getQuestionSets();
  const existingIndex = sets.findIndex(s => s.id === questionSet.id);
  if (existingIndex >= 0) {
    sets[existingIndex] = questionSet;
  } else {
    sets.push(questionSet);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
};

export const deleteQuestionSet = (id: string): void => {
  const sets = getQuestionSets().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
};

export const getQuestionSetById = (id: string): QuestionSet | undefined => {
  return getQuestionSets().find(s => s.id === id);
};

export const isTeacherLoggedIn = (): boolean => {
  return localStorage.getItem(TEACHER_AUTH_KEY) === 'true';
};

export const teacherLogin = (password: string): boolean => {
  // Simple password for demo - in production use proper auth
  if (password === 'teacher123') {
    localStorage.setItem(TEACHER_AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const teacherLogout = (): void => {
  localStorage.removeItem(TEACHER_AUTH_KEY);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
