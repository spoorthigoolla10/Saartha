import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, ApplicationDocument, User } from '../types';

interface DocumentVaultPageProps {
  currentUser: User;
  onPreviewDocument: (doc: ApplicationDocument) => void;
}

export const DocumentVaultPage: React.FC<DocumentVaultPageProps> = ({
  currentUser,
  onPreviewDocument,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState<ApplicationDocument['document_type']>('Proof of Residential Address');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  const loadData = async () => {
    const apps = await api.getApplications(currentUser.role === 'applicant' ? currentUser.id : undefined);
    setApplications(apps);
    if (apps.length > 0 && selectedAppId === null) {
      setSelectedAppId(apps[0].id);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = api.onDataChange(() => {
      loadData();
    });
    return unsub;
  }, [currentUser]);

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleUploadSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;
    const name = uploadFileName.trim() || `${uploadType.replace(/ /g, '_')}_Updated.pdf`;
    await api.uploadDocument(activeApp.id, uploadType, name, Math.floor(800 + Math.random() * 1500));
    setUploadFileName('');
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 3000);
    loadData();
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Toast Alert */}
      {uploadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">task_alt</span>
          <span>Sample credential ingested into encrypted archival vault.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7DED6]">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Cryptographic Archive • Sovereign Storage
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#201A17] tracking-tight">Citizen Document Vault</h1>
          <p className="text-xs text-[#756B63] mt-0.5">
            Manage legal identification, municipal birth records, and residential proofs associated with your filings.
          </p>
        </div>

        {applications.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#756B63] font-semibold">Active Filing:</span>
            <select
              value={selectedAppId || ''}
              onChange={(e) => setSelectedAppId(Number(e.target.value))}
              className="px-3 py-1.5 rounded bg-white border border-[#E7DED6] text-xs font-bold text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
            >
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.application_number} ({a.applicant_name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid: 2 Cols Vault Documents & 1 Col Ingestion Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Documents Table / Grid (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E7DED6] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FEF1EA] border-b border-[#E7DED6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">folder_special</span>
              <span className="text-xs font-bold text-[#201A17]">
                Archived Documents for {activeApp?.application_number || '#PAS-2025-08492'}
              </span>
            </div>
            <span className="text-[11px] text-[#756B63]">
              {activeApp?.documents?.length || 0} Records On File
            </span>
          </div>

          <div className="p-4 divide-y divide-[#E7DED6]/60">
            {(!activeApp?.documents || activeApp.documents.length === 0) ? (
              <div className="p-8 text-center text-[#756B63] text-xs">
                No documents uploaded yet for this application. Use the intake station to attach credentials.
              </div>
            ) : (
              activeApp.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex items-center justify-center text-[#6F4E37] shrink-0">
                      <span className="material-symbols-outlined text-[22px]">
                        {doc.original_filename.endsWith('.pdf') ? 'picture_as_pdf' : 'badge'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#201A17]">{doc.document_type}</h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          doc.verification_status === 'Verified'
                            ? 'bg-[#EAF5ED] text-[#2E6F40]'
                            : doc.verification_status === 'Correction Required'
                            ? 'bg-[#FFDAD6] text-[#93000A]'
                            : 'bg-[#FEF8E7] text-[#B37D14]'
                        }`}>
                          {doc.verification_status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#756B63] mt-0.5">
                        {doc.original_filename} • {doc.file_size_kb} KB • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                      {doc.officer_remarks && (
                        <p className="text-[11px] text-[#B37D14] mt-1 bg-[#FEF8E7] p-1.5 rounded border border-[#E7DED6]/60">
                          <strong>Remark:</strong> {doc.officer_remarks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onPreviewDocument(doc)}
                      className="px-3 py-1.5 rounded bg-[#FEF1EA] hover:bg-[#F8ECE5] text-[#6F4E37] text-xs font-semibold border border-[#E7DED6] flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upload & Re-upload Station (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E7DED6] shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E7DED6]">
            <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">upload_file</span>
            <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">
              Upload / Replace Document
            </h3>
          </div>

          <p className="text-xs text-[#756B63] leading-relaxed">
            Attach fresh identity collateral or replace records when a consular officer has requested correction.
          </p>

          <form onSubmit={handleUploadSample} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#201A17] mb-1">Category</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs font-semibold text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
              >
                <option value="Proof of Date of Birth">Proof of Date of Birth</option>
                <option value="Proof of Identity">Proof of Identity (Photo ID)</option>
                <option value="Proof of Residential Address">Proof of Residential Address</option>
                <option value="Annexure F">Annexure F (Urgency Verification)</option>
                <option value="Minor Parent Consent (Annexure D)">Minor Consent (Annexure D)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#201A17] mb-1">File Name / Label</label>
              <input
                type="text"
                placeholder="e.g. Utility_Bill_Corrected_HighRes.pdf"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] text-[11px] text-[#50453E] space-y-1">
              <span className="font-bold text-[#201A17] block">Security Verification Constraints:</span>
              <p>• Max permitted size: 5MB</p>
              <p>• Executable files (.exe, .bat, .sh) strictly prohibited</p>
              <p>• SHA-256 integrity hash computed automatically</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Upload to Sovereign Vault</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
