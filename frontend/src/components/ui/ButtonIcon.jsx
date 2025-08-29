import styled from "styled-components";

const ButtonIcon = styled.button`
  background: ${({ bg }) => bg || 'none'};
  color: ${({ color }) => color || 'var(--color-brand-600)'};
  border: none;
  padding: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '0.6rem';
      case 'md':
        return '1rem';
      case 'lg':
        return '1.5rem';
      default:
        return '1rem';
    }
  }};
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  outline: none;
  display: flex !important;
  align-items: center; 
  justify-content: center;
  font-size: ${({ iconSize }) => iconSize ? `calc(${iconSize} - 0.5rem)` : '1.6rem'};
  text-align: center; 
  gap: 0.5rem; 
  &:hover, &:focus {
    background-color: var(--color-grey-100);
    outline: none;
  }
  & svg {
    width: ${({ iconSize }) => iconSize || '1.6rem'};
    height: ${({ iconSize }) => iconSize || '1.6rem'};
    color: ${({ color }) => color || 'var(--color-brand-600)'};
  }
`;

export default ButtonIcon;
