import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "../types/settings";
const loadSettingsFromStorage = (): SettingsState => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("userSettings");
        if (saved) {
            return JSON.parse(saved);
        }
    }

    return {
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
        },
        appearance: {
            theme: "light",
            language: "he",
            fontSize: 14,
        },
        privacy: {
            profileVisibility: "friends",
            showEmail: false,
            showPhone: false,
            showLocation: false,
        },
        security: {
            twoFactor: false,
            loginAlerts: true,
            sessionTimeout: 30,
        },
        sounds: {
            enabled: true,
            volume: 70,
            notificationSound: "default",
        },
    };
};

const initialState: SettingsState = loadSettingsFromStorage();

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
            const newState = { ...state, ...action.payload };

            // Save to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(newState));
            }

            return newState;
        },
        updateNotifications: (state, action: PayloadAction<Partial<SettingsState["notifications"]>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(state));
            }
        },
        updateAppearance: (state, action: PayloadAction<Partial<SettingsState["appearance"]>>) => {
            state.appearance = { ...state.appearance, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(state));
            }
        },
        updatePrivacy: (state, action: PayloadAction<Partial<SettingsState["privacy"]>>) => {
            state.privacy = { ...state.privacy, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(state));
            }
        },
        updateSecurity: (state, action: PayloadAction<Partial<SettingsState["security"]>>) => {
            state.security = { ...state.security, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(state));
            }
        },
        updateSounds: (state, action: PayloadAction<Partial<SettingsState["sounds"]>>) => {
            state.sounds = { ...state.sounds, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(state));
            }
        },
        resetSettings: () => {
            const defaultSettings: SettingsState = {
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    marketing: false,
                },
                appearance: {
                    theme: "light",
                    language: "he",
                    fontSize: 14,
                },
                privacy: {
                    profileVisibility: "friends",
                    showEmail: false,
                    showPhone: false,
                    showLocation: false,
                },
                security: {
                    twoFactor: false,
                    loginAlerts: true,
                    sessionTimeout: 30,
                },
                sounds: {
                    enabled: true,
                    volume: 70,
                    notificationSound: "default",
                },
            };

            if (typeof window !== "undefined") {
                localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
            }

            return defaultSettings;
        },
    },
});

export const {
    updateSettings,
    updateNotifications,
    updateAppearance,
    updatePrivacy,
    updateSecurity,
    updateSounds,
    resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
