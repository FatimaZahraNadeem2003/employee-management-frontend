"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import DataTable from "@/app/components/ui/DataTable";
import SearchBar from "@/app/components/ui/SearchBar";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import AddProjectModal from "./components/AddProjectModal";
import { Plus, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

interface Project {
  _id: string;
  name: string;
  code: string;
  department: string;
  priority: string;
  status: string;
  assignedCount: number;
  startDate: string;
  endDate: string;
  managerId?: {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

const ProjectsPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [addProjectModal, setAddProjectModal] = useState({ isOpen: false });
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchUniqueDepartments();
  }, [currentPage, selectedDepartment, selectedPriority, selectedStatus]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setCurrentPage(1);
      fetchProjects();
    }, 500);

    if (search !== undefined) {
      debouncedSearch();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

  const fetchUniqueDepartments = async () => {
    try {
      const response = await http.get("/admin/projects?limit=1000");
      const allProjects = response.data.data || [];
      const departments = [...new Set(allProjects.map((p: Project) => p.department).filter(Boolean))];
      setUniqueDepartments(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      
      if (search && search.trim() !== "") {
        params.append("search", search.trim());
      }
      if (selectedDepartment && selectedDepartment !== "") {
        params.append("department", selectedDepartment);
      }
      if (selectedPriority && selectedPriority !== "") {
        params.append("priority", selectedPriority);
      }
      if (selectedStatus && selectedStatus !== "") {
        params.append("status", selectedStatus);
      }

      const response = await http.get(`/admin/projects?${params}`);
      
      if (response.data.success) {
        setProjects(response.data.data || []);
        setTotalPages(response.data.pages || 1);
        setTotalCount(response.data.total || response.data.data.length);
      } else {
        setProjects([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectSuccess = () => {
    fetchProjects();
    fetchUniqueDepartments();
  };

  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/admin/projects/${id}`);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const clearFilters = () => {
    setSelectedDepartment("");
    setSelectedPriority("");
    setSelectedStatus("");
    setSearch("");
    setCurrentPage(1);
    setTimeout(() => {
      fetchProjects();
    }, 100);
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

  const getStatusBadge = (status: string) => {
    const colors = {
      planning: "bg-gray-600 text-white",
      active: "bg-teal-600 text-white",
      "on-hold": "bg-yellow-600 text-white",
      completed: "bg-blue-600 text-white",
      cancelled: "bg-red-600 text-white",
    };
    return colors[status as keyof typeof colors] || "bg-gray-600 text-white";
  };

  const columns = [
    { key: "code", header: "Code" },
    { key: "name", header: "Project Name" },
    {
      key: "manager",
      header: "Manager",
      render: (project: Project) => (
        <span className="text-white font-medium">
          {project.managerId?.userId?.firstName || ''} {project.managerId?.userId?.lastName || ''}
        </span>
      ),
    },
    { key: "department", header: "Department" },
    {
      key: "priority",
      header: "Priority",
      render: (project: Project) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getPriorityBadge(project.priority)}`}>
          {project.priority}
        </span>
      ),
    },
    {
      key: "assignedCount",
      header: "Assigned",
      render: (project: Project) => (
        <span className="text-white font-medium">{project.assignedCount || 0} employees</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (project: Project) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(project.status)}`}>
          {project.status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Management</h1>
          <p className="text-white/60 mt-1">Total Projects: {totalCount}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors font-medium"
          >
            <Filter className="w-4 h-4" />
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => setAddProjectModal({ isOpen: true })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-lg text-white hover:from-teal-500 hover:to-indigo-600 transition-colors font-bold"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search by name, code, department..."
        />

        {filterOpen && (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
              >
                <X className="w-3 h-3" /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/95 focus:outline-none focus:border-teal-400 font-medium"
              >
                <option value="" className="bg-gray-800 text-white">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept} className="bg-gray-800 text-white">{dept}</option>
                ))}
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/95 focus:outline-none focus:border-teal-400 font-medium"
              >
                <option value="" className="bg-gray-800 text-white">All Priorities</option>
                <option value="low" className="bg-gray-800 text-white">Low</option>
                <option value="medium" className="bg-gray-800 text-white">Medium</option>
                <option value="high" className="bg-gray-800 text-white">High</option>
                <option value="critical" className="bg-gray-800 text-white">Critical</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/95 focus:outline-none focus:border-teal-400 font-medium"
              >
                <option value="" className="bg-gray-800 text-white">All Status</option>
                <option value="planning" className="bg-gray-800 text-white">Planning</option>
                <option value="active" className="bg-gray-800 text-white">Active</option>
                <option value="on-hold" className="bg-gray-800 text-white">On Hold</option>
                <option value="completed" className="bg-gray-800 text-white">Completed</option>
                <option value="cancelled" className="bg-gray-800 text-white">Cancelled</option>
              </select>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        onView={(project) => router.push(`/Admin/projects/${project._id}`)}
        onEdit={(project) => router.push(`/Admin/projects/${project._id}/edit`)}
        onDelete={(project) => setDeleteModal({ isOpen: true, id: project._id })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddProjectModal
        isOpen={addProjectModal.isOpen}
        onClose={() => setAddProjectModal({ isOpen: false })}
        onSuccess={handleAddProjectSuccess}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "" })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will also remove all assignments."
      />
    </div>
  );
};

export default ProjectsPage;