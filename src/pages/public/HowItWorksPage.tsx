import React from 'react';
import { Link } from 'react-router-dom';
import {
  PackagePlus,
  Clock,
  ShieldCheck,
  CheckCircle,
  Users,
  Building,
  Heart,
  ArrowRight,
  Truck
} from 'lucide-react';
import { IMAGES } from '../../data/mockData';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5FAF4] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-3.5 py-1.5 rounded-full">
            <span>Redistribution Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12372A]">
            The Food Rescue Pipeline
          </h1>
          <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
            From the moment surplus is identified in commercial kitchens to the time it is served on community tables, RescueBite guarantees cold/hot chain integrity and verified handoffs.
          </p>
        </div>

        {/* 3 Step Deep Dive */}
        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-[#12372A]/10 shadow-xs">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold text-base">
                1
              </div>
              <h2 className="text-2xl font-bold text-[#12372A]">
                Donors List Surplus Food in Real-Time
              </h2>
              <p className="text-sm text-[#647067] leading-relaxed">
                Chefs, catering managers, and bakery staff open the RescueBite Donor Portal to post available trays or crates. They specify quantity, preparation time, holding temperatures (hot ≥60°C or cold ≤4°C), dietary tags (vegetarian, vegan, halal), known allergens, and strict safe collection cutoffs.
              </p>
              <ul className="text-xs text-[#17231D] space-y-2 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Takes under 90 seconds from any phone or kitchen tablet</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Automated cutoff countdown protects against spoiled pickups</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border">
              <img
                src={IMAGES.commercialKitchen}
                alt="Chef logging surplus food in commercial kitchen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-[#12372A]/10 shadow-xs">
            <div className="lg:col-span-5 order-2 lg:order-1 rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border">
              <img
                src={IMAGES.freshProduce}
                alt="Community partner discovery"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-[#12372A] flex items-center justify-center font-bold text-base">
                2
              </div>
              <h2 className="text-2xl font-bold text-[#12372A]">
                Verified Charitable Partners Match & Claim
              </h2>
              <p className="text-sm text-[#647067] leading-relaxed">
                Vetted shelters, soup kitchens, orphanages, and food pantries monitor their Recipient Dashboard or geospatial map. When a donation matches their storage capacity and dining population, they submit a claim, enter volunteer driver details, and commit to temperature-safe handling.
              </p>
              <ul className="text-xs text-[#17231D] space-y-2 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Immediate reservation prevents duplicate claims</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Clear recipient verification ensures food reaches authentic programs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-[#12372A]/10 shadow-xs">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#12372A] text-white flex items-center justify-center font-bold text-base">
                3
              </div>
              <h2 className="text-2xl font-bold text-[#12372A]">
                Safe Collection, Chain of Custody & Serving
              </h2>
              <p className="text-sm text-[#647067] leading-relaxed">
                Volunteers arrive with insulated cambros or coolers within the scheduled window. Both parties verify safe temperature logs, record a timestamped handover confirmation, and transport the food to community dining facilities for prompt, dignified meals.
              </p>
              <ul className="text-xs text-[#17231D] space-y-2 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Chain of custody audit trail logged for transparency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#166534]" />
                  <span>Environmental impact & meal counts automatically updated</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border">
              <img
                src={IMAGES.communityKitchen}
                alt="Community volunteers serving nutritious meals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* Action Callout */}
        <div className="p-8 sm:p-12 bg-[#166534] text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-white">Ready to rescue surplus food?</h3>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Join dozens of restaurants and charities making zero food waste a daily reality in our metro region.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/register?type=donor"
              className="px-6 py-3 bg-white text-[#166534] font-semibold text-xs rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Sign Up as Donor
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3 bg-[#12372A] text-white font-semibold text-xs rounded-xl hover:bg-black/30 transition-colors whitespace-nowrap border border-white/20"
            >
              Explore Feed
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
