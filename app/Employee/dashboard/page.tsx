"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import http from "@/services/http";
import toast from "react-hot-toast";
import {
  FolderKanban,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

interface DashboardData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    position: string;
    department: string;
  };
  statistics: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    averageCompletion: number;
  };
  recentPerformances: Array<{
    _id: string;
    projectId: {
      _id: string;
      name: string;
      code: string;
    };
    reviewName: string;
    rating: string;
    percentage: number;
    reviewDate: string;
  }>;
  todayMeetings: Array<{
    _id: string;
    projectId: {
      _id: string;
      name: string;
      code: string;
    };
    startTime: string;
    endTime: string;
    location: string;
    managerId: {
      _id: string;
      userId: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
  projects: Array<{
    _id: string;
    name: string;
    code: string;
    completionPercentage: number;
    status: string;
  }>;
}

const EmployeeDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeGreeting, setTimeGreeting] = useState("");

  useEffect(() => {
    setGreeting();
    fetchDashboardData();
  }, []);

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good Morning");
    else if (hour < 18) setTimeGreeting("Good Afternoon");
    else setTimeGreeting("Good Evening");
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const profileRes = await http.get("/employee/profile");
      const projectsRes = await http.get("/employee/projects");
      const performancesRes = await http.get("/employee/performances");
      const scheduleRes = await http.get("/employee/schedule");

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const todayMeetings = scheduleRes.data.today?.meetings || [];

      setData({
        profile: profileRes.data.data.profile,
        statistics: profileRes.data.data.statistics,
        recentPerformances: performancesRes.data.data?.slice(0, 5) || [],
        todayMeetings,
        projects: projectsRes.data.data || [],
      });

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.msg || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-white/60 text-sm mb-1">{title}</h3>
      <p className="text-white/85 text-2xl font-bold">{value}</p>
    </div>
  );

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-teal-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
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
          {timeGreeting}, {data?.profile?.firstName || 'Employee'}! 👋
        </h1>
        <p className="text-white/85">
          Welcome back to your employee dashboard. {`Here's`} your work progress.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
          <span>📋 Position: {data?.profile?.position}</span>
          <span>🏢 Department: {data?.profile?.department}</span>
          <span>🆔 Employee ID: {data?.profile?.employeeId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={data?.statistics?.totalProjects || 0}
          icon={<FolderKanban className="w-6 h-6 text-white" />}
          color="from-teal-400 to-cyan-500"
        />
        <StatCard
          title="Active Projects"
          value={data?.statistics?.activeProjects || 0}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="from-cyan-400 to-indigo-500"
        />
        <StatCard
          title="Completed"
          value={data?.statistics?.completedProjects || 0}
          icon={<Award className="w-6 h-6 text-white" />}
          color="from-indigo-400 to-purple-500"
        />
        <StatCard
          title="Avg Completion"
          value={`${data?.statistics?.averageCompletion || 0}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="from-emerald-400 to-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              {`Today's Meetings`}
            </h2>
            <button
              onClick={() => router.push("/Employee/schedule")}
              className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
            >
              View Schedule <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {data?.todayMeetings && data.todayMeetings.length > 0 ? (
              data.todayMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/85 font-medium">{meeting.projectId?.name}</p>
                    <span className="text-white/80 text-sm">{meeting.projectId?.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">
                      {meeting.startTime} - {meeting.endTime}
                    </span>
                    <span className="text-white/80">Room {meeting.location}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    Manager: {meeting.managerId?.userId?.firstName} {meeting.managerId?.userId?.lastName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">No meetings scheduled for today</p>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              Recent Performance Reviews
            </h2>
            <button
              onClick={() => router.push("/Employee/performances")}
              className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {data?.recentPerformances && data.recentPerformances.length > 0 ? (
              data.recentPerformances.map((performance) => (
                <div
                  key={performance._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-white/85 font-medium">{performance.projectId?.name}</p>
                    <p className="text-white/85 text-sm">{performance.reviewName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/85 font-bold text-lg">{performance.rating}</p>
                    <p className="text-white/85 text-xs">{performance.percentage}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">No performance reviews available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-teal-400" />
            My Projects Progress
          </h2>
          <button
            onClick={() => router.push("/Employee/projects")}
            className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {data?.projects && data.projects.length > 0 ? (
            data.projects.map((project) => (
              <div
                key={project._id}
                className="p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => router.push(`/Employee/projects/${project._id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white/85 font-medium">{project.name}</p>
                    <p className="text-white/85 text-sm">{project.code}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.status === "completed"
                        ? "bg-teal-600 text-white/80"
                        : "bg-indigo-600 text-white/80"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar progress={project.completionPercentage} />
                  <span className="text-white/80 text-sm min-w-[45px]">
                    {project.completionPercentage}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/85 text-center py-4">No projects assigned yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;