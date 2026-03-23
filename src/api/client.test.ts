import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { apiFetch, ApiError, API_BASE_URL } from './client';

describe('apiFetch', () => {
  it('returns parsed JSON for a 200 response', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test`, () =>
        HttpResponse.json({ hello: 'world' })
      )
    );

    const result = await apiFetch<{ hello: string }>('/test');
    expect(result).toEqual({ hello: 'world' });
  });

  it('appends query params to the URL', async () => {
    let receivedUrl = '';
    server.use(
      http.get(`${API_BASE_URL}/test`, ({ request }) => {
        receivedUrl = request.url;
        return HttpResponse.json({});
      })
    );

    await apiFetch('/test', { limit: 10, offset: 0 });
    const url = new URL(receivedUrl);
    expect(url.searchParams.get('limit')).toBe('10');
    expect(url.searchParams.get('offset')).toBe('0');
  });

  it('omits undefined query params', async () => {
    let receivedUrl = '';
    server.use(
      http.get(`${API_BASE_URL}/test`, ({ request }) => {
        receivedUrl = request.url;
        return HttpResponse.json({});
      })
    );

    await apiFetch('/test', { start_date: undefined, limit: 5 });
    const url = new URL(receivedUrl);
    expect(url.searchParams.has('start_date')).toBe(false);
    expect(url.searchParams.get('limit')).toBe('5');
  });

  it('throws ApiError with code "not_found" for 404', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test`, () =>
        HttpResponse.json({ detail: 'Not found' }, { status: 404 })
      )
    );

    await expect(apiFetch('/test')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'not_found',
      status: 404,
    });
  });

  it('throws ApiError with code "validation" for 422', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test`, () =>
        HttpResponse.json({ detail: 'Invalid param' }, { status: 422 })
      )
    );

    await expect(apiFetch('/test')).rejects.toMatchObject({
      code: 'validation',
      status: 422,
    });
  });

  it('throws ApiError with code "server_error" for 500', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test`, () =>
        HttpResponse.json({ detail: 'Internal error' }, { status: 500 })
      )
    );

    await expect(apiFetch('/test')).rejects.toMatchObject({
      code: 'server_error',
      status: 500,
    });
  });

  it('uses the detail string as the error message when present', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test`, () =>
        HttpResponse.json({ detail: 'Custom error message' }, { status: 400 })
      )
    );

    const error = await apiFetch('/test').catch((e) => e);
    expect(error.message).toBe('Custom error message');
  });
});
