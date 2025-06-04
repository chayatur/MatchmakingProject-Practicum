import { FileData } from "./file"
import { User } from "./user"

export type SharingData = {
    shareId: number
    resumeFileId: number
    sharedWithUserId: number
    sharedAt: string
    resumeFile: FileData
    sharedWithUser: User
  }
  