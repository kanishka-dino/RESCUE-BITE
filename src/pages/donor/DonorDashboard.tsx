import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FoodDonation, FoodCategory, FoodUnit, StorageCondition, DietaryType } from '../../types';
import { donationService } from '../../services/donationService';
import { adminService } from '../../services/adminService';
import { IMAGES, WEEKLY_CHART_DATA, CATEGORY_BREAKDOWN_DATA } from '../../data/mockData';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  LayoutDashboard,
  PackagePlus,
  ListOrdered,
  Truck,
  CheckCircle2,
  BarChart3,
  User,
  Plus,
  Clock,
  Thermometer,
  MapPin,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DonorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'my-donations' | 'create' | 'pickups' | 'analytics' | 'profile'
  >('overview');

  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Donation Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState(30);
  const [unit, setUnit] = useState<FoodUnit>('servings');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Hot Held (≥60°C)');
  const [dietaryType, setDietaryType] = useState<DietaryType>('Vegetarian');
  const [allergens, setAllergens] = useState<string[]>(['Gluten']);
  const [prepDateTime, setPrepDateTime] = useState('');
  const [pickupStart, setPickupStart] = useState('');
  const [pickupEnd, setPickupEnd] = useState('');
  const [expiryDeadline, setExpiryDeadline] = useState('');
  const [handlingInstructions, setHandlingInstructions] = useState('');
  const [temperatureLog, setTemperatureLog] = useState('65°C');
  const [imageUrl, setImageUrl] = useState(IMAGES.commercialKitchen);
  const [submitting, setSubmitting] = useState(false);

  // Edit Donation Modal
  const [editingDonation, setEditingDonation] = useState<FoodDonation | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const all = await donationService.getDonations();
      // Filter for this donor or show demo items
      setDonations(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Default dates for form
    const now = new Date();
    const in3Hours = new Date(now.getTime() + 3 * 3600000);
    const in6Hours = new Date(now.getTime() + 6 * 3600000);
    const in8Hours = new Date(now.getTime() + 8 * 3600000);

    const toLocalISO = (d: Date) => d.toISOString().slice(0, 16);
    setPrepDateTime(toLocalISO(now));
    setPickupStart(toLocalISO(in3Hours));
    setPickupEnd(toLocalISO(in6Hours));
    setExpiryDeadline(toLocalISO(in8Hours));
  }, []);

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const created = await donationService.createDonation({
        title,
        description,
        category,
        quantity: Number(quantity),
        unit,
        donorId: currentUser?.id || 'usr_donor_1',
        donorName: currentUser?.organizationName || 'The Green Hearth Bistro',
        donorType: currentUser?.organizationType || 'Restaurant & Caterer',
        donorAddress: currentUser?.address || '428 Heritage Boulevard',
        city: currentUser?.city || 'Metro City',
        area: 'Downtown Financial District',
        coordinates: { lat: 40.7128, lng: -74.006 },
        prepDateTime: prepDateTime || new Date().toISOString(),
        storageCondition,
        dietaryType,
        allergens,
        pickupWindowStart: pickupStart || new Date().toISOString(),
        pickupWindowEnd: pickupEnd || new Date().toISOString(),
        expiryDeadline: expiryDeadline || new Date().toISOString(),
        imageUrl: imageUrl || IMAGES.commercialKitchen,
        handlingInstructions: handlingInstructions || 'Transport in temperature-controlled cambro containers.',
        temperatureAtListing: temperatureLog,
      });

      adminService.addAuditLog({
        donationId: created.id,
        action: 'DONATION_CREATED',
        actorName: currentUser?.name || 'Chef Marco',
        actorRole: 'donor',
        details: `Created new listing "${created.title}" (${created.quantity} ${created.unit}). Storage: ${created.storageCondition}`,
        severity: 'info',
      });

      showToast(`Listing "${title}" created and live for verified NGOs!`, 'success');
      setTitle('');
      setDescription('');
      setActiveTab('my-donations');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create donation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDonation = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this donation listing?')) return;
    try {
      await donationService.updateStatus(id, 'cancelled');
      showToast('Donation listing cancelled', 'info');
      loadData();
    } catch {
      showToast('Failed to cancel', 'error');
    }
  };

  const handleMarkCollected = async (id: string) => {
    try {
      await donationService.updateStatus(id, 'collected');
      showToast('Handover confirmed! Donation is now marked Collected in Transit.', 'success');
      loadData();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      await donationService.updateStatus(id, 'completed');
      showToast('Donation marked fully Completed & Served!', 'success');
      loadData();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const toggleAllergen = (alg: string) => {
    if (allergens.includes(alg)) {
      setAllergens(allergens.filter((a) => a !== alg));
    } else {
      setAllergens([...allergens, alg]);
    }
  };

  // KPIs
  const totalListed = donations.reduce((sum, d) => sum + d.quantity, 0);
  const activeListings = donations.filter((d) => d.status === 'available').length;
  const pendingPickups = donations.filter((d) => d.status === 'reserved' || d.status === 'pickup_scheduled').length;
  const completedCount = donations.filter((d) => d.status === 'completed' || d.status === 'collected').length;

  return (
    <div className="min-h-screen bg-[#F5FAF4] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#12372A] text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Org Header */}
          <div className="border-b border-emerald-900/60 pb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Food Donor Portal
            </span>
            <h2 className="text-base font-bold text-white truncate">
              {currentUser?.organizationName || 'The Green Hearth Bistro'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Verified Food Provider</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'my-donations', label: 'My Donations', icon: ListOrdered },
              { id: 'create', label: 'Create Donation', icon: PackagePlus },
              { id: 'pickups', label: 'Pickup Requests', icon: Truck },
              { id: 'analytics', label: 'Impact Analytics', icon: BarChart3 },
              { id: 'profile', label: 'Kitchen Profile', icon: User },
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

        {/* Quick Post Action */}
        <div className="pt-6 border-t border-emerald-900/60 mt-6">
          <button
            onClick={() => setActiveTab('create')}
            className="w-full py-2.5 px-3 bg-[#22C55E] hover:bg-[#16a34a] text-[#12372A] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>List Surplus Food</span>
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
                  Donor Operations Console
                </h1>
                <p className="text-xs sm:text-sm text-[#647067] mt-1">
                  Active food rescues, pickup dispatches, and landfill prevention stats.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTab('create')}
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>New Surplus Listing</span>
              </Button>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Food Listed"
                value={`${totalListed} units`}
                subtext="Across all surplus listings"
              />
              <StatCard
                label="Active Listings"
                value={activeListings}
                subtext="Currently open for claims"
                highlight={activeListings > 0}
              />
              <StatCard
                label="Pickups Pending"
                value={pendingPickups}
                subtext="Reserved or in transit"
              />
              <StatCard
                label="Completed Rescues"
                value={completedCount}
                subtext="Safely delivered & served"
              />
            </div>

            {/* Chart + Schedule row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Redistribution trend chart */}
              <div className="lg:col-span-7 bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#12372A] text-sm">Weekly Redistribution Trend</h3>
                    <p className="text-xs text-[#647067]">Meals saved by day</p>
                  </div>
                  <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-lg">
                    +18% this week
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#647067" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#647067" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#12372A',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="meals" fill="#166534" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Pickups schedule */}
              <div className="lg:col-span-5 bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#12372A] text-sm">Upcoming NGO Pickups</h3>
                  <p className="text-xs text-[#647067]">Scheduled arrivals today</p>
                </div>

                <div className="space-y-3 my-2">
                  {donations
                    .filter((d) => d.status === 'reserved' || d.status === 'pickup_scheduled')
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#F5FAF4] rounded-xl border border-gray-100 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold text-[#12372A]">
                          <span className="truncate max-w-[180px]">{item.title}</span>
                          <span className="text-emerald-800 text-[11px] font-mono">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="text-[#647067] flex items-center justify-between text-[11px]">
                          <span>Partner: {item.claimedByOrgName || 'St. Jude Shelter'}</span>
                          <span className="font-semibold text-[#166534]">
                            {item.scheduledPickupTime
                              ? new Date(item.scheduledPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '15:30'}
                          </span>
                        </div>
                      </div>
                    ))}

                  {donations.filter((d) => d.status === 'reserved' || d.status === 'pickup_scheduled').length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400">
                      No pickups scheduled for today yet.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('pickups')}
                  className="w-full py-2 bg-gray-50 hover:bg-[#DCFCE7] text-[#166534] font-semibold text-xs rounded-xl transition-colors"
                >
                  Manage All Pickup Requests
                </button>
              </div>

            </div>

            {/* Recent Donations Table */}
            <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#12372A] text-sm">Recent Surplus Listings</h3>
                  <p className="text-xs text-[#647067]">Latest inventory logged by your kitchen</p>
                </div>
                <button
                  onClick={() => setActiveTab('my-donations')}
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  View All Listings
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[#647067]">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Quantity</th>
                      <th className="pb-3 font-semibold">Storage</th>
                      <th className="pb-3 font-semibold">Safe Deadline</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {donations.slice(0, 5).map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50">
                        <td className="py-3 font-medium text-[#17231D] max-w-xs truncate">{d.title}</td>
                        <td className="py-3 text-gray-600">{d.category}</td>
                        <td className="py-3 font-mono tabular-nums font-semibold text-[#12372A]">
                          {d.quantity} {d.unit}
                        </td>
                        <td className="py-3 text-gray-600">{d.storageCondition.split(' ')[0]}</td>
                        <td className="py-3 text-gray-600">
                          {new Date(d.expiryDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setEditingDonation(d)}
                            className="text-gray-500 hover:text-[#166534] p-1"
                            title="Edit / View"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: MY DONATIONS */}
        {activeTab === 'my-donations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#12372A]">All Donation Listings</h1>
                <p className="text-xs text-[#647067]">Manage active, claimed, and historical surplus listings.</p>
              </div>
              <Button variant="primary" size="md" onClick={() => setActiveTab('create')}>
                <Plus className="w-4 h-4 mr-1" />
                <span>Create New Listing</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={d.status} />
                      <span className="text-xs font-mono font-bold text-[#166534]">
                        {d.quantity} {d.unit}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#17231D] text-sm line-clamp-1">{d.title}</h3>
                    <p className="text-xs text-[#647067] line-clamp-2">{d.description}</p>

                    <div className="p-3 bg-[#F5FAF4] rounded-xl text-[11px] space-y-1 text-gray-600">
                      <div>Storage: {d.storageCondition}</div>
                      <div>Deadline: {new Date(d.expiryDeadline).toLocaleString()}</div>
                      {d.claimedByOrgName && (
                        <div className="text-blue-700 font-semibold">Claimed by: {d.claimedByOrgName}</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingDonation(d)}
                      className="text-[#166534] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>

                    {d.status === 'available' && (
                      <button
                        onClick={() => handleCancelDonation(d.id)}
                        className="text-rose-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Listing</span>
                      </button>
                    )}

                    {(d.status === 'reserved' || d.status === 'pickup_scheduled') && (
                      <button
                        onClick={() => handleMarkCollected(d.id)}
                        className="text-white bg-[#166534] px-2.5 py-1 rounded-lg font-semibold hover:bg-[#12372A]"
                      >
                        Verify Handover
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CREATE DONATION */}
        {activeTab === 'create' && (
          <div className="max-w-3xl bg-[#FCFDF9] p-6 sm:p-8 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">List Surplus Food for Rescue</h1>
              <p className="text-xs text-[#647067] mt-1">
                Provide comprehensive specifications to ensure safe temperature handling and rapid NGO collection.
              </p>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-5">
              
              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17231D] mb-1">
                    Donation Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 50 Servings Executive Roasted Chicken & Brown Rice"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17231D] mb-1">
                    Detailed Food Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how it was prepared, whether it was served, and how it is packaged..."
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category, Quantity, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Buffet Surplus">Buffet Surplus</option>
                    <option value="Packaged Goods">Packaged Goods</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as FoodUnit)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  >
                    <option value="servings">servings</option>
                    <option value="kg">kg</option>
                    <option value="boxes">boxes</option>
                    <option value="trays">trays</option>
                    <option value="crates">crates</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>

              {/* Safety & Temperature Controls */}
              <div className="p-4 bg-[#F5FAF4] rounded-2xl border border-[#166534]/20 space-y-3 text-xs">
                <h4 className="font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4" />
                  Temperature & Storage Safety Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">Storage Condition *</label>
                    <select
                      value={storageCondition}
                      onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                    >
                      <option value="Hot Held (≥60°C)">Hot Held (≥60°C)</option>
                      <option value="Refrigerated (≤4°C)">Refrigerated (≤4°C)</option>
                      <option value="Room Temperature / Dry">Room Temperature / Dry</option>
                      <option value="Frozen (≤-18°C)">Frozen (≤-18°C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">Current Temperature *</label>
                    <input
                      type="text"
                      value={temperatureLog}
                      onChange={(e) => setTemperatureLog(e.target.value)}
                      placeholder="e.g. 68°C or 3.5°C"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#17231D] mb-1">Dietary Classification *</label>
                    <select
                      value={dietaryType}
                      onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Eggitarian">Eggitarian</option>
                    </select>
                  </div>
                </div>

                {/* Allergens selection */}
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1.5">
                    Known Allergens (Select all present)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'None reported'].map((alg) => (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => toggleAllergen(alg)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          allergens.includes(alg)
                            ? 'bg-[#166534] text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {alg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time stamps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Preparation Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={prepDateTime}
                    onChange={(e) => setPrepDateTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Pickup Window Start *</label>
                  <input
                    type="datetime-local"
                    required
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Safe Expiry Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    value={expiryDeadline}
                    onChange={(e) => setExpiryDeadline(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                  />
                </div>
              </div>

              {/* Additional handling notes */}
              <div className="text-xs">
                <label className="block font-semibold text-[#17231D] mb-1">
                  Additional Handling Instructions
                </label>
                <input
                  type="text"
                  value={handlingInstructions}
                  onChange={(e) => setHandlingInstructions(e.target.value)}
                  placeholder="e.g. Please bring insulated food pan carriers; exchange clean cambro trays upon pickup."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              {/* Image preset options */}
              <div className="text-xs">
                <label className="block font-semibold text-[#17231D] mb-2">
                  Select Listing Visual
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Cooked Kitchen', path: IMAGES.commercialKitchen },
                    { label: 'Fresh Produce', path: IMAGES.freshProduce },
                    { label: 'Artisan Bread', path: IMAGES.heroRescue },
                    { label: 'Community Dish', path: IMAGES.communityKitchen },
                  ].map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setImageUrl(img.path)}
                      className={`rounded-xl overflow-hidden border-2 aspect-4/3 relative cursor-pointer ${
                        imageUrl === img.path ? 'border-[#166534] ring-2 ring-[#DCFCE7]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded text-center truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  isLoading={submitting}
                  variant="primary"
                  size="md"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Publish Donation Listing</span>
                </Button>
              </div>

            </form>
          </div>
        )}

        {/* VIEW: PICKUP REQUESTS */}
        {activeTab === 'pickups' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">NGO Pickup & Handover Coordination</h1>
              <p className="text-xs text-[#647067]">Verify driver credentials and log custody transfers.</p>
            </div>

            <div className="space-y-4">
              {donations
                .filter((d) => d.status === 'reserved' || d.status === 'pickup_scheduled' || d.status === 'collected')
                .map((d) => (
                  <div
                    key={d.id}
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={d.status} />
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs font-bold text-[#12372A] font-mono">
                          {d.quantity} {d.unit}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#17231D] text-base">{d.title}</h3>
                      <div className="text-xs text-gray-600 flex items-center gap-4">
                        <span>Recipient: <strong>{d.claimedByOrgName || 'St. Jude Shelter'}</strong></span>
                        <span>Estimated Arrival: {d.scheduledPickupTime ? new Date(d.scheduledPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '15:30'}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Instructions: {d.handlingInstructions}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {d.status === 'reserved' && (
                        <button
                          onClick={() => donationService.updateStatus(d.id, 'pickup_scheduled').then(loadData)}
                          className="px-3.5 py-2 bg-blue-50 text-blue-700 font-semibold rounded-xl text-xs hover:bg-blue-100"
                        >
                          Approve Schedule
                        </button>
                      )}

                      {(d.status === 'reserved' || d.status === 'pickup_scheduled') && (
                        <button
                          onClick={() => handleMarkCollected(d.id)}
                          className="px-4 py-2 bg-[#166534] text-white font-semibold rounded-xl text-xs hover:bg-[#12372A] flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Handover to Driver</span>
                        </button>
                      )}

                      {d.status === 'collected' && (
                        <button
                          onClick={() => handleMarkCompleted(d.id)}
                          className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-xl text-xs hover:bg-emerald-800"
                        >
                          Mark Delivered & Served
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Food Waste & Sustainability Analytics</h1>
              <p className="text-xs text-[#647067]">Track meals redistributed, categories saved, and carbon offsets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category distribution */}
              <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
                <h3 className="font-bold text-[#12372A] text-sm">Surplus Food by Category (%)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_BREAKDOWN_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {CATEGORY_BREAKDOWN_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  {CATEGORY_BREAKDOWN_DATA.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-gray-600">{cat.name}:</span>
                      <span className="font-bold text-[#12372A]">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CO2 Impact summary */}
              <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#12372A] text-sm">Environmental Equivalencies</h3>
                  <p className="text-xs text-[#647067]">Converted from EPA WARM sustainability models</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#F5FAF4] rounded-xl space-y-1">
                    <div className="text-xl font-bold text-[#166534] font-mono tabular-nums">
                      15,600 kg CO₂e Offset
                    </div>
                    <p className="text-gray-600 text-[11px]">
                      Equivalent to removing 3.4 passenger vehicles from city roads for an entire year.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5FAF4] rounded-xl space-y-1">
                    <div className="text-xl font-bold text-[#166534] font-mono tabular-nums">
                      6,240 kg Edibles Saved
                    </div>
                    <p className="text-gray-600 text-[11px]">
                      Over 14,890 full meals served to under-resourced community members.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400">
                  Calculated from verified handovers logged in RescueBite chain of custody.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#FCFDF9] p-8 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Commercial Kitchen Profile</h1>
              <p className="text-xs text-[#647067]">Registered donor organization information.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block">Organization Name</span>
                  <span className="font-bold text-[#12372A] text-sm">{currentUser?.organizationName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Business Category</span>
                  <span className="font-bold text-[#12372A] text-sm">{currentUser?.organizationType}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block">Primary Pickup Address</span>
                <span className="font-medium text-[#17231D] text-sm">{currentUser?.address}, {currentUser?.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block">Authorized Chef / Contact</span>
                  <span className="font-medium text-[#17231D]">{currentUser?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Direct Telephone</span>
                  <span className="font-medium text-[#17231D]">{currentUser?.phone}</span>
                </div>
              </div>

              <div className="p-4 bg-[#DCFCE7]/60 rounded-xl border border-[#166534]/20 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#166534] shrink-0" />
                <div>
                  <div className="font-bold text-[#166534]">Commercial Sanitation Clearance Active</div>
                  <div className="text-[11px] text-[#12372A]">Annual health inspection code verified under standard HACCP rules.</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Edit Donation Modal */}
      {editingDonation && (
        <Modal
          isOpen={!!editingDonation}
          onClose={() => setEditingDonation(null)}
          title="Edit Surplus Listing"
          subtitle={editingDonation.title}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editingDonation.title}
                onChange={(e) => setEditingDonation({ ...editingDonation, title: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={editingDonation.quantity}
                onChange={(e) => setEditingDonation({ ...editingDonation, quantity: Number(e.target.value) })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Handling Instructions</label>
              <input
                type="text"
                value={editingDonation.handlingInstructions}
                onChange={(e) => setEditingDonation({ ...editingDonation, handlingInstructions: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setEditingDonation(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await donationService.updateDonation(editingDonation.id, editingDonation);
                  showToast('Listing updated successfully', 'success');
                  setEditingDonation(null);
                  loadData();
                }}
                className="px-4 py-2 bg-[#166534] text-white font-semibold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
