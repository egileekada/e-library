// import React from 'react'

import { useQuery } from "react-query";
import actionService from "../../connections/getdataaction"; 

interface IProps {
    setdata?: any
    setLoading?: any, 
}

export default function PinData(props: IProps) {

    const {
        setdata,
        setLoading, 
    } = props

    const { isLoading } = useQuery(['partnertable'], () => actionService.getservicedata(`${"/partner/pinned"}`), {
        onError: (error: any) => {
            console.log(error);
        },
        onSuccess: (data: any) => {
            setLoading(isLoading)
            setdata(data?.data?.data ?? [""])
        }
    }) 

    return (
        <></>
    )
}
