export const authConfig = {
  accessToken: {
    secret:
      process.env.JWT_ACCESS_SECRET!,
    expiresIn: "15m",
  },

  refreshToken: {
    secret:
      process.env.JWT_REFRESH_SECRET!,
    expiresIn: "30d",
  },
};