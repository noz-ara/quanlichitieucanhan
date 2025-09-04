import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import { HiHome } from "react-icons/hi2";
import { HiMiniUser, HiOutlineUsers } from "react-icons/hi2";
import { GiExpense, GiTakeMyMoney } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa6";
import { useUser } from '../hooks/useUser';

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function MainNav() {
  const { user } = useUser();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <nav>
      <NavList>
        {!isAdmin && (
          <>
            <li><StyledNavLink to='/dashboard'>
              <HiHome /> <span>Trang chủ</span>
            </StyledNavLink></li>

            {/* <li><StyledNavLink to='/split/expense'>
              <GiExpense /> <span>Chia hóa đơn</span>
            </StyledNavLink></li> */}

            <li><StyledNavLink to='/bills'>
              <GiTakeMyMoney /> <span>Bills</span>
            </StyledNavLink></li>

            <li><StyledNavLink to='/contacts'>
              <HiOutlineUsers /> <span>Danh bạ</span>
            </StyledNavLink></li>

            <li><StyledNavLink to='/account'>
              <HiMiniUser /> <span>Tài khoản</span>
            </StyledNavLink></li>
          </>
        )}

        {isAdmin && (
          <li><StyledNavLink to='/admin'>
            <FaUserShield /> <span>Quản lý tài khoản</span>
          </StyledNavLink></li>
        )}
      </NavList>
    </nav>
  )
}

export default MainNav;
