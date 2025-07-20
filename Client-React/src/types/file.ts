import type { SharedResume } from "./share"

export interface FileData {
  sharedWith?: SharedResume[] | null // Make it optional and potentially null
  id: number
  fileName: string
  userId: number
  firstName: string
  lastName: string
  fatherName?: string
  motherName?: string
  address?: string
  gender: string
  age: number
  height: number
  createdAt: string
  updatedAt?: string
  occupation?: string
  placeOfStudy?: string
  downloadUrl?: string
  isOwner?: boolean
  isSharedWithMe?: boolean // Add this new property to mark files shared with the current user
}
