import React from "react";
import { Box, Text } from 'ink';
import type { LogEntry } from "../hooks/usePipedLogs.js";

function levelColor(level: LogEntry['level']): string {
    switch (level) {
        case 'error': return 'red';
        case 'warn': return 'yellow';
        case 'debug': return 'gray';
        default: return 'white';
    }
}

function levelBadge(level: LogEntry['level']): string {
    switch (level) {
        case 'error': return 'ERR';
        case 'warn': return 'WRN';
        case 'debug': return 'DBG';
        default: return 'INF';
    }
}

function LogRow({ entry }: { entry: LogEntry }) {
    const time = entry.timestamp.toLocaleTimeString('en-GB', { hour12: false });
    const color = levelColor(entry.level);

    return (
        <Box gap={1}>
            <Text dimColor>{time}</Text>
            <Text color={color} bold>
                {levelBadge(entry.level)}
            </Text>
            <Text wrap="truncate">{entry.text}</Text>
        </Box>
    );
}

interface Props {
    logs: LogEntry[];
    maxRows?: number;
    isTTY: boolean;
}

export function LogPanel({ logs, maxRows = 8, isTTY }: Props) {
    const shown = logs.slice(0, maxRows);

    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="yellow"
        paddingX={1}
        paddingY={0}
        flexGrow={1}
      >
        <Text bold color="yellow">
          📋 Piped Logs
          {isTTY ? <Text dimColor> (pipe stdin to see logs)</Text> : null}
        </Text>

        <Box flexDirection="column" marginTop={1}>
            {shown.length === 0 ? (
                <Text dimColor>
                {isTTY
                    ? 'Run: echo "some log" | dashboard'
                    : 'Waiting for input…'}
                </Text>
            ) : (
                shown.map((entry) => <LogRow key={entry.id} entry={entry} />)
            )}
        </Box>
      </Box>
    );
}