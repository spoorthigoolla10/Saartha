import { db } from '../data/mockDatabase';
import {
  User,
  Application,
  ApplicationDocument,
  PaymentRecord,
  AppointmentRecord,
  DashboardStats,
  OfficerDashboardStats,
  NotificationItem,
} from '../types';

/**
 * Frontend-Only Demonstration API Service
 * Interacts directly with the local in-browser mock database engine.
 * Changes are persistently stored in localStorage and broadcasted in real-time.
 */
export const api = {
  // Event listener for cross-component live updates
  onDataChange(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener('passport_portal_data_changed', handler);
    return () => window.removeEventListener('passport_portal_data_changed', handler);
  },

  // Auth & Session
  async getCurrentUser(): Promise<User> {
    return db.getCurrentUser();
  },

  async login(email: string): Promise<User> {
    return db.login(email);
  },

  async register(fullName: string, email: string, passwordHash: string): Promise<User> {
    return db.register(fullName, email, passwordHash);
  },

  switchUser(userOrId: User | number): void {
    db.setCurrentUser(userOrId);
  },

  // Applications
  async getApplications(userId?: number): Promise<Application[]> {
    return db.getApplications(userId);
  },

  async getApplicationById(id: number): Promise<Application | undefined> {
    return db.getApplicationById(id);
  },

  async getApplicationByARN(arn: string): Promise<Application | undefined> {
    return db.getApplicationByARN(arn);
  },

  async saveApplication(data: Partial<Application>): Promise<Application> {
    return db.saveApplication(data);
  },

  // Documents
  async uploadDocument(
    applicationId: number,
    documentType: ApplicationDocument['document_type'],
    fileName: string,
    fileSizeKb: number
  ): Promise<ApplicationDocument> {
    return db.uploadDocument(applicationId, documentType, fileName, fileSizeKb);
  },

  async verifyDocument(docId: number, officerRemarks?: string): Promise<ApplicationDocument> {
    return db.verifyDocument(docId, officerRemarks);
  },

  async requestDocumentCorrection(docId: number, remarks: string): Promise<ApplicationDocument> {
    return db.requestDocumentCorrection(docId, remarks);
  },

  // Payments
  async makeSimulatedPayment(applicationId: number, amount: number, method: string): Promise<PaymentRecord> {
    return db.makePayment(applicationId, amount, method);
  },

  // Appointments
  async bookAppointment(
    applicationId: number,
    centerName: string,
    appointmentDate: string,
    timeSlot: string
  ): Promise<AppointmentRecord> {
    return db.bookAppointment(applicationId, centerName, appointmentDate, timeSlot);
  },

  async cancelAppointment(appointmentId: number): Promise<AppointmentRecord> {
    return db.cancelAppointment(appointmentId);
  },

  // Officer Scrutiny & Decisions
  async officerApprove(applicationId: number, remarks?: string): Promise<Application> {
    return db.officerApprove(applicationId, remarks);
  },

  async officerReject(applicationId: number, reason: string): Promise<Application> {
    return db.officerReject(applicationId, reason);
  },

  // Dashboard Aggregates
  async getApplicantStats(userId: number): Promise<DashboardStats> {
    return db.getApplicantStats(userId);
  },

  async getOfficerStats(): Promise<OfficerDashboardStats> {
    return db.getOfficerStats();
  },

  // Notifications
  async getNotifications(userId: number): Promise<NotificationItem[]> {
    return db.getNotifications(userId);
  },

  async markNotificationRead(id: number): Promise<void> {
    db.markNotificationRead(id);
  },

  // Demo Reset
  resetDemo(): void {
    db.resetToInitial();
  },
};
