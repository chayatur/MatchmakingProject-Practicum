export interface FileData {
    sharedWith: any
    id: number
    fileName: string
    userId: number
    firstName: string
    lastName: string
    fatherName?: string
    motherName?: string
    address?: string
    gender:string
    age: number
    height: number
    createdAt: string
    updatedAt?: string
    occupation?: string
    placeOfStudy?: string
    downloadUrl?: string
    isOwner?: boolean
  }