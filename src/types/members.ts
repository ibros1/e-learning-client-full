export interface iListedMembersResponse {
  isSuccess: boolean;
  message: string;
  users: User[];
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
  password: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// getOneMember
export interface iGetOneMember {
  isSuccess: boolean;
  message: string;
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
  password: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
