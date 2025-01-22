import axios from "../util/apiclient"

export function useAddUserCallback() {
  const handleAddUser = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/user/create", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddUser }
}

export function useAddUserGuestCallback() {
  const handleAddUserGuest = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/user/create/guest", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddUserGuest }
}

export function useAddAdminCallback() {
  const handleAddAdmin = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/admin/create-admin", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddAdmin }
}

export function useAddGadgetCallback() {
  const handleAddGadget = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/hardware/gadget/add", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddGadget }
}

export function useAddPartnerCallback() {
  const handleAddPartner = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/partner/create", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddPartner }
}

export function useUpdatePartnerCallback() {
  const handleUpdatePartner = async (index: string | number, postData: object): Promise<any> => {
    try {
      const response = await axios.put("/partner/"+index, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleUpdatePartner }
}

export function useClearDebitCallback() {
  const handleClearDebit = async (index: string | number, postData: object): Promise<any> => {
    try {
      const response = await axios.put("/debt/clear-amount/"+index, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleClearDebit }
}

export function useDeleteRecordCallback() {
  const handleDeleteRecord = async (index: string | number): Promise<any> => {
    try {
      const response = await axios.delete("/record/"+index,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleDeleteRecord }
} 

export function useDeleteAdminCallback() {
  const handleDeleteAdmin = async (index: string | number): Promise<any> => {
    try {
      const response = await axios.delete(`/admin/${index}`,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleDeleteAdmin }
}

export function useAddBookCallback() {
  const handleAddBook = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/record/create-book", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddBook }
}

export function useAddJornalCallback() {
  const handleAddJornal = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/record/create-journal", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddJornal }
}

export function useAddReportCallback() {
  const handleAddReport = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/record/create-report", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddReport }
}


export function useEditBookCallback() {
  const handleEditBook = async (postData: object, id: string): Promise<any> => {
    try {
      const response = await axios.put(`/record/edit-book/${id}`, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleEditBook }
}

export function useEditJornalCallback() {
  const handleEditJornal = async (postData: object, id: string): Promise<any> => {
    try {
      const response = await axios.put(`/record/edit-journal/${id}`, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleEditJornal }
}

export function useEditReportCallback() {
  const handleEditReport = async (postData: object, id: string): Promise<any> => {
    try {
      const response = await axios.put(`/record/edit-report/${id}`, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleEditReport }
}

export function useRecordBorrowCallback() {
  const handleRecordBorrow = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/record/borrow", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleRecordBorrow }
}


export function useEditProfileCallback() {
  const handleEditProfile = async (postData: object, adminId: any ): Promise<any> => {
    try {
      const response = await axios.put(`/admin/update-details/${adminId}`, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleEditProfile }
}

export function useReturnRecordCallback() {
  const handleReturnRecord = async (postData: {
    recordId: string,
    return_state: string,
  }): Promise<any> => {
    try {
      const response = await axios.put("/record/return/" + postData?.recordId +"?return_state="+postData?.return_state, {},
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleReturnRecord }
}

export function useUpdateGadgetCallback() {
  const handleUpdateGadget = async (postData: {
    count?: number,
    state: string
  }, id: string): Promise<any> => {
    try {
      const response = await axios.put("/hardware/gadget/" + id, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleUpdateGadget }
}

export function useUpdateEquipmentCallback() {
  const handleUpdateEquipment = async (postData: {
    count: number,
    state: string
  }, id: string): Promise<any> => {
    try {
      const response = await axios.put("/hardware/equipment/" + id, postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleUpdateEquipment }
}

export function useAddEquipmentCallback() {
  const handleAddEquipment = async (postData: object): Promise<any> => {
    try {
      const response = await axios.post("/hardware/equipment/add", postData,
        {
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleAddEquipment }
}

export function useUploaderCallback() {
  const handleUploader = async (postData: any, image: any): Promise<any> => {
    try {
      const response = await axios.post('/file-upload/upload', postData,
        {
          headers: {
            'Content-Type': image.type,
          },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleUploader }
}

export function usePinCallback() {
  const handlePin = async (postData: any): Promise<any> => {
    try {
      const response = await axios.put('/partner/pin/'+postData, {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handlePin }
}

export function useGetDataCallback() {
  const handleGetData = async (url: string, params?: any): Promise<any> => {
    try {
      const response = await axios.get(url,
        {
          params: params,
          headers: { 'Content-Type': 'application/json' },
        });
      return response
    } catch (err: any) {
      return err?.response
    }
  }
  return { handleGetData }
} 