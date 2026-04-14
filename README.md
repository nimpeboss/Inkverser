# Inkverser

A terminal dashboard built with [Ink](https://github.com/vadimdemedes/ink) (React for CLI), showing real-time system metrics, HTTP request stats, and piped log streaming.

## Getting Started

```bash
npm install
npm run dev      # watch mode
npm start        # run once
npm run build    # compile to dist/
```

## Project Structure

```
Inkverser/
├── src/
│   ├── cli.tsx                # Entry point — renders the Dashboard
│   ├── Dashboard.tsx          # Main layout with all panels
│   ├── components/
│   │   ├── Gauge.tsx          # CPU/MEM/DISK bar gauge
│   │   ├── HttpPanel.tsx     # HTTP request history & stats
│   │   ├── LogPanel.tsx      # Piped stdin log viewer
│   │   └── SystemPanel.tsx   # System metrics (CPU, MEM, DSK, uptime)
│   └── hooks/
│       ├── useHttpStats.ts    # HTTP request tracking & aggregate stats
│       ├── usePipedLogs.ts    # Stdin line reader with log level detection
│       └── useSystemMetrics.ts # Systeminformation polling hook
├── examples/                  # Example extensions (see below)
├── dist/                      # Compiled output
├── package.json
└── tsconfig.json
```

```tsx
// src/Dashboard.tsx
import { NetworkPanel } from "./components/NetworkPanel.js";

// Add alongside SystemPanel in the render:
<NetworkPanel />
```

## Controls

- **ESC** or **Ctrl+C** — quit the dashboard