# Cash Flow Planner — Electree Solar

Cash flow plánovač a project tracker pro FVE realizace.  
React 18 + Vite 5, jeden hlavní komponent (`src/CashFlowPlanner.jsx`).

## Rychlý start (lokálně)

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:5173`.

## Build

```bash
npm run build
```

Výstup je v `dist/`.

## Nasazení na Azure Static Web Apps

### 1. Vytvořit nové úložiště na GitHubu

1. Nový public/private repo (např. `cashflow-planner`)
2. Nahrát obsah tohoto balíčku

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 2. Vytvořit Azure Static Web App

1. Azure Portal → **Create resource** → **Static Web App**
2. **Deployment source**: GitHub → vybrat právě vytvořený repozitář, branch `main`
3. **Build details**:
   - Build preset: `Custom`
   - App location: `/`
   - Api location: *(prázdné)*
   - Output location: `dist`
4. Create → Azure automaticky:
   - Přidá tajný token `AZURE_STATIC_WEB_APPS_API_TOKEN_XXXXX` do vašeho repozitáře
   - Vytvoří workflow soubor v `.github/workflows/`

⚠ **Pokud používáte přiložený `.github/workflows/azure-static-web-apps.yml`**, musíte:
- Buď smazat přiložený soubor a nechat Azure vytvořit jeho vlastní (doporučeno)
- Nebo upravit `${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}` na skutečný název tokenu, který Azure přidal

### 3. Nastavit Anthropic API klíč (volitelné)

Pro funkci **Import PDF přes AI** (v Objednávkách) je potřeba API klíč od Anthropic:
1. Otevřít aplikaci → **Nastavení** (ozubené kolo) → záložka **Ostatní**
2. Vyplnit **Anthropic API klíč** (klíč začíná `sk-ant-...`)
3. Vybrat model (doporučeno `claude-sonnet-4-6`)

Klíč se ukládá pouze do vaší localStorage, nikdy neopouští prohlížeč.

## Struktura projektu

```
.
├── .github/workflows/          # CI/CD pro Azure SWA
├── src/
│   ├── CashFlowPlanner.jsx     # 🎯 hlavní aplikace (celá logika v jednom souboru)
│   ├── main.jsx                # React entry point
│   └── index.css               # globální reset
├── index.html                  # HTML shell
├── staticwebapp.config.json    # Azure SWA config (SPA routing)
├── package.json
└── vite.config.js
```

## Datové úložiště

- **localStorage** klíč `fve-planner-data-v10` — hlavní stav aplikace
- **IndexedDB** databáze `fve-planner-pdfs` (store `pdfs`) — přiložené PDF faktury

Data jsou uložena **jen v prohlížeči** — pro sdílení mezi kolegy je potřeba backend (viz TODO).

## Klíčové funkce

- 📊 **Projekty** — dashboard, platby od klienta, položky materiálu, PDF archiv
- 🛒 **Nákupní seznam** — plánované položky napříč projekty
- 📋 **Objednávky** — sledování dodání a fakturace + import z PDF přes AI
- 🏭 **Sklad** — souhrn kusů, sériová čísla, přesuny mezi lokacemi, spotřeba na projekt
- 💰 **Cash flow** — přehled peněz s DPH/bez DPH toggle

## Prostředí

- Node.js 20+
- npm 10+

## Licence

Interní projekt Electree Solar.
