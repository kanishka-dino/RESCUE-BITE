import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, ChevronDown, UserCheck, ShieldCheck, HeartHandshake, LogOut, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC<{ onOpenApiModal?: () => void }> = ({ onOpenApiModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, loginAs, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Explore Donations', path: '/explore' },
    { label: 'Our Impact', path: '/#impact' },
    { label: 'Food Safety', path: '/food-safety' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  const getDashboardPath = () => {
    if (role === 'donor') return '/donor';
    if (role === 'recipient') return '/recipient';
    if (role === 'admin') return '/admin';
    return '/donor';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFDF9]/95 backdrop-blur-md border-b border-[#12372A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#12372A] whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 text-[#DCFCE7]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#12372A]">RescueBite</span>
          </Link>

          {/* Zone 2: 4-5 Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#647067]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 whitespace-nowrap shrink-0 relative ${
                  isActive(link.path)
                    ? 'text-[#166534] font-semibold'
                    : 'hover:text-[#17231D]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#166534] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Quick Account / Role Switcher */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Quick Spring Boot API documentation trigger */}
            {onOpenApiModal && (
              <button
                onClick={onOpenApiModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#166534] bg-[#DCFCE7]/60 hover:bg-[#DCFCE7] rounded-lg transition-colors whitespace-nowrap shrink-0 border border-[#166534]/20"
                title="View Spring Boot REST API Architecture & MySQL Mapping"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Spring Boot API</span>
              </button>
            )}

            {/* Role Switcher & Account Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#12372A] bg-white border border-[#12372A]/15 hover:border-[#166534] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="font-semibold capitalize">{currentUser.role}:</span>
                  <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#647067]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-[#12372A]/10 rounded-2xl shadow-xl p-2 z-50 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="font-semibold text-sm text-[#17231D]">{currentUser.name}</div>
                      <div className="text-[#647067] truncate">{currentUser.organizationName}</div>
                      <div className="text-[11px] text-[#166534] font-medium mt-0.5 capitalize">
                        {currentUser.role} Account • Verified
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-[#17231D] hover:bg-[#F5FAF4] rounded-lg transition-colors font-medium"
                      >
                        <span>Open Dashboard</span>
                        <span className="text-[10px] text-white bg-[#166534] px-1.5 py-0.5 rounded">Go</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 my-1 pt-1">
                      <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        Switch Demo Role
                      </div>
                      <button
                        onClick={() => {
                          loginAs('donor1');
                          setUserDropdownOpen(false);
                          navigate('/donor');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-gray-700 hover:bg-[#F5FAF4] rounded-lg"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#166534]" />
                        <span>Donor (Green Hearth Bistro)</span>
                      </button>
                      <button
                        onClick={() => {
                          loginAs('recipient1');
                          setUserDropdownOpen(false);
                          navigate('/recipient');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-gray-700 hover:bg-[#F5FAF4] rounded-lg"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Recipient (St. Jude Shelter)</span>
                      </button>
                      <button
                        onClick={() => {
                          loginAs('admin1');
                          setUserDropdownOpen(false);
                          navigate('/admin');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-gray-700 hover:bg-[#F5FAF4] rounded-lg"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Platform Administrator</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-[#166534] hover:text-[#12372A] transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              to="/donor/create"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#166534] hover:bg-[#12372A] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534]"
            >
              Donate Food
            </Link>
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#17231D] hover:text-[#166534] focus:outline-none rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#12372A]/10 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col gap-2 font-medium text-sm text-[#17231D]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#DCFCE7] text-[#166534] font-semibold'
                    : 'hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-[#DCFCE7] text-[#166534] rounded-xl"
                >
                  Open {currentUser.role} Dashboard
                </Link>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                  <button
                    onClick={() => {
                      loginAs('donor1');
                      setMobileMenuOpen(false);
                      navigate('/donor');
                    }}
                    className="p-2 text-center rounded border bg-gray-50 hover:bg-[#DCFCE7]"
                  >
                    Donor Role
                  </button>
                  <button
                    onClick={() => {
                      loginAs('recipient1');
                      setMobileMenuOpen(false);
                      navigate('/recipient');
                    }}
                    className="p-2 text-center rounded border bg-gray-50 hover:bg-[#DCFCE7]"
                  >
                    Recipient Role
                  </button>
                  <button
                    onClick={() => {
                      loginAs('admin1');
                      setMobileMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="p-2 text-center rounded border bg-gray-50 hover:bg-[#DCFCE7]"
                  >
                    Admin Role
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 text-sm font-semibold text-[#166534] border border-[#166534] rounded-xl"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/donor/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-[#166534] rounded-xl shadow-xs"
            >
              Donate Food
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
