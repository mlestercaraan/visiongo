# VisionGo

Digital self-service platform for Asian Vision Cable and Internet Corporation.

Covers Batangas, Quezon Province, and Zambales.

## What this is

Two apps sharing one Supabase database:

- **mobile/** - Expo React Native app (iOS, Android, PWA)
- **admin/** - Next.js 15 admin portal (desktop)
- **backend/** - Supabase schema SQL + Edge Function stubs

## Live URLs

- Mobile / PWA: https://visiongo-app.netlify.app
- Admin Portal: https://visiongo-admin.netlify.app

## Demo login

Enter any valid Philippine mobile (09XX XXX XXXX), then OTP code: **123456**

## Running locally

```bash
# Mobile
cd mobile && npm install && npx expo start --web

# Admin
cd admin && npm install && npm run dev
```

## Stack

| Layer | Tech |
|---|---|
| Mobile | Expo SDK 57, Expo Router v4, NativeWind |
| Admin | Next.js 16, Tailwind CSS |
| State | Zustand + React Query |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Phone OTP) |
| Payments | PayMongo (mock in prototype) |
| CRM | HubSpot (custom properties + deal pipelines) |
| Push | Firebase FCM (mock in prototype) |

## Supabase setup

Paste `backend/schema.sql` into the Supabase SQL Editor. Add environment variables to `mobile/.env.local` and `admin/.env.local`.
