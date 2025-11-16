# Quick Reference - DVA Cloudflare Workers

## 🌐 URL Applicazione
**https://dva-drone-vision-archaeology.loziobiz.workers.dev**

## ⚡ Comandi Più Usati

### Sviluppo Locale
```bash
npm run dev              # Avvia dev server su localhost:3000
```

### Deploy
```bash
npm run deploy           # Build + Deploy su Cloudflare
./.cloudflare-deploy.sh  # Script interattivo (consigliato)
```

### Monitoring
```bash
npx wrangler tail        # Logs in tempo reale
npx wrangler deployments list  # Lista deployments
```

### Secrets
```bash
npx wrangler secret list                    # Lista secrets
echo "key" | npx wrangler secret put NAME   # Aggiungi/Aggiorna secret
npx wrangler secret delete NAME             # Elimina secret
```

### Preview & Build
```bash
npm run build            # Solo build
npm run preview          # Build + Preview locale
```

### Rollback
```bash
npx wrangler rollback    # Torna alla versione precedente
```

## 📁 File Importanti

| File | Descrizione |
|------|-------------|
| `wrangler.jsonc` | Configurazione Cloudflare Workers |
| `worker/index.ts` | Codice del Worker |
| `.dev.vars` | Secrets per sviluppo locale (non committato) |
| `vite.config.ts` | Configurazione Vite + plugin Cloudflare |
| `DEPLOYMENT.md` | Guida completa al deployment |

## 🔑 Variabili d'Ambiente

### Locale (`.dev.vars`)
```
GEMINI_API_KEY=your-api-key-here
```

### Produzione (Cloudflare Secrets)
```bash
echo "your-api-key" | npx wrangler secret put GEMINI_API_KEY
```

## 📊 Info Account

- **Account**: operations@keyformat.it
- **Account ID**: 9e9075cd7b5eb4225c70717081508ffd
- **Worker Name**: dva-drone-vision-archaeology

## 🆘 Troubleshooting

### Build fallisce
```bash
npm install              # Reinstalla dipendenze
npm run build           # Verifica errori
```

### Deploy fallisce
```bash
npx wrangler whoami     # Verifica autenticazione
npx wrangler login      # Re-autentica se necessario
```

### App non funziona
```bash
npx wrangler tail       # Controlla logs
npx wrangler secret list # Verifica secrets
```

## 📚 Documentazione

- `README.md` - Guida generale
- `DEPLOYMENT.md` - Guida deployment completa
- `DEPLOY_INFO.md` - Info deployment corrente
- `CHANGELOG_CLOUDFLARE.md` - Cronologia modifiche
- `DEPLOY_SUCCESS.txt` - Riepilogo deployment

## 🔗 Link Utili

- [Dashboard Cloudflare](https://dash.cloudflare.com)
- [Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Vite Plugin](https://developers.cloudflare.com/workers/vite-plugin/)

---

**Ultima modifica**: 16 Novembre 2025

