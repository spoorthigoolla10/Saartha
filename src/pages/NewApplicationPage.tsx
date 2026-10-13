import React, { useState } from 'react';
import { api } from '../services/api';
import { Application, User } from '../types';

interface NewApplicationPageProps {
  currentUser: User;
  onNavigate: (path: string) => void;
  onApplicationCreated: (app: Application) => void;
}

export const NewApplicationPage: React.FC<NewApplicationPageProps> = ({
  currentUser,
  onNavigate,
  onApplicationCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [savedDraftToast, setSavedDraftToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    given_name: 'Eleanor Jane',
    surname: 'Vance',
    has_alias: false,
    alias_name: '',
    dob: '1994-06-14',
    gender: 'female' as 'female' | 'male' | 'other',
    marital_status: 'single',
    place_of_birth: 'Portland',
    country_of_birth: 'United States of America',
    citizenship_basis: 'birth',
    employment_type: 'private',
    educational_qualification: 'grad-above',
    tax_id_pan: 'ALTPV9981E',
    voter_id: '',
    distinguishing_mark: 'Small 1cm linear scar on left forearm',

    // Step 2: Contact Details
    email: currentUser.email || 'eleanor.vance@example.com',
    phone: currentUser.phone || '+1 (555) 234-5678',
    emergency_contact_name: 'Arthur Vance (Father)',
    emergency_contact_phone: '+1 (555) 234-8899',

    // Step 3: Address Details
    residential_address: '742 Evergreen Terrace, Suite 4B',
    city: 'Portland',
    state: 'Oregon',
    pincode: '97201',
    police_station_code: 'PS-COLABA-04',

    // Step 4: Booklet & Service Type
    booklet_pages: 36 as 36 | 60,
    validity_years: 10 as 10 | 5,
    priority: 'Normal' as 'Normal' | 'Tatkaal',
    application_type: 'Fresh Normal (36 Pgs)' as any,

    // Step 5: Document Uploads Check
    dob_doc_name: 'Proof_of_Birth_Cert.pdf',
    identity_doc_name: 'National_ID_Card.png',
    address_doc_name: 'Electricity_Bill_Utility.pdf',

    // Step 6: Declaration
    declarationAccepted: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    api.saveApplication({
      ...formData,
      status: 'Draft',
    });
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 2500);
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitError(null);
    if (!formData.declarationAccepted) {
      setSubmitError('Please check and accept the legal statutory declaration before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.saveApplication({
        ...formData,
        status: 'Submitted',
      });

      // Also register sample documents in vault
      await api.uploadDocument(created.id, 'Proof of Date of Birth', formData.dob_doc_name, 1240);
      await api.uploadDocument(created.id, 'Proof of Identity', formData.identity_doc_name, 2450);
      await api.uploadDocument(created.id, 'Proof of Residential Address', formData.address_doc_name, 840);

      onApplicationCreated(created);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for MRZ generation
  const formattedDobMRZ = formData.dob ? formData.dob.replace(/-/g, '').slice(2) : '940614';
  const surnameUpper = (formData.surname || 'VANCE').toUpperCase().replace(/[^A-Z]/g, '');
  const givenUpper = (formData.given_name || 'ELEANOR JANE').toUpperCase().replace(/[^A-Z]/g, '<');
  const mrzLine1 = `P<USA${surnameUpper}<<${givenUpper}`.padEnd(44, '<').slice(0, 44);
  const mrzLine2 = `9921008431USA${formattedDobMRZ}4F3501018<<<<<<<<<<<<06`.padEnd(44, '<').slice(0, 44);

  const percentComplete = Math.round((currentStep / 6) * 100);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Draft Saved Toast */}
      {savedDraftToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">cloud_done</span>
          <span>Draft record successfully synchronized to database vault.</span>
        </div>
      )}

      {/* Top Header Band with Status Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-1">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-[#756B63] hover:text-[#6F4E37] text-xs font-medium mb-2 transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[11px] font-semibold uppercase tracking-wider border border-[#E7DED6]">
              Official Form P-1
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FEF1EA] text-[#4F3A25] text-[11px] font-medium flex items-center gap-1 border border-[#E7DED6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] animate-pulse"></span>
              Biometric Enrolment Standard v4.2
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#201A17] tracking-tight">New Passport Application</h1>
          <p className="text-sm text-[#756B63]">
            Please ensure all details match your official proof of identity documents precisely.
          </p>
        </div>

        {/* Auto-Save Tracker Badge */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-white border border-[#E7DED6] shadow-xs">
          <span className="material-symbols-outlined text-[18px] text-[#6F4E37]">cloud_done</span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#201A17]">Draft auto-saved</span>
            <span className="text-[10px] font-mono text-[#82746D]">DFT-9921-2025</span>
          </div>
        </div>
      </div>

      {/* 6-Step Horizontal Progress Stepper */}
      <div className="bg-white rounded-xl p-4 border border-[#E7DED6] shadow-xs mb-6">
        <nav aria-label="Progress" className="w-full">
          <ol className="grid grid-cols-6 gap-2">
            {[
              { num: 1, title: 'Personal Info', sub: 'Civil Records' },
              { num: 2, title: 'Contact Details', sub: 'Phone & Email' },
              { num: 3, title: 'Address Details', sub: 'Permanent & Local' },
              { num: 4, title: 'Booklet Type', sub: '36 vs 60 Pages' },
              { num: 5, title: 'Document Vault', sub: 'Proofs & Uploads' },
              { num: 6, title: 'Review & Submit', sub: 'Final Declaration' },
            ].map((step) => {
              const isCurrent = currentStep === step.num;
              const isPassed = currentStep > step.num;
              return (
                <li
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`relative flex flex-col gap-1.5 cursor-pointer transition-opacity ${
                    isCurrent ? 'opacity-100' : isPassed ? 'opacity-90' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#6F4E37] text-white ring-2 ring-[#6F4E37]/30'
                          : isPassed
                          ? 'bg-[#2E6F40] text-white'
                          : 'bg-[#F2E6DF] text-[#50453E]'
                      }`}
                    >
                      {isPassed ? <span className="material-symbols-outlined text-[14px]">check</span> : step.num}
                    </span>
                    <div className="hidden xl:block min-w-0">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#6F4E37]' : 'text-[#201A17]'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-[#82746D]">{isCurrent ? 'Current Step' : step.sub}</p>
                    </div>
                  </div>
                  <div
                    className={`w-full h-1 rounded-full ${
                      isCurrent ? 'bg-[#6F4E37]' : isPassed ? 'bg-[#2E6F40]' : 'bg-[#E7DED6]'
                    }`}
                  ></div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Primary Asymmetric Grid: 8 Cols Form / 4 Cols Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Workspace (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs">
            {/* Step Section Header */}
            <div className="flex items-center justify-between pb-4 mb-6 bg-[#FEF1EA] -mx-6 -mt-6 px-6 pt-6 rounded-t-xl border-b border-[#E7DED6]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-[#6F4E37]">
                  {currentStep === 1
                    ? 'person_outline'
                    : currentStep === 2
                    ? 'contact_phone'
                    : currentStep === 3
                    ? 'home_pin'
                    : currentStep === 4
                    ? 'menu_book'
                    : currentStep === 5
                    ? 'cloud_upload'
                    : 'assignment_turned_in'}
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#201A17]">
                    {currentStep === 1 && '1. Primary Identity Records'}
                    {currentStep === 2 && '2. Contact & Electronic Notification Records'}
                    {currentStep === 3 && '3. Residential Address & Local Police Jurisdiction'}
                    {currentStep === 4 && '4. Booklet Specification & Expedited Tatkaal Options'}
                    {currentStep === 5 && '5. Pre-Requisite Document Vault Attachments'}
                    {currentStep === 6 && '6. Review Dossier & Sovereign Consular Declaration'}
                  </h2>
                  <p className="text-xs text-[#756B63]">
                    {currentStep === 1 && 'Verify civil registry specifications prior to continuing.'}
                    {currentStep === 2 && 'Ensure active mobile phone and email for automated SMS/portal alerts.'}
                    {currentStep === 3 && 'Police verification report dispatch mapped to specified district station.'}
                    {currentStep === 4 && 'Select 36-page standard vs 60-page jumbo booklet and priority processing.'}
                    {currentStep === 5 && 'Upload verified scanned copies of DOB, ID, and address proofs.'}
                    {currentStep === 6 && 'Cross-check machine readable zone credentials before final submission.'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FECAA5] text-[#795336] text-[11px] font-bold">
                Section {currentStep} of 6
              </span>
            </div>

            {/* STEP 1: PERSONAL INFO */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="given-name">
                      <span>Given Name (First &amp; Middle) <span className="text-[#BA1A1A]">*</span></span>
                      <span className="text-[10px] text-[#82746D]">Max 45 chars</span>
                    </label>
                    <input
                      id="given-name"
                      type="text"
                      required
                      value={formData.given_name}
                      onChange={(e) => handleInputChange('given_name', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                    />
                    <span className="text-[11px] text-[#82746D]">As printed on birth certificate</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="surname">
                      <span>Surname / Family Name <span className="text-[#BA1A1A]">*</span></span>
                      <span className="text-[10px] text-[#82746D]">Primary Key</span>
                    </label>
                    <input
                      id="surname"
                      type="text"
                      required
                      value={formData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                    />
                    <span className="text-[11px] text-[#82746D]">Leave blank only if single name affidavit attached</span>
                  </div>
                </div>

                {/* Alias Question */}
                <div className="p-3.5 rounded-lg bg-[#FEF1EA] border border-[#E7DED6]/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#201A17] block">
                      Have you ever been known by any alias or previous name? <span className="text-[#BA1A1A]">*</span>
                    </span>
                    <span className="text-[11px] text-[#756B63]">Includes maiden names, former surnames, or deed poll revisions.</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-[#201A17] cursor-pointer">
                      <input
                        type="radio"
                        name="alias"
                        checked={!formData.has_alias}
                        onChange={() => handleInputChange('has_alias', false)}
                        className="accent-[#6F4E37]"
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-[#201A17] cursor-pointer">
                      <input
                        type="radio"
                        name="alias"
                        checked={formData.has_alias}
                        onChange={() => handleInputChange('has_alias', true)}
                        className="accent-[#6F4E37]"
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                {/* DOB, Gender, Marital Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="dob">
                      <span>Date of Birth <span className="text-[#BA1A1A]">*</span></span>
                      <span className="material-symbols-outlined text-[15px] text-[#6F4E37]">calendar_today</span>
                    </label>
                    <input
                      id="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                    />
                    <span className="text-[10px] text-[#82746D]">Format: YYYY-MM-DD</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]" htmlFor="gender">
                      Gender <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other / Transgender</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">Matches ICAO 9303 standards</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]" htmlFor="marital-status">
                      Marital Status <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <select
                      id="marital-status"
                      value={formData.marital_status}
                      onChange={(e) => handleInputChange('marital_status', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="single">Single / Never Married</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">Civil registry baseline</span>
                  </div>
                </div>

                {/* Place of Birth & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]" htmlFor="birth-place">
                      Place of Birth (City / Village) <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <input
                      id="birth-place"
                      type="text"
                      required
                      value={formData.place_of_birth}
                      onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                    />
                    <span className="text-[11px] text-[#82746D]">Mention municipality or canton</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]" htmlFor="country-birth">
                      Country of Birth <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <select
                      id="country-birth"
                      value={formData.country_of_birth}
                      onChange={(e) => handleInputChange('country_of_birth', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="United States of America">United States of America</option>
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">Country sovereign jurisdiction</span>
                  </div>
                </div>

                {/* Citizenship, Employment & Qualification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Citizenship Acquired By <span className="text-[#BA1A1A]">*</span></label>
                    <select
                      value={formData.citizenship_basis}
                      onChange={(e) => handleInputChange('citizenship_basis', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="birth">Birth (Jus Soli / Sanguinis)</option>
                      <option value="descent">Descent / Lineage</option>
                      <option value="registration">Registration / Naturalization</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">Requires relevant proof type</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Employment Type <span className="text-[#BA1A1A]">*</span></label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => handleInputChange('employment_type', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="private">Private Sector</option>
                      <option value="government">Government / Public Servant</option>
                      <option value="self-employed">Self-Employed / Business</option>
                      <option value="student">Student / Academic</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">For administrative classification</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Educational Qualification <span className="text-[#BA1A1A]">*</span></label>
                    <select
                      value={formData.educational_qualification}
                      onChange={(e) => handleInputChange('educational_qualification', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    >
                      <option value="grad-above">Graduate and Above</option>
                      <option value="matric-10">Secondary / 10th Pass</option>
                      <option value="below-10">Below Secondary</option>
                    </select>
                    <span className="text-[11px] text-[#82746D]">Non-ECR status eligibility</span>
                  </div>
                </div>

                {/* Tax ID & Distinguishing Mark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="tax-id">
                      <span>Tax ID / PAN <span className="text-[#82746D] font-normal">(Optional)</span></span>
                      <span className="text-[10px] text-[#82746D]">Cross-check</span>
                    </label>
                    <input
                      id="tax-id"
                      type="text"
                      placeholder="e.g. ALTPV9981E"
                      value={formData.tax_id_pan}
                      onChange={(e) => handleInputChange('tax_id_pan', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="text-[11px] text-[#82746D]">Expedites database pre-verification</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="voter-id">
                      <span>National Voter / Electoral ID <span className="text-[#82746D] font-normal">(Optional)</span></span>
                      <span className="text-[10px] text-[#82746D]">Electoral Roll</span>
                    </label>
                    <input
                      id="voter-id"
                      type="text"
                      placeholder="e.g. WKL0194821"
                      value={formData.voter_id}
                      onChange={(e) => handleInputChange('voter_id', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="text-[11px] text-[#82746D]">Valid secondary identity reference</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#201A17] flex justify-between" htmlFor="body-mark">
                    <span>Visible Distinguishing Body Mark <span className="text-[#BA1A1A]">*</span></span>
                    <span className="text-[11px] text-[#82746D]">Required for visual border officer validation</span>
                  </label>
                  <input
                    id="body-mark"
                    type="text"
                    required
                    value={formData.distinguishing_mark}
                    onChange={(e) => handleInputChange('distinguishing_mark', e.target.value)}
                    className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                  <span className="text-[11px] text-[#82746D]">Avoid temporary abrasions; document permanent physiological features.</span>
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Email Address <span className="text-[#BA1A1A]">*</span></label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="text-[11px] text-[#82746D]">Critical for automated dispatch status emails</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Mobile Phone Number <span className="text-[#BA1A1A]">*</span></label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="text-[11px] text-[#82746D]">Used for biometric appointment SMS alerts</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] space-y-3">
                  <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">Emergency Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#201A17]">Contact Name &amp; Relationship</label>
                      <input
                        type="text"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        className="h-10 px-3 rounded bg-white border border-[#E7DED6] text-xs text-[#201A17]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#201A17]">Emergency Phone</label>
                      <input
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        className="h-10 px-3 rounded bg-white border border-[#E7DED6] text-xs text-[#201A17]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ADDRESS DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#201A17]">Present Residential Address <span className="text-[#BA1A1A]">*</span></label>
                  <textarea
                    rows={3}
                    required
                    value={formData.residential_address}
                    onChange={(e) => handleInputChange('residential_address', e.target.value)}
                    className="p-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
                  />
                  <span className="text-[11px] text-[#82746D]">Must match electricity bill or rent agreement</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">City / Town <span className="text-[#BA1A1A]">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">State / Territory <span className="text-[#BA1A1A]">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#201A17]">Postal PIN Code <span className="text-[#BA1A1A]">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#201A17]">Local Police Station Jurisdiction Code <span className="text-[#BA1A1A]">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.police_station_code}
                    onChange={(e) => handleInputChange('police_station_code', e.target.value)}
                    className="h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17]"
                  />
                  <span className="text-[11px] text-[#82746D]">Used to dispatch electronic police clearance enquiry</span>
                </div>
              </div>
            )}

            {/* STEP 4: BOOKLET & SERVICE */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Booklet Pages */}
                  <div
                    onClick={() => handleInputChange('booklet_pages', 36)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.booklet_pages === 36
                        ? 'border-[#6F4E37] bg-[#F8ECE5]'
                        : 'border-[#E7DED6] bg-white hover:bg-[#FFF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#201A17]">36-Page Standard Booklet</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#6F4E37] text-[10px] font-bold border border-[#E7DED6]">Standard</span>
                    </div>
                    <p className="text-xs text-[#756B63]">
                      Recommended for frequent and occasional international travelers. Lightweight tamper-proof laminate.
                    </p>
                    <span className="text-xs font-bold text-[#6F4E37] block mt-2">Statutory Fee: ₹1,500</span>
                  </div>

                  <div
                    onClick={() => handleInputChange('booklet_pages', 60)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.booklet_pages === 60
                        ? 'border-[#6F4E37] bg-[#F8ECE5]'
                        : 'border-[#E7DED6] bg-white hover:bg-[#FFF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#201A17]">60-Page Jumbo Booklet</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#795336] text-[10px] font-bold border border-[#E7DED6]">Jumbo</span>
                    </div>
                    <p className="text-xs text-[#756B63]">
                      Engineered for high-volume corporate and official travelers requiring extensive visa pages.
                    </p>
                    <span className="text-xs font-bold text-[#6F4E37] block mt-2">Statutory Fee: ₹2,000</span>
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="p-4 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] space-y-3">
                  <span className="text-xs font-bold text-[#201A17] uppercase tracking-wider block">Service Processing Stream</span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer ${
                      formData.priority === 'Normal' ? 'bg-white border-[#6F4E37]' : 'border-[#E7DED6] bg-white/70'
                    }`}>
                      <input
                        type="radio"
                        name="priority"
                        checked={formData.priority === 'Normal'}
                        onChange={() => {
                          handleInputChange('priority', 'Normal');
                          handleInputChange('application_type', 'Fresh Normal (36 Pgs)');
                        }}
                        className="accent-[#6F4E37]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#201A17]">Normal Intake</p>
                        <p className="text-[10px] text-[#756B63]">Estimated 7 Business Days</p>
                      </div>
                    </label>

                    <label className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer ${
                      formData.priority === 'Tatkaal' ? 'bg-[#FECAA5]/40 border-[#6F4E37]' : 'border-[#E7DED6] bg-white/70'
                    }`}>
                      <input
                        type="radio"
                        name="priority"
                        checked={formData.priority === 'Tatkaal'}
                        onChange={() => {
                          handleInputChange('priority', 'Tatkaal');
                          handleInputChange('application_type', 'Tatkaal Renewal');
                        }}
                        className="accent-[#6F4E37]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#795336]">Tatkaal Fast-Track</p>
                        <p className="text-[10px] text-[#756B63]">1 to 3 Days (+₹1,500 Surcharge)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: DOCUMENT VAULT */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-xs text-[#756B63]">
                  All documents will be archived to encrypted local storage with tamper verification. Permitted file formats: PDF, PNG, JPG (Max 5MB).
                </p>

                {/* 3 Upload slots */}
                {[
                  { title: '1. Proof of Date of Birth', file: formData.dob_doc_name, type: 'dob' },
                  { title: '2. Proof of Identity (Photo)', file: formData.identity_doc_name, type: 'id' },
                  { title: '3. Proof of Residential Address', file: formData.address_doc_name, type: 'address' },
                ].map((slot) => (
                  <div key={slot.title} className="p-4 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-[#6F4E37] border border-[#E7DED6]">
                        <span className="material-symbols-outlined text-[22px]">attach_file</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#201A17]">{slot.title}</h4>
                        <p className="text-[11px] text-[#756B63] font-mono mt-0.5">{slot.file} • Ready for Ingestion</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#EAF5ED] text-[#2E6F40] text-[10px] font-bold">
                        Attached
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 6: REVIEW & SUBMIT */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] space-y-3">
                  <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">
                    Application Dossier Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Applicant Full Name</span>
                      <span className="font-bold text-[#201A17]">{formData.given_name} {formData.surname}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Date of Birth</span>
                      <span className="font-bold text-[#201A17]">{formData.dob}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Gender / Marital</span>
                      <span className="font-bold text-[#201A17] capitalize">{formData.gender} • {formData.marital_status}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Service Stream</span>
                      <span className="font-bold text-[#6F4E37]">{formData.priority} ({formData.booklet_pages} Pgs)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Police Station</span>
                      <span className="font-bold text-[#201A17]">{formData.police_station_code}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Documents Attached</span>
                      <span className="font-bold text-[#2E6F40]">3 of 3 Verified Ready</span>
                    </div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div className="p-4 rounded-xl bg-white border border-[#E7DED6] space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
                      className="mt-0.5 accent-[#6F4E37] w-4 h-4"
                    />
                    <div className="text-xs text-[#50453E] leading-relaxed">
                      <strong>Legal Declaration:</strong> I solemnly declare and affirm that the particulars given in this application are true and correct. I have not suppressed any material information. I acknowledge this is an academic prototype for R25 Software Engineering evaluation.
                    </div>
                  </label>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mt-4 p-3 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-xs text-[#93000A] flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] text-[#93000A]">error</span>
                <span>{submitError}</span>
              </div>
            )}

            {/* Action Footer Toolbar */}
            <div className="mt-8 pt-4 border-t border-[#E7DED6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="h-10 px-4 rounded font-medium text-xs bg-[#FEF1EA] text-[#201A17] hover:bg-[#F8ECE5] transition-colors flex items-center gap-2 border border-[#E7DED6]"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save as Draft</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="h-10 px-3.5 rounded text-xs font-medium text-[#756B63] hover:text-[#201A17]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handlePrevStep}
                  className={`h-10 px-4 rounded text-xs font-semibold bg-[#FEF1EA] flex items-center gap-1.5 border border-[#E7DED6] ${
                    currentStep === 1 ? 'opacity-40 cursor-not-allowed text-[#82746D]' : 'text-[#201A17] hover:bg-[#F8ECE5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Back</span>
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-10 px-5 rounded text-xs font-semibold bg-[#6F4E37] text-white hover:bg-[#4B3621] shadow-xs flex items-center gap-2 transition-colors"
                  >
                    <span>
                      {currentStep === 1 && 'Continue to Contact Details'}
                      {currentStep === 2 && 'Continue to Address Details'}
                      {currentStep === 3 && 'Continue to Booklet Specification'}
                      {currentStep === 4 && 'Continue to Document Vault'}
                      {currentStep === 5 && 'Continue to Final Review'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitApplication}
                    className="h-10 px-6 rounded text-xs font-semibold bg-[#2E6F40] text-white hover:bg-[#255833] shadow-md flex items-center gap-2 transition-colors"
                  >
                    {submitting ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Submit Final Application</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Guidance & Verification Sidebar (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* High Priority Info Callout */}
          <div className="bg-[#FEF1EA] rounded-xl p-6 border border-[#E7DED6] shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[24px] text-[#6F4E37] shrink-0 mt-0.5">info</span>
              <div>
                <h3 className="text-sm font-bold text-[#201A17]">Institutional Identity Standard</h3>
                <p className="text-xs text-[#756B63] mt-1 leading-relaxed">
                  Names must match supporting documents exactly without honorifics (Mr., Dr., Esq., etc.). Unaligned legal spellings will result in immediate intake rejection by consular officers.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-lg p-4 border border-[#E7DED6] space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#201A17] uppercase tracking-wider">Mandatory Verification Checks</div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37] shrink-0 mt-0.5">check_circle</span>
                <span className="text-[#201A17]">Spelling matches national birth registry records.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37] shrink-0 mt-0.5">check_circle</span>
                <span className="text-[#201A17]">Date of birth is identical across all proofs.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37] shrink-0 mt-0.5">check_circle</span>
                <span className="text-[#201A17]">Distinguishing marks are easily verifiable in person.</span>
              </div>
            </div>
          </div>

          {/* Real-time Credential Preview */}
          <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#E7DED6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#6F4E37]">badge</span>
                <h4 className="text-xs font-bold text-[#201A17]">Real-time Credential Preview</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63]">MRZ ISO/IEC 7501</span>
            </div>

            {/* Specimen Passport Badge Card */}
            <div className="bg-[#F2E6DF] rounded-xl p-4 border border-[#E7DED6] text-[#201A17] space-y-3">
              <div className="flex items-center justify-between text-[#82746D] text-[10px] uppercase font-bold tracking-widest">
                <span>Specimen Passport (P)</span>
                <span className="font-mono">TYPE: P / USA</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded bg-[#E4D8D1] overflow-hidden shrink-0 shadow-xs relative flex items-center justify-center border border-[#E7DED6]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Biometric headshot"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUlVKtWy85uaLi2nXnzbI27xuXAB4LheF1h02SRbwRLjnozzK9-TqcsNfXZrApiJSBxPbptv1nYrvzW2n7B9xOFju0z_z-SkmUPjNAefAeevoCS34VfoK2N197F-iOqJiKKK3k-TkHcvmfxwtnQRvblFYWn3FixhEyFIGjWIOD9_KiZhXEmmg-vOUMTV093XF68CD0fNB8hJCsu0kiQQVgojHNmqf6XS496QygCKWQPfpNYSx65gF1WQ"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#6F4E37]/90 text-white text-center text-[9px] py-0.5 uppercase tracking-wider font-semibold">
                    Verified
                  </div>
                </div>
                <div className="min-w-0 space-y-1">
                  <div>
                    <span className="text-[10px] text-[#82746D] uppercase block">Surname</span>
                    <span className="text-xs font-bold text-[#201A17] truncate block">{surnameUpper}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#82746D] uppercase block">Given Names</span>
                    <span className="text-xs font-bold text-[#201A17] truncate block">{givenUpper.replace(/</g, ' ')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">Nationality</span>
                      <span className="text-xs font-bold font-mono">USA</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#82746D] uppercase block">DOB</span>
                      <span className="text-xs font-bold font-mono">{formData.dob || '1994-06-14'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Readable Zone (MRZ) Specimen */}
              <div className="mt-2 pt-2 bg-white/90 p-2.5 rounded font-mono text-[9px] text-[#201A17] leading-tight tracking-wider select-none border border-[#E7DED6]">
                <p className="truncate">{mrzLine1}</p>
                <p className="truncate">{mrzLine2}</p>
              </div>
            </div>

            <p className="text-[11px] text-[#756B63] leading-relaxed">
              This preview simulates how your official biometric passport data page will be laser-engraved upon adjudication.
            </p>
          </div>

          {/* Form Readiness Metric Visual */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DED6] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#201A17]">Form Readiness</span>
              <span className="text-xs text-[#6F4E37] font-bold">{percentComplete}% Complete</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#E7DED6]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-[#6F4E37]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${percentComplete}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-[#201A17]">
                  {currentStep}/6
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#201A17]">Estimated time remaining: {7 - currentStep} mins</span>
                <span className="text-[11px] text-[#82746D]">Section {currentStep} of 6 active</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="w-full bg-[#E7DED6] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#6F4E37] h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Encryption Guarantee Box */}
          <div className="p-4 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] flex items-center gap-3 text-xs text-[#50453E]">
            <span className="material-symbols-outlined text-[20px] text-[#6F4E37]">lock</span>
            <div className="flex flex-col">
              <span className="font-bold text-[#201A17]">End-to-End Encrypted Session</span>
              <span className="text-[10px] font-mono text-[#82746D]">FIPS 140-3 Hardware Token Compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
