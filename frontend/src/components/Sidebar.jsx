import React, { useState } from 'react'
import { sidebarStyles as s } from '../assets/dummyStyles'
import {Bell, BookCopy, ChartNoAxesCombined, ChevronRight, Icon, Menu, ShieldCheck, UserRound, X} from "lucide-react"
import { href, Link, useLocation } from 'react-router-dom'

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

        <Menu size={18}/>

        <div className={`${s.mobileOverlay} ${open ? s.mobileOverlay : s.mobileOverlayClosed}`} onClick={()=> setOpen(false)}/>
     </button>

        <aside className={`${s.sidebar} ${open ? s.sidebarOpen : s.sidebarClosed}`}>
            <div className={s.sidebarHeader}>
                <div className='min-w-0 pr-3'>
                    <div className={s.logoWrapper}>
                        {
                            logoSrc ? (
                                <img src={logoSrc} alt="" className={logoSrc}/>
                            ): (
                                <BookCopy size={22}/>
                            )}
                    </div>
                    <h2 className={s.title}>{title}</h2>
                    <p className={s.subtitle}>{subtitle}</p>

                    {
                        badges &&(
                            <span className={`${s.badgeBase} ${s.badgeStyles}`}> {badges}</span>
                        )
                    }

                </div>
                <button onClick={()=> setOpen(false)} type='button' className={s.closeButton}>
                    <X size={18}/>
                </button>
            </div>

            <nav className={s.nav}>
                {
                    navItems.map((item)=> {
                        const icon = iconMap[item.icon] ?? ChevronRight
                        const active = 
                        location.pathname === item.href ||
                        (item.match ? location.pathname.startsWith(item.match) : false);

                        return (
                            <Link
                            key={item.label}
                            to={item.href}
                            onClick={()=> setOpen(false)}
                            className={`${s.navLink} ${
                                active ? s.navLinkActive : s.navLinkInactive
                                }`}             
                            >
                                <span className={`${s.navIconWrapper} ${active ? s.navIconWrapper : s.navIconWrapperInactive}`}>
                                <Icon size={18}/> 
                                </span>

                            <span className='min-w-0 flex-1'>
                                <span className={s.navLabel}>{item.label}</span>
                                <span 
                                className={`${s.navDescription} ${active ? s.navDescriptionActive : s.navDescriptionInactive}`}>
                                    {item.description}
                                </span>
                            </span>
                            <ChevronRight 
                            size={16} 
                            className={active ? s.navChevronActive : s.navChevronInactive}
                             />
                            </Link>
                        );
                    })
                }
            </nav>

            <div className={s.footer}>
                 
            </div>


        </aside>

    </>
  )
}

export default Sidebar
