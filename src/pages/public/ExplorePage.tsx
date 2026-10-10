import React, { useState, useEffect } from 'react';
import { FoodDonation, FoodCategory, DietaryType, DonationStatus } from '../../types';
import { donationService } from '../../services/donationService';
import { DonationCard } from '../../components/donations/DonationCard';
import { DonationDetailModal } from '../../components/donations/DonationDetailModal';
import { ClaimDonationModal } from '../../components/donations/ClaimDonationModal';
import { MapPlaceholder } from '../../components/donations/MapPlaceholder';
import { FoodSafetyNotice } from '../../components/donations/FoodSafetyNotice';
import { useAuth } from '../../context/AuthContext';
import { Search, Map, Grid, Filter, RotateCcw, AlertCircle, Info } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { role, currentUser, loginAs } = useAuth();

  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('available');

  // Modals
  const [selectedDonation, setSelectedDonation] = useState<FoodDonation | null>(null);
  const [claimingDonation, setClaimingDonation] = useState<FoodDonation | null>(null);

  const categories = [
    'All',
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Buffet Surplus',
    'Dairy & Eggs',
  ];

  const dietaryTypes = ['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan'];

  const statusOptions = [
    { label: 'Available Now', value: 'available' },
    { label: 'All Statuses', value: 'All' },
    { label: 'Reserved / Scheduled', value: 'reserved' },
    { label: 'Completed', value: 'completed' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await donationService.getDonations({
        search: searchQuery,
        category: selectedCategory,
        dietary: selectedDietary,
        status: selectedStatus,
      });
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, selectedDietary, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDietary('All');
    setSelectedStatus('available');
  };

  return (
    <div className="min-h-screen bg-[#F5FAF4] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#12372A]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#166534] mb-1">
              <span>Community Surplus Clearinghouse</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12372A]">
              Explore Available Food Donations
            </h1>
            <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-2xl">
              Real-time catalog of wholesome commercial surplus ready for immediate rescue by verified charitable partners. Demo records for testing.
            </p>
          </div>

          {/* View toggle (Grid vs Map) */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'text-[#647067] hover:text-[#17231D]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'text-[#647067] hover:text-[#17231D]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map Radar</span>
            </button>
          </div>
        </div>

        {/* Role Helper Banner if viewing as donor or guest */}
        {role !== 'recipient' && (
          <div className="p-4 bg-emerald-50 border border-[#22C55E]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#12372A]">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#166534] shrink-0" />
              <span>
                You are currently browsing as a <strong>{currentUser ? currentUser.role : 'guest'}</strong>. To test claiming donations with volunteer dispatch, switch to the Recipient NGO role.
              </span>
            </div>
            <button
              onClick={() => loginAs('recipient1')}
              className="px-3 py-1.5 bg-[#166534] text-white font-semibold rounded-lg hover:bg-[#12372A] transition-colors whitespace-nowrap"
            >
              Switch to Recipient Demo Role
            </button>
          </div>
        )}

        {/* Filter Controls Panel */}
        <div className="bg-white p-5 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food item, kitchen, address, or ingredients..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5FAF4] rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#166534]"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F5FAF4] rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#166534] text-[#17231D]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Select */}
            <div>
              <select
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F5FAF4] rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#166534] text-[#17231D]"
              >
                {dietaryTypes.map((d) => (
                  <option key={d} value={d}>
                    Dietary: {d}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick status tabs and reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-gray-400 font-medium mr-1 text-[11px]">Status:</span>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedStatus === opt.value
                      ? 'bg-[#166534] text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-[#166534] flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* View Mode Rendering */}
        {viewMode === 'map' ? (
          <MapPlaceholder
            donations={donations}
            onSelectDonation={(item) => setSelectedDonation(item)}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="p-16 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#17231D]">No available donations found</h3>
            <p className="text-xs text-[#647067] max-w-md mx-auto">
              There are no food listings currently matching these filter parameters. Try expanding your search or status filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#DCFCE7] text-[#166534] text-xs font-semibold rounded-xl hover:bg-[#bbf7d0]"
            >
              Clear Search & Show All
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

        {/* Safety Banner */}
        <FoodSafetyNotice />

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
            loadData();
          }}
        />

      </div>
    </div>
  );
};
