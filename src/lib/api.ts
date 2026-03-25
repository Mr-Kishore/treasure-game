const BASE = '/api';

const getToken = () => localStorage.getItem('student_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const req = async (method: string, path: string, body?: unknown) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────
export interface Student {
  id: number;
  username: string;
  name: string;
  age: number;
}

export interface AuthResponse {
  token: string;
  student: Student;
}

export const registerStudent = (payload: {
  username: string;
  name: string;
  age: number;
  password: string;
}): Promise<AuthResponse> => req('POST', '/auth/register', payload);

export const loginStudent = (username: string, password: string): Promise<AuthResponse> =>
  req('POST', '/auth/login', { username, password });

export const getMe = (): Promise<{ student: Student }> => req('GET', '/auth/me');

// ── Progress ─────────────────────────────────────────────────────────────
export const saveProgress = (level: number, score: number) =>
  req('POST', '/progress', { level, score });

export const getProgress = (): Promise<{ progress: { level: number; score: number; completed_at: string }[] }> =>
  req('GET', '/progress');

// ── Question Sets ─────────────────────────────────────────────────────────
export interface TeacherQuestionAPI {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
}

export interface QuestionSetAPI {
  id: string;
  name: string;
  questions: TeacherQuestionAPI[];
  created_at: number;
}

export const getQuestionSets = (): Promise<{ sets: QuestionSetAPI[] }> => req('GET', '/question-sets');

export const saveQuestionSet = (set: {
  id: string;
  name: string;
  questions: TeacherQuestionAPI[];
  createdAt: number;
}) => req('POST', '/question-sets', set);

export const deleteQuestionSet = (id: string) => req('DELETE', `/question-sets/${id}`);

export const getQuestionSetById = (id: string): Promise<QuestionSetAPI> => req('GET', `/question-sets/${id}`);

// ── Students (teacher view) ────────────────────────────────────────────────
export const getAllStudents = (): Promise<{
  students: (Student & { levelsCompleted: number; created_at: string })[];
}> => req('GET', '/students');

// ── Session helpers ────────────────────────────────────────────────────────
export const setSession = (token: string, student: Student) => {
  localStorage.setItem('student_token', token);
  localStorage.setItem('student_data', JSON.stringify(student));
};

export const clearSession = () => {
  localStorage.removeItem('student_token');
  localStorage.removeItem('student_data');
};

export const getStoredStudent = (): Student | null => {
  try {
    const raw = localStorage.getItem('student_data');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
