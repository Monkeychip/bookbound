import { getNotificationCalls, clearNotifications } from './notifications';

export function expectNotificationWithTitle(titleSubstring: string) {
  const calls = getNotificationCalls();
  if (!calls.some((c) => String(c.title ?? '').includes(titleSubstring))) {
    throw new Error(
      `Expected a notification with title including "${titleSubstring}", got: ${JSON.stringify(calls)}`,
    );
  }
}

export function clearNotifs() {
  clearNotifications();
}

export default { expectNotificationWithTitle, clearNotifs };
