# Mable School of Nursing and Midwifery (MBSNM)

Modern, responsive website for **Mable School of Nursing and Midwifery** — *With GOD We Love and Serve*.

Built with Next.js, Tailwind CSS, Framer Motion, and Lucide icons.

**Live site:** [https://mbaleschoolofnursing.ac.ug](https://mbaleschoolofnursing.ac.ug)

## Pages

- **Home** — Hero, about, programs, news ticker, campus, testimonials
- **Academics** — Full program catalogue with requirements & outcomes
- **Admissions** — Application guide, online form, FAQ
- **Portal** — Student dashboard + admin login mockups
- **Contact** — Form, map placeholder, phone/email/social

## Getting started

```bash
npm install
cp .env.example .env   # then fill Azure AD values
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (`npm run dev` uses port **5173**).

Validate Microsoft env vars:

```bash
npm run validate:microsoft-env
npm run validate:microsoft-env:production
```

After deploy, operators can call:

`GET https://mbaleschoolofnursing.ac.ug/api/auth/microsoft/status?production=1`

## Microsoft 365 (student portal SSO)

See **[`.env.example`](.env.example)** for every variable. Minimum for sign-in:

| When | Variables |
|------|-----------|
| **Docker build** (GitHub Actions) | `NEXT_PUBLIC_AZURE_CLIENT_ID`, `NEXT_PUBLIC_AZURE_TENANT_ID`, `NEXT_PUBLIC_AZURE_REDIRECT_URI=https://mbaleschoolofnursing.ac.ug/auth/microsoft/callback`, `NEXT_PUBLIC_SITE_URL` |
| **Container runtime** (Coolify) | Same client/tenant as `MICROSOFT_CLIENT_ID`, `MICROSOFT_TENANT_ID`, plus `MICROSOFT_CLIENT_SECRET`, `SESSION_SECRET`, `ALLOWED_EMAIL_DOMAIN=mbaleschoolofnursing.ac.ug` |

**Entra ID redirect URI (SPA):** `https://mbaleschoolofnursing.ac.ug/auth/microsoft/callback`  
Local dev: `http://localhost:5173/auth/microsoft/callback`

`NEXT_PUBLIC_*` and `MICROSOFT_*` client/tenant IDs must match the same app registration.

## Demo credentials (Staff admin at `/admin`)

- Email: `registry@mbsnm.org` · Password: `Staff@2026`
- Legacy (still accepted): `admin@mbsnm.org` · `admin123`

Staff Admin: [https://mbaleschoolofnursing.ac.ug/admin](https://mbaleschoolofnursing.ac.ug/admin)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
