import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

export const initDB = () => {
  db = new Database(path.join(__dirname, 'treasure_hunt.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    UNIQUE NOT NULL,
      name        TEXT    NOT NULL,
      age         INTEGER NOT NULL CHECK(age BETWEEN 4 AND 18),
      password    TEXT    NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_progress (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL,
      level        INTEGER NOT NULL,
      score        INTEGER NOT NULL DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(student_id, level)
    );

    CREATE TABLE IF NOT EXISTS question_sets (
      id         TEXT PRIMARY KEY,
      name       TEXT    NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id            TEXT PRIMARY KEY,
      set_id        TEXT    NOT NULL,
      question      TEXT    NOT NULL,
      option1       TEXT    NOT NULL,
      option2       TEXT    NOT NULL,
      option3       TEXT    NOT NULL,
      option4       TEXT    NOT NULL,
      correct_index INTEGER NOT NULL DEFAULT 0,
      hint          TEXT,
      FOREIGN KEY (set_id) REFERENCES question_sets(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ SQLite database initialised');
};

export const getDB = () => {
  if (!db) throw new Error('DB not initialised — call initDB() first');
  return db;
};
