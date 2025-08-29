import React from 'react'
import ButtonIcon from './ButtonIcon'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import { useDarkMode } from '../context/DarkModeContext'
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa6";


function DarkModeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    return (
        <ButtonIcon iconSize='2.1rem' onClick={toggleDarkMode} >
           {isDarkMode?<FaRegLightbulb color='var(--color-grey-700)' />: <FaLightbulb />}
        </ButtonIcon>
    )
}

export default DarkModeToggle