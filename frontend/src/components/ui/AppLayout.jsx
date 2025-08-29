import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { styled } from 'styled-components'

const Main = styled.main`
    background-color: var(--color-grey-100);
    padding: 4rem 4.7rem 6.4rem;
`

const StyledAppLayout = styled.div`
    display: grid;
    grid-template-columns: 26rem 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
`
const StyledContainer = styled.div`
    max-width: 100rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
`

function AppLayout() {
    return (
        <StyledAppLayout>
            <Header />
            <Sidebar />
            <Main>
                <StyledContainer>
                    <Outlet />
                </StyledContainer>
            </Main>
        </StyledAppLayout>
    )
}

export default AppLayout