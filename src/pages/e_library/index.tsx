import { Box, Flex } from '@chakra-ui/react'
import Filter from '../../components/shared_components/filter'
import { useState } from 'react';
import Partnertable from '../../components/elibrary_components/partnertable';
import Pagination from '../../components/shared_components/pagination';
// import filterdata from '../../store/filterdata';
// import React from 'react'

interface Props { }

function Elibrary(props: Props) {
    const { } = props

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalItem, setTotalItem] = useState(0)
    // const { search } = filterdata((state) => state);

    const [ type, setType ] = useState("BOOKS")

    return (
        <Flex width={"full"} h={"full"} flexDir={"column"} >
            <Filter data={[]} />
            <Flex w={"full"} py={"2"} justifyContent={"center"} >
                <Flex w={"fit-content"} rounded={"12px"} borderWidth={"1px"} bgColor={"white"} p={"1"} >
                    <Flex onClick={()=> setType("BOOKS")} as={"button"} w={"200px"} justifyContent={"center"} alignItems={"center"} h={"45px"} color={type === "BOOKS" ? "white" : "black"} fontWeight={"600"} bgColor={type === "BOOKS" ? "#1F7CFF" : "white"} rounded={"12px"} >
                        Books
                    </Flex>
                    <Flex onClick={()=> setType("AFFILIATE")} as={"button"} w={"200px"} justifyContent={"center"} alignItems={"center"} h={"45px"} color={type !== "BOOKS" ? "white" : "black"} fontWeight={"600"} bgColor={type !== "BOOKS" ? "#1F7CFF" : "white"} rounded={"12px"} >
                        Affiliate
                    </Flex>
                </Flex>
            </Flex>
            <Partnertable setLimit={setLimit} setPage={setPage} type={type} setTotal={setTotalItem} limit={limit} page={page} />
            {/* {search && ( */}
                <Box mt={"auto"} pt={"12"} >
                    <Pagination setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} totalItem={totalItem} />
                </Box>
            {/* )} */}
        </Flex>
    )
}

export default Elibrary
