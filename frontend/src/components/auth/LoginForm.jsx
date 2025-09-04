import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../ui";
import { useAuth } from "../context/AuthContext";

// ===== styled components =====
const FullPageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-md);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: transparent;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  font-weight: bold;
  margin-right: 5px;
`;

const Checkbox = styled.input`
  margin-left: 5px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const Message = styled.span`
  margin: 5px 0;
  color: ${(props) => (props.$error ? "red" : "green")};
  display: block;
  text-align: center;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

// ===== component =====
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Load rememberMe từ localStorage
  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true";
    setRememberMe(remember);
    if (remember) {
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  // Xử lý submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Validate trước khi gọi API
    if (!username.trim() || !password.trim()) {
      setError(true);
      setMsg("Tên đăng nhập và mật khẩu không được để trống!");
      return;
    }

    // 2. Gọi API login thông qua context
    const result = await login(username, password, rememberMe);

    // 3. Xử lý kết quả
    if (result.success) {
      setError(false);
      setMsg(result.message);
      navigate("/"); // chuyển về trang chủ
    } else {
      setError(true);
      setMsg(result.message);
    }
  };

  return (
    <FullPageContainer>
      <FormContainer>
        <Title>Đăng nhập</Title>
        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <InputContainer>
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </InputContainer>

          {/* Password */}
          <InputContainer>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </InputContainer>

          {/* Remember Me + Forgot Password */}
          <CheckboxContainer>
            <div>
              <CheckboxLabel htmlFor="rememberMe">Ghi nhớ tôi</CheckboxLabel>
              <Checkbox
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </CheckboxContainer>

          {/* Message */}
          {msg && <Message $error={error}>{msg}</Message>}

          {/* Submit button */}
          <Button size="lg" type="submit">Đăng nhập</Button>

          {/* Signup link */}
          <LinkContainer>
            <Link to="/signup">Chưa có tài khoản? Đăng ký</Link>
          </LinkContainer>
        </Form>
      </FormContainer>
    </FullPageContainer>
  );
};

export default LoginForm;
