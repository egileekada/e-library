import { Box, Checkbox, Flex, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { focusManager, useQuery } from 'react-query';
import { useState } from 'react';
import { IGadgetData } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import actionService from '../../connections/getdataaction';
import filterdata from '../../store/filterdata';
import MoreOption from '../shared_components/more_options';
import { cleanup } from '../../util/cleanup';
import { capitalizeFLetter } from '../../util/capitalLetter';
// import { useNavigate } from 'react-router-dom';

interface Props {
    tableRef: any
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
    setDataInfo: (by: Array<any>) => void;
}

function GadgetTable(props: Props) {
    const {
        tableRef,
        limit,
        page,
        // setPage, 
        setTotal,
        setDataInfo
    } = props

    const [data, setData] = useState([] as any)
    const toast = useToast()

    focusManager.setFocused(false)

    const { search, filter } = filterdata((state) => state); 

    const { isLoading, isRefetching } = useQuery(['gadgettable', search, page, limit, filter?.state], () => actionService.getservicedata(`/hardware/gadget`,
        {
            ...cleanup({...filter,
                page: page,
                limit: limit,
                manufacturer: search ? search : null,
                type: search ? search : null, 
            }),
        }), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error);

        },
        onSuccess: (data: any) => {
            // setPage(data?.data?.page) 
            setTotal(data?.data?.total)
            setData(data?.data?.data);
            setDataInfo(data?.data?.data);
        }
    }) 

    const statuscomponent = (item: string) => {
        if (item === "ACTIVE") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#1B4332"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#A7D5C0"} >
                    Active
                </Flex>
            )
        } else if (item === "TEMPORARILY_DISABLED") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#3F4010"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#E7DD84"} >
                    Temporarily disabled
                </Flex>
            )
        } else {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#450000"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#FFDEDE"} >
                    Permanently disabled
                </Flex>
            )
        }
    }

    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.length} >
            <TableContainer ref={tableRef} >
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th><Checkbox size={"lg"} /></Th>
                            <Th>ID</Th>
                            <Th>Image</Th>
                            <Th>Gadget</Th>
                            <Th>Manufacturer</Th>
                            <Th>Serial Number</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: IGadgetData, index: number) => {
                            return (
                                <Tr fontSize={"14px"} key={index} >
                                    <Td><Checkbox size={"lg"} /></Td>
                                    <Td>{item?.id?.length > 12 ? item?.id.slice(0, 12) + "..." : item?.id}</Td>
                                    <Td> 
                                            <Box w={"48px"} h={"48px"} borderWidth={"3px"} rounded={"4px"} >
                                                <Image w={"full"} h={"full"} rounded={"4px"} src={item?.picture ? item?.picture : "/placeholder.png"} objectFit={"cover"} alt='image' />
                                            </Box> 
                                    </Td>
                                    <Td>{item?.type?.length > 13 ? capitalizeFLetter(item?.type.slice(0, 12) + "...") : capitalizeFLetter(item?.type)}</Td>
                                    <Td>{item?.manufacturer?.length > 12 ? capitalizeFLetter(item?.manufacturer.slice(0, 12) + "...") : capitalizeFLetter(item?.manufacturer)}</Td>
                                    <Td>{item?.serialNumber}</Td>
                                    <Td>
                                        <Flex gap={"3"} alignItems={"center"} >
                                            {statuscomponent(item?.state)}
                                            <MoreOption name='Gadget' data={item} />
                                        </Flex>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </LoadingAnimation>
    )
}

export default GadgetTable
