import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Package,
  Truck,
  Users
} from 'lucide-react';
import { FoodDonation, FoodCategory } from '../../types';
import { donationService } from '../../services/donationService';
import { IMAGES, DEMO_IMPACT_STATS } from '../../data/mockData';
import { DonationCard } from '../../components/donations/DonationCard';
import { DonationDetailModal } from '../../components/donations/DonationDetailModal';
import { ClaimDonationModal } from '../../components/donations/ClaimDonationModal';
import { FoodSafetyNotice } from '../../components/donations/FoodSafetyNotice';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<FoodDonation | null>(null);
  const [claimingDonation, setClaimingDonation] = useState<FoodDonation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Animated metric counters
  const [counters, setCounters] = useState({
    meals: 0,
    donors: 0,
    partners: 0,
  });

  const categories: (string | FoodCategory)[] = [
    'All',
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Buffet Surplus',
    'Dairy & Eggs',
  ];

  const loadDonations = async () => {
    try {
      const data = await donationService.getDonations({
        category: selectedCategory,
        search: searchQuery,
      });
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [selectedCategory, searchQuery]);

  // Animate counters once mounted
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const factor = 1 - Math.pow(1 - progress, 3);

      setCounters({
        meals: Math.floor(DEMO_IMPACT_STATS.mealsRedistributed * factor),
        donors: Math.floor(DEMO_IMPACT_STATS.verifiedDonors * factor),
        partners: Math.floor(DEMO_IMPACT_STATS.communityPartners * factor),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5FAF4] text-[#17231D]">
      
      {/* 1. HERO SECTION (Split-screen layout) */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        
        {/* Subtle background ambiance */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DCFCE7]/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 lg:pr-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Hunger • Zero Food Waste</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#12372A] leading-[1.1] text-balance">
                Good Food Deserves a <span className="text-[#166534]">Second Chance.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#647067] max-w-2xl leading-relaxed">
                Connecting surplus food with communities that need it. RescueBite makes food redistribution simple, transparent, and impactful.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/donor/create"
                  className="px-7 py-3.5 bg-[#166534] hover:bg-[#12372A] text-white font-semibold text-sm rounded-xl shadow-xs transition-all text-center whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                >
                  Donate Surplus Food
                </Link>
                <Link
                  to="/explore"
                  className="px-7 py-3.5 bg-white hover:bg-[#FCFDF9] text-[#12372A] font-semibold text-sm rounded-xl border border-[#12372A]/15 hover:border-[#166534] transition-all text-center whitespace-nowrap shadow-xs"
                >
                  Find Food Nearby
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#647067]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#166534]" />
                  <span>Verified Safe Kitchens</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#166534]" />
                  <span>Insulated Cold/Hot Transit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#166534]" />
                  <span>Automated Expiry Safeguards</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual with Real Generated High-Fidelity Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#12372A]/5 aspect-4/3 sm:aspect-16/11">
                <img
                  src={IMAGES.heroRescue}
                  alt="Fresh wholesome food safely packed for community donation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating completed food rescue proof card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#166534] shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-[#17231D]">32 Hot Meals Rescued</div>
                      <div className="text-[#647067] text-[11px]">Green Hearth Bistro → St. Jude Shelter</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md shrink-0">
                    Completed
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Impact Metrics Bar with Animated Counters */}
          <div className="mt-16 pt-8 border-t border-[#12372A]/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 bg-white rounded-2xl border border-[#12372A]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647067] block">
                  Meals Redistributed
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#12372A] font-mono tabular-nums mt-1">
                  {counters.meals.toLocaleString()}+
                </div>
                <p className="text-xs text-[#647067] mt-1">
                  Wholesome nutrition diverted from landfills to community plates.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#12372A]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647067] block">
                  Verified Food Donors
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#166534] font-mono tabular-nums mt-1">
                  {counters.donors.toLocaleString()}
                </div>
                <p className="text-xs text-[#647067] mt-1">
                  Restaurants, bakeries, corporate cafeterias, and farm co-ops.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#12372A]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647067] block">
                  Community Organizations
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#12372A] font-mono tabular-nums mt-1">
                  {counters.partners.toLocaleString()}
                </div>
                <p className="text-xs text-[#647067] mt-1">
                  Vetted shelters, soup kitchens, orphanages, and food pantries.
                </p>
              </div>

            </div>
            
            <p className="text-[11px] text-[#647067] text-center mt-3">
              *Illustrative demo metrics representing network capacity until real platform data is connected.
            </p>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS (3 visually distinct steps) */}
      <section className="py-20 bg-white border-y border-[#12372A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#166534] block mb-2">
              Simple, Safe & Rapid
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12372A]">
              How RescueBite Works
            </h2>
            <p className="text-sm text-[#647067] mt-2">
              Three seamless steps bridging commercial culinary surplus and local charitable initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-[#F5FAF4] border border-[#12372A]/10 hover:border-[#166534]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                1
              </div>
              <h3 className="text-lg font-bold text-[#17231D]">
                List Surplus Food
              </h3>
              <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
                Food donors log available dishes, quantities, preparation times, storage temperatures (refrigerated/hot-held), allergens, and safe collection deadlines.
              </p>
              <div className="text-xs font-semibold text-[#166534] pt-2 flex items-center gap-1">
                <span>Takes less than 90 seconds</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-[#F5FAF4] border border-[#12372A]/10 hover:border-[#166534]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E] text-[#12372A] flex items-center justify-center font-bold text-lg shadow-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-[#17231D]">
                Connect with Recipients
              </h3>
              <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
                Vetted NGOs and community kitchens receive alerts for nearby matching surplus. Organizations reserve meals that fit their daily feeding capacity.
              </p>
              <div className="text-xs font-semibold text-[#166534] pt-2 flex items-center gap-1">
                <span>Verified non-profit network</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-[#F5FAF4] border border-[#12372A]/10 hover:border-[#166534]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#12372A] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-[#17231D]">
                Rescue and Redistribute
              </h3>
              <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
                Coordinated pickup with thermal cambros and temperature verification. Handover is logged with verification pins and served safely to community members.
              </p>
              <div className="text-xs font-semibold text-[#166534] pt-2 flex items-center gap-1">
                <span>Tracked custody handover</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. EXPLORE AVAILABLE DONATIONS (Interactive Catalog) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#166534] block mb-1">
              Active Surplus Network
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#12372A]">
              Explore Available Donations
            </h2>
            <p className="text-xs sm:text-sm text-[#647067] mt-1">
              Real-time listings ready for immediate pickup by registered community partners.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-semibold text-[#166534] hover:text-[#12372A] flex items-center gap-1 self-start md:self-auto"
          >
            <span>Open Full Interactive Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#12372A]/10 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, bakery items, or donor restaurants..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5FAF4] rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-[#F5FAF4] rounded-xl shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#12372A] font-semibold shadow-xs'
                    : 'text-[#647067] hover:text-[#17231D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-[#17231D]">No listings matching criteria</h3>
            <p className="text-xs text-[#647067]">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#166534] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                canClaim={role === 'recipient'}
                onViewDetails={(item) => setSelectedDonation(item)}
                onClaim={(item) => setClaimingDonation(item)}
              />
            ))}
          </div>
        )}

      </section>

      {/* 4. IMPACT SECTION (Editorial style) */}
      <section id="impact" className="py-20 bg-[#FCFDF9] border-t border-[#12372A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#166534] block">
                Quantified Environmental & Community Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12372A] tracking-tight">
                Turning Landfill Waste into Wholesome Dinners.
              </h2>
              <p className="text-sm text-[#647067] leading-relaxed">
                Roughly one-third of all food produced globally is wasted, generating immense greenhouse emissions while millions experience food insecurity. RescueBite proves that logistics and transparency can eliminate this paradox.
              </p>

              {/* Impact Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <div className="text-2xl font-bold font-mono text-[#166534] tabular-nums">
                    {DEMO_IMPACT_STATS.co2SavedKg.toLocaleString()} kg
                  </div>
                  <div className="text-xs font-medium text-[#17231D] mt-1">CO₂e Emissions Prevented</div>
                  <div className="text-[11px] text-[#647067] mt-0.5">By diverting organics from landfill anaerobic decay</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <div className="text-2xl font-bold font-mono text-[#166534] tabular-nums">
                    {DEMO_IMPACT_STATS.kgFoodSaved.toLocaleString()} kg
                  </div>
                  <div className="text-xs font-medium text-[#17231D] mt-1">Surplus Edibles Rescued</div>
                  <div className="text-[11px] text-[#647067] mt-0.5">Fresh produce, warm dishes, and baked goods</div>
                </div>
              </div>

              {/* Recipient Testimonial */}
              <div className="p-5 bg-[#F5FAF4] rounded-2xl border border-[#166534]/15 space-y-3">
                <p className="text-xs sm:text-sm text-[#17231D] italic leading-relaxed">
                  “RescueBite enabled our soup kitchen to reliably plan 150 extra nutritious evening dinners every single week. Knowing the food arrives hot and temperature-verified makes all the difference.”
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs">
                    SJ
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#12372A] block">Sister Sarah Jenkins</span>
                    <span className="text-[#647067]">Director, St. Jude Community Meals & Shelter</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Impact photography */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-3/4 shadow-md bg-gray-100">
                  <img
                    src={IMAGES.communityKitchen}
                    alt="Volunteers serving meals at community kitchen"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#166534] text-white rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-sm">96.4% Success Rate</div>
                  <p className="text-emerald-100 text-[11px]">
                    Of listed donations are collected within safe temperature windows.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-xs space-y-1">
                  <div className="font-bold text-[#12372A] text-sm">Safe Harbors Protected</div>
                  <p className="text-[#647067] text-[11px]">
                    Donors protected under Good Samaritan food donation legislation.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-3/4 shadow-md bg-gray-100">
                  <img
                    src={IMAGES.freshProduce}
                    alt="Fresh crates of rescued organic produce"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Food Safety Notice component */}
      <section className="py-12 bg-white border-t border-[#12372A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FoodSafetyNotice />
        </div>
      </section>

      {/* Modals */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onClaim={(item) => {
          setSelectedDonation(null);
          setClaimingDonation(item);
        }}
      />

      <ClaimDonationModal
        donation={claimingDonation}
        isOpen={!!claimingDonation}
        onClose={() => setClaimingDonation(null)}
        onSuccess={() => {
          loadDonations();
        }}
      />

    </div>
  );
};
