# Guida al Deployment su Cloudflare Workers

## Informazioni sul Deployment

- **URL Produzione**: https://dva-drone-vision-archaeology.loziobiz.workers.dev
- **Account Cloudflare**: operations@keyformat.it
- **Account ID**: 9e9075cd7b5eb4225c70717081508ffd
- **Worker Name**: dva-drone-vision-archaeology

## Versioni Utilizzate

- **Wrangler**: 4.47.0 (versione stabile, evita la 4.48.0 per bug noti)
- **@cloudflare/vite-plugin**: latest
- **Vite**: 6.4.1
- **React**: 19.2.0
- **Node.js**: Compatibilità con nodejs_compat flag

## Architettura

L'applicazione è deployata come:
- **Single Page Application (SPA)** con React
- **Cloudflare Worker** per servire gli assets statici
- **Static Assets** serviti direttamente da Cloudflare
- **Secrets** per la gestione sicura della chiave API di Gemini

## File di Configurazione

### wrangler.jsonc
```jsonc
{
  "name": "dva-drone-vision-archaeology",
  "compatibility_date": "2025-11-16",
  "compatibility_flags": ["nodejs_compat"],
  "main": "worker/index.ts",
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  }
}
```

### vite.config.ts
Il progetto utilizza il plugin `@cloudflare/vite-plugin` che:
- Integra Vite con il runtime di Cloudflare Workers
- Gestisce il build per produzione
- Supporta lo sviluppo locale con hot module replacement
- Genera automaticamente la configurazione di output per wrangler

## Processo di Build

1. **Build Client**: Vite compila il codice React in assets statici
   - Output: `dist/client/`
   - Include: HTML, CSS, JS bundled e ottimizzato

2. **Build Worker**: Vite compila il codice del Worker
   - Output: `dist/dva_drone_vision_archaeology/`
   - Include: Worker code, wrangler.json generato, .dev.vars

3. **Deploy**: Wrangler carica il Worker e gli assets su Cloudflare
   - Upload degli assets statici
   - Deploy del Worker code
   - Configurazione delle routes

## Secrets e Variabili d'Ambiente

### Sviluppo Locale
File: `.dev.vars` (non committato in git)
```
GEMINI_API_KEY=your-api-key-here
```

### Produzione
Gestito tramite Cloudflare Secrets:
```bash
echo "your-api-key" | npx wrangler secret put GEMINI_API_KEY
```

I secrets sono:
- Crittografati
- Non visibili dopo la creazione
- Accessibili solo dal Worker in runtime

## Comandi Utili

### Visualizzare i logs in produzione
```bash
npx wrangler tail
```

### Visualizzare i secrets configurati
```bash
npx wrangler secret list
```

### Eliminare un secret
```bash
npx wrangler secret delete GEMINI_API_KEY
```

### Rollback a una versione precedente
```bash
npx wrangler rollback
```

### Visualizzare le versioni deployate
```bash
npx wrangler deployments list
```

## Performance e Ottimizzazioni

- **Edge Computing**: Il Worker gira sui server edge di Cloudflare in tutto il mondo
- **Caching**: Gli assets statici sono automaticamente cachati dalla CDN di Cloudflare
- **Gzip**: Gli assets sono automaticamente compressi
- **HTTP/2**: Supporto nativo per HTTP/2 e HTTP/3

## Monitoraggio

Puoi monitorare l'applicazione tramite:
1. **Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Wrangler Tail**: `npx wrangler tail` per logs in real-time
3. **Analytics**: Disponibili nel dashboard di Cloudflare

## Troubleshooting

### Build fallisce
- Verifica che tutte le dipendenze siano installate: `npm install`
- Controlla che non ci siano errori TypeScript: `npm run build`

### Deploy fallisce
- Verifica di essere autenticato: `npx wrangler whoami`
- Controlla che l'account sia corretto
- Verifica che il nome del Worker non sia già in uso

### L'app non funziona in produzione
- Verifica che il secret GEMINI_API_KEY sia configurato: `npx wrangler secret list`
- Controlla i logs: `npx wrangler tail`
- Verifica che gli assets siano stati caricati correttamente

## Limitazioni di Cloudflare Workers

- **CPU Time**: Max 50ms per richiesta (piano gratuito), 50ms-30s (piano a pagamento)
- **Memory**: 128MB
- **Request Size**: Max 100MB
- **Response Size**: Max 100MB

Per questo progetto, queste limitazioni sono più che sufficienti dato che:
- Il Worker serve principalmente assets statici
- L'analisi AI avviene tramite API esterna (Gemini)
- Le immagini sono processate lato client

## Costi

Con il piano gratuito di Cloudflare Workers:
- **100,000 richieste/giorno** gratuite
- **Bandwidth illimitato** per gli assets
- **Nessun costo** per il traffico in uscita

Oltre il piano gratuito:
- **$5/mese** per 10 milioni di richieste aggiuntive

## Prossimi Passi

### Custom Domain
Per usare un dominio personalizzato:
```bash
npx wrangler domains add your-domain.com
```

### CI/CD
Puoi configurare GitHub Actions per il deploy automatico:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Environment Variables
Per aggiungere variabili d'ambiente pubbliche (non sensibili):
```jsonc
{
  "vars": {
    "ENVIRONMENT": "production",
    "API_VERSION": "v1"
  }
}
```

## Riferimenti

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Vite Plugin Docs](https://developers.cloudflare.com/workers/vite-plugin/)
- [React on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)

