import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  VerificationRequest,
  AuditLogEntry,
  SafetyReport,
  FoodDonation
} from '../../types';
import { adminService } from '../../services/adminService';
import { donationService } from '../../services/donationService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { MONTHLY_TREND_DATA } from '../../data/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  ListOrdered,
  Users,
  Activity,
  BarChart2,
  Building,
  RefreshCw,
  Search,
  Check,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'verifications' | 'donations' | 'reports' | 'audit' | 'analytics'
  >('overview');

  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const v = adminService.getVerifications();
      setVerifications(v);

      const a = adminService.getAuditLogs();
      setAuditLogs(a);

      const r = adminService.getReports();
      setReports(r);

      const d = await donationService.getDonations();
      setDonations(d);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveVerification = (id: string, name: string) => {
    const updated = adminService.updateVerificationStatus(id, 'approved');
    setVerifications(updated);
    showToast(`Approved "${name}" as a verified redistribution partner!`, 'success');
    loadData();
  };

  const handleRejectVerification = (id: string, name: string) => {
    const updated = adminService.updateVerificationStatus(id, 'rejected');
    setVerifications(updated);
    showToast(`Rejected verification request for "${name}".`, 'info');
    loadData();
  };

  const handleResolveReport = (id: string) => {
    const updated = adminService.updateReportStatus(id, 'resolved');
    setReports(updated);
    showToast(`Safety report ${id} marked as inspected & resolved.`, 'success');
  };

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');
  const activeReports = reports.filter((r) => r.status === 'under_review');

  return (
    <div className="min-h-screen bg-[#F5FAF4] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#12372A] text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          <div className="border-b border-emerald-900/60 pb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Operations & Safety Board
            </span>
            <h2 className="text-base font-bold text-white truncate">
              RescueBite Admin
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Safety Governance Console</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'verifications', label: `Verifications (${pendingVerifications.length})`, icon: FileCheck2 },
              { id: 'donations', label: 'Listing Moderation', icon: ListOrdered },
              { id: 'reports', label: `Safety Reports (${activeReports.length})`, icon: AlertTriangle },
              { id: 'audit', label: 'Custody Audit Trail', icon: ShieldCheck },
              { id: 'analytics', label: 'System Analytics', icon: BarChart2 },
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

        <div className="pt-6 border-t border-emerald-900/60 text-[11px] text-emerald-300/70">
          Demo Operational Mode • Role-Based Access Control
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#12372A]">
                Platform Governance & Safety Board
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-1">
                Oversee NGO verifications, food safety incidents, and network redistribution health.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Pending Partner Verifications"
                value={pendingVerifications.length}
                subtext="Charity registration applications"
                highlight={pendingVerifications.length > 0}
              />
              <StatCard
                label="Total Active Listings"
                value={donations.filter((d) => d.status === 'available').length}
                subtext="Live across Metro district"
              />
              <StatCard
                label="Active Safety Flags"
                value={activeReports.length}
                subtext="Under moderation inspection"
              />
              <StatCard
                label="Audit Events Logged"
                value={auditLogs.length}
                subtext="Chain of custody timestamps"
              />
            </div>

            {/* Verification queue card */}
            <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#12372A] text-sm">
                    Pending Charitable Organization Applications
                  </h3>
                  <p className="text-xs text-[#647067]">
                    Validate non-profit tax status and kitchen health permits
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  Manage All
                </button>
              </div>

              {pendingVerifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  All charity partner applications have been reviewed!
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingVerifications.map((v) => (
                    <div
                      key={v.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#17231D] text-sm">{v.orgName}</div>
                        <div className="text-gray-500">
                          {v.orgType} • Reg #: <span className="font-mono">{v.registrationNumber}</span> • Capacity: {v.dailyCapacity} meals/day
                        </div>
                        <div className="text-gray-400 text-[11px]">
                          Contact: {v.contactPerson} ({v.email})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectVerification(v.id, v.orgName)}
                          className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveVerification(v.id, v.orgName)}
                          className="px-4 py-1.5 bg-[#166534] hover:bg-[#12372A] text-white rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Charity</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Growth chart */}
            <div className="bg-[#FCFDF9] p-6 rounded-2xl border border-[#12372A]/10 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-[#12372A] text-sm">Network Growth & Redistribution Volume</h3>
                <p className="text-xs text-[#647067]">Cumulative meals delivered vs participating donor kitchens</p>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#647067" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#647067" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12372A',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="meals" stroke="#166534" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="donors" stroke="#22C55E" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Organization Verification Queue</h1>
              <p className="text-xs text-[#647067]">
                Review 501(c)(3) documentation and food safety equipment clearances.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5FAF4] border-b border-gray-200 text-[#647067]">
                    <th className="p-3.5 font-semibold">Organization Name</th>
                    <th className="p-3.5 font-semibold">Type</th>
                    <th className="p-3.5 font-semibold">Tax / Reg ID</th>
                    <th className="p-3.5 font-semibold">Capacity</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-[#17231D]">{v.orgName}</div>
                        <div className="text-gray-400 text-[11px]">{v.address}</div>
                      </td>
                      <td className="p-3.5 text-gray-600">{v.orgType}</td>
                      <td className="p-3.5 font-mono text-gray-700">{v.registrationNumber}</td>
                      <td className="p-3.5 text-gray-700">{v.dailyCapacity} meals/day</td>
                      <td className="p-3.5">
                        <span
                          className={`font-semibold capitalize ${
                            v.status === 'approved'
                              ? 'text-emerald-700'
                              : v.status === 'rejected'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {v.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRejectVerification(v.id, v.orgName)}
                              className="px-2.5 py-1 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveVerification(v.id, v.orgName)}
                              className="px-3 py-1 bg-[#166534] text-white rounded-lg hover:bg-[#12372A]"
                            >
                              Approve
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: DONATIONS MODERATION */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Listing Moderation & Expiry Watch</h1>
              <p className="text-xs text-[#647067]">
                Audit active listings for complete allergen disclosures and safe temperature limits.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5FAF4] border-b border-gray-200 text-[#647067]">
                    <th className="p-3.5 font-semibold">Title</th>
                    <th className="p-3.5 font-semibold">Donor</th>
                    <th className="p-3.5 font-semibold">Quantity</th>
                    <th className="p-3.5 font-semibold">Storage</th>
                    <th className="p-3.5 font-semibold">Safe Deadline</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-medium text-[#17231D] max-w-xs truncate">{d.title}</td>
                      <td className="p-3.5 text-gray-600">{d.donorName}</td>
                      <td className="p-3.5 font-mono tabular-nums">{d.quantity} {d.unit}</td>
                      <td className="p-3.5 text-gray-600">{d.storageCondition.split(' ')[0]}</td>
                      <td className="p-3.5 text-gray-600">{new Date(d.expiryDeadline).toLocaleTimeString()}</td>
                      <td className="p-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        {d.status === 'available' && (
                          <button
                            onClick={async () => {
                              await donationService.updateStatus(d.id, 'cancelled');
                              showToast(`Listing ${d.id} delisted by admin safety audit`, 'info');
                              loadData();
                            }}
                            className="text-rose-600 hover:underline font-semibold"
                          >
                            Delist
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Safety Complaints & Incident Reports</h1>
              <p className="text-xs text-[#647067]">
                User-flagged listings regarding incorrect holding temperatures or packaging issues.
              </p>
            </div>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Severity: {rep.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-600">Reported on {new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-[#17231D] text-sm">Listing: {rep.donationTitle}</h3>
                    <p className="text-gray-700">Reason: “{rep.reason}”</p>
                    <div className="text-[11px] text-gray-500">
                      Reported by {rep.reporterName} ({rep.reporterOrg})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'under_review' ? (
                      <button
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-4 py-2 bg-[#166534] text-white rounded-xl font-semibold hover:bg-[#12372A]"
                      >
                        Inspect & Resolve
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Resolved ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">Chain of Custody Audit Trail</h1>
              <p className="text-xs text-[#647067]">
                Immutable chronological log of all listings, claim reservations, handovers, and moderator actions.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-start gap-3 text-xs hover:bg-gray-50/50">
                    <div className="p-2 bg-[#DCFCE7] text-[#166534] rounded-xl shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#12372A]">{log.action}</span>
                        <span className="text-gray-400 text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{log.details}</p>
                      <div className="text-[11px] text-gray-500">
                        Actor: {log.actorName} ({log.actorRole})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#12372A]">System Analytics & Metric Audits</h1>
              <p className="text-xs text-[#647067]">
                Redistribution metrics across all Metro district hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Average Transit Time</span>
                <div className="text-3xl font-bold text-[#12372A] font-mono">38 minutes</div>
                <p className="text-xs text-gray-500">From claim reservation to commercial kitchen handover.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">HACCP Temperature Adherence</span>
                <div className="text-3xl font-bold text-[#166534] font-mono">99.2%</div>
                <p className="text-xs text-gray-500">Zero dangerous-zone holding breaches recorded.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Non-Profit Fulfillment</span>
                <div className="text-3xl font-bold text-[#12372A] font-mono">96.4%</div>
                <p className="text-xs text-gray-500">Listed food collected and served successfully.</p>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
