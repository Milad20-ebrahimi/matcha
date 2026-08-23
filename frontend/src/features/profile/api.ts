import {
  apiRequest,
} from "@/lib/api/client";

import type {
  GetProfileResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from "./types";

export async function getProfile(
  accessToken: string
) {
  return apiRequest<GetProfileResponse>(
    "/users/me",
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );
}

export async function updateProfile(
  accessToken: string,
  data: UpdateProfileInput
) {
  return apiRequest<UpdateProfileResponse>(
    "/users/me",
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );
}