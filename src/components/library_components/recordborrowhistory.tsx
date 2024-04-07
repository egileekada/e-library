// import React, { useState } from 'react'
// import { useQuery } from 'react-query'
// import { useNavigate } from 'react-router-dom'
// import actionService from '../../connections/getdataaction'
import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { BorrowData, ILibrary } from '../../models'
import { dateFormat } from '../../util/dateFormat'
import LoadingAnimation from '../shared_components/loading_animation'
import Returnbtn from './returnbtn'
// import { useState } from 'react'
// import ModalLayout from '../shared_components/modal_layout'
// import Qrcode from '../shared_components/qrcode'

interface Props {
    info: ILibrary
    data: Array<BorrowData>
}

function Recordborrowhistory(props: Props) {
    const {
        data,
        info
    } = props


    // const [open, setOpen] = useState(false)

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
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Borrowed</Th>
                            <Th>Returned</Th>
                            <Th>Status</Th>
                            <Th>Condition</Th>
                            <Th>action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item: BorrowData, index: number) => { 
                            return (
                                <Tr role='button' fontSize={"14px"} key={index} >
                                    <Td>{item?.user?.name}</Td>
                                    <Td>{item?.user?.email}</Td>
                                    <Td>{dateFormat(item?.startDate)}</Td>
                                    <Td>{dateFormat(item?.endDate)}</Td>
                                    <Td>
                                        {statuscomponent(item?.status)}
                                    </Td>
                                    <Td >
                                        {!item?.return_state && "-"}
                                        {item?.return_state && statecomponent(item?.return_state)}
                                    </Td>
                                    <Td>

                                        <Flex justifyContent={"center"} gap={"4"} >

                                            {item?.status !== "RETURNED" && (
                                                <Returnbtn table={true} {...info} borrowId={item?.id} />
                                            )}

                                        </Flex>

                                        {/* <ModalLayout size={"md"} open={open} close={setOpen} title={""} >

                                            <Qrcode setOpen={setOpen} type={info?.name ? info?.name : ""} id={item?.id ? item?.id : "" as any} />

                                        </ModalLayout> */}
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

export default Recordborrowhistory
