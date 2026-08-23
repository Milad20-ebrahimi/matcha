"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
} from "./api";

import {
  clearSession,
  getSession,
  saveSession,
} from "./storage";

import type {
  Session,
  User,
} from "./types";

type AuthContextValue = {
  user: User | null;
  session: Session | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  setSession: (
    session: Session
  ) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [session, setSessionState] =
    useState<Session | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

useEffect(() => {
  async function restoreSession() {
    try {
      const savedSession =
        getSession();

      if (!savedSession) {
        setIsLoading(false);
        return;
      }

      setSessionState(
        savedSession
      );

      const response =
        await getMe(
          savedSession.accessToken
        );

      const currentSession =
        getSession();

      setSessionState(
        currentSession ||
          savedSession
      );

      setUser(
        response.data
      );
    } catch (error) {


      clearSession();

      setSessionState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  restoreSession();
}, []);
  async function setSession(
    newSession: Session
  ) {
    saveSession(
      newSession
    );

    setSessionState(
      newSession
    );

    try {
      const response =
        await getMe(
          newSession.accessToken
        );

      const currentSession =
        getSession();

      setSessionState(
        currentSession ||
          newSession
      );

      setUser(
        response.data
      );
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      clearSession();

      setSessionState(null);
      setUser(null);
    }
  }

  async function logout() {
    const currentSession =
      session;

    try {
      if (
        currentSession?.refreshToken
      ) {
        const { logout: logoutApi } =
          await import("./api");

        await logoutApi(
          currentSession.refreshToken
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      clearSession();

      setSessionState(null);
      setUser(null);
    }
  }

  const value: AuthContextValue = {
    user,
    session,

    isAuthenticated:
      !!user && !!session,

    isLoading,

    setSession,

    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuthContext باید داخل AuthProvider استفاده شود."
    );
  }

  return context;
}