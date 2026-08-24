const COOKIE = "lm_auth";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loginPage(error) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>محمي 💗</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(1200px 800px at 50% -10%, #2a0d1f 0%, #0a0510 60%, #050208 100%);
    font-family: -apple-system, "Segoe UI", Tahoma, sans-serif; color: #f6dce8;
  }
  .card {
    width: min(92vw, 380px); padding: 38px 30px; text-align: center;
    background: rgba(40, 12, 30, 0.55); border: 1px solid rgba(255, 160, 200, 0.25);
    border-radius: 22px; backdrop-filter: blur(8px);
    box-shadow: 0 0 60px rgba(255, 120, 170, 0.18);
  }
  .heart { font-size: 46px; margin-bottom: 6px; filter: drop-shadow(0 0 14px rgba(255,120,170,.7)); }
  h1 { font-size: 22px; font-weight: 600; margin: 6px 0 4px; color: #ffd4e6; }
  p { font-size: 14px; opacity: .8; margin: 0 0 22px; }
  input {
    width: 100%; padding: 13px 16px; border-radius: 14px; border: 1px solid rgba(255,160,200,.3);
    background: rgba(0,0,0,.35); color: #fff; font-size: 16px; text-align: center; outline: none;
  }
  input:focus { border-color: #ff7ab0; box-shadow: 0 0 0 3px rgba(255,122,176,.2); }
  button {
    margin-top: 14px; width: 100%; padding: 13px; border: none; border-radius: 14px; cursor: pointer;
    background: linear-gradient(180deg, #ff86b6, #e85a92); color: #2a0010; font-size: 16px; font-weight: 700;
  }
  button:hover { filter: brightness(1.05); }
  .err { color: #ffb3c8; margin-top: 14px; font-size: 13px; }
</style>
</head>
<body>
  <form class="card" method="POST" action="/__auth">
    <div class="heart">💗</div>
    <h1>المكان ده مقفول</h1>
    <p>اكتب الباسورد عشان تدخل</p>
    <input type="password" name="password" placeholder="الباسورد" autocomplete="current-password" autofocus required />
    <button type="submit">دخول</button>
    ${error ? '<div class="err">الباسورد غلط، جرّب تاني 🙈</div>' : ""}
  </form>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const expected = env.SITE_PASSWORD;
    if (!expected) return env.ASSETS.fetch(request);

    const url = new URL(request.url);
    const expectedHash = await sha256(expected);

    if (request.method === "POST" && url.pathname === "/__auth") {
      const form = await request.formData();
      const pass = String(form.get("password") || "");
      if (pass === expected) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `${COOKIE}=${expectedHash}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
          },
        });
      }
      return new Response(loginPage(true), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const cookie = request.headers.get("Cookie") || "";
    const m = cookie.match(new RegExp(`${COOKIE}=([a-f0-9]+)`));
    if (m && m[1] === expectedHash) {
      return env.ASSETS.fetch(request);
    }

    return new Response(loginPage(false), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
