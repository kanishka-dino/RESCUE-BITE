import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Leaf, Eye, EyeOff, ShieldCheck, HeartHandshake, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, loginAs } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('marco@greenhearthbistro.org');
  const [password, setPassword] = useState('demoSecurePassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithCredentials(email, role);
      showToast(`Welcome back! Signed in as ${role}.`, 'success');
      if (role === 'donor') navigate('/donor');
      else if (role === 'recipient') navigate('/recipient');
      else navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
      showToast('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (key: 'donor1' | 'recipient1' | 'admin1', targetRole: UserRole) => {
    loginAs(key);
    showToast(`Logged in with demo credentials (${targetRole})`, 'success');
    if (targetRole === 'donor') navigate('/donor');
    else if (targetRole === 'recipient') navigate('/recipient');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F5FAF4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-[#DCFCE7]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#12372A]">RescueBite</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#12372A] tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-[#647067] mt-1.5">
          Access your donor dispatch, recipient claim ledger, or operations console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[#166534]/20 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#12372A]">Quick Demo Access (1-Click)</span>
            <span className="text-[10px] text-emerald-800 bg-[#DCFCE7] px-2 py-0.5 rounded font-medium">Demo Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('donor1', 'donor')}
              className="p-2 text-center rounded-xl border border-gray-200 hover:border-[#166534] hover:bg-[#F5FAF4] transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#166534] mx-auto mb-1" />
              <span className="font-semibold text-[11px] block text-[#12372A]">Food Donor</span>
              <span className="text-[10px] text-gray-500">Bistro Chef</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('recipient1', 'recipient')}
              className="p-2 text-center rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="font-semibold text-[11px] block text-[#12372A]">Recipient</span>
              <span className="text-[10px] text-gray-500">Charity Kitchen</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin1', 'admin')}
              className="p-2 text-center rounded-xl border border-gray-200 hover:border-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <span className="font-semibold text-[11px] block text-[#12372A]">Admin</span>
              <span className="text-[10px] text-gray-500">Safety Board</span>
            </button>
          </div>
        </div>

        {/* Regular Sign In Card */}
        <div className="bg-[#FCFDF9] py-8 px-6 sm:px-8 rounded-3xl border border-[#12372A]/10 shadow-sm space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#17231D] mb-1.5">
                Portal Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['donor', 'recipient', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      role === r
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#17231D] mb-1">
                Organization Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#17231D]">
                  Password
                </label>
                <span className="text-[11px] text-[#166534] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#166534] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full mt-2"
            >
              <span>Sign In to {role.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-gray-100 text-center text-xs text-[#647067]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#166534] hover:underline">
              Create an account
            </Link>
          </div>

          <p className="text-[10px] text-gray-400 text-center leading-tight">
            RescueBite utilizes spring security JWT headers when configured with production backend.
          </p>

        </div>
      </div>
    </div>
  );
};
