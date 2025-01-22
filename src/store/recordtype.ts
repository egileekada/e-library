import { create } from 'zustand';

type State = {
    type: string, 
} 

type Action = {
    setRecordType: (data: State['type']) => void  
}

const recorddata = create<State & Action>((set) => ({
    type: "",  
    setRecordType: (data) => set(() => ({ type: data })), 
}));



export default recorddata