import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Leaf, Eye, EyeOff, ShieldCheck, HeartHandshake, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'recipient' ? 'recipient' : 'donor';

  const { registerUser } = useAuth();
  const { showToast } = useToast();

  const [accountType, setAccountType] = useState<UserRole>(initialType as UserRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Conditional Donor fields
  const [donorType, setDonorType] = useState('Restaurant');
  const [healthLicenseNumber, setHealthLicenseNumber] = useState('');

  // Conditional Recipient fields
  const [recipientOrgType, setRecipientOrgType] = useState('Community Kitchen');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dailyServingCapacity, setDailyServingCapacity] = useState('150');
  const [hasColdChainEquipment, setHasColdChainEquipment] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      showToast('You must accept the terms & food redistribution safety policy', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        name: fullName,
        email,
        phone,
        role: accountType,
        organizationName: orgName,
        organizationType: accountType === 'donor' ? donorType : recipientOrgType,
        address: orgAddress,
        city,
      });

      showToast(`Registration successful! Welcome to RescueBite.`, 'success');

      if (accountType === 'donor') {
        navigate('/donor');
      } else {
        navigate('/recipient');
      }
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF4] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-[#DCFCE7]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#12372A]">RescueBite</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12372A] tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs sm:text-sm text-[#647067] mt-1">
          Join the trusted redistribution network as a food provider or charity partner.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="bg-[#FCFDF9] py-8 px-6 sm:px-10 rounded-3xl border border-[#12372A]/10 shadow-sm space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#17231D] mb-2">
                Select Your Organization Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('donor')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    accountType === 'donor'
                      ? 'border-[#166534] bg-[#DCFCE7]/40 ring-2 ring-[#166534]/20'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 text-[#166534] mb-1.5" />
                  <div className="font-bold text-xs sm:text-sm text-[#12372A]">Food Donor</div>
                  <div className="text-[11px] text-[#647067] mt-0.5">
                    Restaurants, bakeries, hotels, canteens, catering, and markets.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('recipient')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    accountType === 'recipient'
                      ? 'border-[#166534] bg-[#DCFCE7]/40 ring-2 ring-[#166534]/20'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-blue-600 mb-1.5" />
                  <div className="font-bold text-xs sm:text-sm text-[#12372A]">Recipient Partner</div>
                  <div className="text-[11px] text-[#647067] mt-0.5">
                    NGOs, community kitchens, shelters, orphanages, and food pantries.
                  </div>
                </button>
              </div>
            </div>

            {/* General Organization Info */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-[#12372A] uppercase tracking-wider">
                Organization Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Organization / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Hearthstone Bistro or Hope Kitchen"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Metro District / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Metro City"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-[#17231D] mb-1">
                  Physical Street Address for Pickups / Operations *
                </label>
                <input
                  type="text"
                  required
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="e.g. 428 Heritage Boulevard, Central Core"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>
            </div>

            {/* Conditional Fields: Donor */}
            {accountType === 'donor' && (
              <div className="space-y-4 pt-4 border-t border-gray-100 bg-[#F5FAF4] p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-[#166534] uppercase tracking-wider">
                  Donor Specific Requirements
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">
                      Business Classification
                    </label>
                    <select
                      value={donorType}
                      onChange={(e) => setDonorType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    >
                      <option value="Restaurant">Restaurant & Bistro</option>
                      <option value="Hotel">Hotel & Banquet</option>
                      <option value="Bakery">Artisanal Bakery & Cafe</option>
                      <option value="College Canteen">University / College Canteen</option>
                      <option value="Event Caterer">Event / Corporate Caterer</option>
                      <option value="Supermarket">Supermarket & Co-op</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">
                      Health Department License / Food Safety Permit #
                    </label>
                    <input
                      type="text"
                      value={healthLicenseNumber}
                      onChange={(e) => setHealthLicenseNumber(e.target.value)}
                      placeholder="e.g. FSS-99214-MC"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Fields: Recipient */}
            {accountType === 'recipient' && (
              <div className="space-y-4 pt-4 border-t border-gray-100 bg-sky-50/60 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Recipient Charitable Verification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">
                      Charity Type
                    </label>
                    <select
                      value={recipientOrgType}
                      onChange={(e) => setRecipientOrgType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    >
                      <option value="Community Kitchen">Community Kitchen / Soup Kitchen</option>
                      <option value="Charity Shelter">Unhoused Family Shelter</option>
                      <option value="Orphanage">Children's Home / Orphanage</option>
                      <option value="Food Bank">Regional Food Bank / Pantry</option>
                      <option value="NGO">Disaster Relief NGO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">
                      Non-Profit Reg. / Tax-Exempt ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="e.g. NGO-44120-MC"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">
                      Daily Dining Capacity (Servings)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={dailyServingCapacity}
                      onChange={(e) => setDailyServingCapacity(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="coldChain"
                      checked={hasColdChainEquipment}
                      onChange={(e) => setHasColdChainEquipment(e.target.checked)}
                      className="rounded text-[#166534] focus:ring-[#166534]"
                    />
                    <label htmlFor="coldChain" className="text-xs text-[#17231D]">
                      Our team has insulated food cambros / refrigerated coolers
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Authorized Contact Person */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-[#12372A] uppercase tracking-wider">
                Primary Representative
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maria Gonzalez"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria@organization.org"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Safe Redistribution Agreement */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#166534] focus:ring-[#166534]"
                />
                <span className="text-gray-700 leading-relaxed text-[11px]">
                  I certify that all information provided is accurate. I agree to RescueBite’s Terms of Service and adhere to standard Food Safety protocols, including temperature danger zone avoidance and prompt delivery.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

          </form>

          <div className="text-center text-xs text-[#647067]">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#166534] hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
