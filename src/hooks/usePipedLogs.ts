import { useState, useEffect } from "react";
import readline from "readline";

declare const process: { stdin?: NodeJS.ReadStream & { isTTY?: boolean } } | undefined;

export interface LogEntry {
  id: number;
  text: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
}

const MAX_LOGS = 100;

function detectLevel(line: string): LogEntry["level"] {
  const lower = line.toLowerCase();
  if (
    lower.includes("error") ||
    lower.includes("err ") ||
    lower.includes("[error]")
  )
    return "error";
  if (lower.includes("warn") || lower.includes("[warn]")) return "warn";
  if (lower.includes("debug") || lower.includes("[debug]")) return "debug";
  return 'info';
}

export function usePipedLogs(enabled: boolean): LogEntry[] {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [idCounter, setIdCounter] = useState(0);

    useEffect(() => {
        if (!enabled || typeof process === "undefined" || !process.stdin || process.stdin.isTTY)
            return;

        const rl = readline.createInterface({
            input: process.stdin,
            terminal: false,
        });

        let counter = idCounter;

        rl.on('line', (line: string) => {
            const entry: LogEntry = {
                id: counter++,
                text: line.trim(),
                timestamp: new Date(),
                level: detectLevel(line),
            };
            setIdCounter(counter);
            setLogs((prev: any) => [entry, ...prev].slice(0, MAX_LOGS));
        })
    })

    return logs;
}
