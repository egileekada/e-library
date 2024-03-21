import { create } from 'zustand';

type State = {
    search: string,
    filter: {
        status?: string
        state?: string
        isbn?: string
        issn?: string
        publicationYear?: string
        author?: string
        debtors?: string
    },
} 

type Action = {
    setSearchValue: (data: State['search']) => void 
    setFilter: (data: State['filter']) => void 
}

const filterdata = create<State & Action>((set) => ({
    search: "", 
    filter: {
        status: "", 
        state: ""
    },
    setSearchValue: (data) => set(() => ({ search: data })),
    setFilter: (data) => set(() => ({ filter: data })),
}));



export default filterdata