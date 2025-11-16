<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DVA: Drone Vision for Archaeology

Applicazione web per l'analisi di immagini aeree da drone per scopi archeologici, utilizzando l'AI di Google Gemini.

**🌐 App Live:** https://dva-drone-vision-archaeology.loziobiz.workers.dev

View your app in AI Studio: https://ai.studio/apps/drive/1x0QTjGzoQwBcsuTwQZ5lhQ9LbB8Ldi66

## Tecnologie Utilizzate

- **React 19** - Framework UI
- **Vite 6** - Build tool e dev server
- **TypeScript** - Type safety
- **Cloudflare Workers** - Hosting e deployment
- **Google Gemini AI** - Analisi delle immagini
- **Tailwind CSS** - Styling

## Run Locally

**Prerequisites:** Node.js (v18 o superiore)

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Configura la chiave API di Gemini:
   - Crea un file `.dev.vars` nella root del progetto
   - Aggiungi la tua chiave API:
     ```
     GEMINI_API_KEY=your-api-key-here
     ```

3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

4. Apri il browser su `http://localhost:3000`

## Deploy su Cloudflare Workers

### Script di Utilità (Consigliato)

Per semplificare il processo di deployment, puoi usare lo script interattivo:

```bash
./.cloudflare-deploy.sh
```

Lo script offre le seguenti opzioni:
- 🚀 Deploy completo (build + deploy)
- 🔨 Solo build
- 👀 Preview locale
- 📊 Visualizza logs
- 🔑 Gestisci secrets
- 📋 Info deployment
- ⏮️ Rollback
- 🧹 Pulisci cache

### Deploy Manuale

#### Prima volta

1. Installa Wrangler (se non già installato):
   ```bash
   npm install -g wrangler
   ```

2. Autenticati con Cloudflare:
   ```bash
   npx wrangler login
   ```

3. Configura il secret per la chiave API di Gemini:
   ```bash
   echo "your-api-key-here" | npx wrangler secret put GEMINI_API_KEY
   ```

4. Esegui il deploy:
   ```bash
   npm run deploy
   ```

### Deploy successivi

Dopo la prima configurazione, per deployare nuove versioni:

```bash
npm run deploy
```

## Script Disponibili

- `npm run dev` - Avvia il server di sviluppo locale
- `npm run build` - Crea il build di produzione
- `npm run preview` - Visualizza il build in locale prima del deploy
- `npm run deploy` - Esegue il build e il deploy su Cloudflare Workers
- `npm run cf-typegen` - Genera i tipi TypeScript per i bindings di Cloudflare

## Configurazione

### wrangler.jsonc

Il file `wrangler.jsonc` contiene la configurazione per Cloudflare Workers:

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

### Variabili d'Ambiente

- **Sviluppo locale**: Usa il file `.dev.vars`
- **Produzione**: Usa i secrets di Cloudflare Workers (configurati con `wrangler secret put`)

## Struttura del Progetto

```
dva-experiment/
├── components/          # Componenti React
├── hooks/              # Custom React hooks
├── services/           # Servizi (es. Gemini API)
├── worker/             # Codice del Cloudflare Worker
├── types.ts            # Definizioni TypeScript
├── App.tsx             # Componente principale
├── index.tsx           # Entry point
├── vite.config.ts      # Configurazione Vite
└── wrangler.jsonc      # Configurazione Cloudflare Workers
```

## Account Cloudflare

L'applicazione è deployata sull'account: **operations@keyformat.it**

## Supporto

Per problemi o domande, consulta la [documentazione di Cloudflare Workers](https://developers.cloudflare.com/workers/).
