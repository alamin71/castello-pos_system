export interface BranchRef {
  _id: string;
  name: string;
  branchId: string;
}

export interface RoleRef {
  _id: string;
  name: string;
  permissions: string[];
}

// Mirrors castello-backend's OperationUser (operations/operationUser module).
export interface OperationUserProfile {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  image?: string;
  designation: string;
  branch: BranchRef;
  role: RoleRef;
  status: "active" | "inactive";
}

export interface LoginPayload {
  identifier: string; // user ID or phone number
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: OperationUserProfile;
}

export interface ForgotPasswordPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface ResetPasswordPayload {
  phone: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  name?: string;
  image?: File;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
