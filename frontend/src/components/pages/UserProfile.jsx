import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../hooks/useUser';
import {Heading, Button, Input} from '../ui'
import { formatCurrency } from '../utils/helpers';
import UserService from '../service/UserService';

const UserProfile = () => {
  const { isLoading, user, profileImage } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);

  // Prefill local state when user is available
  React.useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <div>Không tìm thấy người dùng</div>;
  }

  // Todo: need to update account ui and to add update profile image option

  const profileImageUrl = profileImage ? profileImage : null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUser(user.id, {
        username,
        email,
        password,
        role: user.role,
        profileImage: file ? [file] : [new File([], '')],
      });
      alert('Cập nhật tài khoản thành công');
    } catch (err) {
      alert('Cập nhật thất bại');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác.');
    if (!ok) return;
    try {
      await UserService.deleteUser(user.id);
      alert('Tài khoản đã được xóa');
      // Optionally redirect or log out
      window.location.href = '/login';
    } catch (err) {
      alert('Xóa tài khoản thất bại');
      console.error(err);
    }
  };

  return (
    <>
      <Heading as="h1">Hồ sơ người dùng</Heading>
      <ProfileContainer>
      {profileImageUrl && <ProfileImage src={profileImageUrl} alt={`${user.username}'s profile`} />}
        <InfoContainer>
          <InfoItem>
            <strong>Tên đăng nhập:</strong> {user.username}
          </InfoItem>
          <InfoItem>
            <strong>Email:</strong> {user.email}
          </InfoItem>
          <InfoItem>
            <strong>Số dư:</strong>{formatCurrency(user.balance)}
          </InfoItem>
          {/* <InfoItem>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Role:</strong> {user.role === 'ROLE_USER'? 'user' : 'admin'}
        </InfoItem> */}
        </InfoContainer>
        <Divider />
        <form onSubmit={handleUpdate}>
          <Field>
            <label>Tên đăng nhập</label>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field>
            <label>Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field>
            <label>Mật khẩu mới</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Để trống nếu không đổi" />
          </Field>
          <Field>
            <label>Ảnh đại diện</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </Field>
          <Actions>
            <Button type="submit">Cập nhật</Button>
            <Button variation="danger" type="button" onClick={handleDelete}>Xóa tài khoản</Button>
          </Actions>
        </form>
      </ProfileContainer>
    </>
  );
};

export default UserProfile;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  width: 400px;
  padding: 41px;
  /* border: 1px solid var(--color-grey-300); */
  /* border-radius: 8px; */
  box-shadow: var(--shadow-sm);
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const InfoItem = styled.p`
  /* font-size: 18px; */
  margin: 5px 0;
  strong {
    margin-right: 10px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-grey-200);
  margin: 1.6rem 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  label { font-size: 1.2rem; color: var(--color-grey-500); }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
`;
