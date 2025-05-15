export interface UserProfile {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface UserUpdate {
  username?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  firstname: string;
  lastname: string;
} 