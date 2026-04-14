#!/usr/bin/env node

import React, { useState, useEffect, useCallback } from "react";
import { render, Box, Text, useApp, useInput } from "ink";
import si from "systeminformation";

interface AlertRule {
  id: string;
  metric: "cpu" | "mem" | "disk";
  threshold: number;
  comparator: "above" | "below";
  message?: string;
}

interface Alert {
  id: string;
  rule: AlertRule;
  value: number;
  firedAt: Date;
  dismissed: boolean;
}

function useAlerts(rules: AlertRule[], intervalMs = 2000) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const [cpu, mem, disk] = await Promise.all([
          si.currentLoad(),
          si.mem(),
          si.fsSize(),
        ]);
        if (!active) return;

        const values: Record<string, number> = {
          cpu: Math.round(cpu.currentLoad),
          mem: Math.round((mem.active / mem.total) * 100),
          disk: Math.round(disk[0]?.use ?? 0),
        };

        setAlerts((prev) => {
          const now = new Date();
          const next: Alert[] = [];

          for (const rule of rules) {
            const val = values[rule.metric] ?? 0;
            const triggered =
              rule.comparator === "above"
                ? val >= rule.threshold
                : val <= rule.threshold;

            if (triggered) {
              const existing = prev.find(
                (a) => a.rule.id === rule.id && !a.dismissed,
              );
              if (existing) {
                next.push({ ...existing, value: val });
              } else {
                next.push({
                  id: `${rule.id}-${now.getTime()}`,
                  rule,
                  value: val,
                  firedAt: now,
                  dismissed: false,
                });
              }
            }
          }
          return next;
        });
      } catch {}
    };

    check();
    const timer = setInterval(check, intervalMs);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [rules, intervalMs]);

  const dismiss = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)),
    );
  }, []);

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  return { alerts: activeAlerts, dismiss };
}

function AlertBanner({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: (id: string) => void;
}) {
  const color = alert.rule.comparator === "above" ? "red" : "green";
  const icon = alert.rule.comparator === "above" ? "▲" : "▼";

  return (
    <Box borderStyle="bold" borderColor={color} paddingX={1} gap={1}>
      <Text color={color} bold>
        {icon} ALERT
      </Text>
      <Text>
        {alert.rule.metric.toUpperCase()} is {alert.value}% (
        {alert.rule.comparator} {alert.rule.threshold}%)
      </Text>
      {alert.rule.message && <Text dimColor>{alert.rule.message}</Text>}
      <Text dimColor>[d to dismiss]</Text>
    </Box>
  );
}

function Demo() {
  const { exit } = useApp();
  const [dismissTarget, setDismissTarget] = useState<string | null>(null);

  const rules: AlertRule[] = [
    {
      id: "cpu-high",
      metric: "cpu",
      threshold: 50,
      comparator: "above",
      message: "CPU load high!",
    },
    {
      id: "mem-high",
      metric: "mem",
      threshold: 70,
      comparator: "above",
      message: "Memory pressure",
    },
    {
      id: "disk-high",
      metric: "disk",
      threshold: 80,
      comparator: "above",
      message: "Disk almost full",
    },
  ];

  const { alerts, dismiss } = useAlerts(rules, 3000);

  useInput((input) => {
    if (input === "d" && alerts.length > 0) {
      dismiss(alerts[0]!.id);
    }
    if (input === "q") exit();
  });

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Text bold>▶ Alert System Demo</Text>
      <Text dimColor>
        Rules: CPU&gt;50%, MEM&gt;70%, DISK&gt;80% | d=dismiss, q=quit
      </Text>

      {alerts.length === 0 ? (
        <Text color="green">✓ All metrics within normal range</Text>
      ): (
        alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} onDismiss={dismiss} />
        ))
      )}
    </Box>
  );
}

render(<Demo />)