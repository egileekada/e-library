import { Checkbox, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { focusManager, useQuery } from 'react-query';
import { useState } from 'react';
import { TransactionData } from '../../models';
import LoadingAnimation from '../shared_components/loading_animation';
import actionService from '../../connections/getdataaction';
import filterdata from '../../store/filterdata'; 
import { cleanup } from '../../util/cleanup';
import { capitalizeFLetter } from '../../util/capitalLetter';
import { formatNumber } from '../../util/numberFormat';
import { dateFormat } from '../../util/dateFormat';
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

function TransactionTable(props: Props) {
    const {
        tableRef,
        limit,
        page,
        setPage,
        setLimit,
        setTotal,
        setDataInfo
    } = props

    const [data, setData] = useState([] as any)
    const toast = useToast()

    focusManager.setFocused(false)

    const { search } = filterdata((state) => state); 

    const { isLoading, isRefetching } = useQuery(['transactiontable', search, page, limit], () => actionService.getservicedata(`/transaction`,
        {
            ...cleanup({ 
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
            setPage(data?.data?.page)
            setLimit(data?.data?.limit)
            setTotal(data?.data?.total)
            setData(data?.data?.data);
            setDataInfo(data?.data?.data);
        }
    }) 

    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.length} >
            <TableContainer ref={tableRef} >
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th><Checkbox size={"lg"} /></Th>
                            <Th>Staff/Guest</Th>
                            <Th>Admin</Th>
                            <Th>Amount Clear</Th>
                            <Th>Debit</Th>
                            <Th>Date</Th> 
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: TransactionData, index: number) => {
                            return (
                                <Tr fontSize={"14px"} key={index} >
                                    <Td><Checkbox size={"lg"} /></Td>
                                    <Td>{capitalizeFLetter(item?.user?.name)}</Td>
                                    <Td>{capitalizeFLetter(item?.admin?.name)}</Td>
                                    <Td>{formatNumber(item?.amountCleared)}</Td>
                                    <Td>{formatNumber(item?.newAmount)}</Td>
                                    <Td>{dateFormat(item?.createdAt)}</Td> 
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </LoadingAnimation>
    )
}

export default TransactionTable
