export const translations = {
    he: {
      // Navigation
      home: "בית",
      upload: "העלאת קבצים",
      resumes: "קורות חיים",
      profile: "פרופיל",
      settings: "הגדרות",
      login: "התחברות",
      register: "הרשמה",
      logout: "התנתקות",
  
      // Common
      save: "שמור",
      cancel: "ביטול",
      delete: "מחק",
      edit: "ערוך",
      close: "סגור",
      loading: "טוען...",
      error: "שגיאה",
      success: "הצלחה",
  
      // Home page
      welcomeTitle: "ברוכים הבאים למערכת ניהול קורות חיים",
      welcomeSubtitle: "העלו, נהלו ושתפו את קורות החיים שלכם בקלות",
      getStarted: "התחילו עכשיו",
  
      // Settings
      settingsTitle: "הגדרות מערכת",
      personalDetails: "פרטים אישיים",
      notifications: "התראות",
      appearance: "מראה",
      privacy: "פרטיות",
      security: "אבטחה",
      sounds: "צלילים",
  
      // Notifications
      emailNotifications: "התראות במייל",
      pushNotifications: "התראות דחיפה",
      smsNotifications: "הודעות SMS",
      marketingEmails: "דיוור שיווקי",
  
      // Appearance
      theme: "ערכת נושא",
      language: "שפה",
      fontSize: "גודל גופן",
      lightTheme: "בהיר",
      darkTheme: "כהה",
      autoTheme: "אוטומטי",
  
      // Languages
      hebrew: "עברית",
      english: "אנגלית",
      arabic: "ערבית",
    },
    en: {
      // Navigation
      home: "Home",
      upload: "Upload Files",
      resumes: "Resumes",
      profile: "Profile",
      settings: "Settings",
      login: "Login",
      register: "Register",
      logout: "Logout",
  
      // Common
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      loading: "Loading...",
      error: "Error",
      success: "Success",
  
      // Home page
      welcomeTitle: "Welcome to Resume Management System",
      welcomeSubtitle: "Upload, manage and share your resumes easily",
      getStarted: "Get Started",
  
      // Settings
      settingsTitle: "System Settings",
      personalDetails: "Personal Details",
      notifications: "Notifications",
      appearance: "Appearance",
      privacy: "Privacy",
      security: "Security",
      sounds: "Sounds",
  
      // Notifications
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      smsNotifications: "SMS Messages",
      marketingEmails: "Marketing Emails",
  
      // Appearance
      theme: "Theme",
      language: "Language",
      fontSize: "Font Size",
      lightTheme: "Light",
      darkTheme: "Dark",
      autoTheme: "Auto",
  
      // Languages
      hebrew: "Hebrew",
      english: "English",
      arabic: "Arabic",
    },
    ar: {
      // Navigation
      home: "الرئيسية",
      upload: "رفع الملفات",
      resumes: "السير الذاتية",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      login: "تسجيل الدخول",
      register: "التسجيل",
      logout: "تسجيل الخروج",
  
      // Common
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تحرير",
      close: "إغلاق",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
  
      // Home page
      welcomeTitle: "مرحباً بكم في نظام إدارة السير الذاتية",
      welcomeSubtitle: "ارفع وأدر وشارك سيرتك الذاتية بسهولة",
      getStarted: "ابدأ الآن",
  
      // Settings
      settingsTitle: "إعدادات النظام",
      personalDetails: "التفاصيل الشخصية",
      notifications: "الإشعارات",
      appearance: "المظهر",
      privacy: "الخصوصية",
      security: "الأمان",
      sounds: "الأصوات",
  
      // Notifications
      emailNotifications: "إشعارات البريد الإلكتروني",
      pushNotifications: "الإشعارات المباشرة",
      smsNotifications: "رسائل SMS",
      marketingEmails: "رسائل تسويقية",
  
      // Appearance
      theme: "السمة",
      language: "اللغة",
      fontSize: "حجم الخط",
      lightTheme: "فاتح",
      darkTheme: "داكن",
      autoTheme: "تلقائي",
  
      // Languages
      hebrew: "العبرية",
      english: "الإنجليزية",
      arabic: "العربية",
    },
  }
  
  export type Language = keyof typeof translations
  export type TranslationKey = keyof typeof translations.he
  
  export const getTranslation = (language: Language, key: TranslationKey): string => {
    return translations[language][key] || translations.he[key] || key
  }
  