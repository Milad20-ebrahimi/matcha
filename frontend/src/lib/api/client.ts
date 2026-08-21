import {
  getSession,
  saveSession,
  clearSession,
} from "@/features/auth/storage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api/v1";

type ApiRequestOptions =
  RequestInit & {
    accessToken?: string;
    skipRefresh?: boolean;
  };

type RefreshResponse = {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    refreshSessionId?: string;
  };
};

async function parseResponse(
  response: Response
) {
  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    return response.json();
  }

  return null;
}

async function refreshAccessToken() {
  const session =
    getSession();

  if (
    !session?.refreshToken
  ) {
    return null;
  }

  const response =
    await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          refreshToken:
            session.refreshToken,
        }),
      }
    );

  const data =
    (await parseResponse(
      response
    )) as RefreshResponse | null;

  if (!response.ok) {
    clearSession();

    return null;
  }

  if (
    !data?.data?.accessToken ||
    !data?.data?.refreshToken
  ) {
    clearSession();

    return null;
  }

  const newSession = {
    accessToken:
      data.data.accessToken,

    refreshToken:
      data.data.refreshToken,
  };

  saveSession(
    newSession
  );

  return newSession;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    accessToken,
    skipRefresh,
    headers,
    ...requestOptions
  } = options;

  const session =
    getSession();

  const token =
    accessToken ||
    session?.accessToken;

  /*
   * درخواست اول
   */
  let response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...requestOptions,

        headers: {
          ...(headers || {}),

          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

  let data =
    await parseResponse(
      response
    );

  /*
   * اگر Access Token منقضی شده باشد،
   * Refresh Token را استفاده می‌کنیم.
   */
  if (
    response.status === 401 &&
    !skipRefresh
  ) {
    const newSession =
      await refreshAccessToken();

    if (newSession) {
      /*
       * درخواست دوم حتماً با
       * Access Token جدید ارسال می‌شود.
       *
       * Authorization بعد از headers قرار گرفته
       * تا Token قدیمی نتواند آن را overwrite کند.
       */
      response =
        await fetch(
          `${API_URL}${endpoint}`,
          {
            ...requestOptions,

            headers: {
              ...(headers || {}),

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${newSession.accessToken}`,
            },
          }
        );

      data =
        await parseResponse(
          response
        );
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "خطایی در ارتباط با سرور رخ داد."
    );
  }

  return data as T;
}