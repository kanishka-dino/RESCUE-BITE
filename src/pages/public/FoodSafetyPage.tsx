import React from 'react';
import {
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FoodSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5FAF4] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HACCP Principles & Statutory Protections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12372A]">
            Food Safety & Responsible Redistribution
          </h1>
          <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
            RescueBite enforces strict standards to ensure every rescued meal is safe, traceable, and handled with dignity. Learn how we safeguard the food redistribution chain.
          </p>
        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Regulatory & Operational Notice</span>
          </div>
          <p className="leading-relaxed text-amber-900/90">
            RescueBite facilitates communication and logistics coordination between verified donors and recipient organizations. <strong>RescueBite does not independently test or certify food items.</strong> All participants must comply with local Department of Health regulations, commercial kitchen food-handling codes, and verified temperature logging procedures.
          </p>
        </div>

        {/* The Temperature Danger Zone Guide */}
        <div className="bg-white p-8 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#DCFCE7] text-[#166534] rounded-xl">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#12372A]">The Temperature Danger Zone</h2>
              <p className="text-xs text-[#647067]">Critical thresholds for food pathogen prevention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div className="text-sky-900 font-bold text-sm">Cold Chain: ≤4°C (40°F)</div>
              <p className="text-sky-950/80 leading-relaxed">
                Applies to fresh dairy, cut fruits/vegetables, raw salad prep, cold deli meats, and prepared wraps. Must be kept refrigerated and transported in ice-packed insulated coolers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="text-rose-900 font-bold text-sm">Danger Zone: 4°C – 60°C</div>
              <p className="text-rose-950/80 leading-relaxed">
                Bacteria multiply rapidly. Unchilled or lukewarm cooked food kept in this range for more than 2 hours is strictly prohibited and must NOT be listed or accepted on RescueBite.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="text-amber-900 font-bold text-sm">Hot Holding: ≥60°C (140°F)</div>
              <p className="text-amber-950/80 leading-relaxed">
                Applies to cooked soups, roasted meats, rice, and hot buffet surplus. Must be maintained hot in commercial cambros and reheated to 74°C (165°F) prior to serving.
              </p>
            </div>

          </div>
        </div>

        {/* Acceptable vs Prohibited Food Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Acceptable */}
          <div className="bg-white p-7 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#166534] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <span>Eligible for Redistribution</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#17231D]">
              <li className="flex items-start gap-2">
                <span className="text-[#166534] font-bold">✓</span>
                <span>Unserved commercial buffet surplus kept continuously at safe hot or cold temperatures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#166534] font-bold">✓</span>
                <span>Uncut whole fresh produce and farm harvest surplus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#166534] font-bold">✓</span>
                <span>Unopened commercial bakery items, breads, rolls, and dry pastries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#166534] font-bold">✓</span>
                <span>Properly labeled prepackaged goods within or near best-by dates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#166534] font-bold">✓</span>
                <span>Sealed commercial dairy containers with verifiable refrigeration history.</span>
              </li>
            </ul>
          </div>

          {/* Prohibited */}
          <div className="bg-white p-7 rounded-3xl border border-[#12372A]/10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Strictly Prohibited & Ineligible</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#17231D]">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Food that has been served onto individual consumer dining plates or tables.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Prepared food that has remained in the 4°C–60°C danger zone for &gt;2 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Home-cooked meals prepared in uninspected residential kitchens.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Dented, bulging, or leaking canned items with compromised integrity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>High-risk raw seafood or raw unpasteurized dairy without certified cold log.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Protections: The Bill Emerson Good Samaritan Act */}
        <div className="bg-[#12372A] text-white p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#22C55E]" />
            <h3 className="text-xl font-bold">Legal Protections: Good Samaritan Act</h3>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Many businesses fear donating food due to perceived liability. Under the <strong>Bill Emerson Good Samaritan Food Donation Act (42 U.S. Code § 1791)</strong>, food donors and recipient non-profits are protected from civil and criminal liability when donating surplus food in good faith, provided they do not engage in gross negligence or intentional misconduct.
          </p>
          <div className="pt-2 text-xs text-emerald-200/80">
            RescueBite’s structured preparation logging, timestamping, and recipient confirmation create a clear chain of custody supporting legal safe harbor compliance.
          </div>
        </div>

        {/* Reporting Protocol */}
        <div className="bg-white p-7 rounded-3xl border border-[#12372A]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-[#12372A] text-base">Notice an Unsafe or Misleading Listing?</h4>
            <p className="text-xs text-[#647067]">
              Every listing card and detail modal features a “Flag Unsafe Listing” trigger that alerts our administrator moderation queue for immediate inspection.
            </p>
          </div>
          <Link
            to="/explore"
            className="px-5 py-2.5 bg-[#166534] text-white font-semibold text-xs rounded-xl hover:bg-[#12372A] transition-colors whitespace-nowrap shrink-0"
          >
            Explore Active Listings
          </Link>
        </div>

      </div>
    </div>
  );
};
