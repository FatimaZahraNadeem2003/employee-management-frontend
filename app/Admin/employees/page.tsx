"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import DataTable from "@/app/components/ui/DataTable";
import SearchBar from "@/app/components/ui/SearchBar";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import AddEmployeeModal from "./components/AddEmployeeModal";
import { Plus, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

interface Employee {
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
  status: string;
  createdAt: string;
}

const EmployeesPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "" });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [uniquePositions, setUniquePositions] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchFiltersData();
  }, [currentPage, selectedDepartment, selectedPosition, selectedStatus]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setCurrentPage(1);
      fetchEmployees();
    }, 500);

    if (search !== undefined) {
      debouncedSearch();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

  const fetchFiltersData = async () => {
    try {
      const response = await http.get("/admin/employees?limit=1000");
      const allEmployees = response.data.data || [];
      const departments = [...new Set(allEmployees.map((e: Employee) => e.department).filter(Boolean))];
      const positions = [...new Set(allEmployees.map((e: Employee) => e.position).filter(Boolean))];
      setUniqueDepartments(departments);
      setUniquePositions(positions);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }
      if (selectedDepartment && selectedDepartment !== "") {
        params.department = selectedDepartment;
      }
      if (selectedPosition && selectedPosition !== "") {
        params.position = selectedPosition;
      }
      if (selectedStatus && selectedStatus !== "") {
        params.status = selectedStatus;
      }

      const response = await http.get("/admin/employees", { params });
      
      if (response.data.success && response.data.data) {
        setEmployees(response.data.data);
        setTotalPages(response.data.pages || 1);
        setTotalCount(response.data.total || response.data.data.length);
      } else {
        setEmployees([]);
        setTotalPages(1);
        setTotalCount(0);
      }
      
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error(error.response?.data?.msg || "Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const clearFilters = () => {
    setSelectedDepartment("");
    setSelectedPosition("");
    setSelectedStatus("");
    setSearch("");
    setCurrentPage(1);
    setTimeout(() => {
      fetchEmployees();
    }, 100);
  };

  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/admin/employees/${id}`);
      toast.success("Employee deleted successfully");
      fetchEmployees();
      fetchFiltersData();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data?.msg || "Failed to delete employee");
    }
  };

  const columns = [
    { 
      key: "employeeId", 
      header: "Employee ID",
      render: (employee: Employee) => <span className="text-white font-medium">{employee.employeeId || 'N/A'}</span>
    },
    {
      key: "name",
      header: "Name",
      render: (employee: Employee) => (
        <span className="text-white font-bold">
          {employee.userId?.firstName || ''} {employee.userId?.lastName || ''}
        </span>
      ),
    },
    { 
      key: "position", 
      header: "Position",
      render: (employee: Employee) => <span className="text-white font-medium">{employee.position || 'N/A'}</span>
    },
    { 
      key: "department", 
      header: "Department",
      render: (employee: Employee) => <span className="text-white font-medium">{employee.department || 'N/A'}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => {
        const status = employee.status || 'unknown';
        const colorClass = 
          status === "active" ? "bg-teal-600 text-white" :
          status === "on-leave" ? "bg-yellow-600 text-white" :
          status === "probation" ? "bg-blue-600 text-white" :
          status === "terminated" ? "bg-red-600 text-white" :
          "bg-gray-600 text-white";
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (employee: Employee) => (
        <span className="text-white font-medium">
          {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees Management</h1>
          <p className="text-white/60 mt-1">Total Employees: {totalCount}</p>
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
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-lg text-white hover:from-teal-500 hover:to-indigo-600 transition-colors font-bold"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email, employee ID..."
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
                value={selectedPosition}
                onChange={(e) => {
                  setSelectedPosition(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/95 focus:outline-none focus:border-teal-400 font-medium"
              >
                <option value="" className="bg-gray-800 text-white">All Positions</option>
                {uniquePositions.map(pos => (
                  <option key={pos} value={pos} className="bg-gray-800 text-white">{pos}</option>
                ))}
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
                <option value="active" className="bg-gray-800 text-white">Active</option>
                <option value="on-leave" className="bg-gray-800 text-white">On Leave</option>
                <option value="probation" className="bg-gray-800 text-white">Probation</option>
                <option value="terminated" className="bg-gray-800 text-white">Terminated</option>
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
        data={employees}
        loading={loading}
        onView={(employee) => router.push(`/Admin/employees/${employee._id}`)}
        onEdit={(employee) => router.push(`/Admin/employees/${employee._id}/edit`)}
        onDelete={(employee) => setDeleteModal({ isOpen: true, id: employee._id })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddEmployeeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          fetchEmployees();
          fetchFiltersData();
        }}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "" })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
};

export default EmployeesPage;