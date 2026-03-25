import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../server/index.js'
import { initDB, getDB } from '../../server/db.js'

describe('Backend API Integration Tests', () => {
  let db: any

  beforeAll(async () => {
    // Initialize test database
    initDB()
    db = getDB()
  })

  beforeEach(() => {
    // Clean up database before each test
    db.prepare('DELETE FROM students').run()
    db.prepare('DELETE FROM student_progress').run()
    db.prepare('DELETE FROM levels').run()
  })

  describe('Authentication Endpoints', () => {
    it('should register a new student', async () => {
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('student')
      expect(response.body.student.username).toBe(studentData.username)
      expect(response.body.student.name).toBe(studentData.name)
      expect(response.body.student.age).toBe(studentData.age)
      expect(response.body.student).not.toHaveProperty('password')
    })

    it('should not register student with invalid age', async () => {
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 20, // Invalid age
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(400)

      expect(response.body.error).toBe('Age must be between 4 and 18')
    })

    it('should not register student with duplicate username', async () => {
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      }

      // Register first student
      await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201)

      // Try to register with same username
      await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(409)
    })

    it('should login existing student', async () => {
      // First register a student
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      }

      await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201)

      // Then login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: studentData.username,
          password: studentData.password
        })
        .expect(200)

      expect(loginResponse.body).toHaveProperty('token')
      expect(loginResponse.body).toHaveProperty('student')
      expect(loginResponse.body.student.username).toBe(studentData.username)
    })

    it('should reject login with invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword'
        })
        .expect(401)
    })

    it('should get current student with valid token', async () => {
      // Register and login to get token
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201)

      const token = registerResponse.body.token

      // Get current student
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(meResponse.body.student.username).toBe(studentData.username)
      expect(meResponse.body.student.name).toBe(studentData.name)
    })

    it('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })

    it('should reject request without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401)
    })
  })

  describe('Game Endpoints', () => {
    let studentToken: string
    let studentId: number

    beforeEach(async () => {
      // Create a test student and get token
      const studentData = {
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201)

      studentToken = response.body.token
      studentId = response.body.student.id

      // Add some test levels
      db.prepare('INSERT INTO levels (id, title, description, difficulty, age_range, questions) VALUES (?, ?, ?, ?, ?, ?)').run(
        1, 'Level 1', 'Easy Level', 'easy', '4-6', JSON.stringify([
          { question: 'What is 2+2?', answer: '4', options: ['3', '4', '5', '6'] }
        ])
      )
    })

    it('should get all levels', async () => {
      const response = await request(app)
        .get('/api/game/levels')
        .expect(200)

      expect(response.body).toHaveProperty('levels')
      expect(Array.isArray(response.body.levels)).toBe(true)
      expect(response.body.levels.length).toBeGreaterThan(0)
    })

    it('should get specific level', async () => {
      const response = await request(app)
        .get('/api/game/level/1')
        .expect(200)

      expect(response.body).toHaveProperty('level')
      expect(response.body.level.id).toBe(1)
      expect(response.body.level.title).toBe('Level 1')
    })

    it('should save student progress', async () => {
      const progressData = {
        level_id: 1,
        score: 100,
        completed: true
      }

      const response = await request(app)
        .post('/api/game/progress')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(progressData)
        .expect(200)

      expect(response.body.success).toBe(true)
    })

    it('should get student progress', async () => {
      // First save some progress
      await request(app)
        .post('/api/game/progress')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          level_id: 1,
          score: 100,
          completed: true
        })
        .expect(200)

      // Then get progress
      const response = await request(app)
        .get('/api/game/progress')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('progress')
      expect(Array.isArray(response.body.progress)).toBe(true)
    })
  })

  describe('Root Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('endpoints')
      expect(Array.isArray(response.body.endpoints)).toBe(true)
    })
  })
})
