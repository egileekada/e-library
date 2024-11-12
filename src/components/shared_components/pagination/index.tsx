import { Box, Flex, Select, Text } from '@chakra-ui/react'
import { ArrowIcon } from '../svg'
import { useEffect, useState } from 'react';
// import Repage from 'react'

interface Props {
    page: number;
    setPage: (by: number) => void;
    limit: number;
    setLimit: (by: number) => void;
    totalItem: number;
    setTotal: (by: number) => void;
}

function Pagination(props: Props) {

    const {
        limit,
        page,
        setPage,
        setLimit,
        totalItem
    } = props

    const [totaldata, setTotaldata] = useState(1)

    useEffect(() => {
        let value = totalItem / limit

        if (Number(value.toString().split(".")[1]) > 0) {
            // if()
            setTotaldata(Number(value.toString().split(".")[0]) + 1)
        } else {
            setTotaldata(Number(value.toString().split(".")[0]))
        }

    }, [totalItem, limit])

    return (
        <Flex  w={"full"} flexDir={"column"} pb={"3"} >

            <Flex position={"relative"} w={"full"} height={"40px"} alignItems={"center"} justifyContent={"center"}  >
                {totaldata > 1 && (
                    <Flex zIndex={"10"} w={"fit-content"} gap={"2"} >
                        <Box disabled={page === 1 ? true : false} cursor={page === 1 ? "not-allowed" : "pointer"} onClick={() => setPage(page - 1)} as='button' >
                            <ArrowIcon />
                        </Box>
                        {new Array(totaldata).fill("").map((_, i) => {
                            if ((i + 1) <= 3) {
                                return (
                                    <Flex key={i} fontSize={"12px"} border={(i + 1) === page ? "1px solid #BDBDBD" : ""} bgColor={(i + 1) === page ? "#F2F2F2" : ""} justifyContent={"center"} alignItems={"center"} width={"35px"} height={"35px"} rounded={"full"} >
                                        {i + 1}
                                    </Flex>
                                )
                            } else if (i === 3) {
                                return (
                                    <Flex w={"fit-content"} gap={"2"} >
                                        <Text>...</Text>
                                        {((i + 1) === page || (totaldata - 1) === 4 || totaldata === 4) && (
                                            <Flex key={i} fontSize={"12px"} border={(i + 1) === page ? "1px solid #BDBDBD" : ""} bgColor={(i + 1) === page ? "#F2F2F2" : ""} justifyContent={"center"} alignItems={"center"} width={"35px"} height={"35px"} rounded={"full"} >
                                                {i + 1}
                                            </Flex>
                                        )}
                                        {(((i + 1) === page && page <= 4 && (totaldata - 1) !== 4 && (totaldata) !== 4) && (
                                            <Text>...</Text>
                                        ))}
                                    </Flex>
                                )
                            } else if (i > 2 && (i + 1) === page && (i + 1) !== (totaldata - 1) && (i + 1) !== totaldata) {
                                console.log("gello");
                                return (
                                    <Flex w={"fit-content"} gap={"2"} >
                                        <Flex key={i} fontSize={"12px"} border={(i + 1) === page ? "1px solid #BDBDBD" : ""} bgColor={(i + 1) === page ? "#F2F2F2" : ""} justifyContent={"center"} alignItems={"center"} width={"35px"} height={"35px"} rounded={"full"} >
                                            {i + 1}
                                        </Flex>

                                        <Text>...</Text>
                                    </Flex>
                                )
                            } else if ((i + 1) === (totaldata - 1) && i !== 2) {
                                return (
                                    <Flex w={"fit-content"} gap={"2"} >
                                        <Flex key={i} fontSize={"12px"} border={(i + 1) === page ? "1px solid #BDBDBD" : ""} bgColor={(i + 1) === page ? "#F2F2F2" : ""} justifyContent={"center"} alignItems={"center"} width={"35px"} height={"35px"} rounded={"full"} >
                                            {i + 1}
                                        </Flex>
                                    </Flex>
                                )
                            }
                            else if ((i + 1) === totaldata && i !== 2) {
                                return (
                                    <Flex w={"fit-content"} gap={"2"} >
                                        <Flex key={i} fontSize={"12px"} border={(i + 1) === page ? "1px solid #BDBDBD" : ""} bgColor={(i + 1) === page ? "#F2F2F2" : ""} justifyContent={"center"} alignItems={"center"} width={"35px"} height={"35px"} rounded={"full"} >
                                            {i + 1}
                                        </Flex>
                                    </Flex>
                                )
                            }
                        })}
                        <Box onClick={() => setPage(page + 1)} as='button' cursor={totaldata === page ? "not-allowed" : "pointer"} disabled={totaldata === page ? true : false} transform={"rotate(180deg)"} >
                            <ArrowIcon />
                        </Box>
                    </Flex>
                )}
                <Flex width={"full"} position={"absolute"} gap={"2"} justifyContent={"end"} alignItems={"center"} right={"0px"} >
                    <Text color={"#333"} lineHeight={"20.3px"} fontSize={"14px"} >Data Per Page</Text>
                    <Select defaultValue={limit} onChange={(e) => setLimit(Number(e.target.value))} bgColor={"white"} width={"fit-content"} border={"1.12px solid #D0D5DD"} rounded={"6.75px"} >
                        <option>10</option>
                        <option>20</option>
                        <option>30</option>
                        <option>40</option>
                        <option>50</option>
                        <option>60</option>
                        <option>70</option>
                        <option>80</option>
                        <option>90</option>
                        <option>100</option>
                    </Select>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Pagination
