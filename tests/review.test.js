const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Review API', () => {
  beforeEach(async () => {
    await prisma.review.deleteMany({});

    // Seed with test reviews
    await prisma.review.createMany({
      data: [
        {
          customerName: 'John Smith',
          rating: 5,
          comment: 'Excellent service! Very professional and honest.',
          serviceName: 'Oil Change',
          isApproved: true
        },
        {
          customerName: 'Jane Doe',
          rating: 4,
          comment: 'Good experience, will come back.',
          serviceName: 'Brake Service',
          isApproved: true
        },
        {
          customerName: 'Bob Johnson',
          rating: 5,
          comment: 'Best auto shop in Dallas!',
          serviceName: 'Engine Repair',
          isApproved: true
        },
        {
          customerName: 'Pending Review',
          rating: 5,
          comment: 'This review is pending approval',
          serviceName: 'Tire Service',
          isApproved: false
        }
      ]
    });
  });

  describe('GET /api/reviews', () => {
    it('should return only approved reviews', async () => {
      const response = await request(app)
        .get('/api/reviews')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.reviews).toHaveLength(3); // Only approved reviews
    });

    it('should not include unapproved reviews', async () => {
      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      const pendingReview = response.body.data.reviews.find(
        r => r.customerName === 'Pending Review'
      );
      expect(pendingReview).toBeUndefined();
    });

    it('should return reviews with all required fields', async () => {
      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      const review = response.body.data.reviews[0];
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('customerName');
      expect(review).toHaveProperty('rating');
      expect(review).toHaveProperty('comment');
      expect(review).toHaveProperty('serviceName');
      expect(review).toHaveProperty('createdAt');
    });

    it('should support pagination with limit parameter', async () => {
      const response = await request(app)
        .get('/api/reviews?limit=2')
        .expect(200);

      expect(response.body.data.reviews).toHaveLength(2);
    });

    it('should support pagination with offset parameter', async () => {
      const response = await request(app)
        .get('/api/reviews?offset=1&limit=2')
        .expect(200);

      expect(response.body.data.reviews).toHaveLength(2);
    });

    it('should return total count of reviews', async () => {
      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      expect(response.body.data).toHaveProperty('total', 3);
    });

    it('should default to limit of 10', async () => {
      // Create 15 reviews
      const manyReviews = Array.from({ length: 15 }, (_, i) => ({
        customerName: `Customer ${i}`,
        rating: 5,
        comment: `Review ${i}`,
        serviceName: 'Test Service',
        isApproved: true
      }));

      await prisma.review.deleteMany({});
      await prisma.review.createMany({ data: manyReviews });

      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      expect(response.body.data.reviews.length).toBeLessThanOrEqual(10);
    });

    it('should return empty array when no reviews exist', async () => {
      await prisma.review.deleteMany({});

      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      expect(response.body.data.reviews).toHaveLength(0);
      expect(response.body.data.total).toBe(0);
    });
  });
});
