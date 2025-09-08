import { useState, useEffect,useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../service/api"; // axios instance có interceptor

export const useUser = () => {
  const { loggedInUser } = useAuth();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!loggedInUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await api.get(`/users/user/${loggedInUser.username}`);
      setUser(res.data);

      if (res.data.profileImageFileName) {
        const imgRes = await api.get(
          `/users/user/profileImage/${res.data.profileImageFileName}`,
          { responseType: "blob" }
        );
        const blobUrl = URL.createObjectURL(imgRes.data);
        setProfileImage(blobUrl);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setIsLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { isLoading, user, profileImage, fetchUser };
};
