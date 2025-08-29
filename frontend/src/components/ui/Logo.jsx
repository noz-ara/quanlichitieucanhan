import React from "react";
import styled, { keyframes } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";
import { SiExpensify } from "react-icons/si";
import { GiExpense, GiTakeMyMoney } from "react-icons/gi";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledLogo = styled.div`
  font-size: 2.1rem;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 1s ease;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const LogoIcon = <GiTakeMyMoney size={30} color="var(--color-indigo-700)" />;

  return (
    <StyledLogo>
      {LogoIcon} &nbsp; ExpenseWise
    </StyledLogo>
  );
}

export default Logo;
