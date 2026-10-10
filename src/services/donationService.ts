import { FoodDonation, ClaimRequest, ImpactStats, DonationStatus } from '../types';
import { INITIAL_DONATIONS, INITIAL_CLAIMS, DEMO_IMPACT_STATS } from '../data/mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_DONATIONS = 'rescuebite_donations_v1';
const STORAGE_KEY_CLAIMS = 'rescuebite_claims_v1';

// In-memory + LocalStorage reactive state for full interactive fidelity
function getStoredDonations(): FoodDonation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored donations', e);
  }
  // Initialize with initial mock data
  localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  return INITIAL_DONATIONS;
}

function saveDonations(donations: FoodDonation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
  } catch (e) {
    console.error('Failed to persist donations', e);
  }
}

function getStoredClaims(): ClaimRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLAIMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored claims', e);
  }
  localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(INITIAL_CLAIMS));
  return INITIAL_CLAIMS;
}

function saveClaims(claims: ClaimRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error('Failed to persist claims', e);
  }
}

export const donationService = {
  // Fetch all donations with optional filters
  async getDonations(filters?: {
    search?: string;
    category?: string;
    dietary?: string;
    status?: string;
    city?: string;
  }): Promise<FoodDonation[]> {
    // Attempt backend first if available
    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        const response = await apiClient.get<FoodDonation[]>('/donations', { params: filters });
        return response.data;
      }
    } catch {
      // Fallback to local store
    }

    let items = getStoredDonations();

    // Auto-mark expired items based on simulated now
    const now = new Date().toISOString();
    items = items.map((d) => {
      if (d.status === 'available' && new Date(d.expiryDeadline).toISOString() < now) {
        return { ...d, status: 'expired' as DonationStatus };
      }
      return d;
    });

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.donorName.toLowerCase().includes(q) ||
            d.area.toLowerCase().includes(q)
        );
      }
      if (filters.category && filters.category !== 'All') {
        items = items.filter((d) => d.category === filters.category);
      }
      if (filters.dietary && filters.dietary !== 'All') {
        items = items.filter((d) => d.dietaryType === filters.dietary);
      }
      if (filters.status && filters.status !== 'All') {
        items = items.filter((d) => d.status === filters.status);
      }
      if (filters.city && filters.city !== 'All') {
        items = items.filter((d) => d.city === filters.city);
      }
    }

    return items;
  },

  async getDonationById(id: string): Promise<FoodDonation | undefined> {
    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        const response = await apiClient.get<FoodDonation>(`/donations/${id}`);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const items = getStoredDonations();
    return items.find((d) => d.id === id);
  },

  async createDonation(data: Omit<FoodDonation, 'id' | 'createdAt' | 'status'>): Promise<FoodDonation> {
    const newDonation: FoodDonation = {
      ...data,
      id: `don_${Date.now()}`,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        const response = await apiClient.post<FoodDonation>('/donations', newDonation);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const items = getStoredDonations();
    const updated = [newDonation, ...items];
    saveDonations(updated);
    return newDonation;
  },

  async updateDonation(id: string, updates: Partial<FoodDonation>): Promise<FoodDonation> {
    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        const response = await apiClient.put<FoodDonation>(`/donations/${id}`, updates);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const items = getStoredDonations();
    const index = items.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Donation not found');

    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    saveDonations(items);
    return updatedItem;
  },

  async deleteDonation(id: string): Promise<void> {
    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        await apiClient.delete(`/donations/${id}`);
        return;
      }
    } catch {
      // Fallback
    }

    const items = getStoredDonations().filter((d) => d.id !== id);
    saveDonations(items);
  },

  async claimDonation(params: {
    donationId: string;
    organizationId: string;
    organizationName: string;
    volunteerName?: string;
    volunteerPhone?: string;
    beneficiaryCount: number;
    notes?: string;
    scheduledPickupTime: string;
  }): Promise<{ donation: FoodDonation; claim: ClaimRequest }> {
    try {
      if (import.meta.env.VITE_USE_LIVE_API === 'true') {
        const response = await apiClient.post(`/donations/${params.donationId}/claims`, params);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const donations = getStoredDonations();
    const donation = donations.find((d) => d.id === params.donationId);
    if (!donation) throw new Error('Donation listing not found');

    if (donation.status !== 'available') {
      throw new Error(`This listing is currently ${donation.status} and cannot be claimed.`);
    }

    const updatedDonation: FoodDonation = {
      ...donation,
      status: 'reserved',
      claimedByOrgId: params.organizationId,
      claimedByOrgName: params.organizationName,
      claimedAt: new Date().toISOString(),
      scheduledPickupTime: params.scheduledPickupTime,
    };

    const newClaim: ClaimRequest = {
      id: `clm_${Date.now()}`,
      donationId: params.donationId,
      donationTitle: donation.title,
      organizationId: params.organizationId,
      organizationName: params.organizationName,
      donorName: donation.donorName,
      status: 'reserved',
      scheduledPickupTime: params.scheduledPickupTime,
      volunteerName: params.volunteerName,
      volunteerPhone: params.volunteerPhone,
      beneficiaryCount: params.beneficiaryCount,
      notes: params.notes,
      createdAt: new Date().toISOString(),
    };

    const updatedDonations = donations.map((d) => (d.id === params.donationId ? updatedDonation : d));
    saveDonations(updatedDonations);

    const claims = getStoredClaims();
    saveClaims([newClaim, ...claims]);

    return { donation: updatedDonation, claim: newClaim };
  },

  async updateStatus(
    donationId: string,
    newStatus: DonationStatus
  ): Promise<FoodDonation> {
    const donations = getStoredDonations();
    const index = donations.findIndex((d) => d.id === donationId);
    if (index === -1) throw new Error('Donation not found');

    const updated: FoodDonation = {
      ...donations[index],
      status: newStatus,
      ...(newStatus === 'collected' ? { collectedAt: new Date().toISOString() } : {}),
    };
    donations[index] = updated;
    saveDonations(donations);

    // Also update corresponding claim if exists
    const claims = getStoredClaims();
    const claimIndex = claims.findIndex((c) => c.donationId === donationId);
    if (claimIndex !== -1) {
      if (newStatus === 'pickup_scheduled') claims[claimIndex].status = 'pickup_scheduled';
      else if (newStatus === 'collected') claims[claimIndex].status = 'collected';
      else if (newStatus === 'completed') claims[claimIndex].status = 'completed';
      else if (newStatus === 'cancelled') claims[claimIndex].status = 'cancelled';
      saveClaims(claims);
    }

    return updated;
  },

  async reportDonation(donationId: string, reason: string): Promise<void> {
    const donations = getStoredDonations();
    const index = donations.findIndex((d) => d.id === donationId);
    if (index !== -1) {
      donations[index] = {
        ...donations[index],
        reported: true,
        reportReason: reason,
      };
      saveDonations(donations);
    }
  },

  async getClaims(): Promise<ClaimRequest[]> {
    return getStoredClaims();
  },

  async getImpactSummary(): Promise<ImpactStats> {
    const donations = getStoredDonations();
    const completed = donations.filter((d) => d.status === 'completed' || d.status === 'collected');
    const totalServings = completed.reduce((acc, curr) => acc + (curr.unit === 'servings' ? curr.quantity : curr.quantity * 2.5), 0);
    
    return {
      ...DEMO_IMPACT_STATS,
      mealsRedistributed: Math.max(DEMO_IMPACT_STATS.mealsRedistributed, Math.round(totalServings + 14890)),
      activeListingsCount: donations.filter((d) => d.status === 'available').length,
    };
  },

  resetToDemo(): void {
    localStorage.removeItem(STORAGE_KEY_DONATIONS);
    localStorage.removeItem(STORAGE_KEY_CLAIMS);
  }
};
