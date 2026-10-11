export type UserRole = 'applicant' | 'officer';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  officer_badge?: string;
  created_at: string;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Payment Pending'
  | 'Appointment Scheduled'
  | 'Under Review'
  | 'Correction Required'
  | 'Approved'
  | 'Rejected';

export type DocumentVerificationStatus = 'Pending' | 'Verified' | 'Correction Required';

export interface ApplicationDocument {
  id: number;
  application_id: number;
  document_type: 'Proof of Date of Birth' | 'Proof of Identity' | 'Proof of Residential Address' | 'Annexure F' | 'Minor Parent Consent (Annexure D)';
  original_filename: string;
  stored_filename: string;
  file_size_kb: number;
  verification_status: DocumentVerificationStatus;
  officer_remarks?: string;
  uploaded_at: string;
  preview_url?: string;
}

export interface Application {
  id: number;
  application_number: string; // e.g. #PAS-2025-08492
  urn: string; // e.g. 9028-441-A
  applicant_id: number;
  applicant_name: string;
  application_type: 'Fresh Normal (36 Pgs)' | 'Fresh Jumbo (60 Pgs)' | 'Tatkaal Renewal' | 'Re-issue (Lost / Damaged)';
  priority: 'Normal' | 'Tatkaal';
  
  // Personal Info (Step 1)
  given_name: string;
  surname: string;
  has_alias: boolean;
  alias_name?: string;
  dob: string;
  gender: 'female' | 'male' | 'other';
  marital_status: string;
  place_of_birth: string;
  country_of_birth: string;
  citizenship_basis: string;
  employment_type: string;
  educational_qualification: string;
  tax_id_pan?: string;
  voter_id?: string;
  distinguishing_mark: string;

  // Contact Info (Step 2)
  email: string;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;

  // Address Details (Step 3)
  residential_address: string;
  city: string;
  state: string;
  pincode: string;
  police_station_code: string;

  // Booklet & Service (Step 4)
  booklet_pages: 36 | 60;
  validity_years: 10 | 5;
  tatkaal: boolean;

  // Status & Lifecycle
  status: ApplicationStatus;
  current_stage: string;
  officer_remarks?: string;
  rejection_reason?: string;
  biometric_status: 'Scheduled' | 'Completed' | 'Pending Slot' | 'Exempt';
  biometric_score?: number; // e.g. 99.4
  documents_status: string; // e.g. "3/3 Uploaded", "Address Proof Unclear"
  
  submitted_at?: string;
  created_at: string;
  updated_at: string;

  // Relations
  documents?: ApplicationDocument[];
  payment?: PaymentRecord;
  appointment?: AppointmentRecord;
}

export interface PaymentRecord {
  id: number;
  application_id: number;
  amount: number;
  currency: string;
  payment_status: 'Pending' | 'Completed' | 'Failed';
  transaction_reference: string;
  payment_method: string;
  created_at: string;
}

export interface AppointmentRecord {
  id: number;
  application_id: number;
  center_name: string;
  station_desk: string;
  appointment_date: string;
  time_slot: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  created_at: string;
}

export interface VerificationHistoryItem {
  id: number;
  application_id: number;
  officer_id: number;
  officer_name: string;
  action: string;
  remarks: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'status_change' | 'appointment' | 'document' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_applications: number;
  pending_review: number;
  biometric_appointment_count: number;
  next_appointment?: AppointmentRecord & { application_number: string };
  completed_filings: number;
  sla_hours_remaining: number;
}

export interface OfficerDashboardStats {
  pending_verification: number;
  tatkaal_priority_count: number;
  reviewed_today: number;
  approved_this_week: number;
  acceptance_rate: number;
  correction_requested: number;
  live_queue_count: number;
}
