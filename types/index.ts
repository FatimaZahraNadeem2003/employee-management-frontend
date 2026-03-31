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
  class?: string; 
  contactNumber?: string;
  parentName?: string;
  parentContact?: string;
  employeeId?: string;
  qualification?: string;
  specialization?: string;
  position?: string;
  department?: string;
}

export interface Employee {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  employeeId: string;
  position: string;
  department: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  joiningDate: string;
  status: 'active' | 'on-leave' | 'terminated' | 'probation';
  salary?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Manager {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  employeeId: string;
  department: string;
  qualification: string;
  experience?: number;
  dateOfBirth?: string;
  gender?: string;
  contactNumber: string;
  emergencyContact?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave' | 'resigned';
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  code: string;
  description: string;
  managerId?: string | Manager;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  department: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  budget?: number;
  resources?: string[];
  assignedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  employeeId: Employee | string;
  projectId: Project | string;
  assignmentDate: string;
  status: 'active' | 'completed' | 'removed' | 'pending';
  role?: string;
  completionPercentage?: number;
  completionDate?: string;
  performanceRating?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Performance {
  _id: string;
  employeeId: Employee | string;
  projectId: Project | string;
  reviewerId: Manager | string;
  reviewType: 'quarterly' | 'annual' | 'project' | 'probation';
  reviewName: string;
  maxScore: number;
  obtainedScore: number;
  percentage?: number;
  rating?: 'Outstanding' | 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory';
  comments?: string;
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  _id: string;
  projectId: Project | string;
  managerId: Manager | string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  location: string;
  building?: string;
  meetingType?: 'meeting' | 'workshop' | 'presentation' | 'review' | 'training';
  semester: string;
  academicYear: string;
  isRecurring: boolean;
  status: 'scheduled' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

export interface DashboardStats {
  overview: {
    totalEmployees: number;
    totalManagers: number;
    totalProjects: number;
    totalAssignments: number;
    activeProjects: number;
    activeAssignments: number;
    completionRate: number;
    avgEmployeesPerProject: number;
  };
  todayMeetings: {
    count: number;
    meetings: Schedule[];
  };
  popularProjects: Array<{
    _id: string;
    project: {
      name: string;
      code: string;
      department: string;
    };
    count: number;
  }>;
  recentActivity: {
    assignments: Assignment[];
  };
}