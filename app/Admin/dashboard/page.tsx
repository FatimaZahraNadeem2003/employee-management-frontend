"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import http from "@/services/http";
import toast from "react-hot-toast";
import {
  Users,
  UserCog,
  FolderKanban,
  Briefcase,
  ArrowUpRight,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";

interface DashboardStats {
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
    meetings: any[];
  };
  popularProjects: any[];
  recentActivity: {
    assignments: any[];
  };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeGreeting, setTimeGreeting] = useState("");

  useEffect(() => {
    fetchDashboardStats();
    setGreeting();
  }, []);

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good Morning");
    else if (hour < 18) setTimeGreeting("Good Afternoon");
    else setTimeGreeting("Good Evening");
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await http.get("/admin/reports/dashboard");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, color }: any) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center text-white/80 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-white/60 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white/95 mb-2">
          {timeGreeting}, {user?.firstName}! 👋
        </h1>
        <p className="text-white/85">
          Welcome back to your admin dashboard. {`Here's what's`} happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.overview.totalEmployees || 0}
          icon={<Users className="w-6 h-6 text-white" />}
          color="from-teal-400 to-cyan-500"
        />
        <StatCard
          title="Total Managers"
          value={stats?.overview.totalManagers || 0}
          icon={<UserCog className="w-6 h-6 text-white" />}
          color="from-cyan-400 to-indigo-500"
        />
        <StatCard
          title="Active Projects"
          value={stats?.overview.activeProjects || 0}
          icon={<FolderKanban className="w-6 h-6 text-white" />}
          color="from-indigo-400 to-purple-500"
        />
        <StatCard
          title="Active Assignments"
          value={stats?.overview.activeAssignments || 0}
          icon={<Briefcase className="w-6 h-6 text-white" />}
          color="from-emerald-400 to-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              Today's Meetings
            </h2>
            <span className="text-white/80 text-sm">
              {stats?.todayMeetings.count || 0} meetings
            </span>
          </div>
          <div className="space-y-3">
            {stats?.todayMeetings.meetings && stats.todayMeetings.meetings.length > 0 ? (
              stats.todayMeetings.meetings.map((meeting: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-white/85 font-medium">{meeting.projectId?.name}</p>
                    <p className="text-white/85 text-sm">{meeting.managerId?.userId?.firstName} {meeting.managerId?.userId?.lastName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/85">{meeting.startTime} - {meeting.endTime}</p>
                    <p className="text-white/85 text-sm">Room {meeting.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/85 text-center py-4">No meetings scheduled for today</p>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Recent Assignments
            </h2>
          </div>
          <div className="space-y-3">
            {stats?.recentActivity.assignments && stats.recentActivity.assignments.length > 0 ? (
              stats.recentActivity.assignments.map((assignment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-white/85 font-medium">
                      {assignment.employeeId?.userId?.firstName} {assignment.employeeId?.userId?.lastName}
                    </p>
                    <p className="text-white/85 text-sm">{assignment.projectId?.name}</p>
                  </div>
                  <span className="text-xs text-white/80">
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/85 text-center py-4">No recent assignments</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h2 className="text-white font-semibold mb-4">Popular Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.popularProjects && stats.popularProjects.length > 0 ? (
            stats.popularProjects.map((project: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <h3 className="text-white font-medium">{project.project?.name}</h3>
                <p className="text-white/85 text-sm mb-2">{project.project?.code}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Department:</span>
                  <span className="text-white/80 text-sm">{project.project?.department}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/80 text-sm">Assigned:</span>
                  <span className="text-teal-400 font-semibold">{project.count} employees</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/85 col-span-3 text-center py-4">No popular projects data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;