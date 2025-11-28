const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Coupon API', () => {
  beforeEach(async () => {
    await prisma.coupon.deleteMany({});

    // Seed with test coupons
    await prisma.coupon.createMany({
      data: [
        {
          title: '$20 Off Oil Change',
          description: 'Save $20 on your next oil change service',
          code: 'OIL20',
          discount: '$20 off',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          active: true
        },
        {
          title: '15% Off Brake Service',
          description: 'Get 15% off brake pad replacement',
          code: 'BRAKE15',
          discount: '15% off',
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          active: true
        },
        {
          title: 'Expired Coupon',
          description: 'This coupon has expired',
          code: 'EXPIRED',
          discount: '$10 off',
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
          active: true
        },
        {
          title: 'Inactive Coupon',
          description: 'This coupon is inactive',
          code: 'INACTIVE',
          discount: '$25 off',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          active: false
        }
      ]
    });
  });

  describe('GET /api/coupons', () => {
    it('should return only active non-expired coupons', async () => {
      const response = await request(app)
        .get('/api/coupons')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2); // Only 2 active, non-expired coupons
    });

    it('should return coupons with all required fields', async () => {
      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      const coupon = response.body.data[0];
      expect(coupon).toHaveProperty('id');
      expect(coupon).toHaveProperty('title');
      expect(coupon).toHaveProperty('description');
      expect(coupon).toHaveProperty('code');
      expect(coupon).toHaveProperty('discount');
      expect(coupon).toHaveProperty('expiresAt');
    });

    it('should not include expired coupons', async () => {
      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      const expiredCoupon = response.body.data.find(c => c.code === 'EXPIRED');
      expect(expiredCoupon).toBeUndefined();
    });

    it('should not include inactive coupons', async () => {
      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      const inactiveCoupon = response.body.data.find(c => c.code === 'INACTIVE');
      expect(inactiveCoupon).toBeUndefined();
    });

    it('should return empty array when no active coupons exist', async () => {
      await prisma.coupon.deleteMany({});

      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
    });
  });
});
