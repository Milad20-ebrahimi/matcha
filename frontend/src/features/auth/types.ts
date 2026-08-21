export type User = {
  id: string;
  roleId: string;

  firstName: string;
  lastName: string | null;

  email: string | null;
  phone: string | null;

  isActive: boolean;

  emailVerified: boolean;
  phoneVerified: boolean;

  lastLoginAt: string | null;
  createdAt: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
};

export type RequestOtpResponse = {
  message: string;

  data: {
    otpId: string;
    phone: string;
    expiresAt: string;
  };
};

export type VerifyOtpResponse = {
  message: string;

  data: {
    success: boolean;
    phone: string;

    isNewUser: boolean;
    needsName: boolean;

    userId?: string;

    accessToken?: string;
    refreshToken?: string;
  };
};

export type CompleteRegistrationResponse = {
  message: string;

  data: {
    success: boolean;

    user: User;

    accessToken: string;
    refreshToken: string;
  };
};

export type GetMeResponse = {
  message: string;

  data: User;
};

export type RefreshResponse = {
  message: string;

  data: {
    accessToken: string;
    refreshToken: string;
    refreshSessionId?: string;
  };
};

export type LogoutResponse = {
  message: string;
};