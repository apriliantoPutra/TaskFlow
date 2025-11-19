import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

const API_URL = "http://localhost:5000/api/tasks";

const Tasks = () => {
  const Navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem("token");

  // --- Helpers ---
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  });

  const handleAuthError = () => {
    localStorage.removeItem("token");
    Navigate("/login", { state: { message: "Harus login terlebih dahulu", type: "error" } });
  };

  // --- Fetch tasks on mount ---
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: authHeaders(),
      });

      if (res.status === 401) return handleAuthError();

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal memuat tasks" });
        return;
      }
      setTasks(data);
    } catch {
      setAlert({ type: "error", message: "Server tidak merespon" });
    }
  };

  // --- Input handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Create Task ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    setAlert(null);

    let deadline = newTask.deadline;
    if (deadline && deadline.length === 16) deadline = `${deadline}:00`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          deadline,
        }),
      });

      if (res.status === 401) return handleAuthError();

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal membuat task" });
        return;
      }

      // tambah task ke state
      setTasks((prev) => [data.task, ...prev]);
      setShowModal(false);
      setNewTask({ title: "", description: "", deadline: "" });
      setAlert({ type: "success", message: data.message || "Task berhasil dibuat" });
    } catch {
      setAlert({ type: "error", message: "Server tidak merespon" });
    }
  };

  // --- Edit Task (PUT /:id/edit) ---
  const handleEditTask = async (e) => {
    e.preventDefault();
    setAlert(null);

    const taskId = editingTask.id;
    let deadline = editingTask.deadline;
    if (deadline && deadline.length === 16) deadline = `${deadline}:00`;

    try {
      const res = await fetch(`${API_URL}/${taskId}/edit`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          deadline,
        }),
      });

      if (res.status === 401) return handleAuthError();

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal memperbarui task" });
        return;
      }

      // update state
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, title: editingTask.title, description: editingTask.description, deadline } : t)));
      setShowEditModal(false);
      setEditingTask(null);
      setAlert({ type: "success", message: data.message || "Task diperbarui" });
    } catch {
      setAlert({ type: "error", message: "Server tidak merespon" });
    }
  };

  // --- Patch status to done (PATCH /:id/status) ---
  const handleStatusComplete = async (taskId) => {
    setAlert(null);
    try {
      const res = await fetch(`${API_URL}/${taskId}/status`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      if (res.status === 401) return handleAuthError();

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", message: data.error || data.message || "Gagal update status" });
        return;
      }

      // update local state: set status done for that task
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "done" } : t)));
      setAlert({ type: "success", message: data.message || "Task ditandai selesai" });
    } catch {
      setAlert({ type: "error", message: "Server tidak merespon" });
    }
  };

  // --- Delete Task ---
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;
    setAlert(null);
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401) return handleAuthError();

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", message: data.error || data.message || "Gagal menghapus task" });
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setAlert({ type: "success", message: data.message || "Task berhasil dihapus" });
    } catch {
      setAlert({ type: "error", message: "Server tidak merespon" });
    }
  };

  const handleEditButtonClick = (task) => {
    // normalize deadline to input format "YYYY-MM-DDTHH:mm" if task.deadline exists
    const editDeadline = task.deadline ? new Date(task.deadline) : null;
    setEditingTask({
      ...task,
      deadline: editDeadline ? editDeadline.toISOString().slice(0, 16) : "",
    });
    setShowEditModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/login", {
      state: { message: "User berhasil Logout", type: "success" },
    });
  };

  // --- UI helper functions (kept as you provided) ---
  const getStatusColor = (status) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "in-progress":
        return "Proses";
      case "done":
        return "Selesai";
      case "expired":
        return "Kadaluarsa";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const toLocalInputValue = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const isActionDisabled = (status) => {
    return status === "done" || status === "expired";
  };

  // --- JSX (UI unchanged, just added alert usage) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Manajemen Task</h1>
            <p className="text-purple-600 mt-2">Kelola semua tugas Anda di satu tempat</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 md:justify-end">
            <button onClick={handleLogout} className="px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-150 shadow flex items-center justify-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-13V3m0 0a2 2 0 00-2 2v1m2-3a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>

            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150 shadow-lg flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Task
            </button>
          </div>
        </div>

        {/* ALERT */}
        {alert && <Alert type={alert.type} message={alert.message} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition duration-150">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-purple-900 truncate">{task.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{getStatusText(task.status)}</span>
                </div>

                <p className="text-purple-700 mb-4 line-clamp-3">{task.description}</p>

                <div className="flex items-center text-purple-600 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Deadline: {formatDate(task.deadline)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-purple-100">
                  {!isActionDisabled(task.status) && (
                    <button onClick={() => handleStatusComplete(task.id)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-150 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selesai
                    </button>
                  )}

                  <div className="flex space-x-2">
                    {!isActionDisabled(task.status) && (
                      <button onClick={() => handleEditButtonClick(task)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-150 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    )}

                    <button onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition duration-150 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Belum ada task</h3>
            <p className="text-purple-600 mb-4">Mulai dengan membuat task pertama Anda</p>
            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150">
              Buat Task Pertama
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg backdrop-saturate-150 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            <div className="p-6 border-b border-purple-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-purple-900">Tambah Task Baru</h2>
                <button onClick={() => setShowModal(false)} className="text-purple-400 hover:text-purple-600 transition duration-150">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddTask} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-purple-700 mb-2">
                  Judul Task *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Masukkan judul task"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-purple-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Tambahkan deskripsi task (opsional)"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-purple-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  required
                  value={newTask.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition duration-150">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150 shadow-md">
                  Simpan Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg backdrop-saturate-150 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            <div className="p-6 border-b border-purple-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-purple-900">Edit Task</h2>
                <button onClick={() => setShowEditModal(false)} className="text-purple-400 hover:text-purple-600 transition duration-150">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditTask} className="p-6 space-y-6">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-purple-700 mb-2">
                  Judul Task *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  required
                  value={editingTask.title}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Masukkan judul task"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-purple-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  value={editingTask.description}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Tambahkan deskripsi task (opsional)"
                />
              </div>

              <div>
                <label htmlFor="edit-deadline" className="block text-sm font-medium text-purple-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  id="edit-deadline"
                  name="deadline"
                  required
                  value={editingTask.deadline ? toLocalInputValue(editingTask.deadline) : ""}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition duration-150">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150 shadow-md">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
