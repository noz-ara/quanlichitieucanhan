import React from 'react'
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 1rem 1.2rem;
  box-sizing: border-box;
  /* appearance: none; */
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;


function Select({options, value, onChange, ...props}) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
    {options.map((option)=>(
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
    </StyledSelect>
  )
}

export default Select