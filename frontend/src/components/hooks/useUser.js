import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const { loggedInUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (loggedInUser) {
        setIsLoading(true);

        try {
          const response = await fetch(`http://localhost:8080/users/user/${loggedInUser}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            console.log(userData);

            if (userData.profileImageFileName) {
              console.log(userData.profileImageFileName);
              fetchProfileImage(userData.profileImageFileName);
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUser(null);
      }
    };

    const fetchProfileImage = async (fileName) => {
      try {
        const response = await fetch(`http://localhost:8080/users/user/profileImage/${fileName}`);
        if (response.ok) {
          const imageBlob = await response.blob();
          console.log(imageBlob);
          const imageUrl = URL.createObjectURL(imageBlob);
          console.log(`imageurl`,imageUrl) // imageurl blob:http://localhost:9000/07aade99-d6c2-4d42-9a7d-7a141c2b3a62
          setProfileImage(imageUrl);
        } else {
          console.error('Failed to fetch profile image');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchUser();
  }, [loggedInUser]);

  return { isLoading, user, profileImage };
};

export { useUser };
