export interface SettingsState {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      marketing: boolean
    }
    appearance: {
      theme: "light" | "dark" | "auto"
      language: "he" | "en" | "ar"
      fontSize: number
    }
    privacy: {
      profileVisibility: "public" | "friends" | "private"
      showEmail: boolean
      showPhone: boolean
      showLocation: boolean
    }
    security: {
      twoFactor: boolean
      loginAlerts: boolean
      sessionTimeout: number
    }
    sounds: {
      enabled: boolean
      volume: number
      notificationSound: string
    }
  }