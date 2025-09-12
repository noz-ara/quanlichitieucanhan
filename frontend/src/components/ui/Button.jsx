import styled, { css } from "styled-components";

const sizes = {
  sm: css`
    font-size: 1.2rem;
    padding: 0.34rem 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
    border-radius: 0%;
  `,
  md: css`
    font-size: 1.4rem;
    padding: 0.7rem 1.1rem;
    font-weight: 500;
    text-align: center;
  `,
  lg: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,

  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,

  success: css`
    color: var(--color-green-500);
    background-color: var(--color-green-500);

    &:hover {
      background-color: var(--color-green-700);
    }
  `,

  danger: css`
    color: white;
    background-color: var(--color-red-500);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  text: css`
    color: ${(color)=>color ||`var(--color-brand-100)`};
    background-color: transparent;
    box-shadow: none;

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
};

const color = {
  primary: css`
    color: var(--color-red-100);
  `,
  secondary: css`
    color: var(--color-grey-600);
  `,
  success: css`
    color: var(--color-green-500);
  `,
  accent: css`
    color: var(--color-silver-700);
  `,
  danger: css`
    color: white;
  `,
};



const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['size', 'variation', 'color'].includes(prop)
})`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  &:focus {
    outline: none; 
  } 
  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
  ${(props)=> color[props.color]}
`;

Button.defaultProps = {
  variation: "primary",
  size: "md",
  color: 'var(--color-brand-600)'
};

export default Button;
