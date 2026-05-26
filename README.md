# Predictor Demand SaaS

Web app SaaS en Next.js para forecast estadistico de demanda de productos.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite local
- Recharts

## Comandos

```bash
npm install
npx prisma generate
npm run seed
npm run seed:sales-2025
npm run dev
npm run build
```

## Desarrollo En Windows

Para evitar bloqueos de `.next\trace`, usar:

```bash
npm run dev:clean
npm run build:clean
```

Si aparece `EPERM: operation not permitted, open '.next\trace'`:

```bash
taskkill /F /IM node.exe
npm run clean
npm run dev:clean
```

El comando `clean` elimina `.next` con un mensaje claro si algun proceso `node` mantiene archivos bloqueados.

## Prisma

Si el schema engine de Prisma falla en Windows/Node local, la migracion inicial esta disponible como SQL en `prisma/migrations/20260525225200_init/migration.sql` y se puede aplicar con:

```bash
npx prisma db execute --file prisma/migrations/20260525225200_init/migration.sql --schema prisma/schema.prisma
```
