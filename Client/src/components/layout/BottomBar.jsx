import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPinned, Airplay } from 'lucide-react';
import '@/styles/Bottom.css'

const BottomBar = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/map', label: 'Hartă', icon: MapPinned },
        { href: '/docs', label: 'AI DOCS', icon: Airplay },
    ];

    return (
        <nav className="bottom-nav md:hidden">
            <div className="bottom-nav__row">
                <div className="bottom-nav__items">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                to={href}
                                className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                            >
                                <span className="bottom-nav__icon">
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && <span className="bottom-nav__icon-glow" />}
                                </span>
                                <span className="bottom-nav__label">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomBar;