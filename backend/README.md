# Wunschbaum Backend

## Setup
```
cd backend
npm install
npm run seed
npm run dev
```

Environment variables:
- `PORT` (default `3000`)
- `DATABASE_URL` (default `file:./data/wishes.db`)
- `CORS_ORIGIN` (optional)
- `STATIC_FRONTEND_PATH` (optional absolute/relative path to built Angular app)

## API
- `GET /api/wishes`
- `POST /api/wishes/:id/reserve` body `{ name: string; email?: string }`
- `POST /api/wishes/:id/fulfill`
- `POST /api/wishes/:id/reset`
