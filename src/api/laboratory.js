import API from "../config/api";

/**
 * Search patients by name or ID
 * @param {string} query - Search query
 * @returns {Promise} Array of patients data
 */
export const searchPatientsForLab = async (query) => {
  try {
    const response = await fetch(
      `${API}/patients/search-patients-GLobal.php?barangay_id=0&search=${encodeURIComponent(query)}`
    );
    const text = await response.text();
    
    // Log raw response for debugging
    console.log("Raw API response:", text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON. Raw response:", text);
      console.error("Response status:", response.status);
      console.error("Response headers:", response.headers);
      
      // Provide more helpful error message
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): The server returned an invalid response. Check browser console for details.`);
      }
      throw new Error(`Invalid JSON response from server. Check browser console for the raw response.`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to search patients`);
    }

    return data.patients || [];
  } catch (error) {
    console.error("Error searching patients:", error);
    throw error;
  }
};

/**
 * Get laboratory request history for a patient
 * @param {number} patientId - Patient ID
 * @returns {Promise} Lab request history
 */
export const getLabHistory = async (patientId) => {
  try {
    const response = await fetch(
      `${API}/laboratory/laboratory-history.php?patient_id=${patientId}`
    );
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`Invalid JSON response`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to fetch lab history`);
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching lab history:", error);
    throw error;
  }
};

/**
 * Get laboratory request details for printing
 * @param {number} labRequestId - Lab Request ID
 * @returns {Promise} Lab request details
 */
export const getLabRequestDetails = async (labRequestId) => {
  try {
    const response = await fetch(
      `${API}/laboratory/get-certificate-laboratory.php?id=${labRequestId}`
    );
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`Invalid JSON response`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to fetch lab request details`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching lab request details:", error);
    throw error;
  }
};

/**
 * Save laboratory request
 * @param {Object} requestData - Lab request data including patient_id, diagnosis, xray_findings, utz_findings
 * @param {Array} selectedTests - Selected tests array with category, test_name, other_value
 * @param {number} doctorId - Doctor ID
 * @returns {Promise} Saved request data
 */
export const saveLabRequest = async (requestData, selectedTests, doctorId) => {
  try {
    const payload = {
      request_no: requestData.request_no,
      patient_id: parseInt(requestData.patient_id),
      doctor_id: doctorId,
      diagnosis: requestData.diagnosis,
      xray_findings: requestData.xray_findings || null,
      utz_findings: requestData.utz_findings || null,
      ct_scan_findings: requestData.ct_scan_findings || null,
      other_findings: requestData.other_findings || null,
      tests: selectedTests
    };

    const response = await fetch(
      `${API}/laboratory/save-certificate-laboratory.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`Invalid JSON response`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to save lab request`);
    }

    return data.data;
  } catch (error) {
    console.error("Error saving lab request:", error);
    throw error;
  }
};

/**
 * Update laboratory request
 * @param {Object} requestData - Lab request data including id, diagnosis, xray_findings, utz_findings
 * @param {Array} selectedTests - Selected tests array with category, test_name, other_value
 * @returns {Promise} Updated request data
 */
export const updateLabRequest = async (requestData, selectedTests) => {
  try {
    const payload = {
      id: requestData.id,
      diagnosis: requestData.diagnosis,
      xray_findings: requestData.xray_findings || null,
      utz_findings: requestData.utz_findings || null,
      ct_scan_findings: requestData.ct_scan_findings || null,
      other_findings: requestData.other_findings || null,
      tests: selectedTests
    };

    const response = await fetch(
      `${API}/laboratory/update-certificate-laboratory.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`Invalid JSON response`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to update lab request`);
    }

    return data.data;
  } catch (error) {
    console.error("Error updating lab request:", error);
    throw error;
  }
};




/**
 * Delete a laboratory request
 * @param {number} requestId - Request ID to delete
 * @returns {Promise} Deletion response
 */
export const deleteLabRequest = async (requestId) => {
  try {
    const response = await fetch(
      `${API}/laboratory/delete-certificate.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ request_id: requestId })
      }
    );

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`Invalid JSON response`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Failed to delete lab request`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting lab request:", error);
    throw error;
  }
};