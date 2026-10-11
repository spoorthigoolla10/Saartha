import {
  User,
  Application,
  ApplicationDocument,
  PaymentRecord,
  AppointmentRecord,
  VerificationHistoryItem,
  NotificationItem,
  DashboardStats,
  OfficerDashboardStats
} from '../types';

const STORAGE_KEY = 'passport_portal_db_v1';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    full_name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    role: 'applicant',
    phone: '+1 (555) 234-5678',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2vkNJFZPDz8w5uHfHQOzOyvauO-AMVSX4A0EA2WP5qg0UZgf1c4vOTRPbWFNG1KZZo_f4v8W6G3swdbmf3G7bY9sTlfLSKRX60_n8nV-xguXOWrU7-IzUJFRyHVLQpuRKmZZQLV0aJsW4lEx45hDE6xQx46dZhRc15q9NPfH6DQnqITiPwzt4MjhvxbwI9MrgbHuCPtEFvBQBOfFeQtjqNpKDnbuXCefLS3vWKAjU8QLPbUk6t0zT4g',
    created_at: '2025-01-10T08:00:00Z',
  },
  {
    id: 2,
    full_name: 'Marcus Aurelius Sterling',
    email: 'marcus.sterling@example.com',
    role: 'applicant',
    phone: '+1 (555) 987-6543',
    created_at: '2025-09-12T10:00:00Z',
  },
  {
    id: 3,
    full_name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    role: 'applicant',
    phone: '+1 (555) 345-6789',
    created_at: '2025-10-01T11:00:00Z',
  },
  {
    id: 4,
    full_name: 'David Chen',
    email: 'david.chen@example.com',
    role: 'applicant',
    phone: '+1 (555) 456-7890',
    created_at: '2025-10-05T09:30:00Z',
  },
  {
    id: 99,
    full_name: 'Inspector R. K. Thorne',
    email: 'officer.rpo@passport.gov.in',
    role: 'officer',
    officer_badge: 'OFF-4029',
    phone: '+1 (800) 258-1800',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2vkNJFZPDz8w5uHfHQOzOyvauO-AMVSX4A0EA2WP5qg0UZgf1c4vOTRPbWFNG1KZZo_f4v8W6G3swdbmf3G7bY9sTlfLSKRX60_n8nV-xguXOWrU7-IzUJFRyHVLQpuRKmZZQLV0aJsW4lEx45hDE6xQx46dZhRc15q9NPfH6DQnqITiPwzt4MjhvxbwI9MrgbHuCPtEFvBQBOfFeQtjqNpKDnbuXCefLS3vWKAjU8QLPbUk6t0zT4g',
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const INITIAL_DOCUMENTS: ApplicationDocument[] = [
  {
    id: 101,
    application_id: 1,
    document_type: 'Proof of Date of Birth',
    original_filename: 'Proof_of_Birth_Cert.pdf',
    stored_filename: 'sec_vault_birth_9028_441.pdf',
    file_size_kb: 1240,
    verification_status: 'Verified',
    officer_remarks: 'Municipal registrar stamp and registration seal validated via civil registry OCR handshake.',
    uploaded_at: '2025-10-12T14:24:00Z',
  },
  {
    id: 102,
    application_id: 1,
    document_type: 'Proof of Residential Address',
    original_filename: 'Electricity_Bill_Utility.pdf',
    stored_filename: 'sec_vault_utility_9028_441.pdf',
    file_size_kb: 840,
    verification_status: 'Verified',
    officer_remarks: 'Consumer account billing address cross-verified with state utility database.',
    uploaded_at: '2025-10-12T14:25:00Z',
  },
  {
    id: 103,
    application_id: 1,
    document_type: 'Proof of Identity',
    original_filename: 'National_ID_Card.png',
    stored_filename: 'sec_vault_id_9028_441.png',
    file_size_kb: 2450,
    verification_status: 'Verified',
    officer_remarks: '100% Demographic Match with DigiLocker national identity framework.',
    uploaded_at: '2025-10-12T14:26:00Z',
  },
  {
    id: 104,
    application_id: 3,
    document_type: 'Proof of Residential Address',
    original_filename: 'Rent_Lease_Agreement_Scan.pdf',
    stored_filename: 'sec_vault_rent_1198.pdf',
    file_size_kb: 1890,
    verification_status: 'Correction Required',
    officer_remarks: 'Scan resolution too low to read notary endorsement stamp. Please upload high-res color copy or electricity bill.',
    uploaded_at: '2025-10-15T10:10:00Z',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 201,
    application_id: 1,
    amount: 1500,
    currency: 'INR (Demo)',
    payment_status: 'Completed',
    transaction_reference: 'TXN-PAS-2025-88412-A1',
    payment_method: 'Net Banking (SBI Demo)',
    created_at: '2025-10-12T14:23:00Z',
  },
  {
    id: 202,
    application_id: 2,
    amount: 3500,
    currency: 'INR (Demo)',
    payment_status: 'Completed',
    transaction_reference: 'TXN-PAS-2025-88495-TK',
    payment_method: 'UPI Instant (Demo)',
    created_at: '2025-10-14T09:15:00Z',
  },
  {
    id: 203,
    application_id: 4,
    amount: 1500,
    currency: 'INR (Demo)',
    payment_status: 'Completed',
    transaction_reference: 'TXN-PAS-2025-8502-DC',
    payment_method: 'Credit Card (Demo)',
    created_at: '2025-10-16T11:20:00Z',
  },
];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 301,
    application_id: 1,
    center_name: 'PSK Central Seva Kendra',
    station_desk: 'Station #04 (Counter 04 reserved)',
    appointment_date: '2025-10-24',
    time_slot: '10:30 AM',
    status: 'Scheduled',
    created_at: '2025-10-12T14:30:00Z',
  },
  {
    id: 302,
    application_id: 2,
    center_name: 'PSK Central Seva Kendra',
    station_desk: 'Tatkaal Fast-Track Desk A',
    appointment_date: '2025-10-14',
    time_slot: '09:00 AM',
    status: 'Completed',
    created_at: '2025-10-14T09:20:00Z',
  },
  {
    id: 303,
    application_id: 4,
    center_name: 'Post Office PSK North Gate',
    station_desk: 'Biometric Desk 02',
    appointment_date: '2025-10-18',
    time_slot: '11:15 AM',
    status: 'Completed',
    created_at: '2025-10-16T11:25:00Z',
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    application_number: '#PAS-2025-08492',
    urn: '9028-441-A',
    applicant_id: 1,
    applicant_name: 'Eleanor Vance',
    application_type: 'Fresh Normal (36 Pgs)',
    priority: 'Normal',
    given_name: 'Eleanor Jane',
    surname: 'Vance',
    has_alias: false,
    dob: '1994-06-14',
    gender: 'female',
    marital_status: 'single',
    place_of_birth: 'Portland',
    country_of_birth: 'United States of America',
    citizenship_basis: 'birth',
    employment_type: 'private',
    educational_qualification: 'grad-above',
    tax_id_pan: 'ALTPV9981E',
    voter_id: 'WKL0194821',
    distinguishing_mark: 'Small 1cm linear scar on left forearm',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 234-5678',
    residential_address: '742 Evergreen Terrace, Suite 4B',
    city: 'Portland',
    state: 'Oregon',
    pincode: '97201',
    police_station_code: 'PS-COLABA-04',
    booklet_pages: 36,
    validity_years: 10,
    tatkaal: false,
    status: 'Under Review',
    current_stage: 'Under Officer Scrutiny (Regional Passport Office)',
    officer_remarks: 'Biometrics recorded. Aadhaar and CCTNS background clearance check nominal. Desk adjudication in progress.',
    biometric_status: 'Completed',
    biometric_score: 99.4,
    documents_status: '3/3 Uploaded',
    submitted_at: '2025-10-12T14:22:00Z',
    created_at: '2025-10-12T14:00:00Z',
    updated_at: '2025-10-16T09:40:00Z',
  },
  {
    id: 2,
    application_number: '#PAS-2022-01934',
    urn: '4401-893-X',
    applicant_id: 1,
    applicant_name: 'Eleanor Vance',
    application_type: 'Fresh Normal (36 Pgs)',
    priority: 'Normal',
    given_name: 'Eleanor Jane',
    surname: 'Vance',
    has_alias: false,
    dob: '1994-06-14',
    gender: 'female',
    marital_status: 'single',
    place_of_birth: 'Portland',
    country_of_birth: 'United States of America',
    citizenship_basis: 'birth',
    employment_type: 'private',
    educational_qualification: 'grad-above',
    distinguishing_mark: 'Small 1cm linear scar on left forearm',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 234-5678',
    residential_address: '742 Evergreen Terrace, Suite 4B',
    city: 'Portland',
    state: 'Oregon',
    pincode: '97201',
    police_station_code: 'PS-COLABA-04',
    booklet_pages: 36,
    validity_years: 10,
    tatkaal: false,
    status: 'Approved',
    current_stage: 'Completed (Booklet #Z891204 Dispatched)',
    biometric_status: 'Completed',
    biometric_score: 99.8,
    documents_status: 'Verified',
    submitted_at: '2022-05-14T10:15:00Z',
    created_at: '2022-05-14T09:00:00Z',
    updated_at: '2022-05-20T16:00:00Z',
  },
  {
    id: 3,
    application_number: '#PAS-2025-08495',
    urn: '9028-440-B',
    applicant_id: 2,
    applicant_name: 'Marcus Aurelius Sterling',
    application_type: 'Tatkaal Renewal',
    priority: 'Tatkaal',
    given_name: 'Marcus Aurelius',
    surname: 'Sterling',
    has_alias: false,
    dob: '1988-11-03',
    gender: 'male',
    marital_status: 'married',
    place_of_birth: 'London',
    country_of_birth: 'United Kingdom',
    citizenship_basis: 'birth',
    employment_type: 'government',
    educational_qualification: 'grad-above',
    distinguishing_mark: 'Birthmark below left collarbone',
    email: 'marcus.sterling@example.com',
    phone: '+1 (555) 987-6543',
    residential_address: '12 Downing Crescent',
    city: 'New York',
    state: 'New York',
    pincode: '10001',
    police_station_code: 'PS-METRO-01',
    booklet_pages: 60,
    validity_years: 10,
    tatkaal: true,
    status: 'Under Review',
    current_stage: 'Priority Tatkaal Adjudication',
    officer_remarks: 'Annexure F and urgency affidavit attached. Biometrics queued for immediate clearance.',
    biometric_status: 'Scheduled',
    biometric_score: 98.7,
    documents_status: '3/3 Uploaded',
    submitted_at: '2025-10-14T09:00:00Z',
    created_at: '2025-10-14T08:30:00Z',
    updated_at: '2025-10-14T12:00:00Z',
  },
  {
    id: 4,
    application_number: '#PAS-2025-08499',
    urn: '9028-119-C',
    applicant_id: 3,
    applicant_name: 'Aisha Khan',
    application_type: 'Fresh Normal (36 Pgs)',
    priority: 'Normal',
    given_name: 'Aisha',
    surname: 'Khan',
    has_alias: false,
    dob: '1998-03-21',
    gender: 'female',
    marital_status: 'single',
    place_of_birth: 'Mumbai',
    country_of_birth: 'India',
    citizenship_basis: 'birth',
    employment_type: 'private',
    educational_qualification: 'grad-above',
    distinguishing_mark: 'None',
    email: 'aisha.khan@example.com',
    phone: '+1 (555) 345-6789',
    residential_address: '404 Palm Avenue, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    police_station_code: 'PS-BANDRA-02',
    booklet_pages: 36,
    validity_years: 10,
    tatkaal: false,
    status: 'Correction Required',
    current_stage: 'Document Re-upload Required',
    officer_remarks: 'Address proof rent deed illegible. Please submit electricity bill or bank passbook.',
    rejection_reason: 'Address proof stamp not verifiable in current scan.',
    biometric_status: 'Pending Slot',
    documents_status: 'Address Proof Unclear',
    submitted_at: '2025-10-15T10:00:00Z',
    created_at: '2025-10-15T09:15:00Z',
    updated_at: '2025-10-16T14:30:00Z',
  },
  {
    id: 5,
    application_number: '#PAS-2025-08502',
    urn: '9028-652-D',
    applicant_id: 4,
    applicant_name: 'David Chen',
    application_type: 'Re-issue (Lost / Damaged)',
    priority: 'Normal',
    given_name: 'David',
    surname: 'Chen',
    has_alias: false,
    dob: '1992-09-17',
    gender: 'male',
    marital_status: 'single',
    place_of_birth: 'San Francisco',
    country_of_birth: 'United States of America',
    citizenship_basis: 'birth',
    employment_type: 'self-employed',
    educational_qualification: 'grad-above',
    distinguishing_mark: 'Mole on right temple',
    email: 'david.chen@example.com',
    phone: '+1 (555) 456-7890',
    residential_address: '88 Market St, Apt 12',
    city: 'San Francisco',
    state: 'California',
    pincode: '94103',
    police_station_code: 'PS-SF-03',
    booklet_pages: 36,
    validity_years: 10,
    tatkaal: false,
    status: 'Submitted',
    current_stage: 'Ready for Final Adjudication',
    officer_remarks: 'Police clearance report received. No loss blacklist hit.',
    biometric_status: 'Completed',
    biometric_score: 99.6,
    documents_status: 'Police Verification Clear',
    submitted_at: '2025-10-16T11:00:00Z',
    created_at: '2025-10-16T10:30:00Z',
    updated_at: '2025-10-16T15:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Adjudication Milestone: Documents Verified',
    message: 'Your 3 supporting documents have been cleared by Consular Adjudication Desk 12. Next: Attend PSK Biometric appointment.',
    type: 'status_change',
    is_read: false,
    created_at: '2025-10-16T09:40:00Z',
  },
  {
    id: 2,
    user_id: 1,
    title: 'Biometric Appointment Reminder',
    message: 'Your appointment is confirmed for Friday, Oct 24, 2025 at 10:30 AM at PSK Central Seva Kendra (Counter 04).',
    type: 'appointment',
    is_read: false,
    created_at: '2025-10-14T08:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    title: 'Payment Acknowledgment Generated',
    message: 'Demo fee receipt TXN-PAS-2025-88412-A1 confirmed. Official Form P-1 is now active.',
    type: 'system',
    is_read: true,
    created_at: '2025-10-12T14:23:00Z',
  },
];

export const INITIAL_VERIFICATION_HISTORY: VerificationHistoryItem[] = [
  {
    id: 1,
    application_id: 1,
    officer_id: 99,
    officer_name: 'Inspector R. K. Thorne (OFF-4029)',
    action: 'DOCUMENTS_VERIFIED',
    remarks: 'Birth Certificate, Utility Bill, and National ID verified with state registries.',
    created_at: '2025-10-16T09:40:00Z',
  },
  {
    id: 2,
    application_id: 1,
    officer_id: 99,
    officer_name: 'Inspector R. K. Thorne (OFF-4029)',
    action: 'STATUS_UPDATE',
    remarks: 'Application progressed to Step 03: Under Review (Regional Office Desk 12).',
    created_at: '2025-10-16T09:42:00Z',
  },
];

// Helper to manage persistent state in browser storage
class MockDatabase {
  private users: User[] = [];
  private applications: Application[] = [];
  private documents: ApplicationDocument[] = [];
  private payments: PaymentRecord[] = [];
  private appointments: AppointmentRecord[] = [];
  private notifications: NotificationItem[] = [];
  private history: VerificationHistoryItem[] = [];
  private currentUser: User = INITIAL_USERS[0];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.users = parsed.users || INITIAL_USERS;
        this.applications = parsed.applications || INITIAL_APPLICATIONS;
        this.documents = parsed.documents || INITIAL_DOCUMENTS;
        this.payments = parsed.payments || INITIAL_PAYMENTS;
        this.appointments = parsed.appointments || INITIAL_APPOINTMENTS;
        this.notifications = parsed.notifications || INITIAL_NOTIFICATIONS;
        this.history = parsed.history || INITIAL_VERIFICATION_HISTORY;
        const currentUserId = parsed.currentUserId || 1;
        this.currentUser = this.users.find(u => u.id === currentUserId) || this.users[0];
        return;
      }
    } catch {
      // fallback to initial
    }
    this.resetToInitial();
  }

  private save() {
    try {
      const payload = {
        users: this.users,
        applications: this.applications,
        documents: this.documents,
        payments: this.payments,
        appointments: this.appointments,
        notifications: this.notifications,
        history: this.history,
        currentUserId: this.currentUser.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('passport_portal_data_changed'));
      }
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public resetToInitial() {
    this.users = [...INITIAL_USERS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.documents = [...INITIAL_DOCUMENTS];
    this.payments = [...INITIAL_PAYMENTS];
    this.appointments = [...INITIAL_APPOINTMENTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.history = [...INITIAL_VERIFICATION_HISTORY];
    this.currentUser = this.users[0];
    this.save();
  }

  // Auth & User Methods
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(userOrId: User | number) {
    if (typeof userOrId === 'number') {
      const found = this.users.find(u => u.id === userOrId);
      if (found) this.currentUser = found;
    } else {
      this.currentUser = userOrId;
    }
    this.save();
  }

  public register(full_name: string, email: string, password_hash: string, role: 'applicant' = 'applicant'): User {
    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: User = {
      id: Date.now(),
      full_name,
      email,
      role,
      phone: '',
      created_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.save();
    return newUser;
  }

  public login(email: string): User {
    const found = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('Invalid email or password credentials.');
    }
    this.currentUser = found;
    this.save();
    return found;
  }

  // Applications
  public getApplications(filterUserId?: number): Application[] {
    let list = this.applications;
    if (filterUserId && this.currentUser.role === 'applicant') {
      list = list.filter(a => a.applicant_id === filterUserId);
    }
    return list.map(app => ({
      ...app,
      documents: this.documents.filter(d => d.application_id === app.id),
      payment: this.payments.find(p => p.application_id === app.id),
      appointment: this.appointments.find(ap => ap.application_id === app.id),
    }));
  }

  public getApplicationById(id: number): Application | undefined {
    const app = this.applications.find(a => a.id === id);
    if (!app) return undefined;
    return {
      ...app,
      documents: this.documents.filter(d => d.application_id === app.id),
      payment: this.payments.find(p => p.application_id === app.id),
      appointment: this.appointments.find(ap => ap.application_id === app.id),
    };
  }

  public getApplicationByARN(arn: string): Application | undefined {
    const cleanArn = arn.trim().toUpperCase().replace('#', '');
    const app = this.applications.find(a => 
      a.application_number.replace('#', '').toUpperCase() === cleanArn ||
      a.urn.toUpperCase() === cleanArn
    );
    if (!app) return undefined;
    return {
      ...app,
      documents: this.documents.filter(d => d.application_id === app.id),
      payment: this.payments.find(p => p.application_id === app.id),
      appointment: this.appointments.find(ap => ap.application_id === app.id),
    };
  }

  public saveApplication(data: Partial<Application>): Application {
    const isNew = !data.id;
    const now = new Date().toISOString();
    let app: Application;

    if (isNew) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const randUrn = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

      app = {
        id: Date.now(),
        application_number: `#PAS-${year}-${randNum}`,
        urn: randUrn,
        applicant_id: this.currentUser.id,
        applicant_name: this.currentUser.full_name,
        application_type: (data.application_type as any) || 'Fresh Normal (36 Pgs)',
        priority: data.priority || 'Normal',
        given_name: data.given_name || '',
        surname: data.surname || '',
        has_alias: !!data.has_alias,
        alias_name: data.alias_name || '',
        dob: data.dob || '1995-01-01',
        gender: data.gender || 'female',
        marital_status: data.marital_status || 'single',
        place_of_birth: data.place_of_birth || '',
        country_of_birth: data.country_of_birth || 'United States of America',
        citizenship_basis: data.citizenship_basis || 'birth',
        employment_type: data.employment_type || 'private',
        educational_qualification: data.educational_qualification || 'grad-above',
        tax_id_pan: data.tax_id_pan || '',
        voter_id: data.voter_id || '',
        distinguishing_mark: data.distinguishing_mark || '',
        email: data.email || this.currentUser.email,
        phone: data.phone || this.currentUser.phone || '',
        residential_address: data.residential_address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        police_station_code: data.police_station_code || 'PS-CENTRAL-01',
        booklet_pages: data.booklet_pages || 36,
        validity_years: data.validity_years || 10,
        tatkaal: !!data.tatkaal,
        status: data.status || 'Draft',
        current_stage: data.status === 'Submitted' ? 'Submitted (Awaiting Payment / Biometrics)' : 'Draft Intake',
        biometric_status: 'Pending Slot',
        documents_status: '0/3 Uploaded',
        submitted_at: data.status === 'Submitted' ? now : undefined,
        created_at: now,
        updated_at: now,
      };
      this.applications.unshift(app);
    } else {
      const idx = this.applications.findIndex(a => a.id === data.id);
      if (idx === -1) throw new Error('Application not found');
      app = {
        ...this.applications[idx],
        ...data,
        updated_at: now,
      };
      if (data.status === 'Submitted' && !app.submitted_at) {
        app.submitted_at = now;
        app.current_stage = 'Step 01: Submitted & Signed';
      }
      this.applications[idx] = app;
    }

    this.save();
    return app;
  }

  // Documents
  public uploadDocument(
    application_id: number,
    document_type: ApplicationDocument['document_type'],
    original_filename: string,
    file_size_kb: number
  ): ApplicationDocument {
    const existingIdx = this.documents.findIndex(
      d => d.application_id === application_id && d.document_type === document_type
    );

    const doc: ApplicationDocument = {
      id: Date.now(),
      application_id,
      document_type,
      original_filename,
      stored_filename: `sec_vault_${document_type.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`,
      file_size_kb,
      verification_status: 'Pending',
      uploaded_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      this.documents[existingIdx] = doc;
    } else {
      this.documents.push(doc);
    }

    // Update parent application documents count
    const app = this.applications.find(a => a.id === application_id);
    if (app) {
      const docs = this.documents.filter(d => d.application_id === application_id);
      app.documents_status = `${docs.length}/3 Uploaded`;
      app.updated_at = new Date().toISOString();
    }

    this.save();
    return doc;
  }

  public verifyDocument(docId: number, officerRemarks?: string): ApplicationDocument {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    doc.verification_status = 'Verified';
    doc.officer_remarks = officerRemarks || 'Document integrity and legal seal verified by consular officer.';
    this.save();
    return doc;
  }

  public requestDocumentCorrection(docId: number, remarks: string): ApplicationDocument {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    doc.verification_status = 'Correction Required';
    doc.officer_remarks = remarks;

    const app = this.applications.find(a => a.id === doc.application_id);
    if (app) {
      app.status = 'Correction Required';
      app.current_stage = 'Document Correction Requested';
      app.officer_remarks = `Correction required for ${doc.document_type}: ${remarks}`;
      app.updated_at = new Date().toISOString();

      this.notifications.unshift({
        id: Date.now(),
        user_id: app.applicant_id,
        title: `Correction Requested: ${doc.document_type}`,
        message: remarks,
        type: 'document',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    this.save();
    return doc;
  }

  // Simulated Payment
  public makePayment(application_id: number, amount = 1500, payment_method = 'Net Banking (Demo)'): PaymentRecord {
    const app = this.applications.find(a => a.id === application_id);
    if (!app) throw new Error('Application not found');

    const existingPayment = this.payments.find(p => p.application_id === application_id && p.payment_status === 'Completed');
    if (existingPayment) {
      throw new Error('A successful payment has already been recorded for this application.');
    }

    const ref = `TXN-PAS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const payment: PaymentRecord = {
      id: Date.now(),
      application_id,
      amount,
      currency: 'INR (Demo)',
      payment_status: 'Completed',
      transaction_reference: ref,
      payment_method,
      created_at: new Date().toISOString(),
    };

    this.payments.push(payment);
    if (app.status === 'Payment Pending' || app.status === 'Submitted') {
      app.status = 'Appointment Scheduled';
      app.current_stage = 'Payment Cleared • Biometrics Ready';
      app.updated_at = new Date().toISOString();
    }

    this.notifications.unshift({
      id: Date.now(),
      user_id: app.applicant_id,
      title: 'Simulated Fee Payment Completed',
      message: `Payment of ₹${amount} recorded with Reference ID: ${ref}. You may now book your PSK Seva Kendra appointment.`,
      type: 'system',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.save();
    return payment;
  }

  // Appointments
  public bookAppointment(
    application_id: number,
    center_name: string,
    appointment_date: string,
    time_slot: string
  ): AppointmentRecord {
    const app = this.applications.find(a => a.id === application_id);
    if (!app) throw new Error('Application not found');

    // Conflict check
    const conflict = this.appointments.find(
      ap => ap.center_name === center_name && ap.appointment_date === appointment_date && ap.time_slot === time_slot && ap.status === 'Scheduled'
    );
    if (conflict && conflict.application_id !== application_id) {
      throw new Error(`The selected slot ${time_slot} on ${appointment_date} at ${center_name} is already reserved by another applicant. Please choose another slot.`);
    }

    // Cancel or update existing
    const existing = this.appointments.find(ap => ap.application_id === application_id);
    if (existing) {
      existing.center_name = center_name;
      existing.appointment_date = appointment_date;
      existing.time_slot = time_slot;
      existing.status = 'Scheduled';
      this.save();
      return existing;
    }

    const appointment: AppointmentRecord = {
      id: Date.now(),
      application_id,
      center_name,
      station_desk: 'Counter 04 reserved',
      appointment_date,
      time_slot,
      status: 'Scheduled',
      created_at: new Date().toISOString(),
    };

    this.appointments.push(appointment);
    app.biometric_status = 'Scheduled';
    app.status = 'Under Review';
    app.current_stage = 'Step 03: Under Review (Regional Office Desk 12)';
    app.updated_at = new Date().toISOString();

    this.notifications.unshift({
      id: Date.now(),
      user_id: app.applicant_id,
      title: 'Biometric Appointment Reserved',
      message: `Your appointment is confirmed for ${appointment_date} at ${time_slot} at ${center_name}.`,
      type: 'appointment',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.save();
    return appointment;
  }

  public cancelAppointment(appointment_id: number): AppointmentRecord {
    const ap = this.appointments.find(a => a.id === appointment_id);
    if (!ap) throw new Error('Appointment not found');
    ap.status = 'Cancelled';
    const app = this.applications.find(a => a.id === ap.application_id);
    if (app) {
      app.biometric_status = 'Pending Slot';
      app.updated_at = new Date().toISOString();
    }
    this.save();
    return ap;
  }

  // Officer Actions
  public officerApprove(application_id: number, remarks?: string): Application {
    const app = this.applications.find(a => a.id === application_id);
    if (!app) throw new Error('Application not found');

    // Rule: Must not approve with unresolved required document checks
    const docs = this.documents.filter(d => d.application_id === application_id);
    const hasCorrection = docs.some(d => d.verification_status === 'Correction Required');
    if (hasCorrection) {
      throw new Error('Cannot approve application with unresolved document corrections. All documents must be verified.');
    }

    app.status = 'Approved';
    app.current_stage = 'Step 04: Decision & Dispatch (Tamper-Resistant Booklet Laser-Engraved)';
    app.officer_remarks = remarks || 'All identity credentials and background clearance checks cleared. Sovereign passport granted.';
    app.updated_at = new Date().toISOString();

    this.history.unshift({
      id: Date.now(),
      application_id,
      officer_id: this.currentUser.id,
      officer_name: this.currentUser.full_name,
      action: 'APPLICATION_APPROVED',
      remarks: app.officer_remarks,
      created_at: new Date().toISOString(),
    });

    this.notifications.unshift({
      id: Date.now(),
      user_id: app.applicant_id,
      title: 'Passport Application Approved',
      message: `Congratulations! Application ${app.application_number} has been officially approved. Booklet scheduled for SpeedPost dispatch.`,
      type: 'status_change',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.save();
    return app;
  }

  public officerReject(application_id: number, reason: string): Application {
    const app = this.applications.find(a => a.id === application_id);
    if (!app) throw new Error('Application not found');

    app.status = 'Rejected';
    app.current_stage = 'Adjudication Rejected';
    app.rejection_reason = reason;
    app.officer_remarks = `Rejected: ${reason}`;
    app.updated_at = new Date().toISOString();

    this.history.unshift({
      id: Date.now(),
      application_id,
      officer_id: this.currentUser.id,
      officer_name: this.currentUser.full_name,
      action: 'APPLICATION_REJECTED',
      remarks: reason,
      created_at: new Date().toISOString(),
    });

    this.notifications.unshift({
      id: Date.now(),
      user_id: app.applicant_id,
      title: 'Application Adjudication Outcome: Rejected',
      message: `Your application ${app.application_number} was rejected. Reason: ${reason}`,
      type: 'status_change',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.save();
    return app;
  }

  // Dashboard Stats
  public getApplicantStats(userId: number): DashboardStats {
    const userApps = this.applications.filter(a => a.applicant_id === userId);
    const pending = userApps.filter(a => a.status === 'Under Review' || a.status === 'Submitted' || a.status === 'Payment Pending').length;
    const completed = userApps.filter(a => a.status === 'Approved').length;
    
    // next appointment
    const nextAp = this.appointments.find(ap => {
      const app = userApps.find(a => a.id === ap.application_id);
      return app && ap.status === 'Scheduled';
    });

    let nextApWithNum: any = undefined;
    if (nextAp) {
      const parent = userApps.find(a => a.id === nextAp.application_id);
      nextApWithNum = {
        ...nextAp,
        application_number: parent?.application_number || '#PAS-2025-08492',
      };
    }

    return {
      total_applications: userApps.length,
      pending_review: pending,
      biometric_appointment_count: nextAp ? 1 : 0,
      next_appointment: nextApWithNum,
      completed_filings: completed,
      sla_hours_remaining: 48,
    };
  }

  public getOfficerStats(): OfficerDashboardStats {
    const pending = this.applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length;
    const tatkaal = this.applications.filter(a => a.priority === 'Tatkaal' && (a.status === 'Under Review' || a.status === 'Submitted')).length;
    const correction = this.applications.filter(a => a.status === 'Correction Required').length;
    const approved = this.applications.filter(a => a.status === 'Approved').length;

    return {
      pending_verification: pending + 13, // calibrated for live queue display
      tatkaal_priority_count: tatkaal + 2,
      reviewed_today: 24,
      approved_this_week: 112 + approved,
      acceptance_rate: 98.2,
      correction_requested: 7 + correction,
      live_queue_count: pending + 13,
    };
  }

  // Notifications
  public getNotifications(userId: number): NotificationItem[] {
    return this.notifications.filter(n => n.user_id === userId);
  }

  public markNotificationRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
    this.save();
  }
}

export const db = new MockDatabase();
