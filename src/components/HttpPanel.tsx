import React from "react";
import { Box, Text } from "ink";
import type { HttpStats, HttpRequest } from "../hooks/useHttpStats.js";

function statusColor(status: number): string {
    if (status >= 500) return 'red';
    if (status >= 400) return 'yellow';
    if (status >= 300) return 'cyan';
    return 'green';
}

function methodColor(method: string): string {
    switch (method.toUpperCase()) {
        case 'GET': return 'green';
        case 'POST': return 'blue';
        case 'PUT': return 'yellow';
        case 'DELETE': return 'red';
        case 'PATCH': return 'magenta';
        default: return 'white';
    }
}

function RequestRow({ req }: { req: HttpRequest }) {
    const time = req.timestamp.toLocaleTimeString('en-GB', { hour12: false });
    const url = req.url.length > 28 ? req.url.slice(0, 25) + '...' : req.url;

    return (
        <Box gap={1}>
            <Text dimColor>{time}</Text>
            <Text color={methodColor(req.method)} bold>
                {req.method.padEnd(6)}
            </Text>
            <Text color={statusColor(req.status)} bold>
                {req.status}
            </Text>
            <Text>{url.padEnd(29)}</Text>
            <Text dimColor>{req.durationMs}ms</Text>
        </Box>
    );
}

interface Props {
    stats: HttpStats;
    maxRows?: number;
}

export function HttpPanel({ stats, maxRows = 8}: Props) {
     const shown = stats.requests.slice(0, maxRows);

    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="magenta"
        paddingX={1}
        paddingY={0}
        flexGrow={1}
      >
        <Box gap={2}>
          <Text bold color="magenta">
            🌐 HTTP Requests
          </Text>
          <Text dimColor>total:</Text>
          <Text bold>{stats.totalCount}</Text>
          <Text color="green">{stats.successCount} ok</Text>
          <Text color="red">{stats.errorCount} err</Text>
          <Text dimColor>avg:</Text>
          <Text bold>{stats.avgDurationMs}ms</Text>
          <Text dimColor>rps:</Text>
          <Text bold>{stats.rps}</Text>
        </Box>

        <Box flexDirection="column" marginTop={1}>
            {shown.length === 0 ? (
                <Text dimColor>
                    No requests yet. Send JSON lines to stdin or call addRequest().
                </Text>
            ) : (
                shown.map((req) => <RequestRow key={req.id} req={req} />)
            )}
        </Box>
      </Box>
    );
}