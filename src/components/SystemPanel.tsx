import React from "react";
import { Box, Text } from "ink";
import { Gauge } from "./Gauge.js";
import type { SystemMetrics } from "../hooks/useSystemMetrics.js";

function formatBytes(bytes: number): string {
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface Props {
    metrics: SystemMetrics;
}

export function SystemPanel({ metrics }: Props) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        paddingY={0}
        minWidth={36}
      >
        <Text bold color="cyan">
          ⚙ System
        </Text>

        <Box flexDirection="column" marginTop={1}>
            <Gauge label="CPU" value={metrics.cpuLoad} />
            <Gauge
            label="MEM"
            value={metrics.memPercent}
            subtitle={`${formatBytes(metrics.memUsed)} / ${formatBytes(metrics.memTotal)}`}
            />
            <Gauge 
            label="DSK"
            value={metrics.diskPercent}
            subtitle={`${formatBytes(metrics.diskUsed)} / ${formatBytes(metrics.diskTotal)}`}
            />
        </Box>

        <Box marginTop={1}>
            <Text dimColor>Uptime: </Text>
            <Text color="white">{formatUptime(metrics.uptime)}</Text>
        </Box>
      </Box>
    );
}