import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC<{ onOpenApiModal?: () => void }> = ({ onOpenApiModal }) => {
  return (
    <footer className="bg-[#12372A] text-white pt-20 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner */}
        <div className="bg-[#166534] rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#DCFCE7] mb-2 block">
              Join the Movement
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Small Actions. Meaningful Impact.
            </h2>
            <p className="text-emerald-100 text-base leading-relaxed">
              Every unserved tray of food, fresh harvest surplus, or bakery loaf represents nutrition that can nourish an unhoused family, children's center, or local community kitchen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/register?type=donor"
              className="px-6 py-3.5 bg-white text-[#166534] font-semibold text-sm rounded-xl hover:bg-emerald-50 transition-colors text-center whitespace-nowrap shadow-sm"
            >
              Become a Food Donor
            </Link>
            <Link
              to="/register?type=recipient"
              className="px-6 py-3.5 bg-[#12372A] text-white font-semibold text-sm rounded-xl hover:bg-black/30 transition-colors text-center whitespace-nowrap border border-white/20"
            >
              Join as a Community Partner
            </Link>
          </div>
        </div>

        {/* Multi-column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-[#12372A]">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">RescueBite</span>
            </div>
            <p className="text-emerald-200/80 text-sm max-w-sm leading-relaxed">
              A transparent, safe food rescue and redistribution network connecting commercial surplus with verified charitable kitchens, shelters, and food banks.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-200/60 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                Food Safety Compliant
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-[#22C55E]" />
                Verified Non-Profits
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-emerald-300 mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore Food Listings</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/food-safety" className="hover:text-white transition-colors">Safety & Guidelines</Link>
              </li>
              <li>
                <Link to="/#impact" className="hover:text-white transition-colors">Community Impact</Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-emerald-300 mb-4">Portals</h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li>
                <Link to="/donor" className="hover:text-white transition-colors">Food Donor Portal</Link>
              </li>
              <li>
                <Link to="/recipient" className="hover:text-white transition-colors">Recipient Kitchens</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Safety Operations & Audit</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Portal Authentication</Link>
              </li>
            </ul>
          </div>

          {/* Engineering & Docs */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-emerald-300 mb-4">Architecture</h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li>
                {onOpenApiModal ? (
                  <button
                    onClick={onOpenApiModal}
                    className="hover:text-white transition-colors text-left flex items-center gap-1 text-[#22C55E]"
                  >
                    <span>Spring Boot API Spec</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span>Spring Boot REST API</span>
                )}
              </li>
              <li>
                <span className="text-emerald-200/50">MySQL Database Schema</span>
              </li>
              <li>
                <span className="text-emerald-200/50">HACCP Chain of Custody</span>
              </li>
              <li>
                <span className="text-emerald-200/50">Bill Emerson Act Protection</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <div>
            © {new Date().getFullYear()} RescueBite Platform. Built for zero food waste and community nutrition.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/food-safety" className="hover:text-white transition-colors">Food Safety Policy</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Notice</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
