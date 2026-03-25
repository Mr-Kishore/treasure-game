// teacherStorage.ts — DB-backed via Express API
import * as api from './api';

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

const TEACHER_AUTH_KEY = 'math_adventure_teacher_auth';

// ── Question Sets (DB-backed) ────────────────────────────────────────────────

export const getQuestionSets = async (): Promise<QuestionSet[]> => {
  try {
    const { sets } = await api.getQuestionSets();
    return sets.map((s) => ({ id: s.id, name: s.name, questions: s.questions, createdAt: s.created_at }));
  } catch {
    return [];
  }
};

export const saveQuestionSet = async (questionSet: QuestionSet): Promise<void> => {
  await api.saveQuestionSet({ id: questionSet.id, name: questionSet.name, questions: questionSet.questions, createdAt: questionSet.createdAt });
};

export const deleteQuestionSet = async (id: string): Promise<void> => {
  await api.deleteQuestionSet(id);
};

export const getQuestionSetById = async (id: string): Promise<QuestionSet | undefined> => {
  try {
    const set = await api.getQuestionSetById(id);
    return { id: set.id, name: set.name, questions: set.questions, createdAt: set.created_at };
  } catch {
    return undefined;
  }
};

// ── Teacher Auth (localStorage — simple password) ────────────────────────────

export const isTeacherLoggedIn = (): boolean => localStorage.getItem(TEACHER_AUTH_KEY) === 'true';

export const teacherLogin = (password: string): boolean => {
  if (password === 'teacher123') {
    localStorage.setItem(TEACHER_AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const teacherLogout = (): void => { localStorage.removeItem(TEACHER_AUTH_KEY); };

export const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2);
