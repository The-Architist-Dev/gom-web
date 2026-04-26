/* eslint-disable no-console */
/**
 * API integration test runner.
 *
 * Usage:
 *   node scripts/test-api.js
 *
 * Env (optional):
 *   API_BASE   - base URL (default http://127.0.0.1:8000/api)
 *   TEST_EMAIL - email used to register a fresh user (default tester+timestamp@example.com)
 *   TEST_PWD   - password (default Test1234!)
 */

const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8000/api';
const RANDOM = Date.now().toString(36);
const TEST_EMAIL = process.env.TEST_EMAIL || `tester_${RANDOM}@example.com`;
const TEST_PWD = process.env.TEST_PWD || 'Test1234!';

// ── ANSI colors ──
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red:   '\x1b[31m',
  yellow:'\x1b[33m',
  cyan:  '\x1b[36m',
  gray:  '\x1b[90m',
  bold:  '\x1b[1m',
};

const client = axios.create({
  baseURL: API_BASE,
  validateStatus: () => true,
  timeout: 30000,
});

let token = null;
const results = [];

function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function step(name, fn, { expectStatus, soft } = {}) {
  const t0 = Date.now();
  let pass = false;
  let info = '';
  let res = null;
  try {
    res = await fn();
    const status = res?.status ?? 0;
    if (Array.isArray(expectStatus)) {
      pass = expectStatus.includes(status);
    } else if (expectStatus !== undefined) {
      pass = status === expectStatus;
    } else {
      pass = status >= 200 && status < 400;
    }
    info = `HTTP ${status}`;
  } catch (e) {
    info = e.message || 'error';
  }
  const dt = Date.now() - t0;
  const tag = pass ? `${c.green}PASS${c.reset}` : (soft ? `${c.yellow}SKIP${c.reset}` : `${c.red}FAIL${c.reset}`);
  console.log(`  ${tag} ${c.gray}${dt}ms${c.reset}  ${name} ${c.gray}${info}${c.reset}`);
  results.push({ name, pass, soft, dt, info });
  return res;
}

function section(title) {
  console.log(`\n${c.bold}${c.cyan}━━ ${title} ${c.reset}`);
}

(async () => {
  console.log(`${c.bold}API Test Runner${c.reset}`);
  console.log(`Base : ${c.cyan}${API_BASE}${c.reset}`);
  console.log(`Email: ${c.cyan}${TEST_EMAIL}${c.reset}`);

  // ─────────── Public ───────────
  section('Public');
  await step('GET /health', () => client.get('/health'));
  await step('GET /test', () => client.get('/test'));
  await step('GET /stats', () => client.get('/stats'));
  await step('GET /ceramic-lines', () => client.get('/ceramic-lines'));
  await step('GET /ceramic-lines?featured=1', () => client.get('/ceramic-lines', { params: { featured: 1 } }));

  // ─────────── Validation errors ───────────
  section('Validation errors');
  await step(
    'POST /login (empty) → 422',
    () => client.post('/login', {}),
    { expectStatus: [400, 422] }
  );
  await step(
    'POST /register (invalid email) → 422',
    () => client.post('/register', { name: 'T', email: 'invalid', password: '123' }),
    { expectStatus: [400, 422] }
  );
  await step(
    'POST /contact (empty) → 422',
    () => client.post('/contact', {}),
    { expectStatus: [400, 422] }
  );

  // ─────────── Auth ───────────
  section('Auth');
  await step(
    'POST /register (new user)',
    () => client.post('/register', { name: 'API Tester', email: TEST_EMAIL, password: TEST_PWD }),
    { expectStatus: [201, 200] }
  );

  const loginRes = await step(
    'POST /login (correct credentials)',
    () => client.post('/login', { email: TEST_EMAIL, password: TEST_PWD })
  );
  token = loginRes?.data?.token || loginRes?.data?.data?.token;
  if (!token) {
    console.log(`${c.red}No token returned from login. Aborting authed tests.${c.reset}`);
  }

  await step(
    'POST /login (wrong password) → 401',
    () => client.post('/login', { email: TEST_EMAIL, password: 'wrongpwd' }),
    { expectStatus: 401 }
  );

  // ─────────── Authed ───────────
  if (token) {
    section('Authenticated endpoints');

    await step('GET /user', () => client.get('/user', { headers: authHeaders() }));
    await step('GET /history', () => client.get('/history', { headers: authHeaders() }));
    await step('GET /payment/packages', () => client.get('/payment/packages', { headers: authHeaders() }));
    await step('GET /payment/history', () => client.get('/payment/history', { headers: authHeaders() }));
    await step('GET /payment/status', () => client.get('/payment/status', { headers: authHeaders() }));

    await step(
      'POST /payment/create (invalid package) → 422',
      () => client.post('/payment/create', { package_id: 999 }, { headers: authHeaders() }),
      { expectStatus: [400, 422] }
    );

    const createRes = await step(
      'POST /payment/create (valid package)',
      () => client.post('/payment/create', { package_id: 1 }, { headers: authHeaders() })
    );
    const paymentId = createRes?.data?.data?.id || createRes?.data?.payment_id || createRes?.data?.id;
    if (paymentId) {
      await step(
        `GET /payment/check/${paymentId}`,
        () => client.get(`/payment/check/${paymentId}`, { headers: authHeaders() })
      );
    }

    await step(
      'POST /predict (no file) → 422',
      () => client.post('/predict', {}, { headers: authHeaders() }),
      { expectStatus: [400, 422] }
    );

    await step(
      'POST /ai/chat (empty) → 422',
      () => client.post('/ai/chat', {}, { headers: authHeaders() }),
      { expectStatus: [400, 422] }
    );

    await step(
      'POST /profile/password (wrong current) → 401',
      () =>
        client.post(
          '/profile/password',
          {
            current_password: 'definitely-wrong',
            new_password: 'NewPass123!',
            new_password_confirmation: 'NewPass123!',
          },
          { headers: authHeaders() }
        ),
      { expectStatus: [401, 422] }
    );
  }

  // ─────────── Unauthorized ───────────
  section('Unauthorized');
  await step('GET /user (no token) → 401', () => client.get('/user'), { expectStatus: 401 });
  await step('GET /history (no token) → 401', () => client.get('/history'), { expectStatus: 401 });
  await step('POST /predict (no token) → 401', () => client.post('/predict', {}), { expectStatus: 401 });
  await step(
    'GET /admin/dashboard (regular user) → 401/403',
    () => client.get('/admin/dashboard', { headers: authHeaders() }),
    { expectStatus: [401, 403], soft: true }
  );

  // ─────────── Logout ───────────
  if (token) {
    section('Logout');
    await step('POST /logout', () => client.post('/logout', null, { headers: authHeaders() }));
    await step(
      'GET /user after logout → 401',
      () => client.get('/user', { headers: authHeaders() }),
      { expectStatus: 401 }
    );
  }

  // ─────────── Summary ───────────
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass && !r.soft).length;
  const skipped = results.filter((r) => !r.pass && r.soft).length;

  console.log(`\n${c.bold}Summary${c.reset}`);
  console.log(`  ${c.green}Passed : ${passed}${c.reset}`);
  console.log(`  ${c.red}Failed : ${failed}${c.reset}`);
  console.log(`  ${c.yellow}Skipped: ${skipped}${c.reset}`);
  console.log(`  Total  : ${results.length}`);

  process.exitCode = failed > 0 ? 1 : 0;
})().catch((err) => {
  console.error(`${c.red}Test runner crashed:${c.reset}`, err.message);
  process.exitCode = 2;
});
