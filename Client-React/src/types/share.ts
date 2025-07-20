// types/share.ts
import type { FileData } from "./file"
import type { User } from "./user"

export interface SharingPermission {
  id: number
  shareId: number
  permission: "view" | "edit" | "download" | "full"
  grantedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface SharedResume {
  shareID: number
  resumefileID: number
  sharedWithUserID: number
  sharedByUserID: number
  permissions: SharingPermission[]
  sharedAt: string
  lastAccessedAt?: string
  accessCount: number
  isActive: boolean
  note?: string
  resumefile?: FileData // Optional, as it might not always be populated by the backend
  sharedWithUser?: User
  sharedByUser?: User
}

export interface SharingStats {
  totalShared: number
  totalReceived: number
  activeShares: number
  recentActivity: number
}
