import React from "react";
import { Box, Text } from 'ink';

interface GaugeProps {
    label: string;
    value: number;
    width?: number;
    unit?: string;
    subtitle?: string;
}

function barColor(value: number): string {
    if (value >= 85) return 'red';
    if (value >= 60) return 'yellow';
    return 'green';
}

export function Gauge({ label, value, width = 20, unit = '%', subtitle}: GaugeProps) {
    const filled = Math.round((value / 100) * width);
    const empty = width - filled;
    const color = barColor(value);

    return (
      <Box flexDirection="column" marginBottom={1}>
        <Box gap={1}>
          <Text bold>{label}</Text>
          <Text color={color} bold>
            {value}
            {unit}
          </Text>
          {subtitle ? <Text dimColor>{subtitle}</Text> : null}
        </Box>
        <Box>
          <Text color={color}>{"█".repeat(filled)}</Text>
          <Text dimColor>{"░".repeat(empty)}</Text>
        </Box>
      </Box>
    );
}