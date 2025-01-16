 import axios from "../util/apiclient" 

export interface LoginDataType {
  email: string;
  password: string;
}

export function useLoginCallback() {
  
  const handleLogin = async (postData: LoginDataType): Promise<any> => {    
    try{ 
        const response = await axios.post('/admin/login', postData,
        {
          headers: {'Content-Type':'application/json'}, 
        }); 
        return response       
    } catch(err: any) { 
      console.log(err);
      
      return err?.response    
    }     
  }
  return { handleLogin }
}
 
export function useSendOtpCallback() {
  
  const handleSendOtp = async (postData: {
    email: string
  }): Promise<any> => {    
    try{ 
        const response = await axios.post('/admin/reset-password-otp', postData,
        {
          headers: {'Content-Type':'application/json'}, 
        }); 
        return response       
    } catch(err: any) { 
      console.log(err);
      
      return err?.response    
    }     
  }
  return { handleSendOtp }
}

 
export function useVerifyOtpCallback() {
  
  const handleVerifyOtp = async (postData: {
    otp: string
  }): Promise<any> => {    
    try{ 
        const response = await axios.post('/admin/verify-otp', postData,
        {
          headers: {'Content-Type':'application/json'}, 
        }); 
        return response       
    } catch(err: any) { 
      console.log(err);
      
      return err?.response    
    }     
  }
  return { handleVerifyOtp }
}
 
export function useResetPassWordCallback() {
  
  const handleResetPassWord = async (postData: {
    password: string,
    id: any
  }): Promise<any> => {    
    try{ 
        const response = await axios.put('/admin/reset-password', postData,
        {
          headers: {'Content-Type':'application/json'}, 
        }); 
        return response       
    } catch(err: any) { 
      console.log(err);
      
      return err?.response    
    }     
  }
  return { handleResetPassWord }
}