import { Box, Flex } from '@chakra-ui/react' 
import { useState } from 'react'
import Filter from '../../components/shared_components/filter'
import Pagination from '../../components/shared_components/pagination'
import TransactionTable from '../../components/transaction'

export default function Transaction() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalItem, setTotalItem] = useState(0)
    const [data, setData] = useState([] as Array<any>)
    
    return (
        <Flex width={"full"} h={"full"} flexDir={"column"} >
            <Filter data={data} />
            <TransactionTable setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} tableRef={undefined} setDataInfo={setData} />
            {/* <Librarytable setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} /> */}
            <Box mt={"auto"} pt={"12"} >
                <Pagination setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} totalItem={totalItem} />
            </Box>
        </Flex>
    )
}
