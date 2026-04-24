import request from 'supertest';
import app from '../index';

describe('GET /api/brand', () => {
  it('should return the brand name', async () => {
    const response = await request(app).get('/api/brand');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: 'Scoot PTE LTD' });
  });
});
