import { useCallback, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(
    async ({ displayName, bio }) => {
      try {
        setSaving(true);
        const res = await api.put("/users/profile", { displayName, bio });
        updateUser(res.data.user);
        setError(null);
        return res.data.user;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [updateUser]
  );

  return { user, saving, error, updateProfile };
};
