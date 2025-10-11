export type TestNotification = { title?: string; message?: string; [k: string]: unknown };

declare global {
  var __TEST_NOTIFICATIONS__: { calls: TestNotification[]; clear: () => void } | undefined;
}

function store() {
  // ensure the global test store exists using a typed accessor
  const g = globalThis as unknown as {
    __TEST_NOTIFICATIONS__?: { calls: TestNotification[]; clear: () => void };
  };
  if (!g.__TEST_NOTIFICATIONS__) {
    g.__TEST_NOTIFICATIONS__ = {
      calls: [] as TestNotification[],
      clear() {
        this.calls.length = 0;
      },
    };
  }
  return g.__TEST_NOTIFICATIONS__ as { calls: TestNotification[]; clear: () => void };
}

export function getNotificationCalls() {
  return store().calls;
}

export function clearNotifications() {
  store().clear();
}

export default { getNotificationCalls, clearNotifications };
