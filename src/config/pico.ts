// Base URL of the Pico W HTTP server. Override via .env -> VITE_PICO_URL.
export const PICO_BASE_URL: string =
  import.meta.env.VITE_PICO_URL ?? 'http://192.168.1.50';

// Core live fields the Pico reports from its sensors.
export interface PicoStatus {
  liquidLevel: number;
  solidLevel: number;
  motionDetected: boolean;
  relayStatus: boolean;
  batteryLevel: number;
  totalUsageCount: number;
}

const STATUS_TIMEOUT_MS = 1500;
const COMMAND_TIMEOUT_MS = 1500;

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Poll the Pico for the latest sensor snapshot. Throws on network error,
// timeout, or non-2xx so callers can fall back to mock data.
export async function fetchStatus(): Promise<PicoStatus> {
  const response = await fetchWithTimeout(
    `${PICO_BASE_URL}/status`,
    { headers: { Accept: 'application/json' } },
    STATUS_TIMEOUT_MS,
  );

  if (!response.ok) {
    throw new Error(`Pico /status returned ${response.status}`);
  }

  return (await response.json()) as PicoStatus;
}

// Notify the Pico that a face was recognized. Fire-and-forget: errors are
// swallowed so a missing Pico never disrupts the recognition UI.
export async function sendRecognition(
  name: string,
  confidence: number,
): Promise<void> {
  try {
    await fetchWithTimeout(
      `${PICO_BASE_URL}/recognition`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, confidence, ts: Date.now() }),
      },
      COMMAND_TIMEOUT_MS,
    );
  } catch {
    // Pico unreachable - ignore for prototype.
  }
}

// Optional: tell the Pico about a manual relay/gate toggle.
export async function sendCommand(
  command: string,
  value?: unknown,
): Promise<void> {
  try {
    await fetchWithTimeout(
      `${PICO_BASE_URL}/command`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, value, ts: Date.now() }),
      },
      COMMAND_TIMEOUT_MS,
    );
  } catch {
    // Pico unreachable - ignore for prototype.
  }
}
