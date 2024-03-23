import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex } from '@chakra-ui/react'
// import React from 'react'
import { IBorrowData } from '../../models'
import { dateFormat } from '../../util/dateFormat'
import LoadingAnimation from '../shared_components/loading_animation'

interface Props {
    tableRef?: any,
    data: any 
}

function Borrowtable(props: Props) {
    const {
        tableRef,
        data
    } = props

    const statuscomponent = (item: string) => {
        if (item === "RETURNED") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#1B4332"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#A7D5C0"} >
                    Returned
                </Flex>
            )
        } else if (item === "BORROWED") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#3F4010"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#E7DD84"} >
                    Borrowed
                </Flex>
            )
        } else {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#450000"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#FFDEDE"} >
                    Overdue
                </Flex>
            )
        }
    }


    const statecomponent = (item: string) => {
        if (item === "SATISFACTORY") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#1B4332"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#A7D5C0"} >
                    Satisfactory
                </Flex>
            )
        } else if (item === "DAMAGED") {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#450000"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#FFDEDE"} >
                    Damaged
                </Flex>
            )
        } else {
            return (
                <Flex width={"180px"} rounded={"10px"} color={"#450000"} height={"30px"} lineHeight={"16.94px"} fontSize={"14px"} justifyContent={"center"} alignItems={"center"} bgColor={"#FFDEDE"} >
                    Unusable
                </Flex>
            )
        }
    }

    return (
        <LoadingAnimation loading={false} length={data?.length} > 
            <TableContainer>
                <Table ref={tableRef} variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Literature</Th>
                            <Th>Borrowed</Th>
                            <Th>Returned</Th>
                            <Th>Status</Th>
                            <Th>Condition</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: IBorrowData, index: number) => {
                            return (
                                <Tr role='button' fontSize={"14px"} key={index} >
                                    <Td>{item?.record?.name}</Td>
                                    <Td>{dateFormat(item?.startDate)}</Td>
                                    <Td>{dateFormat(item?.endDate)}</Td>
                                    <Td>
                                        {statuscomponent(item?.status)}
                                    </Td>
                                    <Td >
                                        {!item?.return_state && "-"}
                                        {item?.return_state  && statecomponent(item?.return_state)} 
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

export default Borrowtable
