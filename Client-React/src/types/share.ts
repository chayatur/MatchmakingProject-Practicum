export interface SharingPermission {
  id: number
  shareId: number
  permission: "view" | "edit" | "download" | "full"
  grantedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface SharedResume {
  shareId: number
  resumeFileId: number
  sharedWithUserId: number
  sharedByUserId: number
  permissions: SharingPermission[]
  sharedAt: string
  lastAccessedAt?: string
  accessCount: number
  isActive: boolean
  note?: string
  resumeFile: {
    id: number
    firstName: string
    lastName: string
    fileName: string
    createdAt: string
  }
  sharedByUser: {
    id: number
    username: string
    email: string
  }
  sharedWithUser: {
    id: number
    username: string
    email: string
  }
}

export interface SharingStats {
  totalShared: number
  totalReceived: number
  activeShares: number
  recentActivity: number
}
