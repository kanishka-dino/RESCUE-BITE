import React, { useState } from 'react';
import { FoodDonation } from '../../types';
import { MapPin, Navigation, Info, ExternalLink, Thermometer } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface MapPlaceholderProps {
  donations: FoodDonation[];
  onSelectDonation: (donation: FoodDonation) => void;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  donations,
  onSelectDonation,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(donations[0]?.id || null);

  const selectedDonation = donations.find((d) => d.id === selectedId) || donations[0];

  return (
    <div className="bg-[#FCFDF9] rounded-2xl border border-[#12372A]/10 overflow-hidden shadow-xs">
      
      {/* Top Map Notification Bar */}
      <div className="bg-[#12372A] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#22C55E]" />
          <span className="font-semibold">RescueBite Live Redistribution Radar</span>
          <span className="text-emerald-200/60 hidden sm:inline">·</span>
          <span className="text-emerald-200/80 hidden sm:inline">Metro City District Hubs</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-white/10 px-2.5 py-1 rounded-lg">
          <Info className="w-3.5 h-3.5" />
          <span>Interactive Prototype Map (Geospatial Mode)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[480px]">
        
        {/* Interactive Simulated Map Canvas */}
        <div className="lg:col-span-2 relative bg-[#EBF3EA] overflow-hidden p-6 flex flex-col justify-between">
          
          {/* Subtle stylized grid map lines */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#166534 1px, transparent 1px), radial-gradient(#166534 1px, #EBF3EA 1px)`,
              backgroundSize: `40px 40px`,
              backgroundPosition: `0 0, 20px 20px`,
            }}
          />

          {/* Simulated Metro Road Arteries */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-[#166534]" fill="none" strokeWidth="2">
            <path d="M-50,120 Q300,180 800,90" strokeDasharray="6 4" />
            <path d="M120,-30 Q220,320 380,600" strokeDasharray="4 4" />
            <path d="M450,0 Q500,280 900,450" />
            <circle cx="320" cy="240" r="140" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>

          {/* Active City Hub Label */}
          <div className="relative z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-emerald-950/10 shadow-xs inline-flex items-center gap-2 self-start text-xs font-semibold text-[#12372A]">
            <span className="w-2 h-2 rounded-full bg-[#166534]" />
            <span>Metro Central • 8.5 km Active Rescue Radius</span>
          </div>

          {/* Interactive Donation Map Pins */}
          <div className="relative z-10 my-auto h-64 w-full flex items-center justify-around flex-wrap gap-4 px-4">
            {donations.slice(0, 5).map((donation, idx) => {
              const isSelected = selectedDonation?.id === donation.id;
              // Stagger simulated coordinates
              const offsets = [
                'translate-y-4 translate-x-2',
                '-translate-y-6 translate-x-12',
                'translate-y-8 -translate-x-6',
                '-translate-y-2 -translate-x-12',
                'translate-y-12 translate-x-16',
              ];

              return (
                <button
                  key={donation.id}
                  onClick={() => setSelectedId(donation.id)}
                  className={`group relative flex flex-col items-center transition-all duration-200 cursor-pointer ${
                    offsets[idx % offsets.length]
                  }`}
                  aria-label={`View donation pin ${donation.title}`}
                >
                  {/* Pin Bubble */}
                  <div
                    className={`px-3 py-1.5 rounded-xl shadow-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#166534] text-white scale-110 ring-4 ring-[#DCFCE7]'
                        : 'bg-white text-[#12372A] hover:bg-emerald-50 border border-emerald-900/10'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DCFCE7]' : 'text-[#166534]'}`} />
                    <span className="truncate max-w-[110px]">{donation.title.split(' ')[0]} {donation.quantity}{donation.unit[0]}</span>
                  </div>

                  {/* Pin stem */}
                  <div
                    className={`w-2 h-2 rotate-45 -mt-1 ${
                      isSelected ? 'bg-[#166534]' : 'bg-white border-r border-b border-emerald-900/10'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="relative z-10 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-950/10 shadow-xs flex items-center gap-4 text-[11px] text-[#647067] self-start">
            <span className="flex items-center gap-1.5 font-medium text-[#12372A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" /> Available Listing
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#12372A]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Urgent Claim Window
            </span>
          </div>

        </div>

        {/* Selected Hub Sidebar Detail */}
        <div className="p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
          {selectedDonation ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={selectedDonation.status} />
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs font-semibold text-[#166534]">{selectedDonation.category}</span>
                </div>
                <h4 className="text-base font-bold text-[#17231D] leading-snug">
                  {selectedDonation.title}
                </h4>
                <p className="text-xs text-[#647067] mt-1 line-clamp-2">
                  {selectedDonation.description}
                </p>
              </div>

              <div className="p-3 bg-[#F5FAF4] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Available:</span>
                  <span className="font-bold text-[#12372A] font-mono tabular-nums">
                    {selectedDonation.quantity} {selectedDonation.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Pickup Location:</span>
                  <span className="font-medium text-[#17231D] text-right truncate max-w-[150px]">
                    {selectedDonation.area}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Safe Storage:</span>
                  <span className="font-semibold text-[#166534] flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {selectedDonation.storageCondition.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Donor: </span>
                {selectedDonation.donorName} ({selectedDonation.donorType})
              </div>

              <button
                onClick={() => onSelectDonation(selectedDonation)}
                className="w-full py-2.5 px-4 bg-[#166534] hover:bg-[#12372A] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Complete Details & Claim</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-gray-400">
              Select a map marker to view food rescue specifications.
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 text-center">
            GPS Geofencing Active • Safe Transit Logged
          </div>
        </div>

      </div>
    </div>
  );
};
