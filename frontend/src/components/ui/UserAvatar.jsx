import React from 'react'
import styled from "styled-components";
import {useUser} from '../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const UserAvatar = () => {
  const navigate= useNavigate();
  const { user, profileImage } = useUser();

  if (!user) {
    // Handle case where user data is null
    return <div>No user data available</div>;
  }

  console.log('user:', user);

  const { username } = user;

  return (
    <StyledUserAvatar>
      <Avatar src={profileImage || 'default-user.jpg'} alt={username} onClick={() => navigate("/account")} />
      <span>{username}</span>
    </StyledUserAvatar>
  );
};

export default UserAvatar;
