/**
 * The registry Worker: it counts successful item downloads and never changes or breaks the answer.
 */
/* global Request, Response */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import worker from './index.mjs';

function setup({ status = 200, write } = {}) {
  const points = [];
  const answer = new Response('{}', { status });
  const env = {
    ASSETS: { fetch: async () => answer },
    REGISTRY_DOWNLOADS: { writeDataPoint: write ?? ((point) => points.push(point)) },
  };
  return { answer, env, points };
}

const get = (path, init) => new Request(`https://docs.wideset.co${path}`, init);

describe('registry worker', () => {
  it('counts an item with its name, user agent, country and network', async () => {
    const { env, points } = setup();
    const request = get('/r/button.json', { headers: { 'user-agent': 'shadcn' } });
    Object.defineProperty(request, 'cf', { value: { country: 'PL', asOrganization: 'Orange' } });

    await worker.fetch(request, env);

    assert.deepEqual(points, [
      { indexes: ['button'], blobs: ['button', 'shadcn', 'PL', 'Orange'], doubles: [1] },
    ]);
  });

  it('returns the assets response itself', async () => {
    const { answer, env } = setup();
    assert.equal(await worker.fetch(get('/r/button.json'), env), answer);
  });

  it('does not count a missing item', async () => {
    const { env, points } = setup({ status: 404 });
    await worker.fetch(get('/r/nope.json'), env);
    assert.equal(points.length, 0);
  });

  it('does not count a HEAD request or a path that is not an item', async () => {
    const { env, points } = setup();
    await worker.fetch(get('/r/button.json', { method: 'HEAD' }), env);
    await worker.fetch(get('/r/'), env);
    assert.equal(points.length, 0);
  });

  it('still answers when the count fails', async () => {
    const { answer, env } = setup({
      write: () => {
        throw new Error('analytics down');
      },
    });
    assert.equal(await worker.fetch(get('/r/button.json'), env), answer);
  });

  it('works without the binding (staging, previews)', async () => {
    const { answer, env } = setup();
    delete env.REGISTRY_DOWNLOADS;
    assert.equal(await worker.fetch(get('/r/button.json'), env), answer);
  });
});
