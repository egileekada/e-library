import { Box, Checkbox, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { focusManager, useQuery } from 'react-query';
import { useState } from 'react';
import { IUserData } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import actionService from '../../connections/getdataaction';
import filterdata from '../../store/filterdata';
import { useNavigate } from 'react-router-dom';
import { capitalizeFLetter } from '../../util/capitalLetter';
import { formatNumber } from '../../util/numberFormat';
import { cleanup } from '../../util/cleanup';

interface Props {
    tableRef: any
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    setTotal: (by: number) => void;
}

function Usertable(props: Props) {
    const {
        tableRef,
        limit,
        page,
        setPage,
        setLimit,
        setTotal
    } = props

    const [data, setData] = useState([] as Array<IUserData>)
    const toast = useToast()
    const navigate = useNavigate()

    const { search, filter } = filterdata((state) => state);

    focusManager.setFocused(false)

    const { isLoading, isRefetching } = useQuery(['usertable', search, page, limit, filter?.debtors], () => actionService.getservicedata((search || filter?.debtors)? `/user/search` : "/user",
        {
            ...cleanup(filter),
            page: page,
            limit: limit,
            // keyword: search ?? ""
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

    const clickHandler = (item: string) => {
        localStorage.setItem("currentuser", item)
        navigate("/dashboard/user/info")
    }

    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.length} >
            <TableContainer>
                <Table ref={tableRef} variant='simple'>
                    <Thead>
                        <Tr>
                            <Th><Checkbox size={"lg"} /></Th>
                            <Th>ID</Th>
                            <Th>Image</Th>
                            <Th>Name</Th>
                            <Th>Role</Th>
                            <Th>Staff ID</Th>
                            <Th>Email</Th>
                            <Th>Phone No.</Th>
                            <Th>Debit</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: IUserData, index: number) => {
                            return (
                                <Tr role='button' onClick={() => clickHandler(item?.id + "")} fontSize={"14px"} key={index} >
                                    <Td><Checkbox size={"lg"} /></Td>
                                    <Td>{item?.id}</Td>
                                    <Td>
                                        <Box w={"48px"} h={"48px"} borderWidth={"3px"} rounded={"full"} >
                                            <Image w={"full"} h={"full"} rounded={"full"} src={item?.profilePicture ? item?.profilePicture : "/avatar.png"} objectFit={"cover"} alt='image' />
                                        </Box>
                                    </Td>
                                    <Td>{item?.name?.length > 13 ? capitalizeFLetter(item?.name.slice(0, 12)) + "..." : capitalizeFLetter(item?.name)}</Td>
                                    <Td>{item?.staffId ? "Staff" : "Guest"}</Td>
                                    <Td>{item?.staffId ? item?.staffId : "Guest"}</Td>
                                    <Td>{item?.email?.length > 13 ? item?.email.slice(0, 12) + "..." : item?.email}</Td>
                                    <Td>{item?.phone}</Td>
                                    <Td>{formatNumber(item?.debtBalance, true)}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </LoadingAnimation>
    )
}

export default Usertable
