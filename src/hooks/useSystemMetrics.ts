import { useState, useEffect, act } from "react";
import si from 'systeminformation';

export interface SystemMetrics {
    cpuLoad: number;
    memUsed: number;
    memTotal: number;
    memPercent: number;
    diskUsed: number;
    diskTotal: number;
    diskPercent: number;
    uptime: number;
}

export function useSystemMetrics(intervalMs = 2000): SystemMetrics {
    const [metrics, setMetrics] = useState<SystemMetrics>({
      cpuLoad: 0,
      memUsed: 0,
      memTotal: 0,
      memPercent: 0,
      diskUsed: 0,
      diskTotal: 0,
      diskPercent: 0,
      uptime: 0,
    });

    useEffect(() => {
        let active = true;

        const fetchMetrics = async () => {
            try {
                const [cpu, mem, disk] = await Promise.all([
                    si.currentLoad(),
                    si.mem(),
                    si.fsSize(),
                ]);

                const rootDisk = disk.find((d) => d.mount === '/') ?? disk[0];

                if (active) {
                    setMetrics({
                        cpuLoad: Math.round(cpu.currentLoad),
                        memUsed: mem.active,
                        memTotal: mem.total,
                        memPercent: Math.round((mem.active / mem.total) * 100),
                        diskUsed: rootDisk?.used ?? 0,
                        diskTotal: rootDisk?.size ?? 0,
                        diskPercent: Math.round(rootDisk?.use ?? 0),
                        uptime: Math.floor(si.time().uptime),
                    });
                }
            } catch {
            }
        };

        fetchMetrics();
        const timer = setInterval(fetchMetrics, intervalMs);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, [intervalMs]);

    return metrics;
}