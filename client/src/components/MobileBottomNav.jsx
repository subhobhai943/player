import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart } from 'lucide-react';
import useAuthStore from '../store/authStore';

const tabs = [
  { icon: Home,    label: 'Home',    to: '/' },
  { icon: Search,  label: 'Search',  to: '/search' },
  { icon: Library, label: 'Library', to: '/library' },
  { icon: Heart,   label: 'Liked',   to: '/liked' },
];

const MobileBottomNav = () => {
  const { isAuthenticated } = useAuthStore();
  const visibleTabs = isAuthenticated ? tabs : tabs.slice(0, 2);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 flex items-stretch">
      {visibleTabs.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-spotify-green' : 'text-spotify-light'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
