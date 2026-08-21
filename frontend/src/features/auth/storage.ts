import type { Session } from "./types";

const SESSION_KEY = "matcha_auth_session";

export function saveSession(
  session: Session
) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

export function getSession():
  | Session
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value =
    sessionStorage.getItem(
      SESSION_KEY
    );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Session;
  } catch {
    sessionStorage.removeItem(
      SESSION_KEY
    );

    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(
    SESSION_KEY
  );
}