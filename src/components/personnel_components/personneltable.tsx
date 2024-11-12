import { Box, Checkbox, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { focusManager, useQuery } from 'react-query';
import { useState } from 'react';
import { IAdmin } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import actionService from '../../connections/getdataaction';
import filterdata from '../../store/filterdata';
import { capitalizeFLetter } from '../../util/capitalLetter';
import { cleanup } from '../../util/cleanup';

interface Props {
    tableRef: any
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
    setDataInfo: (by: Array<any>) => void;
}

function Admintable(props: Props) {
    const {
        // tableRef,
        limit,
        page,
        // setPage,
        // setLimit,
        setTotal,
        setDataInfo
    } = props

    const [data, setData] = useState([] as Array<IAdmin>)
    const toast = useToast()

    focusManager.setFocused(false)

    const { search } = filterdata((state) => state);

    const { isLoading, isRefetching } = useQuery(['admintable', search, page, limit], () => actionService.getservicedata(`/admin/get-all-admin`,
        {
            ...cleanup({
                page: page,
                limit: limit,
                name: search,
                staffId: search,
                email: search
            })
        }
    ), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error);

        },
        onSuccess: (data: any) => { 
            setTotal(data?.data?.total)
            setData(data?.data?.data);
            setDataInfo(data?.data?.data);
        }
    })

    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.length} >
            <TableContainer  >
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th><Checkbox size={"lg"} /></Th>
                            <Th>ID</Th>
                            <Th>Image</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Staff Id</Th>
                            <Th>Phone No.</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: IAdmin, index: number) => {
                            return (
                                <Tr fontSize={"14px"} key={index} >
                                    <Td><Checkbox size={"lg"} /></Td>
                                    <Td>{item?.id}</Td>
                                    <Td>
                                        {/* {item?.profilePicture && ( */}
                                        <Box w={"48px"} h={"48px"} borderWidth={"3px"} rounded={"full"} >
                                            <Image w={"full"} h={"full"} rounded={"full"} src={item?.profilePicture ? item?.profilePicture : "/avatar.png"} objectFit={"cover"} alt='image' />
                                        </Box>
                                        {/* // )}  */}
                                    </Td>
                                    <Td>{item?.name?.length > 13 ? capitalizeFLetter(item?.name.slice(0, 12) + "...") : capitalizeFLetter(item?.name)}</Td>
                                    {/* <Td>{item?.staffId ? "Staff" : "Guest"}</Td> */}
                                    <Td>{item?.email?.length > 13 ? item?.email.slice(0, 12) + "..." : item?.email}</Td>
                                    <Td>{item?.staffId}</Td>
                                    <Td>{item?.phone}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </LoadingAnimation>
    )
}

export default Admintable
