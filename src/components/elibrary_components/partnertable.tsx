import { Grid, GridItem, useToast } from '@chakra-ui/react';
import { useState } from 'react'
import filterdata from '../../store/filterdata';
import { focusManager, useQuery } from 'react-query';
import actionService from '../../connections/getdataaction';
import Tiles from './tiles';
import { IPartner } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';

interface Props {
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
}

function Partnertable(props: Props) {
    const {
        limit,
        page,
        setPage,
        setLimit,
        setTotal
    } = props

    const toast = useToast()

    const { search } = filterdata((state) => state);
    const [data, setData] = useState([] as Array<any>)

    focusManager.setFocused(false)

    const { isLoading, isRefetching } = useQuery(['partnertable', search, page, limit], () => actionService.getservicedata( `${search ? "/partner" : "/partner/filter"}`,
        {
            page: page,
            limit: limit,
            keyword: search ? search : null
        }), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error); 
        },
        onSuccess: (data: any) => {
            setPage(data?.data?.page)
            setLimit(data?.data?.limit)
            setTotal(data?.data?.total)
            setData(data?.data?.data); 
        }
    })
    
    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} > 
            <Grid templateColumns='repeat(3, 1fr)' gap={4} py={"4"}>
                {data?.map((item: IPartner, index: number) => {
                    return (
                        <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                            <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                        </GridItem>
                    )
                })}
            </Grid>
        </LoadingAnimation>
    )
}

export default Partnertable
