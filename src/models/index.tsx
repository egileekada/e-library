
export interface IUserData {
    email: string;
    adminId: number | string;
    id: number | string;
    name: string;
    phone: string;
    staffId: string;
    profilePicture?: string;
    Borrowing?: Array<BorrowData>;
    createdAt?: string;
    debtBalance?: number
} 

export interface ICreateUser {
    name: string,
    email: string,
    phone: string,
    staffId: string,
    profilePicture?: string
}

export interface IBorrowData {
    recordNumber: number,
    startDate: string,
    status: string,
    record: {name: string}, 
    endDate: string,
    return_state?: string
}
 
export interface IGadgetData {
    count: number,
    manufacturer: string,
    picture: string,
    state: string, 
    type: string, 
    id: string,
    serialNumber?: number
} 
 
export interface ICreateGadget  {
    type: string,
    picture?: string,
    manufacturer: string,
    count: number,
    state?: string 
    id?: string,
    serialNumber?: string | number
}
 
export interface ICreateEquipment  {
    type: string,
    picture?: string, 
    count: number,
    state?: string, 
    id?: string
} 

export interface IAdmin {
    email: string,
    name: string, 
    profilePicture?: string,
    phone: string, 
    id?: string | number,
    createdAt?: string,
    password?: string,
    staffId?: string,
    role?: string
} 

export interface IPartner {
    partnerName: string,
    partnerResourceName: string, 
    partnerResourceUrl?: string,
    imageUrl?: string, 
    id?: string | number,
    createdAt?: string,
    pinned?: boolean
}  

export interface IBorrow {
    userId: string | number,
    recordId: string | number, 
    startDate: string,
    endDate: string,  
}   

export interface ILibrary {
    name: string,
    description: string, 
    author?: string,
    thumbnail?: string, 
    authors?: Array<string>, 
    count?: string, 
    publicationYear?: string, 
    language?: string, 
    category?: string, 
    ISBN?: string,  
    IDNumber?: string,  
    projectYear?: string,  
    projectLocation?: string,  
    value?: string | number,
    id?: string,
    status?: string,
    Borrowing?: Array<BorrowData>
    borrowId?: string | number,
    table?: boolean,
    totalCount?: number
}  

export interface BorrowData {
    user?: IUserData,
    id?: string | number,
    return_state: string,
    startDate: string,
    endDate: string,
    status: string
}
