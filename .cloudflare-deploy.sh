#!/bin/bash

# Script di utilità per il deployment su Cloudflare Workers
# DVA: Drone Vision for Archaeology

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  DVA - Drone Vision for Archaeology                   ║${NC}"
echo -e "${BLUE}║  Cloudflare Workers Deployment Script                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Funzione per verificare se un comando esiste
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verifica prerequisiti
echo -e "${YELLOW}🔍 Verifica prerequisiti...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js non trovato. Installalo da https://nodejs.org/${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm non trovato.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Menu principale
echo -e "${BLUE}Seleziona un'opzione:${NC}"
echo "1) 🚀 Deploy completo (build + deploy)"
echo "2) 🔨 Solo build"
echo "3) 👀 Preview locale"
echo "4) 📊 Visualizza logs"
echo "5) 🔑 Gestisci secrets"
echo "6) 📋 Info deployment"
echo "7) ⏮️  Rollback"
echo "8) 🧹 Pulisci cache"
echo "9) ❌ Esci"
echo ""

read -p "Scelta: " choice

case $choice in
    1)
        echo -e "${YELLOW}🚀 Avvio deployment completo...${NC}"
        echo ""
        
        # Verifica che .dev.vars esista
        if [ ! -f .dev.vars ]; then
            echo -e "${YELLOW}⚠️  File .dev.vars non trovato${NC}"
            read -p "Vuoi crearlo ora? (y/n): " create_devvars
            if [ "$create_devvars" = "y" ]; then
                read -p "Inserisci la GEMINI_API_KEY: " api_key
                echo "GEMINI_API_KEY=$api_key" > .dev.vars
                echo -e "${GREEN}✅ File .dev.vars creato${NC}"
            fi
        fi
        
        echo -e "${YELLOW}📦 Installazione dipendenze...${NC}"
        npm install
        
        echo -e "${YELLOW}🔨 Build del progetto...${NC}"
        npm run build
        
        echo -e "${YELLOW}☁️  Deploy su Cloudflare...${NC}"
        npx wrangler deploy
        
        echo ""
        echo -e "${GREEN}✅ Deployment completato con successo!${NC}"
        echo -e "${BLUE}🌐 URL: https://dva-drone-vision-archaeology.loziobiz.workers.dev${NC}"
        ;;
        
    2)
        echo -e "${YELLOW}🔨 Build del progetto...${NC}"
        npm run build
        echo -e "${GREEN}✅ Build completato!${NC}"
        ;;
        
    3)
        echo -e "${YELLOW}👀 Avvio preview locale...${NC}"
        npm run preview
        ;;
        
    4)
        echo -e "${YELLOW}📊 Visualizzazione logs in tempo reale...${NC}"
        echo -e "${BLUE}Premi Ctrl+C per uscire${NC}"
        npx wrangler tail
        ;;
        
    5)
        echo -e "${BLUE}Gestione Secrets:${NC}"
        echo "1) Visualizza secrets"
        echo "2) Aggiungi/Aggiorna GEMINI_API_KEY"
        echo "3) Elimina secret"
        read -p "Scelta: " secret_choice
        
        case $secret_choice in
            1)
                echo -e "${YELLOW}🔑 Secrets configurati:${NC}"
                npx wrangler secret list
                ;;
            2)
                read -p "Inserisci la GEMINI_API_KEY: " api_key
                echo "$api_key" | npx wrangler secret put GEMINI_API_KEY
                echo -e "${GREEN}✅ Secret aggiornato${NC}"
                ;;
            3)
                read -p "Nome del secret da eliminare: " secret_name
                npx wrangler secret delete "$secret_name"
                ;;
        esac
        ;;
        
    6)
        echo -e "${YELLOW}📋 Informazioni deployment:${NC}"
        echo ""
        echo -e "${BLUE}Worker Name:${NC} dva-drone-vision-archaeology"
        echo -e "${BLUE}Account:${NC} operations@keyformat.it"
        echo -e "${BLUE}URL:${NC} https://dva-drone-vision-archaeology.loziobiz.workers.dev"
        echo ""
        echo -e "${YELLOW}Ultimi deployments:${NC}"
        npx wrangler deployments list
        echo ""
        echo -e "${YELLOW}Secrets configurati:${NC}"
        npx wrangler secret list
        ;;
        
    7)
        echo -e "${YELLOW}⏮️  Rollback all'ultima versione...${NC}"
        echo -e "${RED}⚠️  Questo ripristinerà la versione precedente${NC}"
        read -p "Sei sicuro? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            npx wrangler rollback
            echo -e "${GREEN}✅ Rollback completato${NC}"
        else
            echo -e "${YELLOW}Operazione annullata${NC}"
        fi
        ;;
        
    8)
        echo -e "${YELLOW}🧹 Pulizia cache...${NC}"
        rm -rf dist/
        rm -rf .wrangler/
        rm -rf node_modules/.vite/
        echo -e "${GREEN}✅ Cache pulita${NC}"
        ;;
        
    9)
        echo -e "${GREEN}👋 Arrivederci!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ Scelta non valida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Operazione completata!${NC}"

