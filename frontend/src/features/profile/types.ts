export type UserProfile = {
  id: string;

  dateOfBirth:
    | string
    | null;

  job:
    | string
    | null;

  bio:
    | string
    | null;

  avatarUrl:
    | string
    | null;

  createdAt: string;
  updatedAt: string;
};

export type ProfileUser = {
  id: string;

  roleId: string;

  firstName:
    | string
    | null;

  lastName:
    | string
    | null;

  email:
    | string
    | null;

  phone: string;

  phoneVerified: boolean;

  emailVerified: boolean;

  isActive: boolean;

  lastLoginAt:
    | string
    | null;

  createdAt: string;

  updatedAt: string;

  profile:
    | UserProfile
    | null;
};

export type GetProfileResponse = {
  message: string;

  data: ProfileUser;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;

  dateOfBirth?:
    | string
    | null;

  job?:
    | string
    | null;

  bio?:
    | string
    | null;

  avatarUrl?:
    | string
    | null;
};

export type UpdateProfileResponse = {
  message: string;

  data: ProfileUser;
};