import React from 'react'
import styled from "styled-components";

const ChartBox = styled.div`
  /* width: 100%; */
  display: flex;
  /* flex-grow: 1; */
  align-items: center;
  justify-content: center;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

export default ChartBox