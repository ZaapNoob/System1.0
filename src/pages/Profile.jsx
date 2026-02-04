// Import useState hook from React to manage local component state
import { useState, useEffect } from "react";



// Import CSS styles specific to the Profile page
import "./Profile.css";

// Import API base URL configuration
import API_BASE_URL from "../config/api";

// Export Profile component as default
export default function Profile({ user, onNavigateToDashboard, onAllowedPagesUpdate }) {

  
  
  
  // =============================
  // NAVIGATION
  // =============================
  const handleBackToDashboard = () => {
    onNavigateToDashboard();
  };






  // =============================
  // EDIT MODE
  // =============================
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };









  // =============================
  // PROFILE DATA
  // =============================
  const [profileData, setProfileData] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };







  // =============================
  // SETTINGS DROPDOWN
  // =============================
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleSettingsClick = () => {
    setShowSettingsDropdown(prev => !prev);
  };

  const handleChangePassword = () => {
    console.log("Change Password clicked");
    setShowSettingsDropdown(false);
  };

  const handleAddAccount = () => {
    setShowSettingsDropdown(false);
    openAddAccountModal();
  };

  const handleLogoutAllDevices = () => {
    console.log("Logout from all devices clicked");
    setShowSettingsDropdown(false);
  };







  // =============================
  // ADD ACCOUNT MODAL
  // =============================
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accountModalStep, setAccountModalStep] = useState(2);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [createdAccountInfo, setCreatedAccountInfo] = useState({});

  const [accountMessage, setAccountMessage] = useState({
    type: "",
    text: "",
  });

  const handleCloseAddAccountModal = () => {
    setShowAddAccountModal(false);
    setAccountModalStep(2);
    setNewAccountData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountMessage({ type: "", text: "" });
    setSelectedAccountRole("admin");
    setCustomRoles({ role3: "", role4: "", role5: "" });
  };







  // =============================
  // ACCOUNT FORM DATA
  // =============================
  const [newAccountData, setNewAccountData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleNewAccountInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (accountMessage.type === "error") {
      setAccountMessage({ type: "", text: "" });
    }
  };









// =============================
// ROLE SELECTION (STEP 2)
// =============================
const [selectedAccountRole, setSelectedAccountRole] = useState("admin");

const [customRoles, setCustomRoles] = useState({
  role3: "",
  role4: "",
  role5: "",
});

const [availableRoles, setAvailableRoles] = useState([]);
const [showAddRoleInput, setShowAddRoleInput] = useState(false);
const [newRoleName, setNewRoleName] = useState("");

// Fetch all roles from database
const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/get-roles.php`, {
      headers: { Authorization: token },
    });

    const data = await response.json();

    if (response.ok) {
      setAvailableRoles(data.roles || []);
    } else {
      console.error("Failed to fetch roles:", data.error);
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};

// Modal helpers

const openAddAccountModal = () => {
  setShowAddAccountModal(true);
  fetchRoles();
};

// Move to Step 3 (Review)
const handleMoveToStep3 = (e) => {
  e.preventDefault();
  const role = availableRoles.find(r => r.code === selectedAccountRole);
  setSelectedRoleName(role?.name || selectedAccountRole);
  setAccountModalStep(3);
};

const handleCustomRoleChange = ({ target: { name, value } }) => {
  setCustomRoles(prev => ({ ...prev, [name]: value }));
};

// Handle adding a new custom role
const handleAddNewRole = async () => {
  const roleName = newRoleName.trim();

  if (!roleName) {
    setAccountMessage({ type: "error", text: "Please enter a role name" });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("roleName", roleName);

    const response = await fetch(`${API_BASE_URL}/auth/add-role.php`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setAccountMessage({
        type: "error",
        text: data.error || "Failed to create role",
      });
      return;
    }

    setAccountMessage({
      type: "success",
      text: `Role "${roleName}" created successfully!`,
    });

    setNewRoleName("");
    setShowAddRoleInput(false);
    fetchRoles();
    setSelectedAccountRole(data.role.code);

    setTimeout(() => {
      setAccountMessage({ type: "", text: "" });
    }, 2000);

  } catch (error) {
    console.error("Role creation error:", error);
    setAccountMessage({
      type: "error",
      text: "Network error. Please try again.",
    });
  }
};












  // =============================
  // PAGE ACCESS MANAGEMENT
  // =============================
  const [selectedPages, setSelectedPages] = useState([]);
  const [pageAccessMessage, setPageAccessMessage] = useState({ type: "", text: "" });
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  // Load user's current page access on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserPages();
    }
  }, [user?.id]);

  const loadUserPages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-panels-get.php?user_id=${user.id}`);
      const pages = await response.json();
      setSelectedPages(pages || []);
    } catch (error) {
      console.error("Error loading user pages:", error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handlePageToggle = (pageCode) => {
    setSelectedPages(prev => {
      if (prev.includes(pageCode)) {
        return prev.filter(p => p !== pageCode);
      } else {
        return [...prev, pageCode];
      }
    });
  };

  const handleSavePages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-panels-save.php?user_id=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: selectedPages })
      });

      const data = await response.json();

      if (data.success) {
        const message = selectedPages.length === 0 
          ? "Page access cleared successfully!" 
          : "Pages access updated successfully!";
        setPageAccessMessage({ type: "success", text: message });
        
        // Update App.jsx with the new allowed pages
        if (onAllowedPagesUpdate) {
          onAllowedPagesUpdate(selectedPages);
        }
        
        setTimeout(() => {
          setPageAccessMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setPageAccessMessage({ type: "error", text: data.error || "Failed to save pages" });
      }
    } catch (error) {
      console.error("Error saving pages:", error);
      setPageAccessMessage({ type: "error", text: "Network error. Please try again." });
    }
  };








// =============================
// WIDGET ACCESS MANAGEMENT
// =============================
const [selectedWidgets, setSelectedWidgets] = useState([]);
const [widgetAccessMessage, setWidgetAccessMessage] = useState({ type: "", text: "" });
const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);
useEffect(() => {
  if (user?.id) {
    loadUserWidgets();
  }
}, [user?.id]);

const loadUserWidgets = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/widgets/get.php?user_id=${user.id}`
    );
    
    if (!response.ok) {
      setSelectedWidgets([]);
      return;
    }
    
    const text = await response.text();
    if (!text) {
      setSelectedWidgets([]);
      return;
    }
    
    const widgets = JSON.parse(text);
    
    // If response has error property, set empty
    if (widgets.error) {
      setSelectedWidgets([]);
      return;
    }
    
    setSelectedWidgets(Array.isArray(widgets) ? widgets : []);
  } catch (error) {
    console.error("Error loading user widgets:", error);
    setSelectedWidgets([]);
  } finally {
    setIsLoadingWidgets(false);
  }
};
const handleWidgetToggle = (widgetCode) => {
  setSelectedWidgets(prev => {
    if (prev.includes(widgetCode)) {
      return prev.filter(w => w !== widgetCode);
    } else {
      return [...prev, widgetCode];
    }
  });
};
const handleSaveWidgets = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/widgets/save.php?user_id=${user.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets: selectedWidgets })
      }
    );

    const data = await response.json();

    if (data.success) {
      setWidgetAccessMessage({ type: "success", text: "Widgets access updated successfully!" });
      setTimeout(() => setWidgetAccessMessage({ type: "", text: "" }), 2000);
    } else {
      setWidgetAccessMessage({ type: "error", text: data.error || "Failed to save widgets" });
    }
  } catch (error) {
    console.error("Error saving widgets:", error);
    setWidgetAccessMessage({ type: "error", text: "Network error. Please try again." });
  }
};











  // =============================
// =============================
// ACCOUNT SUBMISSION
// =============================
const handleAddAccountSubmit = async (e) => {
  e.preventDefault();

  setIsCreatingAccount(true);
  setAccountMessage({ type: "", text: "" });

  if (newAccountData.password !== newAccountData.confirmPassword) {
    setAccountMessage({ type: "error", text: "Passwords do not match" });
    setIsCreatingAccount(false);
    return;
  }

  if (!newAccountData.name || !newAccountData.email || !newAccountData.password) {
    setAccountMessage({
      type: "error",
      text: "Please fill in all required fields",
    });
    setIsCreatingAccount(false);
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    ["name", "email", "password"].forEach(key =>
      formData.append(key, newAccountData[key])
    );
    formData.append("role", selectedAccountRole);

    console.log("Submitting account creation with:", {
      name: newAccountData.name,
      email: newAccountData.email,
      role: selectedAccountRole,
      token: token ? "present" : "missing",
    });

    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      setAccountMessage({
        type: "error",
        text: data.error || data.message || "Failed to create account",
      });
      return;
    }

    setCreatedAccountInfo({
      username: newAccountData.email,
      password: newAccountData.password,
      roleName: selectedRoleName,
    });

    setAccountModalStep(4);

  } catch (error) {
    console.error("Account creation error:", error);
    setAccountMessage({
      type: "error",
      text: "Network error. Please try again.",
    });
  } finally {
    setIsCreatingAccount(false);
  }
};









  // -----------------------------
  // UI RENDER
  // -----------------------------

  return (
    // Main container for entire profile page
    <div className="profile-container">

      {/* ================= HEADER ================= */}
      <header className="profile-header">

        <div className="header-content">

          {/* Back navigation button */}
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>





          {/* Page title */}
          <h1>User Profile</h1>

          {/* Action buttons on the right side */}
          <div className="header-actions">

            {/* If NOT editing */}
            {!isEditing ? (
              <>
                {/* Enable edit mode */}
                <button className="edit-btn" onClick={handleEditClick}>
                  Edit Profile
                </button>

                {/* Account settings entry point */}
                <button className="settings-btn" onClick={handleSettingsClick}>
                  ⚙️ Account Settings
                </button>






                {/* Account settings dropdown menu */}
                {showSettingsDropdown && (
                  <div className="settings-dropdown">
                    <button
                      className="dropdown-item"
                      onClick={handleChangePassword}
                    >
                      🔐 Change Password
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleAddAccount}
                    >
                      ➕ Add Account
                    </button>
                    <button
                      className="dropdown-item logout-all"
                      onClick={handleLogoutAllDevices}
                    >
                      🚪 Logout from All Devices
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* If editing mode is active */
              <div className="edit-actions">

                {/* Save profile changes */}
                <button className="save-btn" onClick={handleSaveEdit}>
                  Save Changes
                </button>

                {/* Cancel editing */}
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            )}



          </div>
        </div>
      </header>






      {/* ================= MAIN CONTENT ================= */}
      <main className="profile-main">

        {/* ========== TOP CARDS SECTION ========== */}
        <div className="profile-cards-container">
          <div className="profile-card card-1">
            <h3 className="card-title">📄 Pages Access</h3>
            <p className="card-description">Please select page this user want to access</p>
            
            {pageAccessMessage.text && (
              <div className={`message-alert message-${pageAccessMessage.type}`} style={{ marginBottom: '1rem' }}>
                {pageAccessMessage.type === 'error' && '❌ '}
                {pageAccessMessage.type === 'success' && '✅ '}
                {pageAccessMessage.text}
              </div>
            )}
            
            <div className="card-options">
              <div className="option-group">
                <input 
                  type="checkbox" 
                  id="page-patient" 
                  checked={selectedPages.includes('patient')}
                  onChange={() => handlePageToggle('patient')}
                />
                <label htmlFor="page-patient">Patient</label>
              </div>
              <div className="option-group">
                <input 
                  type="checkbox" 
                  id="page-queuegen" 
                  checked={selectedPages.includes('queuegen')}
                  onChange={() => handlePageToggle('queuegen')}
                />
                <label htmlFor="page-queuegen">Queue Gen</label>
              </div>
            </div>
            
            <button className="card-select-btn" onClick={handleSavePages}>
              {isLoadingPages ? 'Loading...' : 'Save Access'}
            </button>
          </div>
       <div className="profile-card card-2">
  <h3 className="card-title">🎨 Widgets Access</h3>
  <p className="card-description">Please select widgets this user want to access</p>

  {widgetAccessMessage.text && (
    <div className={`message-alert message-${widgetAccessMessage.type}`}>
      {widgetAccessMessage.type === "success" && "✅ "}
      {widgetAccessMessage.type === "error" && "❌ "}
      {widgetAccessMessage.text}
    </div>
  )}

  <div className="card-options">
    <div className="option-group">
      <input
        type="checkbox"
        id="widget-doctor"
        checked={selectedWidgets.includes("doctor")}
        onChange={() => handleWidgetToggle("doctor")}
      />
      <label htmlFor="widget-doctor">👨‍⚕️ Doctor Panel</label>
    </div>

    <div className="option-group">
      <input
        type="checkbox"
        id="widget-triage"
        checked={selectedWidgets.includes("triage")}
        onChange={() => handleWidgetToggle("triage")}
      />
      <label htmlFor="widget-triage">🚨 Triage Panel</label>
    </div>
    
  {/* TV Widget */}
  <div className="option-group">
    <input
      type="checkbox"
      id="widget-tv"
      checked={selectedWidgets.includes("tv")}
      onChange={() => handleWidgetToggle("tv")}
    />
    <label htmlFor="widget-tv">📺 TV Display Widget</label>
  </div>
  </div>

  <button className="card-select-btn" onClick={handleSaveWidgets}>
    {isLoadingWidgets ? "Loading..." : "Save Widgets"}
  </button>
</div>

        </div>

        {/* ========== IDENTITY SECTION ========== */}
        <section className="profile-section identity-section">

          {/* Section title */}
          <h2>🔹 Identity</h2>

          <div className="section-content">

            {/* Avatar container */}
            <div className="avatar-container">

              {/* Avatar circle */}
              <div className="avatar">

                {/* Displays first letter of user name */}
                <span className="avatar-initials">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Avatar change button (edit mode only) */}
              {isEditing && (
                <button className="change-avatar-btn">
                  Change Avatar
                </button>
              )}
            </div>

            {/* Full Name (read-only) */}
            <div className="profile-field">
              <label>Full Name</label>
              <p className="field-value">{user?.name || "N/A"}</p>
            </div>

            {/* Email address (read-only) */}
            <div className="profile-field">
              <label>Email</label>
              <p className="field-value">{user?.email || "N/A"}</p>
            </div>

            {/* User UUID (for dev/admin reference) */}
            <div className="profile-field">
              <label>
                User ID / UUID <span className="dev-badge">(Dev/Admin)</span>
              </label>

              <div className="uuid-container">

                {/* UUID value */}
                <code className="field-value uuid-value">
                  {user?.uuid || "N/A"}
                </code>

                {/* Copy UUID to clipboard */}
                <button
                  className="copy-btn"
                  onClick={() =>
                    navigator.clipboard.writeText(user?.uuid)
                  }
                >
                  Copy
                </button>
              </div>
            </div>

          </div>
        </section>



        {/* ========== CONTACT INFO SECTION ========== */}
        <section className="profile-section contact-section">
          <h2>🔹 Contact Info</h2>

          <div className="section-content">

            {/* Phone number field */}
            <div className="profile-field">
              <label>Phone Number</label>

              {/* Editable input if editing */}
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="field-input"
                />
              ) : (
                /* Read-only view */
                <p className="field-value">
                  {profileData.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Address field */}
            <div className="profile-field">
              <label>Address</label>

              {/* Editable textarea if editing */}
              {isEditing ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="field-input address-input"
                />
              ) : (
                /* Read-only view */
                <p className="field-value">
                  {profileData.address || "Not provided"}
                </p>
              )}
            </div>

            {/* Email displayed again as read-only */}
            <div className="profile-field">
              <label>Email (Read-Only)</label>
              <p className="field-value readonly">
                {user?.email || "N/A"}
              </p>
            </div>

          </div>
        </section>

        {/* ========== ACCOUNT STATUS SECTION ========== */}
        <section className="profile-section account-section">
          <h2>🔹 Account Status</h2>

          <div className="section-content">

            {/* User role */}
            <div className="profile-field">
              <label>Role</label>
              <p className="field-value">
                <span className={`role-badge role-${user?.role?.toLowerCase()}`}>
                  {user?.role || "member"}
                </span>
              </p>
            </div>

            {/* Account status */}
            <div className="profile-field">
              <label>Account Status</label>
              <p className="field-value">
                <span className={`status-badge status-${user?.status?.toLowerCase()}`}>
                  {user?.status || "active"}
                </span>
              </p>
            </div>

            {/* Account creation date */}
            <div className="profile-field">
              <label>Member Since</label>
              <p className="field-value">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

          </div>
        </section>

      </main>



      {/* ================= ADD ACCOUNT MODAL ================= */}
      {showAddAccountModal && (
        <div className="modal-overlay" onClick={handleCloseAddAccountModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  





            {/* ===== STEP 2: SELECT ACCOUNT ROLE ===== */}
            {accountModalStep === 2 && (
              <form className="modal-form" onSubmit={handleAddAccountSubmit}>
                <p className="step-description">Select which account type to create:</p>

                {/* Error message */}
                {accountMessage.text && (
                  <div className={`message-alert message-${accountMessage.type}`}>
                    {accountMessage.type === 'error' && '❌ '}
                    {accountMessage.type === 'success' && '✅ '}
                    {accountMessage.text}
                  </div>
                )}

                {/* Role Selection */}
                <div className="role-selection">
                  {/* Display all roles from database */}
                  {availableRoles.map((role, index) => (
                    <div className="role-option" key={role.id}>
                      <input
                        type="radio"
                        id={`role-${role.code}`}
                        name="accountRole"
                        value={role.code}
                        checked={selectedAccountRole === role.code}
                        onChange={(e) => setSelectedAccountRole(e.target.value)}
                      />
                      <label htmlFor={`role-${role.code}`}>{role.name}</label>
                    </div>
                  ))}

                  {/* Add Custom Role Option */}
                  <div className="role-option">
                    <input
                      type="radio"
                      id="role-add-new"
                      name="accountRole"
                      value="add-new"
                      checked={selectedAccountRole === 'add-new'}
                      onChange={(e) => {
                        setSelectedAccountRole(e.target.value);
                        setShowAddRoleInput(true);
                      }}
                    />
                    <label htmlFor="role-add-new">➕ Add Custom Role</label>
                  </div>

                  {/* Add New Role Form */}
                  {showAddRoleInput && selectedAccountRole === 'add-new' && (
                    <div className="add-role-form">
                      <div className="form-group">
                        <input
                          type="text"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="Enter new role name (e.g., Nurse)"
                          className="form-input"
                        />
                      </div>
                      <div className="add-role-actions">
                        <button
                          type="button"
                          className="done-btn"
                          onClick={handleAddNewRole}
                        >
                          Create Role
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => {
                            setShowAddRoleInput(false);
                            setNewRoleName("");
                            setSelectedAccountRole("admin");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseAddAccountModal}
                    disabled={isCreatingAccount}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="btn-submit"
                    onClick={handleMoveToStep3}
                    disabled={isCreatingAccount || selectedAccountRole === 'add-new'}
                  >
                    {isCreatingAccount ? 'Loading...' : 'Next'}
                  </button>
                </div>
              </form>
            )}




            {/* ===== STEP 3: REVIEW ACCOUNT DETAILS ===== */}
            {accountModalStep === 3 && (
              <form className="modal-form" onSubmit={handleAddAccountSubmit}>
                <p className="step-description">Please review the account details before creating:</p>

                {/* Error message */}
                {accountMessage.text && (
                  <div className={`message-alert message-${accountMessage.type}`}>
                    {accountMessage.type === 'error' && '❌ '}
                    {accountMessage.type === 'success' && '✅ '}
                    {accountMessage.text}
                  </div>
                )}

                {/* Account Input Section */}
                <div className="account-input-section">
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newAccountData.name}
                      onChange={handleNewAccountInputChange}
                      placeholder="Enter full name"
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newAccountData.email}
                      onChange={handleNewAccountInputChange}
                      placeholder="Enter email address"
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newAccountData.password}
                      onChange={handleNewAccountInputChange}
                      placeholder="Enter password"
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={newAccountData.confirmPassword}
                      onChange={handleNewAccountInputChange}
                      placeholder="Confirm password"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Review Section */}
                <div className="review-section">
                  {/* Selected Role */}
                  <div className="review-field">
                    <label>Account Role</label>
                    <p className="review-value">
                      <span className={`role-badge role-${selectedAccountRole?.toLowerCase()}`}>
                        {selectedRoleName}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setAccountModalStep(2)}
                    disabled={isCreatingAccount}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={isCreatingAccount}
                  >
                    {isCreatingAccount ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}





      {/* ===== STEP 4: SUCCESS SCREEN ===== */}
      {accountModalStep === 4 && (
        <div className="success-step">
          <h2>✅ Account Created Successfully!</h2>
          <p>Username: {createdAccountInfo.username}</p>
              <p>Password: {createdAccountInfo.password}</p> {/* <-- added */}
          <p>Role: {createdAccountInfo.roleName}</p>

          <button
            className="btn-close"
            onClick={handleCloseAddAccountModal}
          >
            Close
          </button>
        </div>
      )}




          </div>
        </div>
      )}
    </div>
  );
}
