import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export const useTasks = (dateQuery) => {
  const [tasks, setTasks] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTasks(res.data.tasks);
      setActiveCount(res.data.activeCount);
      setCompleteCount(res.data.completeCount);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dateQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (title) => {
    await api.post("/tasks", { title });
    await fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, updates) => {
    await api.put(`/tasks/${id}`, updates);
    await fetchTasks();
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    activeCount,
    completeCount,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
