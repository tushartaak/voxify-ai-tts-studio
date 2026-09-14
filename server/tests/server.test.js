import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Voxify Backend API Tests', () => {
  // 1. Test Health Endpoint
  describe('GET /api/health', () => {
    it('should return 200 and health status indicating browser-native speech engine', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toBe('Voxify API is running');
      expect(res.body.speechEngine).toBe('browser-native-web-speech-api');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('provider');
      expect(res.body.provider.billingRequired).toBe(false);
      expect(res.body.provider.cloudCredentialsRequired).toBe(false);
    });
  });

  // 2. Test Legacy TTS endpoints informational behavior
  describe('Legacy TTS endpoints', () => {
    it('should return notice for /api/tts pointing to browser Web Speech API', async () => {
      const res = await request(app).post('/api/tts').send({ text: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.speechEngine).toBe('browser-native-web-speech-api');
      expect(res.body.message).toContain('browser Web Speech API');
    });

    it('should return notice for /api/voices pointing to browser Web Speech API', async () => {
      const res = await request(app).get('/api/voices');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.speechEngine).toBe('browser-native-web-speech-api');
    });
  });

  // 3. Test 404 for undefined routes
  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/non-existent-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
