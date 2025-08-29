import styled, { css } from "styled-components";


const FormContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  background: var(--color-grey-100);
  backdrop-filter: blur(5px);
  box-shadow: var(--shadow-md);
`;

const Form = styled.form`
  padding: ${(props) => (props.type === "regular" ? "2.1rem" : "1rem")};
  background-color: ${(props) =>
    props.type === "regular" ? "var(--color-grey-100)" : "transparent"};
  display: ${(props) => (props.type === "regular" ? "block" : "inline-block")};
  border: ${(props) =>
    props.type === "regular"
      ? "1px solid var(--color-grey-300)"
      : "none"};
  border-radius: ${(props) =>
    props.type === "regular" ? "var(--border-radius-md)" : "0"};
  /* width: ${(props) => (props.type === "modal" ? "80rem" : "auto")}; */
  width: 100%;
  overflow: hidden;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  & > * {
    display: block;
    /* margin-bottom: 1rem; */
  }
  & input{
    width: 100%;
    margin-bottom: 1rem;
  }
  & Button{
    margin: 1rem 0 1rem 0;
  }
`;

const Label= styled.span`
  color: ${color=> color? color : `var(--color-grey-100)`};
  margin-right: 10px;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--color-red-500);
  margin-bottom: 10px;
`;

Form.defaultProps = {
  type: "regular",
};

export {FormContainer, Form, ErrorMessage, Label};
