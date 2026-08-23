"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getProfile,
  updateProfile,
} from "./api";

import type {
  ProfileUser,
  UpdateProfileInput,
} from "./types";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

type ProfileContextValue = {
  profile: ProfileUser | null;

  isLoading: boolean;

  isUpdating: boolean;

  error: string | null;

  refreshProfile: () => Promise<void>;

  updateProfileData: (
    data: UpdateProfileInput
  ) => Promise<void>;
};

const ProfileContext =
  createContext<
    ProfileContextValue | undefined
  >(undefined);

type ProfileProviderProps = {
  children: ReactNode;
};

export function ProfileProvider({
  children,
}: ProfileProviderProps) {
  const {
    session,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  const [
    profile,
    setProfile,
  ] = useState<ProfileUser | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  async function refreshProfile() {
    if (
      !session?.accessToken ||
      !isAuthenticated
    ) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getProfile(
          session.accessToken
        );

      setProfile(
        response.data
      );
    } catch (error) {
      console.error(
        "Profile load error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "خطا در دریافت پروفایل."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfileData(
    data: UpdateProfileInput
  ) {
    if (
      !session?.accessToken ||
      !isAuthenticated
    ) {
      throw new Error(
        "کاربر وارد حساب کاربری نشده است."
      );
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response =
        await updateProfile(
          session.accessToken,
          data
        );

      setProfile(
        response.data
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "خطا در بروزرسانی پروفایل.";

      setError(message);

      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    refreshProfile();
  }, [
    isAuthLoading,
    isAuthenticated,
    session?.accessToken,
  ]);

  const value: ProfileContextValue = {
    profile,

    isLoading,

    isUpdating,

    error,

    refreshProfile,

    updateProfileData,
  };

  return (
    <ProfileContext.Provider
      value={value}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context =
    useContext(
      ProfileContext
    );

  if (!context) {
    throw new Error(
      "useProfileContext باید داخل ProfileProvider استفاده شود."
    );
  }

  return context;
}