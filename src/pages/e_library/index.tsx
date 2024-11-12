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

    return (
        <Flex width={"full"} h={"full"} flexDir={"column"} >
            <Filter data={[]} />
            <Partnertable setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} />
            {/* {search && ( */}
                <Box mt={"auto"} pt={"12"} >
                    <Pagination setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} totalItem={totalItem} />
                </Box>
            {/* )} */}
        </Flex>
    )
}

export default Elibrary
