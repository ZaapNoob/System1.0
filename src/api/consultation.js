import API from "../config/api";

/**
 * Fetch vital signs from patient_queue
 * @param {number} queue_id - Queue ID
 * @returns {Promise} Vital signs data
 */
export const getVitalSigns = async (queue_id) => {
  try {
    const url = `${API}/consultation/get-vitals.php?queue_id=${queue_id}`;
    console.log("Fetching vitals from:", url);
    
    const response = await fetch(url);
    const text = await response.text();
    
    console.log("Response status:", response.status);
    console.log("Response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON. Response:", text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}: Failed to fetch vital signs`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching vital signs:", error);
    throw error;
  }
};

/**
 * Fetch latest consultation history
 * @param {number} patient_id - Patient ID
 * @returns {Promise} Consultation history data
 */
export const getLatestConsultations = async (patient_id) => {
  try {
    const url = `${API}/consultation/get-latest-consultation.php?patient_id=${patient_id}`;
    console.log('🔍 getLatestConsultations - Fetching with patient_id:', patient_id, 'URL:', url);
    
    const response = await fetch(url);

    const text = await response.text();
    console.log('🔍 getLatestConsultations - Response status:', response.status);
    console.log('🔍 getLatestConsultations - Response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('❌ JSON parse error:', text.substring(0, 200));
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      console.error('❌ Response not OK. Status:', response.status, 'Message:', data.message);
      throw new Error(data.message || "Failed to fetch consultation history");
    }

    if (!data.success) {
      console.error('❌ API returned success: false. Message:', data.message);
      throw new Error(data.message || "API returned error");
    }

    console.log('✅ Successfully fetched', data.data?.length || 0, 'consultations');
    return data.data;
  } catch (error) {
    console.error("Error fetching consultation history:", error);
    throw error;
  }
};

/**
 * Save consultation data
 * @param {object} consultationData - Consultation form data
 * @returns {Promise} API response
 */
export const saveConsultation = async (consultationData) => {
  try {
    const response = await fetch(`${API}/consultation/save-consultation.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consultationData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to save consultation");
    }

    return data;
  } catch (error) {
    console.error("Error saving consultation:", error);
    throw error;
  }
};
/**
 * Get latest consultation ID for a patient
 * @param {number} patient_id - Patient ID
 * @returns {Promise} Consultation ID or null if none exists
 */
export const getLatestConsultationId = async (patient_id) => {
  try {
    const url = `${API}/consultation/get-latest-consultation.php?patient_id=${patient_id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.success && data.data && data.data.length > 0) {
      // Return the ID of the first (latest) consultation
      return data.data[0].id;
    }
    // Return null if no consultation found
    return null;
  } catch (error) {
    console.error("Error fetching consultation ID:", error);
    return null; // Return null on error instead of throwing
  }
};


/**
 * Fetch encoder queue (DONE patients for doctor)
 * @param {number} doctor_id
 * @param {string} queue_date (optional)
 * @returns {Promise}
 */
export const getEncoderQueue = async (doctor_id, queue_date = null) => {
  try {
    let url = `${API}/encoder/consultation/api/get-encoder-queue.php?doctor_id=${doctor_id}`;

    if (queue_date) {
      url += `&queue_date=${queue_date}`;
    }

    console.log("🔍 Fetching Encoder Queue:", url);

    const response = await fetch(url);
    const text = await response.text();

    console.log("Encoder Response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON response");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch encoder queue");
    }

    return data.data;

  } catch (error) {
    console.error("❌ Encoder Queue Error:", error);
    throw error;
  }
};