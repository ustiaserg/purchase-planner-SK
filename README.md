# EneDom SK — Plánovač nákupu materiálu

Interná React aplikácia (Vite) na plánovanie nákupu FVE materiálu, sklad, cash flow,
objednávky a PDF archív. Bázová mena **EUR**, DPH podľa slovenského zákona.

## Štruktúra

```
.
├── index.html                 # Vstupný HTML (Vite)
├── package.json               # Závislosti + build skripty
├── vite.config.js             # Build do priečinka dist/
├── staticwebapp.config.json   # SPA fallback pre Azure Static Web Apps
├── .gitignore
└── src/
    ├── main.jsx               # Mount React aplikácie na #root
    └── App.jsx                # Celá aplikácia (default export CashFlowPlanner)
```

Aplikácia potrebuje iba `react`, `react-dom` a `lucide-react`.
Knižnice **XLSX (SheetJS)** a **JSZip** sa načítavajú za behu z CDN — nie sú v package.json.

## Lokálny vývoj

```bash
npm install
npm run dev      # spustí dev server (http://localhost:5173)
npm run build    # produkčný build do dist/
npm run preview  # náhľad produkčného buildu
```

## Nasadenie na Azure Static Web Apps

Build vytvára výstup do priečinka **`dist/`**. Vo workflow súbore
`.github/workflows/azure-static-web-apps-*.yml` musí byť v kroku
`Azure/static-web-apps-deploy@v1`:

```yaml
app_location: "/"
api_location: ""
output_location: "dist"
```

> **Dôležité:** Workflow súbor `.github/workflows/…` v tomto ZIP-e **nie je** —
> Azure ho vygeneroval priamo vo vašom repozitári pri prepojení s GitHubom a obsahuje
> tajný token špecifický pre vaše nasadenie. Ponechajte svoj existujúci workflow,
> len sa uistite, že `output_location` je `dist`.

## Poznámky

- Dáta (projekty, položky, sklad…) sa ukladajú do **localStorage** prehliadača
  (kľúč `enedom-sk-material-v1`).
- PDF prílohy sa ukladajú do **IndexedDB** (`fve-planner-pdfs`). Sú len na danom
  počítači — na prenos slúži *Export / Import zálohy PDF* v Nastaveniach → PDF archív.
- Import faktúr cez AI vyžaduje Anthropic API kľúč (zadáva sa v Nastaveniach).
