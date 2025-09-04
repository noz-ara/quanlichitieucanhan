import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { Button, FileInput, FormContainer, ErrorMessage, Form, Input, Heading } from '../ui';
import FilePreview from '../ui/FilePreview';
import api from '../service/api';

const FullPageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-grey-100);
`;

const Suggestions = styled.div`
  margin-top: 10px;
`;

const RegisterForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const csrfToken = useCsrfToken();

  const handleImageChange = (e) => {
    // Todo: Have to fix image preview
    const file = e.target.files[0];
    const previewURL = URL.createObjectURL(file);

    if (file) {
      setImagePreview(previewURL);
      setValue("profileImage", e.target.files[0]);
    }
  };

  // Image preview loaded
  const submitForm = async (data) => {
    try {
      // const formData = new FormData();
      // formData.append('username', data.username);
      // formData.append('email', data.email);
      // formData.append('password', data.password);
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('profileImage', data.profileImage[0]); // Add the profile image to form data

      await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      // Registration successful
      navigate('/signin');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          const { message, suggestedUsernames: suggestions } = error.response.data;
          setErrorMessage(message);
          setSuggestedUsernames(suggestions);
        } else if (error.response.status === 400) {
          const { errors: validationErrors } = error.response.data;
          validationErrors.forEach(err => {
            setError(err.field, { type: 'manual', message: err.defaultMessage });
          });

        } else {
          if (error.response.data && error.response.data.message) {
            alert(error.response.data.message);
            setErrorMessage(error.response.data.message);
          } else if (typeof error.response.data === 'string') {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage('An error occurred while registering.');
          }
        }
      } else {
        setErrorMessage('An unexpected error occurred while registering.');
      }
    }

    // Registration completed successfully
  };

  return (
    <FullPageContainer>
      <FormContainer>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Heading as='h2'>Đăng ký</Heading>
          <Input
            name="username"
            type="text"
            placeholder="Tên đăng nhập"
            {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email là bắt buộc' })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <Input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            {...register('password', { required: 'Mật khẩu là bắt buộc' })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

          <FileInput
            name="profileImage"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            {...register('profileImage', { required: true })}
          />
          {errors.profileImage && <ErrorMessage>{errors.profileImage.message}</ErrorMessage>}

          {imagePreview && <FilePreview file={imagePreview} />}
          {true && (
            <div>
              <img src={imagePreview} alt="Image preview" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          <Button style={{ marginTop: '10px' }} variation="secondary" size="md" type="submit">Đăng ký</Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          {suggestedUsernames.length > 0 && (
            <Suggestions>
              <p>Gợi ý tên đăng nhập:</p>
              {suggestedUsernames.map((name, index) => (
                <span key={index}>{name}&nbsp;</span>
              ))}
            </Suggestions>
          )}
        </Form>
      </FormContainer>
    </FullPageContainer>
  );
};

export default RegisterForm;
