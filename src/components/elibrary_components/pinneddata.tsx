// import React from 'react'

import { useQuery } from "react-query";
import actionService from "../../connections/getdataaction"; 
import { cleanup } from "../../util/cleanup";

interface IProps {
    setdata?: any
    setLoading?: any, 
    type?: string
}

export default function PinData(props: IProps) {

    const {
        setdata,
        setLoading, 
        type
    } = props

    const { isLoading } = useQuery(['partnertable', type], () => actionService.getservicedata(`${"/partner/pinned"}`,
    {
        ...cleanup({ 
            limit: 10,
            category: type
        }),
    }), {
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
