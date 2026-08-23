export const authConfig = {
  accessToken: {
    secret:
      process.env.JWT_ACCESS_SECRET!,
    expiresIn: "1d",
  },

  refreshToken: {
    secret:
      process.env.JWT_REFRESH_SECRET!,
    expiresIn: "30d",
  },
};