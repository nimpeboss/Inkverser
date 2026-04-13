import { useState, useCallback } from 'react'

export interface HttpRequest {
    id: number;
    method: string;
    url: string;
    status: number;
    durationMs: number;
    timestamp: Date;
}

export interface HttpStats {
    requests: HttpRequest[];
    totalCount: number;
    successCount: number;
    errorCount: number;
    avgDurationMs: number;
    rps: number;
}

const MAX_REQUESTS = 50;

export function useHttpStats() {
    const [requests, setRequests] = useState<HttpRequest[]>([]);
    const [idCounter, setIdCounter] = useState(0);

    const addRequest = useCallback(
        (req: Omit<HttpRequest, 'id' | 'timestamp'>) => {
            const newReq: HttpRequest = {
                ...req,
                id: idCounter,
                timestamp: new Date(),
            };
            setIdCounter((c: number) => c + 1);
            setRequests((prev: any) => [newReq, ...prev].slice(0, MAX_REQUESTS));
        },
        [idCounter],
    );

    const now = Date.now();
    const window10s = requests.filter(
        (r: { timestamp: { getTime: () => number; }; }) => now - r.timestamp.getTime() < 10000,
    );
    const successCount = requests.filter((r: { status: number; }) => r.status < 400).length;
    const errorCount = requests.filter((r: { status: number; }) => r.status >= 400).length;
    const avgDurationMs =
        requests.length > 0
        ? Math.round(
            requests.reduce((sum: any, r: { durationMs: any; }) => sum + r.durationMs, 0) / requests.length,
        )
        : 0;

    const stats: HttpStats = {
        requests,
        totalCount: requests.length,
        successCount,
        errorCount,
        avgDurationMs,
        rps: parseFloat((window10s.length / 10).toFixed(1)),
    };

    return { stats, addRequest };
}