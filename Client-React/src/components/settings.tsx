"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState, AppDispatch } from "../store"
import { logoutUser, updateUserProfile } from "../slices/userSlice"


const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, isLoggedIn } = useSelector((state: RootState) => state.user)

  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications" | "privacy">("profile")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReport: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowSharing: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    if (user && user.id) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user, isLoggedIn, navigate])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }))
  }

  const validateProfile = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "שם משתמש נדרש"
    }

    if (!formData.email.trim()) {
      newErrors.email = "כתובת אימייל נדרשת"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה"
    }

    if (formData.phone && !/^[0-9]{9,10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "מספר טלפון לא תקין"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "סיסמה נוכחית נדרשת"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "סיסמה חדשה נדרשת"
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "הסיסמה חייבת להכיל לפחות 6 תווים"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות אינן תואמות"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateProfile()) return

    try {
      const updatedUser = {
        id: user.id,
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
      }

      await dispatch(updateUserProfile(updatedUser)).unwrap()
      setSuccessMessage("הפרופיל עודכן בהצלחה!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrors({ general: "שגיאה בעדכון הפרופיל" })
    }
  }

  const handleChangePassword = async () => {
    if (!validatePassword()) return

    // כאן תוכל להוסיף לוגיקה לשינוי סיסמה
    setSuccessMessage("הסיסמה שונתה בהצלחה!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה ניתנת לביטול.")) {
      // כאן תוכל להוסיף לוגיקה למחיקת חשבון
      await dispatch(logoutUser())
      navigate("/")
    }
  }

  const getInitials = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  const sections = [
    { id: "profile", title: "פרופיל אישי", icon: "👤" },
    { id: "security", title: "אבטחה", icon: "🔒" },
    { id: "notifications", title: "התראות", icon: "🔔" },
    { id: "privacy", title: "פרטיות", icon: "🛡️" },
  ]

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <button onClick={() => navigate("/personal-area")} className="back-btn">
            ← חזרה לאזור האישי
          </button>
          <div className="header-info">
            <div className="user-avatar">{getInitials()}</div>
            <div className="header-text">
              <h1>הגדרות חשבון</h1>
              <p>נהל את הפרופיל והעדפות החשבון שלך</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && <div className="success-message">✅ {successMessage}</div>}

      <div className="settings-content">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="sidebar-header">
            <h3>הגדרות</h3>
          </div>
          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id as any)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-text">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-main">
          {activeSection === "profile" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>👤 פרופיל אישי</h2>
                <p>עדכן את הפרטים האישיים שלך</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>שם משתמש *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "error" : ""}
                    placeholder="הכנס שם משתמש"
                  />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label>כתובת אימייל *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "error" : ""}
                    placeholder="הכנס כתובת אימייל"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>מספר טלפון</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "error" : ""}
                    placeholder="הכנס מספר טלפון"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label>כתובת</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="הכנס כתובת"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button onClick={handleSaveProfile} disabled={loading} className="save-btn">
                  {loading ? "שומר..." : "שמור שינויים"}
                </button>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔒 אבטחה</h2>
                <p>נהל את הגדרות האבטחה של החשבון</p>
              </div>

              <div className="security-section">
                <h3>שינוי סיסמה</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>סיסמה נוכחית *</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className={errors.currentPassword ? "error" : ""}
                      placeholder="הכנס סיסמה נוכחית"
                    />
                    {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                  </div>

                  <div className="form-group">
                    <label>סיסמה חדשה *</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className={errors.newPassword ? "error" : ""}
                      placeholder="הכנס סיסמה חדשה"
                    />
                    {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                  </div>

                  <div className="form-group">
                    <label>אימות סיסמה חדשה *</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "error" : ""}
                      placeholder="הכנס שוב את הסיסמה החדשה"
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={handleChangePassword} className="save-btn">
                    שנה סיסמה
                  </button>
                </div>
              </div>

              <div className="danger-zone">
                <h3>אזור מסוכן</h3>
                <p>פעולות אלו אינן ניתנות לביטול</p>
                <button onClick={handleDeleteAccount} className="danger-btn">
                  מחק חשבון
                </button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔔 התראות</h2>
                <p>נהל את העדפות ההתראות שלך</p>
              </div>

              <div className="notifications-grid">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>התראות אימייל</h4>
                    <p>קבל עדכונים חשובים באימייל</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>התראות SMS</h4>
                    <p>קבל התראות דחופות בהודעות טקסט</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.smsNotifications}
                      onChange={(e) => handleNotificationChange("smsNotifications", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>התראות דחיפה</h4>
                    <p>קבל התראות בדפדפן</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>דוח שבועי</h4>
                    <p>קבל סיכום שבועי של הפעילות</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReport}
                      onChange={(e) => handleNotificationChange("weeklyReport", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🛡️ פרטיות</h2>
                <p>נהל את הגדרות הפרטיות שלך</p>
              </div>

              <div className="privacy-settings">
                <div className="privacy-item">
                  <h4>נראות הפרופיל</h4>
                  <p>בחר מי יכול לראות את הפרופיל שלך</p>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    className="privacy-select"
                  >
                    <option value="public">ציבורי - כולם יכולים לראות</option>
                    <option value="users">משתמשים רשומים בלבד</option>
                    <option value="private">פרטי - רק אני</option>
                  </select>
                </div>

                <div className="privacy-item">
                  <div className="privacy-toggle">
                    <div className="privacy-info">
                      <h4>הצג כתובת אימייל</h4>
                      <p>אפשר למשתמשים אחרים לראות את האימייל שלך</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showEmail}
                        onChange={(e) => handlePrivacyChange("showEmail", e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="privacy-item">
                  <div className="privacy-toggle">
                    <div className="privacy-info">
                      <h4>הצג מספר טלפון</h4>
                      <p>אפשר למשתמשים אחרים לראות את הטלפון שלך</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showPhone}
                        onChange={(e) => handlePrivacyChange("showPhone", e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="privacy-item">
                  <div className="privacy-toggle">
                    <div className="privacy-info">
                      <h4>אפשר שיתוף</h4>
                      <p>אפשר למשתמשים אחרים לשתף איתך רזומות</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.allowSharing}
                        onChange={(e) => handlePrivacyChange("allowSharing", e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style >{`
        .settings-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .settings-header {
          background: linear-gradient(135deg, #8B0000 0%, #5c0000 100%);
          color: white;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(139, 0, 0, 0.3);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .header-text h1 {
          margin: 0 0 5px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .header-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          margin: 20px auto;
          max-width: 1200px;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
          text-align: center;
          font-weight: 600;
        }

        .settings-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
        }

        .settings-sidebar {
          background: white;
          border-radius: 15px;
          padding: 25px;
          height: fit-content;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(139, 0, 0, 0.1);
        }

        .sidebar-header h3 {
          margin: 0 0 20px 0;
          color: #8B0000;
          font-size: 20px;
          font-weight: 700;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: right;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(139, 0, 0, 0.1);
        }

        .nav-item.active {
          background: #8B0000;
          color: white;
        }

        .nav-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .nav-text {
          font-size: 16px;
          font-weight: 600;
        }

        .settings-main {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(139, 0, 0, 0.1);
        }

        .settings-section {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f8f9fa;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          color: #8B0000;
          font-size: 24px;
          font-weight: 700;
        }

        .section-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #8B0000;
          box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
        }

        .form-group input.error {
          border-color: #dc3545;
        }

        .error-text {
          color: #dc3545;
          font-size: 14px;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }

        .save-btn {
          background: #8B0000;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover:not(:disabled) {
          background: #5c0000;
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .security-section {
          margin-bottom: 40px;
          padding: 25px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .security-section h3 {
          margin: 0 0 20px 0;
          color: #8B0000;
          font-size: 18px;
          font-weight: 600;
        }

        .danger-zone {
          padding: 25px;
          background: #fff5f5;
          border-radius: 12px;
          border: 2px solid #fed7d7;
        }

        .danger-zone h3 {
          margin: 0 0 10px 0;
          color: #dc3545;
          font-size: 18px;
          font-weight: 600;
        }

        .danger-zone p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 14px;
        }

        .danger-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .danger-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
        }

        .notifications-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .notification-info h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }

        .notification-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #8B0000;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .privacy-settings {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .privacy-item {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .privacy-item h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }

        .privacy-item p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }

        .privacy-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          cursor: pointer;
        }

        .privacy-select:focus {
          outline: none;
          border-color: #8B0000;
          box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
        }

        .privacy-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .privacy-info {
          flex: 1;
        }

        @media (max-width: 768px) {
          .settings-content {
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .settings-sidebar {
            order: 2;
          }

          .settings-main {
            order: 1;
          }

          .settings-nav {
            flex-direction: row;
            overflow-x: auto;
            gap: 10px;
          }

          .nav-item {
            min-width: 120px;
            flex-shrink: 0;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }

          .notification-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .privacy-toggle {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}

export default SettingsPage
