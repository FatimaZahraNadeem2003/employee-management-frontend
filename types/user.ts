/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  profile?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  employeeId?: string;
  position?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
}