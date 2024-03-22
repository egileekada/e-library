import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import { useState } from 'react'
import filterdata from '../../store/filterdata';
import Tiles from './tiles';
import { IPartner } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import PinData from './pinneddata';
import Searchtable from './searchTable';
import InfiniteScrollerComponent from '../../util/infiniteScrollerComponent';

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

    const { search } = filterdata((state) => state);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([] as Array<IPartner>) 

    const { results, isLoading, ref, isRefetching } = InfiniteScrollerComponent({ url: `/partner/filter`, limit: 2, filter: "id" })

    return (
        <>
            {search && (
                <Searchtable setLimit={setLimit} setPage={setPage} setTotal={setTotal} limit={limit} page={page} />
            )}
            {!search && (
                <>
                    <LoadingAnimation loading={isLoading && loading} >
                        <Grid templateColumns='repeat(3, 1fr)' gap={4} py={"4"}>
                            {data?.map((item: IPartner, index: number) => { 
                                return (
                                    <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                                        <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                                    </GridItem>
                                )
                            })}
                            {results?.filter((el: IPartner) => {
                                return data.some((f) => {
                                    return f.id !== el.id
                                });
                            })?.map((item: IPartner, index: number) => {
                                if (results.length === index + 1) {
                                    return (
                                        <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} ref={ref} >
                                            <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                                        </GridItem>
                                    )
                                } else {
                                    return (
                                        <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                                            <Tiles id={item?.id} imageUrl={item?.imageUrl} partnerName={item?.partnerName} partnerResourceName={item?.partnerResourceName} partnerResourceUrl={item?.partnerResourceUrl} pinned={item?.pinned} />
                                        </GridItem>
                                    )
                                }
                            })}
                            {(isRefetching && !isLoading) && (
                                <GridItem display={"flex"} justifyContent={"center"} alignItems={"center"} >
                                    <Spinner />
                                </GridItem>
                            )}
                        </Grid>
                    </LoadingAnimation>
                    <PinData setLoading={setLoading} setdata={setData} />
                </>
            )}
        </>
    )
}

export default Partnertable
