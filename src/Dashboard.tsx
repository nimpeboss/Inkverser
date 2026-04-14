import React, { useEffect } from "react";
import { Box, Text, useApp, useInput } from 'ink';
import { SystemPanel } from "./components/SystemPanel.js";
import { HttpPanel } from "./components/HttpPanel.js";
import { LogPanel } from "./components/LogPanel.js";
import { useSystemMetrics } from "./hooks/useSystemMetrics.js";
import { useHttpStats } from "./hooks/useHttpStats.js";
import { usePipedLogs } from "./hooks/usePipedLogs.js";

function useDemoRequests(addRequest: (r: Parameters<ReturnType<typeof useHttpStats>['addRequest']>[0]) => void) {
    useEffect(() => {
        const methods = ['GET', 'POST', 'PUT', 'DELETE'];
        const urls = ['/api/users', '/api/orders', '/api/products', '/health', '/api/auth/token'];
        const statuses = [200, 200, 200, 201, 204, 301, 400, 4001, 404, 500];

        const tick = () => {
            addRequest({
                method: methods[Math.floor(Math.random() * methods.length)]!,
                url: urls[Math.floor(Math.random() * urls.length)]!,
                status: statuses[Math.floor(Math.random() * statuses.length)]!,
                durationMs: Math.floor(Math.random() * 300) + 5,
            });
        };

        for (let i = 0; i < 5; i++) setTimeout(tick, i * 100);

        const interval = setInterval(tick, 1500 + Math.random() + 1000);
        return () => clearInterval(interval);
    }, [addRequest]);
}

export function Dashboard() {
    const { exit } = useApp();
    const metrics = useSystemMetrics(2000);
    const { stats, addRequest } = useHttpStats();
    const logs = usePipedLogs(true);
    const isTTY = Boolean(process.stdin.isTTY);

    useDemoRequests(addRequest);

    useInput((_, key) => {
        if (key.escape || (key.ctrl && _.toLowerCase() === 'c')) {
            exit();
        }
    });

    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });

    return (
      <Box flexDirection="column" padding={1}>
        {/* Header */}
        <Box justifyContent="space-between" marginBottom={1}>
          <Text bold color="white">
            ▶ ink-dashboard
          </Text>
          <Text dimColor>{now} Press ESC pr Ctrl+C to quit</Text>
        </Box>

        {/* Main row */}
        <Box gap={1} alignItems="flex-start">
            <SystemPanel metrics={metrics} />

            <Box flexDirection="column" gap={1} flexGrow={1}>
                <HttpPanel stats={stats} maxRows={8} />
                <LogPanel logs={logs} maxRows={6} isTTY={isTTY} />
            </Box>
        </Box>
      </Box>
    );
}