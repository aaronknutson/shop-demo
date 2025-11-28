const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Quote API', () => {
  beforeEach(async () => {
    await prisma.quote.deleteMany({});
  });

  describe('POST /api/quote', () => {
    const validQuoteData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '214-555-5678',
      vehicleMake: 'Toyota',
      vehicleModel: 'Camry',
      vehicleYear: '2020',
      serviceType: 'Oil Change',
      message: 'Need an oil change next week'
    };

    it('should create a new quote request with valid data', async () => {
      const response = await request(app)
        .post('/api/quote')
        .send(validQuoteData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.vehicleMake).toBe(validQuoteData.vehicleMake);
    });

    it('should save quote to database', async () => {
      await request(app)
        .post('/api/quote')
        .send(validQuoteData)
        .expect(201);

      const quotes = await prisma.quote.findMany({});
      expect(quotes).toHaveLength(1);
      expect(quotes[0].vehicleModel).toBe(validQuoteData.vehicleModel);
    });

    it('should reject submission without name', async () => {
      const invalidData = { ...validQuoteData, name: '' };

      const response = await request(app)
        .post('/api/quote')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission with invalid email', async () => {
      const invalidData = { ...validQuoteData, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/quote')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission without vehicle make', async () => {
      const invalidData = { ...validQuoteData, vehicleMake: '' };

      const response = await request(app)
        .post('/api/quote')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject submission without service type', async () => {
      const invalidData = { ...validQuoteData, serviceType: '' };

      const response = await request(app)
        .post('/api/quote')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should accept submission without optional message', async () => {
      const { message, ...dataWithoutMessage } = validQuoteData;

      const response = await request(app)
        .post('/api/quote')
        .send(dataWithoutMessage)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
    });
  });
});
