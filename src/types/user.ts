export interface iLoginResponse {
  isSuccess: boolean;
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface iLoginPayload {
  email: string;
  password: string;
}

// register user
export interface iRegisterUserResponse {
  isSuccess: boolean;
  message: string;
  creatingUser: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    profilePhoto: string;
    coverPhoto: string;
    sex: string;
    phone_number: string;
    password: string;
    role: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  };
}

export interface iRegisterUserPayload {
  email: string;
  username: string;
  fullName: string;
  profilePhoto: string;
  coverPhoto: string;
  phone_number: string;
  sex: string;
  password: string;
  comfirmPassword: string;
}

// update
export interface iUpdatedUserPayload {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone_number: string;
  password: string;
}

export interface iUpdatedUserResponse {
  isSuccess: boolean;
  messsage: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// update role
export interface iUpdatedUserRoleResponse {
  isSuccess: boolean;
  message: string;
  updatedUserRole: UpdatedUserRole;
}

export interface UpdatedUserRole {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: string;
  phone_number: string;
  password: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface iUpdatedUserRolePayload {
  email: string;
  role: string;
}

// delete User

export interface iDeletedUserResponse {
  isSuccess: boolean;
  message: string;
  deletingUser: DeletingUser;
}

export interface DeletingUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: string;
  phone_number: string;
  password: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
