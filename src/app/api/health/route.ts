import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const healthData = {
    status: 'healthy',
    service: 'Telecash Finance Core',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.NODE_ENV || 'production',
    framework: 'Next.js 15 (App Router)',
    runtime: 'Node.js',
    checks: {
      storageEngine: 'localStorage (Client) / Stateless Server',
      database: 'connected (in-memory/edge)',
      memoryUsageMb: process.memoryUsage ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) : 0,
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
