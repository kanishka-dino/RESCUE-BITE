export type UserRole = 'donor' | 'recipient' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Packaged Goods'
  | 'Dairy & Eggs'
  | 'Beverages'
  | 'Buffet Surplus';

export type FoodUnit = 'servings' | 'kg' | 'boxes' | 'trays' | 'crates' | 'liters';

export type StorageCondition =
  | 'Refrigerated (≤4°C)'
  | 'Hot Held (≥60°C)'
  | 'Room Temperature / Dry'
  | 'Frozen (≤-18°C)';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggitarian';

export type DonationStatus =
  | 'available'
  | 'reserved'
  | 'pickup_scheduled'
  | 'collected'
  | 'completed'
  | 'expired'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationName: string;
  organizationType: string;
  address: string;
  city: string;
  verified: boolean;
  avatarUrl?: string;
  joinedDate: string;
}

export interface FoodDonation {
  id: string;
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number;
  unit: FoodUnit;
  donorId: string;
  donorName: string;
  donorType: string;
  donorAddress: string;
  city: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  prepDateTime: string;
  storageCondition: StorageCondition;
  dietaryType: DietaryType;
  allergens: string[];
  pickupWindowStart: string;
  pickupWindowEnd: string;
  expiryDeadline: string;
  status: DonationStatus;
  claimedByOrgId?: string;
  claimedByOrgName?: string;
  claimedAt?: string;
  scheduledPickupTime?: string;
  collectedAt?: string;
  imageUrl: string;
  handlingInstructions: string;
  temperatureAtListing?: string;
  createdAt: string;
  reported?: boolean;
  reportReason?: string;
}

export interface ClaimRequest {
  id: string;
  donationId: string;
  donationTitle: string;
  organizationId: string;
  organizationName: string;
  donorName: string;
  status: 'reserved' | 'pickup_scheduled' | 'collected' | 'completed' | 'cancelled';
  scheduledPickupTime: string;
  volunteerName?: string;
  volunteerPhone?: string;
  beneficiaryCount: number;
  notes?: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  orgName: string;
  orgType: 'NGO' | 'Community Kitchen' | 'Orphanage' | 'Charity Shelter' | 'Food Bank';
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  taxExemptId?: string;
  dailyCapacity: number;
}

export interface AuditLogEntry {
  id: string;
  donationId?: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  severity?: 'info' | 'warning' | 'alert';
}

export interface SafetyReport {
  id: string;
  donationId: string;
  donationTitle: string;
  donorName: string;
  reporterName: string;
  reporterOrg: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  status: 'under_review' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ImpactStats {
  mealsRedistributed: number;
  kgFoodSaved: number;
  co2SavedKg: number;
  verifiedDonors: number;
  communityPartners: number;
  activeListingsCount: number;
  completionRatePercent: number;
}
