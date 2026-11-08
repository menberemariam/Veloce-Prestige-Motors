export const uiPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>My Car Value — Cars Sells UI</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 0; background: #f4f6f8; color: #1a1a1a; }
  header { background: #123; color: #fff; padding: 18px 24px; }
  header h1 { margin: 0; font-size: 20px; }
  header p { margin: 4px 0 0; color: #bcd; font-size: 13px; }
  main { max-width: 960px; margin: 24px auto; padding: 0 16px 48px; display: grid; gap: 16px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
  .card { background: #fff; border: 1px solid #e2e6ea; border-radius: 10px; padding: 16px; }
  .card h2 { margin: 0 0 12px; font-size: 16px; }
  label { display: block; font-size: 12px; color: #555; margin: 10px 0 4px; }
  input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  button { margin-top: 12px; margin-right: 8px; padding: 9px 14px; border: none; border-radius: 6px; background: #123; color: #fff; font-size: 14px; cursor: pointer; }
  button.secondary { background: #eef1f4; color: #123; border: 1px solid #ccd; }
  button:hover { opacity: .9; }
  .whoami { margin-top: 12px; font-size: 13px; color: #333; }
  pre { background: #0c1220; color: #c9f7c0; padding: 14px; border-radius: 10px; overflow: auto; font-size: 12.5px; min-height: 120px; }
  .muted { color: #777; font-size: 12px; }
</style>
</head>
<body>
<header>
  <h1>My Car Value — Cars Sells UI</h1>
  <p>Single-page UI talking to the NestJS API on this same origin (port 4100). Session is kept by the browser cookie.</p>
</header>
<main>
  <div class="grid">
    <section class="card">
      <h2>1. Authentication</h2>
      <label for="email">Email</label>
      <input id="email" type="email" placeholder="me@example.com" />
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="secret123" />
      <button id="signup">Sign up</button>
      <button id="signin" class="secondary">Sign in</button>
      <button id="signout" class="secondary">Sign out</button>
      <button id="whoami" class="secondary">Who am I?</button>
      <div class="whoami" id="whoamiBox">Not signed in yet.</div>
    </section>

    <section class="card">
      <h2>2. Create a car report</h2>
      <div class="row">
        <div><label for="make">Make</label><input id="make" value="toyota" /></div>
        <div><label for="model">Model</label><input id="model" value="corolla" /></div>
      </div>
      <div class="row">
        <div><label for="year">Year</label><input id="year" type="number" value="1980" /></div>
        <div><label for="mileage">Mileage</label><input id="mileage" type="number" value="1000" /></div>
      </div>
      <div class="row">
        <div><label for="lng">Longitude</label><input id="lng" type="number" step="any" value="0" /></div>
        <div><label for="lat">Latitude</label><input id="lat" type="number" step="any" value="0" /></div>
      </div>
      <label for="price">Price</label>
      <input id="price" type="number" value="500000" />
      <button id="createReport">Submit report</button>
    </section>
  </div>

  <div class="grid">
    <section class="card">
      <h2>3. Approve a report (admin)</h2>
      <label for="rid">Report ID</label>
      <input id="rid" type="number" placeholder="1" />
      <label for="approved">Approved</label>
      <select id="approved"><option value="true">true</option><option value="false">false</option></select>
      <button id="approve">Approve</button>
      <p class="muted">New users are admins by default (User.admin defaults to true), so approval works right after sign-up.</p>
    </section>

    <section class="card">
      <h2>4. Get a price estimate</h2>
      <div class="row">
        <div><label for="emake">Make</label><input id="emake" value="toyota" /></div>
        <div><label for="emodel">Model</label><input id="emodel" value="corolla" /></div>
      </div>
      <div class="row">
        <div><label for="eyear">Year</label><input id="eyear" type="number" value="1980" /></div>
        <div><label for="emileage">Mileage</label><input id="emileage" type="number" value="1000" /></div>
      </div>
      <div class="row">
        <div><label for="elng">Longitude</label><input id="elng" type="number" step="any" value="0" /></div>
        <div><label for="elat">Latitude</label><input id="elat" type="number" step="any" value="0" /></div>
      </div>
      <button id="estimate">Get estimate</button>
      <p class="muted">Returns the average price of up to 3 approved reports matching all fields (closest mileage first).</p>
    </section>
  </div>

  <section class="card">
    <h2>API response</h2>
    <pre id="out">// responses will appear here</pre>
  </section>
</main>
<script>
  var out = document.getElementById('out');
  function log(title, status, data) {
    out.textContent = title + '  ->  HTTP ' + status + '\\n' + JSON.stringify(data, null, 2);
  }
  function val(id) { return document.getElementById(id).value; }
  function num(id) { return Number(document.getElementById(id).value); }

  async function api(title, path, options) {
    var res = await fetch(path, Object.assign({ credentials: 'include', headers: { 'content-type': 'application/json' } }, options || {}));
    var data;
    try { data = await res.json(); } catch (e) { data = await res.text(); }
    log(title, res.status, data);
    return { status: res.status, data: data };
  }
  function jsonBody(obj) { return { method: 'POST', body: JSON.stringify(obj) }; }
  function authBody() { return { email: val('email'), password: val('password') }; }
  function reportFields(prefix) {
    var p = prefix || '';
    return { make: val(p + 'make'), model: val(p + 'model'), year: num(p + 'year'), mileage: num(p + 'mileage'), lng: num(p + 'lng'), lat: num(p + 'lat') };
  }

  document.getElementById('signup').addEventListener('click', async function () {
    await api('POST /auth/signup', '/auth/signup', jsonBody(authBody()));
    refreshWhoami();
  });
  document.getElementById('signin').addEventListener('click', async function () {
    await api('POST /auth/signin', '/auth/signin', jsonBody(authBody()));
    refreshWhoami();
  });
  document.getElementById('signout').addEventListener('click', async function () {
    await api('POST /auth/signout', '/auth/signout', { method: 'POST' });
    refreshWhoami();
  });
  document.getElementById('whoami').addEventListener('click', refreshWhoami);

  async function refreshWhoami() {
    var r = await api('GET /auth/whoami', '/auth/whoami');
    document.getElementById('whoamiBox').textContent =
      r.status === 200 ? 'Signed in as: ' + r.data.email + ' (id ' + r.data.id + ')' : 'Not signed in (HTTP ' + r.status + ')';
  }

  document.getElementById('createReport').addEventListener('click', function () {
    var body = reportFields('');
    body.price = num('price');
    api('POST /reports', '/reports', { method: 'POST', body: JSON.stringify(body) });
  });
  document.getElementById('approve').addEventListener('click', function () {
    api('PATCH /reports/' + val('rid'), '/reports/' + val('rid'), {
      method: 'PATCH',
      body: JSON.stringify({ approved: val('approved') === 'true' }),
    });
  });
  document.getElementById('estimate').addEventListener('click', function () {
    var q = reportFields('e');
    var params = new URLSearchParams({
      make: q.make, model: q.model, year: q.year, mileage: q.mileage, lng: q.lng, lat: q.lat,
    });
    api('GET /reports?' + params.toString(), '/reports?' + params.toString());
  });

  refreshWhoami();
</script>
</body>
</html>
`;
