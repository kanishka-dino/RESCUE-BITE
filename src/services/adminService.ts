import { VerificationRequest, AuditLogEntry, SafetyReport } from '../types';
import { INITIAL_VERIFICATIONS, INITIAL_AUDIT_LOGS, INITIAL_REPORTS } from '../data/mockData';

const KEY_VERIFICATIONS = 'rescuebite_verifications_v1';
const KEY_AUDIT_LOGS = 'rescuebite_audit_logs_v1';
const KEY_REPORTS = 'rescuebite_reports_v1';

function getList<T>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export const adminService = {
  getVerifications(): VerificationRequest[] {
    return getList(KEY_VERIFICATIONS, INITIAL_VERIFICATIONS);
  },

  updateVerificationStatus(id: string, status: 'approved' | 'rejected'): VerificationRequest[] {
    const list = getList(KEY_VERIFICATIONS, INITIAL_VERIFICATIONS);
    const updated = list.map((v) => (v.id === id ? { ...v, status } : v));
    saveList(KEY_VERIFICATIONS, updated);
    this.addAuditLog({
      action: status === 'approved' ? 'ORG_VERIFIED' : 'ORG_REJECTED',
      actorName: 'Elena Vance (Admin)',
      actorRole: 'admin',
      details: `Verification request ${id} updated to ${status}.`,
      severity: status === 'approved' ? 'info' : 'warning',
    });
    return updated;
  },

  getAuditLogs(): AuditLogEntry[] {
    return getList(KEY_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const list = getList(KEY_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    saveList(KEY_AUDIT_LOGS, [newEntry, ...list]);
  },

  getReports(): SafetyReport[] {
    return getList(KEY_REPORTS, INITIAL_REPORTS);
  },

  updateReportStatus(id: string, status: 'resolved' | 'dismissed'): SafetyReport[] {
    const list = getList(KEY_REPORTS, INITIAL_REPORTS);
    const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
    saveList(KEY_REPORTS, updated);
    return updated;
  },

  addReport(report: Omit<SafetyReport, 'id' | 'createdAt' | 'status'>): void {
    const list = getList(KEY_REPORTS, INITIAL_REPORTS);
    const newReport: SafetyReport = {
      ...report,
      id: `rep_${Date.now()}`,
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };
    saveList(KEY_REPORTS, [newReport, ...list]);
    this.addAuditLog({
      action: 'SAFETY_REPORT_FILED',
      actorName: report.reporterName,
      actorRole: 'recipient',
      details: `Safety concern reported for donation ${report.donationId}: ${report.reason}`,
      severity: 'alert',
    });
  },
};
