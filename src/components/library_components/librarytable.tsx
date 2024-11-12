import { Grid, GridItem, useToast } from '@chakra-ui/react';
import { useState } from 'react'
import filterdata from '../../store/filterdata';
import { focusManager, useQuery } from 'react-query';
import actionService from '../../connections/getdataaction';
import Tiles from './tiles';
import { ILibrary } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import { cleanup } from '../../util/cleanup';

interface Props {
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
}

function Librarytable(props: Props) {
    const {
        limit,
        page,
        setPage, 
        setTotal
    } = props

    const toast = useToast()

    const { search, filter } = filterdata((state) => state);
    const [data, setData] = useState([] as Array<any>)

    focusManager.setFocused(false)

    const { isLoading, isRefetching } = useQuery(['librarytable', search, page, limit, filter?.status, filter.isbn, filter?.author, filter?.publicationYear, filter?.issn], () => actionService.getservicedata(`/record/filter` ,
        {
            ...cleanup({
                ...filter,
                page: page,
                limit: limit, 
                keyword: search ? search : null}
            )
        }), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error)
        },
        onSuccess: (data: any) => {
            setPage(data?.data?.page) 
            setTotal(data?.data?.total)
            setData(data?.data?.data)  
        }
    })
    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.length} > 
            <Grid templateColumns='repeat(3, 1fr)' gap={4} py={"4"}>
                {data?.map((item: ILibrary, index: number) => {
                    return (
                        <GridItem key={index} w={"full"} borderWidth={"0.5px"} rounded={"10px"} bgColor={"#FCFCFC"} borderColor={"#BDBDBD"} >
                            <Tiles {...item} />
                        </GridItem>
                    )
                })}
            </Grid>
        </LoadingAnimation>
    )
}

export default Librarytable
