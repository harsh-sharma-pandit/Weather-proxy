import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Users, 
  Bed, 
  Utensils, 
  HeartHandshake, 
  ShieldCheck, 
  Search, 
  QrCode, 
  Download,
  Clock
} from 'lucide-react';
import { VerifiedEmergencyFacility } from '../types';

interface SafeStayBookingProps {
  facilities?: VerifiedEmergencyFacility[];
  localUserName?: string;
  onClose?: () => void;
}

interface ShelterItem {
  id: string;
  name: string;
  type: string;
  state: string;
  district: string;
  totalCapacity: number;
  currentOccupancy: number;
  distanceKm: number;
  contactNumber: string;
  amenities: string[];
  medicalOfficerOnDuty: string;
  source: string;
}

const SAMPLE_SHELTERS: ShelterItem[] = [
  {
    id: 'SHELTER-SK-01',
    name: 'Singtam Community Multi-Purpose Sports Complex',
    type: 'Designated Relief Camp',
    state: 'Sikkim',
    district: 'East Sikkim',
    totalCapacity: 450,
    currentOccupancy: 120,
    distanceKm: 3.2,
    contactNumber: '+91 3592 234108',
    amenities: ['24h Diesel Generator', 'Clean Drinking Water', 'Community Kitchen', 'Child Care Tent'],
    medicalOfficerOnDuty: 'Dr. Tenzing Lepcha (STNM Triage)',
    source: 'Sikkim SDMA Official Directory'
  },
  {
    id: 'SHELTER-SK-02',
    name: 'Dikchu Higher Secondary Safe Haven School',
    type: 'Emergency Transit Shelter',
    state: 'Sikkim',
    district: 'North Sikkim',
    totalCapacity: 250,
    currentOccupancy: 85,
    distanceKm: 1.8,
    contactNumber: '+91 3592 234902',
    amenities: ['First Aid Post', 'Water Storage Tanks', 'Satellite Phone Link'],
    medicalOfficerOnDuty: 'Dr. P. Sharma (District Civil Hospital)',
    source: 'NDMA Relief Directory'
  },
  {
    id: 'SHELTER-AS-01',
    name: 'Haflong Government College Relief Center',
    type: 'Designated Relief Camp',
    state: 'Assam',
    district: 'Dima Hasao',
    totalCapacity: 600,
    currentOccupancy: 310,
    distanceKm: 5.4,
    contactNumber: '+91 3673 236222',
    amenities: ['Emergency Mobile ICU', 'Dry Rations Depot', 'Ham Radio Station'],
    medicalOfficerOnDuty: 'Dr. R. Hmar (Civil Hospital Haflong)',
    source: 'Assam ASDMA Directory'
  },
  {
    id: 'SHELTER-AR-01',
    name: 'Bumla Road Transit Camp Safe Shelter',
    type: 'High-Altitude Emergency Camp',
    state: 'Arunachal Pradesh',
    district: 'Tawang',
    totalCapacity: 200,
    currentOccupancy: 45,
    distanceKm: 7.1,
    contactNumber: '+91 3794 222120',
    amenities: ['Heated Barracks', 'Oxygen Cylinders', 'Army BRO Liaison Post'],
    medicalOfficerOnDuty: 'Major Dr. A. Sen (Military Field Hospital)',
    source: 'State Disaster Cell'
  }
];

export const SafeStayBooking: React.FC<SafeStayBookingProps> = ({
  facilities = [],
  localUserName = 'Harsh Sharma',
  onClose
}) => {
  const [shelters, setShelters] = useState<ShelterItem[]>(SAMPLE_SHELTERS);
  const [selectedShelter, setSelectedShelter] = useState<ShelterItem>(SAMPLE_SHELTERS[0]);
  const [guestCount, setGuestCount] = useState(2);
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingVoucherId, setBookingVoucherId] = useState('');

  const handleBookShelter = (e: React.FormEvent) => {
    e.preventDefault();
    const voucher = `EVAC-${selectedShelter.state.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingVoucherId(voucher);
    setBookingConfirmed(true);

    // Increment occupancy
    setShelters(prev => prev.map(s => s.id === selectedShelter.id ? { ...s, currentOccupancy: s.currentOccupancy + guestCount } : s));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>VERIFIED EMERGENCY SAFE-STAY & RELIEF CAMPS</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
            >
              Close
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Emergency Shelter Reservation & Evacuation Voucher
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          During active landslide warnings and road blockages, access verified government relief shelters and safe havens. 
          Generate a priority evacuation token to ensure immediate shelter, medical triage, and emergency rations.
        </p>
      </div>

      {/* Confirmation Modal / Banner if Booked */}
      {bookingConfirmed && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold uppercase">
                  RESERVATION CONFIRMED • OFFICIAL EVACUATION VOUCHER
                </span>
                <h3 className="text-lg font-bold text-white">
                  Token: {bookingVoucherId}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setBookingConfirmed(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Assigned Shelter</span>
              <span className="text-white font-bold">{selectedShelter.name}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Registered evacuees</span>
              <span className="text-cyan-400 font-bold">{guestCount} Person(s) • {localUserName}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Shelter Helpline</span>
              <span className="text-amber-400 font-bold font-mono">{selectedShelter.contactNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Shelter Grid and Reservation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Shelter Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading">
            Designated Verified Relocations Nearby
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shelters.map((shelter) => {
              const isSelected = selectedShelter.id === shelter.id;
              const remainingCapacity = shelter.totalCapacity - shelter.currentOccupancy;

              return (
                <div
                  key={shelter.id}
                  onClick={() => setSelectedShelter(shelter)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      {shelter.type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {shelter.distanceKm} km away
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{shelter.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{shelter.district}, {shelter.state}</span>
                    </p>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Available Bedding</span>
                      <span className="font-mono text-white font-bold">{remainingCapacity} / {shelter.totalCapacity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(shelter.currentOccupancy / shelter.totalCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {shelter.amenities.map((am, i) => (
                      <span key={i} className="text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {am}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">{shelter.contactNumber}</span>
                    <button className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Booking Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-cyan-400" />
            Reserve Safe Haven Pass
          </h2>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Selected Shelter</span>
            <span className="text-white font-bold block">{selectedShelter.name}</span>
            <span className="text-emerald-400 font-mono text-[11px] block">{selectedShelter.distanceKm} km from current location</span>
          </div>

          <form onSubmit={handleBookShelter} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Primary Evacuee Name</label>
              <input
                type="text"
                value={localUserName}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white opacity-80"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Number of People in Transit</label>
              <input
                type="number"
                min={1}
                max={12}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Emergency Mobile Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all text-xs"
              >
                Generate Priority Safe-Stay Pass
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
