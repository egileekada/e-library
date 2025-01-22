import { Flex, Text, useToast } from '@chakra-ui/react'
// import { AreaChart, BarChart, CircleChart } from '../../components/shared_components/svg'
import { focusManager, useQuery } from 'react-query'
import { useState } from 'react'
import actionService from '../../connections/getdataaction'
import LoadingAnimation from '../../components/shared_components/loading_animation'
import RecordGraph from './record_graph'
import BorrowGraph from './borrow_graph'

interface BorrowData {
    total: number,
    overduePercentage: number,
    availablePercentage: number
}

interface RecordData {
    books: number,
    journals: number,
    reports: number
}

interface Props {
    borrow: BorrowData,
    records: RecordData
}

function DashboardPage() {

    const [data, setData] = useState({} as Props)
    const toast = useToast()
    // const navigate = useNavigate()

    focusManager.setFocused(false)

    const { isLoading } = useQuery(['equipmenttable'], () => actionService.getservicedata(`/analytics`,
        {

        }), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error);

        },
        onSuccess: (data: any) => { 
            
            setData(data?.data?.data); 
        }
        
    }) 


    console.log(data);
    
    return (
        <LoadingAnimation loading={isLoading} >
            <Flex flexDir={"column"} gap={"4"} py={"6"} width={"full"} height={"full"} >
                <Flex w={'full'} gap={"4"} >
                    {/* <Piechart /> */}
                    <Flex flexDir={"column"} border={"1px solid #E7E7E7"} pt={"6"} px={"6"} rounded={"lg"} shadow={"md"}  >
                        <Text fontWeight={"bold"} fontSize={"2xl"} >Records</Text>
                        <RecordGraph book={data?.records?.books} report={data?.records?.reports} journal={data?.records?.journals} />
                    </Flex>
                    <Flex flexDir={"column"} border={"1px solid #E7E7E7"} pt={"6"} px={"6"} rounded={"lg"} shadow={"md"}  >
                        <Text fontWeight={"bold"} fontSize={"2xl"} >Borrowed Records %</Text>
                        <BorrowGraph available={data?.borrow?.availablePercentage} overdue={data?.borrow?.overduePercentage} borrow={data?.borrow?.total} />
                    </Flex> 
                </Flex>
                {/* <BarChart /> */}
            </Flex>
        </LoadingAnimation>
    )
}

export default DashboardPage
