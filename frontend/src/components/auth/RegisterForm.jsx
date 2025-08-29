import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { Button, FileInput, FormContainer, ErrorMessage, Form, Input, Heading } from '../ui';
import FilePreview from '../ui/FilePreview';

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

console.log(imagePreview)
  const submitForm = async (data) => {
    try {
      // const formData = new FormData();
      // formData.append('username', data.username);
      // formData.append('email', data.email);
      // formData.append('password', data.password);
      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      })], { type: 'application/json' }));
      formData.append('profileImage', data.profileImage[0]); // Add the profile image to form data

      const response = await axios.post('http://localhost:8080/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken   // Include CSRF token in headers
        },
      });

      console.log(response);
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
          }
          setErrorMessage(error.response.data);
          // setErrorMessage('An error occurred while registering.');
        }
      } else {
        setErrorMessage('An unexpected error occurred while registering.');
      }
    }

    console.log('Registered Data:', {
      username: data.username,
      email: data.email,
      password: data.password,
      image: data.profileImage[0] ? data.profileImage[0].name : null
    });
  };

  return (
    <FullPageContainer>
      <FormContainer>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Heading as='h2'>Register</Heading>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <Input
            name="password"
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
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
          <Button style={{ marginTop: '10px' }} variation="secondary" size="md" type="submit">Register</Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          {suggestedUsernames.length > 0 && (
            <Suggestions>
              <p>Username suggestions:</p>
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
