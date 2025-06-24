import request from 'supertest';
import nock from 'nock';
import app from '../server.js';

beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test';
  nock('https://api.openai.com')
    .post('/v1/chat/completions')
    .reply(200, { choices: [ { message: { content: 'ok' } } ] });
});

afterAll(() => {
  nock.cleanAll();
});

describe('POST /api/ai/analizza', () => {
  it('responds with risultato', async () => {
    const res = await request(app)
      .post('/api/ai/analizza')
      .send({ nome: 'Micio', descrizione: 'sta male' });
    expect(res.statusCode).toBe(200);
    expect(res.body.risultato).toBeDefined();
  });
});
