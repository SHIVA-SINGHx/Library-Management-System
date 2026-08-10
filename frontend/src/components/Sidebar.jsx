import React, { useState } from 'react'
import { sidebarStyles as s } from '../assets/dummyStyles'
import {Bell, BookCopy, ChartNoAxesCombined, ShieldCheck, UserRound} from "lucide-react"
import { useLocation } from 'react-router-dom'

const mapIcon = {
    books: BookCopy,
    dashboard: ChartNoAxesCombined,
    alerts: Bell,
    admin: ShieldCheck,
    users: UserRound
}

const Sidebar = ({
    title,
    subtitle,
    badges,
    navItems,
    footerItems=[],
    accent="user",
    logoSrc
}) => {

    const location = useLocation();
    const {open, setOpen} = useState(false)

    const badgeStyles = accent==="admin" ? s.badgeAdmin : s.badgeUser


  return (
    <>
     <button type='button' onClick={()=> setOpen(true)}
        className={s.mobileMenuButton}
        >


     </button>
    </>
  )
}

export default Sidebar
