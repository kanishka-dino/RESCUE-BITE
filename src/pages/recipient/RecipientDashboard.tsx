import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FoodDonation, ClaimRequest } from '../../types';
import { donationService } from '../../services/donationService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DonationCard } from '../../components/donations/DonationCard';
import { DonationDetailModal } from '../../components/donations/DonationDetailModal';
import { ClaimDonationModal } from '../../components/donations/ClaimDonationModal';
import { MapPlaceholder } from '../../components/donations/MapPlaceholder';
import { FoodSafetyNotice } from '../../components/donations/FoodSafetyNotice';
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  Calendar,
  History,
  Award,
  Building,
  Bell,
  MapPin,
  Clock,
  Truck,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const RecipientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'explore' | 'claims' | 'schedule' | 'completed' | 'profile'
  >('overview');

  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedDonation, setSelectedDonation] = useState<FoodDonation | null>(null);
  const [claimingDonation, setClaimingDonation] = useState<FoodDonation | null>(null);

  // Filters for Explore inside Recipient view
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const loadData = async () => {
    setLoading(true);
    try {
      const allDonations = await donationService.getDonations({
        search: searchQuery,
        category: categoryFilter,
      });
      setDonations(allDonations);

      const allClaims = await donationService.getClaims();
      setClaims(allClaims);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, categoryFilter]);

  // Derived metrics
  const myOrgId = currentUser?.id || 'usr_recipient_1';
  const myReservedList = donations.filter(
    (d) => d.claimedByOrgId === myOrgId && (d.status === 'reserved' || d.status === 'pickup_scheduled')
  );
  const myCompletedList = donations.filter(
    (d) => d.claimedByOrgId === myOrgId && (d.status === 'collected' || d.status === 'completed')
  );

  const availableCount = donations.filter((d) => d.status === 'available').length;
  const totalMealsClaimed = myCompletedList.reduce((sum, d) => sum + d.quantity, 0) + 185;

  return (
    <div className="min-h-screen bg-[#F5FAF4] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#12372A] text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          <div className="border-b border-emerald-900/60 pb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Recipient Partner Portal
            </span>
            <h2 className="text-base font-bold text-white truncate">
              {currentUser?.organizationName || 'St. Jude Community Meals'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Verified 501(c)(3) Partner</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'explore', label: 'Available Food Radar', icon: Search },
              { id: 'claims', label: 'My Claims & Transit', icon: CheckSquare },
              { id: 'schedule', label: 'Pickup Schedule', icon: Calendar },
              { id: 'completed', label: 'Redistribution History', icon: History },
              { id: 'profile', label: 'Organization Profile', icon: Building },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Quick Find Surplus CTA */}
        <div className="pt-6 border-t border-emerald-900/60 mt-6">
          <button
            onClick={() => setActiveTab('explore')}
            className="w-full py-2.5 px-3 bg-[#22C55E] hover:bg-[#16a34a] text-[#12372A] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Discover Food Nearby</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#12372A]">
                  Community Kitchen Hub
                </h1>
                <p className="text-xs sm:text-sm text-[#647067] mt-1">
                  Claim wholesome surplus, coordinate volunteer pickups, and feed local families.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 bg-[#166534] text-white font-semibold text-xs rounded-xl hover:bg-[#12372A] transition-colors self-start sm:self-auto flex items-center gap-2"
              >
                <span>Browse Available Donations ({availableCount})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Available Nearby"
                value={availableCount}
                subtext="Open surplus listings"
                highlight={availableCount > 0}
              />
              <StatCard
                label="Active Reservations"
                value={myReservedList.length}
                subtext="Awaiting scheduled pickup"
              />
              <StatCard
                label="Total Meals Served"
                value={`${totalMealsClaimed}+`}
                subtext="Rescued by your kitchen"
              />
              <StatCard
                label="Daily Capacity"
                value="250 meals"
                subtext="Shelter dining program"
              />
            </div>

            {/* Active scheduled pickups */}
            <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#12372A] text-sm">Active Pickups for Today</h3>
                  <p className="text-xs text-[#647067]">Dispatches assigned to your team</p>
                </div>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  View Schedule
                </button>
              </div>

              {myReservedList.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#647067] space-y-2">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto" />
                  <p>You have no active food pickups reserved right now.</p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="text-xs font-semibold text-[#166534] hover:underline"
                  >
                    Claim available food listings →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReservedList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          <span className="font-mono font-bold text-[#166534]">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#17231D] text-sm">{item.title}</h4>
                        <div className="text-gray-500 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-[#166534]" />
                            {item.donorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                            {item.area}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDonation(item)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={async () => {
                            await donationService.updateStatus(item.id, 'collected');
                            showToast('Handover confirmed! Food collected.', 'success');
                            loadData();
                          }}
                          className="px-4 py-1.5 bg-[#166534] hover:bg-[#12372A] text-white rounded-lg font-semibold"
                        >
                          Confirm Handover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Feed Teaser */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#12372A] text-sm">Freshly Listed in Your District</h3>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  See All Listings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations
                  .filter((d) => d.status === 'available')
                  .slice(0, 3)
                  .map((d) => (
                    <DonationCard
                      key={d.id}
                      donation={d}
                      canClaim={true}
                      onViewDetails={(item) => setSelectedDonation(item)}
                      onClaim={(item) => setClaimingDonation(item)}
                    />
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: EXPLORE */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#12372A]">Available Food Radar</h1>
                <p className="text-xs text-[#647067]">
                  Discover nearby surplus ready for immediate volunteer pickup.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-xs self-start">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    viewMode === 'grid' ? 'bg-[#166534] text-white' : 'text-gray-600'
                  }`}
                >
                  Grid Feed
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    viewMode === 'map' ? 'bg-[#166534] text-white' : 'text-gray-600'
                  }`}
                >
                  Map Radar
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item, donor restaurant, or dish..."
                  className="w-full pl-9 pr-3 py-2 bg-[#F5FAF4] rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-[#F5FAF4] rounded-xl text-xs border border-gray-200 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Buffet Surplus">Buffet Surplus</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
              </select>
            </div>

            {viewMode === 'map' ? (
              <MapPlaceholder
                donations={donations}
                onSelectDonation={(item) => setSelectedDonation(item)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map((d) => (
                  <DonationCard
                    key={d.id}
                    donation={d}
                    canClaim={true}
                    onViewDetails={(item) => setSelectedDonation(item)}
                    onClaim={(item) => setClaimingDonation(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: MY CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">My Claimed Rescues & In-Transit</h1>
              <p className="text-xs text-[#647067]">
                Track donations currently assigned to your charity dispatch.
              </p>
            </div>

            <div className="space-y-4">
              {myReservedList.map((d) => (
                <div
                  key={d.id}
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={d.status} />
                      <span className="font-bold text-[#12372A] font-mono">
                        {d.quantity} {d.unit}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#17231D] text-base">{d.title}</h3>
                    <div className="text-gray-600 flex flex-wrap gap-4">
                      <span>Donor: <strong>{d.donorName}</strong></span>
                      <span>Address: {d.donorAddress}</span>
                      <span>Scheduled: {d.scheduledPickupTime ? new Date(d.scheduledPickupTime).toLocaleString() : 'Today'}</span>
                    </div>
                    <div className="p-2.5 bg-[#F5FAF4] rounded-lg text-[11px] text-[#12372A]">
                      Handling: {d.handlingInstructions}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDonation(d)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
                    >
                      View Slip
                    </button>
                    <button
                      onClick={async () => {
                        await donationService.updateStatus(d.id, 'collected');
                        showToast('Handover confirmed with donor!', 'success');
                        loadData();
                      }}
                      className="px-4 py-2 bg-[#166534] hover:bg-[#12372A] text-white rounded-xl font-semibold"
                    >
                      Confirm Handover
                    </button>
                  </div>
                </div>
              ))}

              {myReservedList.length === 0 && (
                <div className="p-12 bg-white rounded-2xl border text-center text-xs text-gray-500">
                  No active claims in progress. Browse the feed to claim available food.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: PICKUP SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Volunteer Pickup Schedule</h1>
              <p className="text-xs text-[#647067]">
                Logistics calendar and driver dispatches for the week.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5FAF4] border-b border-gray-200 text-[#647067]">
                    <th className="p-3.5 font-semibold">Scheduled Time</th>
                    <th className="p-3.5 font-semibold">Food Listing</th>
                    <th className="p-3.5 font-semibold">Donor Location</th>
                    <th className="p-3.5 font-semibold">Assigned Driver</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-medium text-[#12372A]">
                        {new Date(claim.scheduledPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 font-semibold text-[#17231D]">{claim.donationTitle}</td>
                      <td className="p-3.5 text-gray-600">{claim.donorName}</td>
                      <td className="p-3.5 text-gray-600">
                        {claim.volunteerName || 'David Chen'} ({claim.volunteerPhone || '+1 555-728'})
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-sky-700 capitalize">
                          {claim.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={async () => {
                            await donationService.updateStatus(claim.donationId, 'collected');
                            showToast('Status updated to Collected!', 'success');
                            loadData();
                          }}
                          className="text-[#166534] font-semibold hover:underline"
                        >
                          Mark Picked Up
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: COMPLETED HISTORY */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Redistribution History & Impact Receipts</h1>
              <p className="text-xs text-[#647067]">
                Log of successfully collected and served food donations.
              </p>
            </div>

            <div className="space-y-4">
              {myCompletedList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="font-mono font-bold text-[#166534]">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#17231D] text-sm">{item.title}</h4>
                    <p className="text-gray-500">
                      Donor: {item.donorName} • Distributed to community shelter guests
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-gray-400">
                    <div>Collected: {item.collectedAt ? new Date(item.collectedAt).toLocaleDateString() : 'Yesterday'}</div>
                    <div className="text-[#166534] font-semibold">Chain of Custody Verified ✓</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#FCFDF9] p-8 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Charity Partner Credentials</h1>
              <p className="text-xs text-[#647067]">Registered community kitchen information.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block">Organization Name</span>
                  <span className="font-bold text-[#12372A] text-sm">{currentUser?.organizationName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Charity Classification</span>
                  <span className="font-bold text-[#12372A] text-sm">{currentUser?.organizationType}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block">Facility Address</span>
                <span className="font-medium text-[#17231D] text-sm">{currentUser?.address}, {currentUser?.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block">Director / Representative</span>
                  <span className="font-medium text-[#17231D]">{currentUser?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Phone</span>
                  <span className="font-medium text-[#17231D]">{currentUser?.phone}</span>
                </div>
              </div>

              <div className="p-4 bg-[#DCFCE7]/60 rounded-xl border border-[#166534]/20 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#166534] shrink-0" />
                <div>
                  <div className="font-bold text-[#166534]">501(c)(3) Non-Profit Verification Approved</div>
                  <div className="text-[11px] text-[#12372A]">Registered in Metro City Charity Registry #NGO-11048-MC.</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

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
          setActiveTab('claims');
        }}
      />

    </div>
  );
};
