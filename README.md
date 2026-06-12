# ЧМ-26 · Паша × Влад

Статичный сайт: прогнозы, лента ставок и статистика ЧМ-2026. Next.js (static export) → GitHub Pages. Без бэкенда и авторизации — сайт только для чтения.

## Как обновляются данные

Паша скидывает ставку Владу в чат → Влад просит Клода → Клод правит `data/bets.js` / `data/matches.js` → `git push` → GitHub Actions пересобирает сайт (~2 мин).

- `data/bets.js` — все ставки (status: pending/win/lose/void; book: Паша/Влад/Совместно/Конкурс ЛС)
- `data/matches.js` — карточки матчей с анализом (markdown), результат после игры

## Деплой на GitHub Pages (один раз)

```bash
cd wc2026-site
git init && git add -A && git commit -m "ЧМ-26 сайт"
gh repo create wc2026-site --private --source . --push
```

Затем в репозитории: **Settings → Pages → Source: GitHub Actions** — и всё, workflow `deploy.yml` уже в репо. Сайт появится на `https://<username>.github.io/wc2026-site/`.

> Если имя репозитория другое — поправь `NEXT_PUBLIC_BASE_PATH` в `.github/workflows/deploy.yml`.

> Приватный репозиторий + GitHub Pages требует GitHub Pro; на бесплатном аккаунте сделай репо публичным (данные ставок не секрет) или используй Vercel.

## Локально

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # статика в out/
```
