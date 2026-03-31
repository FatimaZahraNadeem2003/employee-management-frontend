"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import http from "@/services/http";
import toast from "react-hot-toast";
import {
  FolderKanban,
  Users,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  totalEmployees: number;
  todayMeetings: number;
  pendingReviews: number;
}

interface Project {
  _id: string;
  name: string;
  code: string;
  assignedCount: number;
  priority: string;
  status: string;
}

interface TodayMeeting {
  _id: string;
  projectId: {
    name: string;
    code: string;
  };
  startTime: string;
  endTime: string;
  location: string;
  meetingType: string;
}

const ManagerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalEmployees: 0,
    todayMeetings: 0,
    pendingReviews: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TodayMeeting[]>([]);
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
      
      const statsRes = await http.get("/manager/dashboard/stats");
      console.log("Dashboard stats:", statsRes.data);
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      const projectsRes = await http.get("/manager/projects");
      const projects = projectsRes.data.data || [];
      setRecentProjects(projects.slice(0, 4));

      const scheduleRes = await http.get("/manager/schedules");
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const todayClasses = scheduleRes.data.data?.[today] || [];
      setTodaySchedule(todayClasses);

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.msg || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-teal-600 text-white",
      medium: "bg-yellow-600 text-white",
      high: "bg-orange-600 text-white",
      critical: "bg-red-600 text-white",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-600 text-white";
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          {icon}
        </div>
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
          Welcome back to your manager dashboard. {`Here's what's`} happening with your projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Projects"
          value={stats.totalProjects}
          icon={<FolderKanban className="w-6 h-6 text-white" />}
          color="from-teal-400 to-cyan-500"
        />
        <StatCard
          title="Team Members"
          value={stats.totalEmployees}
          icon={<Users className="w-6 h-6 text-white" />}
          color="from-cyan-400 to-indigo-500"
        />
        <StatCard
          title="Today's Meetings"
          value={stats.todayMeetings}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="from-indigo-400 to-purple-500"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={<Award className="w-6 h-6 text-white" />}
          color="from-emerald-400 to-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              {`Today's`} Schedule
            </h2>
            <button
              onClick={() => router.push("/Manager/schedule")}
              className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-white/85 font-medium">{meeting.projectId?.name}</p>
                    <p className="text-white/85 text-sm">{meeting.projectId?.code}</p>
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
              <FolderKanban className="w-5 h-5 text-teal-400" />
              My Projects
            </h2>
            <button
              onClick={() => router.push("/Manager/projects")}
              className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => router.push(`/Manager/projects/${project._id}`)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/85 font-medium">{project.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityBadge(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  <p className="text-white/85 text-sm">{project.code}</p>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <span className="text-white/80">
                      <Users className="w-4 h-4 inline mr-1" />
                      {project.assignedCount || 0} employees
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

      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/Manager/performances")}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <Award className="w-6 h-6 text-teal-400 mb-2" />
            <p className="text-white/85 font-medium">Review Performance</p>
            <p className="text-white/85 text-sm">Submit performance reviews for your team</p>
          </button>
          <button
            onClick={() => router.push("/Manager/employees")}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-teal-400 mb-2" />
            <p className="text-white/85 font-medium">Team Management</p>
            <p className="text-white/85 text-sm">View and manage your team members</p>
          </button>
          <button
            onClick={() => router.push("/Manager/schedule")}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <Calendar className="w-6 h-6 text-teal-400 mb-2" />
            <p className="text-white/85 font-medium">Schedule Meetings</p>
            <p className="text-white/85 text-sm">Check and manage your schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;