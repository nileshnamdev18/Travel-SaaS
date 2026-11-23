import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app';

const app = createApp();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpulse';
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
}, 30000);

describe('Health', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Packages', () => {
  it('GET /api/packages returns list', async () => {
    const res = await request(app).get('/api/packages?limit=3');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Guest booking', () => {
  it('POST /api/bookings creates guest inquiry', async () => {
    const pkgs = await request(app).get('/api/packages?limit=1');
    const id = pkgs.body.data[0]._id;
    const res = await request(app).post('/api/bookings').send({
      packageId: id,
      customerPhone: '+91 99999 99999',
      customerName: 'Test Guest',
      travelDateFrom: '2026-12-25',
      adults: 2
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bookingRef).toMatch(/^TCH-/);
    expect(res.body.data.status).toBe('inquiry_received');
  });
});

describe('Config', () => {
  it('GET /api/config/holiday returns public config', async () => {
    const res = await request(app).get('/api/config/holiday');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('groupDiscountPercent');
  });
});

describe('Reviews', () => {
  it('GET /api/packages/:id/reviews returns list', async () => {
    const pkgs = await request(app).get('/api/packages?limit=1');
    const id = pkgs.body.data[0]._id;
    const res = await request(app).get(`/api/packages/${id}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Departures', () => {
  it('GET /api/packages/:id/departures returns list', async () => {
    const pkgs = await request(app).get('/api/packages?limit=1');
    const id = pkgs.body.data[0]._id;
    const res = await request(app).get(`/api/packages/${id}/departures`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
