const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Contact API', () => {
  beforeEach(async () => {
    await prisma.contact.deleteMany({});
  });

  describe('POST /api/contact', () => {
    const validContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '214-555-1234',
      message: 'I need help with my car'
    };

    it('should create a new contact submission with valid data', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validContactData.name);
      expect(response.body.data.email).toBe(validContactData.email);
    });

    it('should save contact to database', async () => {
      await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(201);

      const contacts = await prisma.contact.findMany({});
      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe(validContactData.name);
    });

    it('should reject submission without name', async () => {
      const invalidData = { ...validContactData, name: '' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject submission with invalid email', async () => {
      const invalidData = { ...validContactData, email: 'not-an-email' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission with short phone number', async () => {
      const invalidData = { ...validContactData, phone: '123' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission with short message', async () => {
      const invalidData = { ...validContactData, message: 'Hi' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission with missing required fields', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should trim whitespace from inputs', async () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        phone: '  214-555-1234  ',
        message: '  I need help with my car  '
      };

      const response = await request(app)
        .post('/api/contact')
        .send(dataWithWhitespace)
        .expect(201);

      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
    });
  });
});
