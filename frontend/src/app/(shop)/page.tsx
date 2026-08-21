"use client";

import {
  useAuth,
} from "@/features/auth/hooks";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <main>
        <h1>
          Matcha Cafe
        </h1>

        <p>
          در حال بررسی حساب کاربری...
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>
        Matcha Cafe
      </h1>

      <p>
        به کافه ماچا خوش آمدید.
      </p>

      {isAuthenticated &&
      user ? (
        <>
          <p>
            سلام {user.firstName} 👋
          </p>

          <p dir="ltr">
            {user.phone}
          </p>
        </>
      ) : (
        <p>
          شما مهمان هستید.
        </p>
      )}
    </main>
  );
}