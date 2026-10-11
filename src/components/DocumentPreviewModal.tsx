import React, { useState } from 'react';
import { ApplicationDocument, User } from '../types';
import { api } from '../services/api';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ApplicationDocument | null;
  currentUser: User;
  onUpdate: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  currentUser,
  onUpdate,
}) => {
  const [remarks, setRemarks] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !doc) return null;

  const isOfficer = currentUser.role === 'officer';

  const handleVerify = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.verifyDocument(doc.id, remarks || 'Document verified by consular officer.');
      onUpdate();
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!remarks.trim()) {
      setErrorMsg('Please specify remarks explaining why a document correction or re-upload is required.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.requestDocumentCorrection(doc.id, remarks);
      onUpdate();
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E7DED6] overflow-hidden animate-in fade-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#F8ECE5] border-b border-[#E7DED6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#6F4E37] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#201A17]">{doc.document_type}</h3>
              <p className="text-[11px] text-[#756B63] font-mono">{doc.original_filename} • {doc.file_size_kb} KB</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#756B63] hover:text-[#201A17]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Document Inspection Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F5F2]">
          {/* Simulated Document Sheet Preview */}
          <div className="w-full bg-white rounded-lg p-6 border border-[#E7DED6] shadow-sm relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-8xl font-black text-[#6F4E37] transform -rotate-45">CONSULAR VERIFIED</span>
            </div>

            <div className="flex items-start justify-between pb-4 border-b border-[#E7DED6]">
              <div>
                <span className="text-[10px] font-bold text-[#6F4E37] uppercase tracking-widest block">
                  Official Civil Record Collateral
                </span>
                <h4 className="font-semibold text-base text-[#201A17] mt-0.5">{doc.document_type}</h4>
                <p className="text-xs text-[#756B63]">Archive Registry Hash: 8F09-EA11-99C1-DFT</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                  doc.verification_status === 'Verified'
                    ? 'bg-[#EAF5ED] text-[#2E6F40]'
                    : doc.verification_status === 'Correction Required'
                    ? 'bg-[#FFDAD6] text-[#93000A]'
                    : 'bg-[#FEF8E7] text-[#B37D14]'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {doc.verification_status === 'Verified' ? 'check_circle' : doc.verification_status === 'Correction Required' ? 'error' : 'hourglass_top'}
                  </span>
                  {doc.verification_status}
                </span>
                <p className="text-[10px] text-[#82746D] mt-1">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Simulated Document Content Display */}
            <div className="py-6 space-y-4 text-xs text-[#201A17]">
              <div className="p-3 bg-[#FFF8F5] rounded border border-[#E7DED6]">
                <span className="font-semibold text-[#6F4E37] uppercase text-[10px] tracking-wider block mb-1">
                  Automated OCR Extraction &amp; Aadhaar/DigiLocker Match
                </span>
                <p className="leading-relaxed text-[#50453E]">
                  Record Type: <strong>{doc.document_type}</strong> | Legal Name Matched: <strong>Eleanor Jane Vance</strong> | Digital Seal: <strong>Authentic Municipal E-Certificate</strong> | Revocation Check: <strong>Pass (No Blacklist)</strong>
                </p>
              </div>

              {doc.officer_remarks && (
                <div className="p-3 bg-[#FEF8E7] rounded border border-[#E7DED6]">
                  <span className="font-semibold text-[#B37D14] uppercase text-[10px] tracking-wider block mb-1">
                    Officer Review Remarks
                  </span>
                  <p className="text-[#50453E]">{doc.officer_remarks}</p>
                </div>
              )}
            </div>

            {/* Footer stamp */}
            <div className="pt-4 border-t border-[#E7DED6] flex items-center justify-between text-[11px] text-[#82746D]">
              <span>Storage Token: {doc.stored_filename}</span>
              <span className="font-mono">FIPS-140-3 Cryptographic Integrity Check OK</span>
            </div>
          </div>

          {/* Officer Adjudication Controls inside Drawer */}
          {isOfficer && (
            <div className="p-4 bg-white rounded-lg border border-[#E7DED6] space-y-3">
              <span className="text-xs font-semibold text-[#201A17] block uppercase tracking-wider">
                Officer Adjudication Decision
              </span>
              <textarea
                rows={2}
                placeholder="Enter remarks for verification or correction requirements..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
              />

              {errorMsg && (
                <div className="p-2.5 rounded bg-[#FFDAD6] border border-[#BA1A1A]/30 text-xs text-[#93000A] flex items-center gap-1.5 animate-in fade-in">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleVerify}
                  className="flex-1 py-2 rounded bg-[#2E6F40] text-white hover:bg-[#255833] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Mark Document as Verified</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRequestCorrection}
                  className="flex-1 py-2 rounded bg-[#BA1A1A] text-white hover:bg-[#961515] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>Request Document Correction</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-[#E7DED6] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded bg-[#F8ECE5] text-[#201A17] hover:bg-[#F2E6DF]"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
