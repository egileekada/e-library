import { Box, Button, Flex, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
// import React from 'react'
import { FilterIcon } from '../svg'
import { useEffect, useState } from 'react'
import ModalLayout from '../modal_layout'
import filterdata from '../../../store/filterdata'
import { useLocation } from 'react-router-dom'
import InputComponent from '../custom_input'
import Yearselector from '../../../models/yearselector'

interface Props {
    type: "Gadget" | "Equipment" | "Library" | "User"
}

function Otherfilter(props: Props) {
    const { } = props

    const [show, setShow] = useState(false)
    const [initialFilter, setInitialFilter] = useState({} as any)

    const { filter, setFilter } = filterdata((state) => state);

    const datastatus = [
        {
            name: "all",
            value: ""
        },
        {
            name: "active",
            value: "ACTIVE"
        },
        {
            name: "temporarily disabled",
            value: "TEMPORARILY_DISABLED"
        },
        {
            name: "permanenly disabled",
            value: "PERMANENTLY_DISABLED"
        },
    ]

    const userstatus = [
        {
            name: "all",
            value: ""
        },
        {
            name: "Debitor",
            value: "true"
        }
    ]

    const datastate = [
        {
            name: "all",
            value: "ALL"
        },
        {
            name: "not available",
            value: "NOT_AVAILABLE"
        },
        {
            name: "available",
            value: "AVAILABLE"
        },
    ]

    const path = useLocation()

    const closeHandler = () => {
        setShow(false)
        setFilter(initialFilter)
    }

    const clearHandler = () => {
        setShow(false)
        setFilter({} as any)
        setInitialFilter({} as any)
    }

    useEffect(() => {
        // if (path?.pathname !== "/dashboard/library") {
        //     setInitialFilter({ ...filter, status: "ACTIVE" })
        // } else {
        //     setInitialFilter({} as any)
        // }
    }, [])

    console.log(initialFilter);
    


    return (
        <Box pos={"relative"} >
            <Button onClick={() => setShow(true)} w={"140px"} height={"45px"} bgColor={"white"} gap={"2"} fontSize={"16px"} fontWeight={"medium"} lineHeight={"24.3px"} display={"flex"} alignItems={"center"} justifyContent={"center"} rounded={"5px"} color={"#333333"} border={"1px solid #828282"} >
                <FilterIcon />
                Filter
            </Button>
            <ModalLayout size={"md"} title={"Filter"} open={show} close={setShow} >

                {(path?.pathname !== "/dashboard/library" && path?.pathname !== "/dashboard/user") && (
                    <Flex w={"full"} flexDir={"column"} >
                        <Text fontWeight={"700"} textAlign={"left"} >Status</Text>
                        <Flex mt={"1"} justifyContent={"center"} flexWrap={"wrap"} gap={"3"} >
                            <Select
                                onChange={(e) => setInitialFilter({ ...initialFilter, state: e.target.value })}
                                fontSize={"14px"} value={initialFilter?.state} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                                {/* <option value={""} >Select Status</option> */}
                                {datastatus?.map((item: {
                                    name: string,
                                    value: string
                                }, index: number) => {
                                    return (
                                        <option key={index} value={item?.value} >{item?.name}</option>
                                    )
                                })}
                            </Select>
                        </Flex>
                        <Box onClick={() => closeHandler()} fontSize={"14px"} mt={"8"} fontWeight={"700"} mx={"auto"} as='button' >Show results</Box>
                        <Box onClick={() => setFilter({ status: "active" })} fontSize={"12px"} color={"#676767"} mt={"1"} fontWeight={"400"} mx={"auto"} as='button' >Clear all</Box>
                    </Flex>
                )}
                {path?.pathname === "/dashboard/user" && (
                    <Flex w={"full"} flexDir={"column"} >
                        <Text fontWeight={"700"} textAlign={"left"} >Status</Text>
                        <Flex mt={"1"} justifyContent={"center"} flexWrap={"wrap"} gap={"3"} >
                            <Select
                                onChange={(e) => setInitialFilter({ ...initialFilter, debtors: e.target.value })}
                                fontSize={"14px"} value={initialFilter?.debtors} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                                {/* <option value={""} >Select Status</option> */}
                                {userstatus?.map((item: {
                                    name: string,
                                    value: string
                                }, index: number) => {
                                    return (
                                        <option key={index} value={item?.value} >{item?.name}</option>
                                    )
                                })}
                            </Select>
                        </Flex>
                        <Box onClick={() => closeHandler()} fontSize={"14px"} mt={"8"} fontWeight={"700"} mx={"auto"} as='button' >Show results</Box>
                        <Box onClick={() => setFilter({ status: "active" })} fontSize={"12px"} color={"#676767"} mt={"1"} fontWeight={"400"} mx={"auto"} as='button' >Clear all</Box>
                    </Flex>
                )}
                {path?.pathname === "/dashboard/library" && (
                    <Flex w={"full"} flexDir={"column"} gap={"3"} >
                        <Box w={"full"} >
                            <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} textAlign={"left"} >State</Text>

                            <RadioGroup onChange={(e) => setInitialFilter({ ...initialFilter, state: e })} value={initialFilter?.state}>
                                <Stack direction='row'>
                                    {datastate?.map((item: {
                                        name: string,
                                        value: string
                                    }, index: number) => {
                                        return (
                                            <Radio key={index} value={item?.value} >{item?.name}</Radio>
                                        )
                                    })}
                                </Stack>
                            </RadioGroup>
                        </Box>
                        <Box w={"full"} >
                            <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} textAlign={"left"} >Enter Author</Text>
                            <InputComponent onChange={(e: any) => setInitialFilter({ ...initialFilter, author: e.target.value })} value={initialFilter?.author} type='text' />
                        </Box>
                        <Box w={"full"} >
                            <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} textAlign={"left"} >Enter ISBN</Text>
                            <InputComponent onChange={(e: any) => setInitialFilter({ ...initialFilter, isbn: e.target.value })} value={initialFilter?.isbn} type='text' />
                        </Box>
                        <Box w={"full"} >
                            <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} textAlign={"left"} >Enter ISSN</Text>
                            <InputComponent onChange={(e: any) => setInitialFilter({ ...initialFilter, issn: e.target.value })} value={initialFilter?.issn} type='text' />
                        </Box>
                        <Box w={"full"} >
                            <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} textAlign={"left"} >Select Publication Year</Text>
                            <Yearselector onChange={(e: any) => setInitialFilter({ ...initialFilter, publicationYear: e.target.value })} value={initialFilter?.publicationYear} />
                        </Box>

                        <Box onClick={() => closeHandler()} fontSize={"14px"} mt={"8"} fontWeight={"600"} mx={"auto"} as='button' >Show results</Box>
                        <Box onClick={clearHandler} fontSize={"12px"} color={"#676767"} mt={"1"} fontWeight={"400"} mx={"auto"} as='button' >Clear all</Box>
                    </Flex>
                )}
            </ModalLayout>
        </Box>
    )
}

export default Otherfilter
