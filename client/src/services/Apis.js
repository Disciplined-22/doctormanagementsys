import {commonrequest} from "./ApiCall"
import {BASE_URL} from "./helper"


export const registerdoc = async(data,header)=>{
    return await commonrequest("POST",`${BASE_URL}/doc/signup`,data,header);
}

export const signindoc = async(data,header)=>{
    return await commonrequest("POST",`${BASE_URL}/doc/signin`,data,header);
}

export const usergetfunc = async()=>{
    return await commonrequest("GET",`${BASE_URL}/patient/details`,"");
}


export const pateintdetails = async(data,header)=>{
    return await commonrequest("GET",`${BASE_URL}/user/register`,data,"");
}

// 

export const mypatient  = async(data,header)=>{
    return await commonrequest("GET",`${BASE_URL}/doc/mypatient`,data, "");
}

export const getDoctors  = async(id)=>{
    return await commonrequest("GET",`${BASE_URL}/doc/mypatient/${id}`,"");
}



export const uploadpdf = async (data,header) =>{
    return await commonrequest("POST",`${BASE_URL}/doc/upload_pdf`,data,header);
}


export const validuser = async (data,header) =>{
    return await commonrequest("GET",`${BASE_URL}/doc/validuser`,"",header);
}



export const connectpatient = async (data,header) =>{
    return await commonrequest("POST",`${BASE_URL}/doc/connectpatient`,data,header);
}

export const registerfunc = async(data,header)=>{
    return await commonrequest("POST",`${BASE_URL}/user/register`,data,header);
}



export const singleUsergetfunc = async(id)=>{
    return await commonrequest("GET",`${BASE_URL}/user/${id}`,"");
}

export const editfunc = async(id,data,header)=>{
    return await commonrequest("PUT",`${BASE_URL}/user/edit/${id}`,data,header);
}

export const deletfunc = async(id)=>{
    return await commonrequest("DELETE",`${BASE_URL}/user/delete/${id}`,{});
}

export const statuschangefunc = async(id,data)=>{
    return await commonrequest("PUT",`${BASE_URL}/user/status/${id}`,{data})
}

export const exporttocsvfunc = async()=>{
    return await commonrequest("GET",`${BASE_URL}/userexport`,"");
}