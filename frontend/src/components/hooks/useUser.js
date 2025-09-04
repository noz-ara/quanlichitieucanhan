import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const { loggedInUser } = useAuth(); // chỉ đọc từ context
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!loggedInUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/users/user/${loggedInUser}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);

          if (data.profileImageFileName) {
            const imgRes = await fetch(`http://localhost:8080/users/user/profileImage/${data.profileImageFileName}`);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              setProfileImage(URL.createObjectURL(blob));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [loggedInUser]);

  return { isLoading, user, profileImage };
};
