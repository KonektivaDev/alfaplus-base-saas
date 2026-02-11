type LogLevel = "error" | "warn" | "info";

export function logServerEvent(params: {
  level: LogLevel;
  scope: string;
  message: string;
  error?: unknown;
  meta?: Record<string, unknown>;
}) {
  const payload = {
    ts: new Date().toISOString(),
    ...params,
  };

  if (params.level === "error") console.error(payload);
  else if (params.level === "warn") console.warn(payload);
  else console.info(payload);
}
