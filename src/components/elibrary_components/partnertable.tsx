import { Grid, GridItem, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import filterdata from '../../store/filterdata';
import Tiles from './tiles';
import { IPartner } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import PinData from './pinneddata';
import Searchtable from './searchTable';
// import InfiniteScrollerComponent from '../../util/infiniteScrollerComponent';
import { cleanup } from '../../util/cleanup';
import { useQuery } from 'react-query';
import actionService from '../../connections/getdataaction';

interface Props {
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
    type?: string
}

function Partnertable(props: Props) {
    const {
        limit,
        page,
        setPage,
        setLimit,
        setTotal,
        type
    } = props

    const { search } = filterdata((state) => state);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([] as Array<IPartner>)
    const [results, setDataInfo] = useState([] as Array<IPartner>) 

    const toast = useToast()

    // const { results, isLoading, ref, isRefetching } = InfiniteScrollerComponent({ url: `/partner/filter`, limit: 20, filter: "id" })


    const { isLoading, isRefetching } = useQuery(['partner', search, page, limit, type], () => actionService.getservicedata(`/partner/filter`,
        {
            ...cleanup({
                page: page,
                limit: limit,
                category: type
            }),
        }), {
        onError: () => {
            toast({
                status: "error",
                title: "Error occured",
            });
        },

        onSuccess: (data: any) => { 
            if(!search) {
                setTotal(data?.data?.total) 
                setDataInfo(data?.data?.data);
            }
        }

    })

    useEffect(() => {
        setPage(1)
    }, [search])

    return (
        <>
            {search && (
                <Searchtable setLimit={setLimit} setPage={setPage} setTotal={setTotal} limit={limit} page={page} />
            )}
            {!search && (
                <>
                    <LoadingAnimation length={data?.length && results?.length} loading={isLoading && loading} refeching={isRefetching} >
                        <Grid templateColumns='repeat(3, 1fr)' gap={4} py={"4"}>
                            {data?.map((item: IPartner, index: number) => {
                                if (page === 1) {
                                    return (
                                        <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                                            <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                                        </GridItem>
                                    )
                                }
                            })}
                            {results?.map((item: IPartner, index: number) => { 
                                return (
                                    <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                                        <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                                    </GridItem>
                                ) 
                            })}
                            {/* {(isRefetching && !isLoading) && (
                                <GridItem display={"flex"} justifyContent={"center"} alignItems={"center"} >
                                    <Spinner />
                                </GridItem>
                            )} */}
                        </Grid>
                    </LoadingAnimation>
                    <PinData type={type} setLoading={setLoading} setdata={setData} />
                </>
            )}
        </>
    )
}

export default Partnertable
