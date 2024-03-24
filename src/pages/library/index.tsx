import { useState } from 'react' 
import Filter from '../../components/shared_components/filter'
import Pagination from '../../components/shared_components/pagination'
import { Box, Flex } from '@chakra-ui/react'
import Librarytable from '../../components/library_components/librarytable'

interface Props {}

function LibraryPage(props: Props) {
    const {} = props

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(30)
    const [totalItem, setTotalItem] = useState(0) 

    return (
        <Flex width={"full"} h={"full"} flexDir={"column"} >
            <Filter data={[]} />
            <Librarytable setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} />
            <Box mt={"auto"} pt={"12"} > 
                <Pagination  setLimit={setLimit} setPage={setPage} setTotal={setTotalItem} limit={limit} page={page} totalItem={totalItem}  />
            </Box>
        </Flex>
    )
}

export default LibraryPage
