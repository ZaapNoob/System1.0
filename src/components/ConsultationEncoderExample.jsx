/**
 * Example: How to integrate encoder tracking in ConsultationHistoryView
 * 
 * STEP 1: Import the hook
 */
import { useSaveConsultationWithEncoder } from "../hooks/useSaveConsultationWithEncoder";

/**
 * STEP 2: In your component, use the hook
 * Replace the existing consultation save logic with this:
 */
const YourConsultationComponent = ({ patient, user }) => {
  const { saveConsultation, loading, error, success } = useSaveConsultationWithEncoder(patient.id);

  // When encoder saves consultation
  const handleSaveConsultation = async (consultationFormData) => {
    // Pass encoder ID (current user's ID) as second parameter
    const result = await saveConsultation(consultationFormData, user?.id);
    
    if (result) {
      // Successfully saved with encoder tracking
      console.log("Saved consultation ID:", result.id);
      // Refresh or update UI as needed
    }
  };

  return (
    <div>
      {/* Your consultation form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = {
          consultation_id: consultationId,
          chief_complaint: chiefComplaint,
          diagnosis: diagnosis,
          treatment: treatment,
          systolic_bp: systolicBp,
          diastolic_bp: diastolicBp,
          temperature: temperature,
          // ... other fields
        };
        handleSaveConsultation(formData);
      }}>
        {/* Form fields */}
      </form>

      {loading && <p>Saving consultation...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {success && <p style={{color: 'green'}}>✅ Consultation saved by encoder!</p>}
    </div>
  );
};

/**
 * STEP 3: Display encoded_by information in consultation table
 * Add this column to your consultation display:
 */
export const ConsultationTableRow = ({ consultation, encoderUsers }) => {
  const encoderName = consultation.encoded_by 
    ? encoderUsers?.find(u => u.id === consultation.encoded_by)?.name 
    : "—";

  return (
    <tr>
      {/* Other columns */}
      <td className="diagnosis-col">{consultation.diagnosis}</td>
      <td className="treatment-col">{consultation.treatment}</td>
      
      {/* NEW: Encoded By Column */}
      <td className="encoded-by-col">
        <span className="encoder-badge">{encoderName}</span>
      </td>
      
      {/* NEW: Encoded At Column (optional) */}
      <td className="encoded-at-col">
        {consultation.encoded_at 
          ? new Date(consultation.encoded_at).toLocaleDateString() 
          : "—"}
      </td>
    </tr>
  );
};

/**
 * CSS for encoded columns
 */
const css = `
.encoded-by-col {
  font-size: 12px;
  color: #666;
}

.encoder-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid #90caf9;
}

.encoded-at-col {
  font-size: 12px;
  color: #999;
}
`;
