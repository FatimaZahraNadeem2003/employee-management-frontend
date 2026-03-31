/* eslint-disable @typescript-eslint/no-explicit-any */

import http from "@/services/http";
import { ApiResponse, PaginatedResponse } from "@/types";
import toast from "react-hot-toast";


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
  contactNumber?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  class?: string; 
  parentName?: string;
  parentContact?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await http.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await http.post("/auth/register", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await http.get("/auth/me");
    return response.data;
  },
};

export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  employeeId: string;
  position: string;
  department: string;
  contactNumber?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  salary?: number;
  joiningDate?: string;
  status?: string;
}

export interface ManagerData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  employeeId: string;
  department: string;
  qualification: string;
  experience?: number;
  contactNumber: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  joiningDate?: string;
  bio?: string;
  status?: string;
}

export interface ProjectData {
  name: string;
  code: string;
  description: string;
  managerId?: string;
  priority?: string;
  startDate: string;
  endDate: string;
  department: string;
  status?: string;
  budget?: number;
  resources?: string[];
}

export interface ScheduleData {
  projectId: string;
  managerId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  building?: string;
  meetingType?: string;
  semester: string;
  academicYear: string;
  isRecurring?: boolean;
  status?: string;
}

export interface AssignmentData {
  employeeId: string;
  projectId: string;
  status?: string;
  role?: string;
  completionPercentage?: number;
  performanceRating?: number;
  remarks?: string;
}

export interface PerformanceData {
  employeeId: string;
  projectId: string;
  reviewType: string;
  reviewName: string;
  maxScore: number;
  obtainedScore: number;
  comments?: string;
}

export const adminApi = {
  employees: {
    getAll: async (params?: any) => {
      const response = await http.get("/admin/employees", { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await http.get(`/admin/employees/${id}`);
      return response.data;
    },
    create: async (data: EmployeeData) => {
      const response = await http.post("/admin/employees", data);
      return response.data;
    },
    update: async (id: string, data: Partial<EmployeeData>) => {
      const response = await http.put(`/admin/employees/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await http.delete(`/admin/employees/${id}`);
      return response.data;
    },
  },

  managers: {
    getAll: async (params?: any) => {
      const response = await http.get("/admin/managers", { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await http.get(`/admin/managers/${id}`);
      return response.data;
    },
    create: async (data: ManagerData) => {
      const response = await http.post("/admin/managers", data);
      return response.data;
    },
    update: async (id: string, data: Partial<ManagerData>) => {
      const response = await http.put(`/admin/managers/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await http.delete(`/admin/managers/${id}`);
      return response.data;
    },
    getStats: async () => {
      const response = await http.get("/admin/managers/stats");
      return response.data;
    },
  },

  projects: {
    getAll: async (params?: any) => {
      const response = await http.get("/admin/projects", { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await http.get(`/admin/projects/${id}`);
      return response.data;
    },
    create: async (data: ProjectData) => {
      const response = await http.post("/admin/projects", data);
      return response.data;
    },
    update: async (id: string, data: Partial<ProjectData>) => {
      const response = await http.put(`/admin/projects/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await http.delete(`/admin/projects/${id}`);
      return response.data;
    },
    assignManager: async (projectId: string, managerId: string) => {
      const response = await http.post(`/admin/projects/${projectId}/assign-manager`, { managerId });
      return response.data;
    },
    getStats: async () => {
      const response = await http.get("/admin/projects/stats");
      return response.data;
    },
  },

  schedules: {
    getAll: async (params?: any) => {
      const response = await http.get("/admin/schedules", { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await http.get(`/admin/schedules/${id}`);
      return response.data;
    },
    create: async (data: ScheduleData) => {
      const response = await http.post("/admin/schedules", data);
      return response.data;
    },
    update: async (id: string, data: Partial<ScheduleData>) => {
      const response = await http.put(`/admin/schedules/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await http.delete(`/admin/schedules/${id}`);
      return response.data;
    },
    getWeekly: async (params?: any) => {
      const response = await http.get("/admin/schedules/weekly", { params });
      return response.data;
    },
  },

  assignments: {
    getAll: async (params?: any) => {
      const response = await http.get("/admin/assignments", { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await http.get(`/admin/assignments/${id}`);
      return response.data;
    },
    create: async (data: AssignmentData) => {
      const response = await http.post("/admin/assignments", data);
      return response.data;
    },
    update: async (id: string, data: Partial<AssignmentData>) => {
      const response = await http.put(`/admin/assignments/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await http.delete(`/admin/assignments/${id}`);
      return response.data;
    },
    getEmployeeProjects: async (employeeId: string, params?: any) => {
      const response = await http.get(`/admin/assignments/employee/${employeeId}`, { params });
      return response.data;
    },
    bulkAssign: async (projectId: string, employeeIds: string[]) => {
      const response = await http.post("/admin/assignments/bulk", { projectId, employeeIds });
      return response.data;
    },
  },

  reports: {
    getDashboard: async () => {
      const response = await http.get("/admin/reports/dashboard");
      return response.data;
    },
    getEmployeesCount: async (params?: any) => {
      const response = await http.get("/admin/reports/employees-count", { params });
      return response.data;
    },
    getProjectsCount: async (params?: any) => {
      const response = await http.get("/admin/reports/projects-count", { params });
      return response.data;
    },
    getTodayMeetings: async () => {
      const response = await http.get("/admin/reports/today-meetings");
      return response.data;
    },
    getManagerWorkload: async () => {
      const response = await http.get("/admin/reports/manager-workload");
      return response.data;
    },
  },
};

export interface GradeData {
  employeeId: string;
  projectId: string;
  reviewType: string;
  reviewName: string;
  maxScore: number;
  obtainedScore: number;
  remarks?: string;
}

export interface RemarkData {
  employeeId: string;
  projectId?: string;
  remark: string;
}

export const managerApi = {
  getDashboardStats: async () => {
    const response = await http.get("/manager/dashboard/stats");
    return response.data;
  },

  projects: {
    getAll: async () => {
      const response = await http.get("/manager/projects");
      return response.data;
    },
    getById: async (projectId: string) => {
      const response = await http.get(`/manager/projects/${projectId}`);
      return response.data;
    },
    getEmployees: async (projectId: string) => {
      const response = await http.get(`/manager/projects/${projectId}/employees`);
      return response.data;
    },
  },

  performances: {
    getAll: async (projectId: string) => {
      const response = await http.get(`/manager/performances/project/${projectId}`);
      return response.data;
    },
    getEmployeePerformances: async (employeeId: string) => {
      const response = await http.get(`/manager/performances/employee/${employeeId}`);
      return response.data;
    },
    create: async (data: GradeData) => {
      const response = await http.post("/manager/performances", data);
      return response.data;
    },
    update: async (id: string, data: Partial<GradeData>) => {
      const response = await http.put(`/manager/performances/${id}`, data);
      return response.data;
    },
  },

  schedule: {
    get: async () => {
      const response = await http.get("/manager/schedules");
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await http.put(`/manager/schedules/${id}`, data);
      return response.data;
    },
  },

  remarks: {
    create: async (data: RemarkData) => {
      const response = await http.post("/manager/remarks", data);
      return response.data;
    },
    getEmployeeRemarks: async (employeeId: string) => {
      const response = await http.get(`/manager/remarks/employee/${employeeId}`);
      return response.data;
    },
  },
};

export const employeeApi = {
  profile: {
    get: async () => {
      const response = await http.get("/employee/profile");
      return response.data;
    },
    update: async (data: any) => {
      const response = await http.put("/employee/profile", data);
      return response.data;
    },
  },

  projects: {
    getAll: async () => {
      const response = await http.get("/employee/projects");
      return response.data;
    },
    getAvailable: async () => {
      const response = await http.get("/employee/projects/available");
      return response.data;
    },
    getById: async (projectId: string) => {
      const response = await http.get(`/employee/projects/${projectId}`);
      return response.data;
    },
    assign: async (projectId: string) => {
      const response = await http.post("/employee/assign", { projectId });
      return response.data;
    },
  },

  schedule: {
    get: async () => {
      const response = await http.get("/employee/schedule");
      return response.data;
    },
  },

  performances: {
    getAll: async () => {
      const response = await http.get("/employee/performances");
      return response.data;
    },
    getByProject: async (projectId: string) => {
      const response = await http.get(`/employee/performances/project/${projectId}`);
      return response.data;
    },
  },

  progress: {
    get: async () => {
      const response = await http.get("/employee/progress");
      return response.data;
    },
  },
};