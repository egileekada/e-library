import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RightArrow } from '../../components/shared_components/svg'
import { useQuery } from 'react-query'
import actionService from '../../connections/getdataaction'
import LoadingAnimation from '../../components/shared_components/loading_animation'
import Borrowtable from '../../components/user_components/borrowtable'
import { dateFormat } from '../../util/dateFormat'
import { useNavigate } from 'react-router-dom'
import { capitalizeFLetter } from '../../util/capitalLetter'

interface Props { }

function UserInfo(props: Props) {
    const { } = props

    const toast = useToast()
    const [data, setData] = useState({} as any)

    const userId = localStorage.getItem("currentuser")

    const navigate = useNavigate()


    // const param

    const { isLoading, isRefetching } = useQuery(['userindex', userId], () => actionService.getservicedata(`/user/singleUser/${userId}`), {
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

    useEffect(() => {
        if (!userId) {
            navigate("/dashboard/user")
        }
    }, [])  

    return (
        <LoadingAnimation loading={isLoading} refeching={isRefetching} >
            <Flex width={"full"} height={"full"} flexDir={"column"} pt={"8"} pb={"4"} >
                <Flex gap={"2px"} alignItems={"center"} >
                    <Text role='button' onClick={() => navigate("/dashboard/user")} color={"#114EA3"} lineHeight={"19.36px"} >Users</Text>
                    <RightArrow />
                    <Text color={"#515151"} lineHeight={"19.36px"} >{data?.name}</Text>
                </Flex>
                <Flex gap={"8"} pt={"10"} alignItems={"center"} >
                    <Box width={"231px"} h={"225px"} rounded={"2px"}  >
                        <Image w={"full"} h={"full"} rounded={"2px"} src={data?.profilePicture ? data?.profilePicture : "/avatar.png"} objectFit={"cover"} alt='image' />
                    </Box>
                    <Box>
                        <Flex gap={"3"} >
                            <Text fontSize={"40px"} lineHeight={"48.41px"} fontWeight={"600"} >{capitalizeFLetter(data?.name)}</Text>
                            {/* <Box mt={"1"} bgColor={"#FFF8DE"} h={"fit-content"} fontSize={"14px"} lineHeight={"20.3px"} py={"4px"} px={"12px"} rounded={"20px"} >
                                Borrowed
                            </Box> */}
                        </Flex>
                        <Text fontSize={"16px"} mt={"3"} lineHeight={"32.4px"} >Joined: <span style={{ fontWeight: "600" }} >{dateFormat(data?.createdAt)}</span></Text>
                        {data?.Borrowing?.length > 0 && (
                            <>
                                {data?.Borrowing[0]?.record?.status === "NOT_AVAILABLE" && (
                                    <> 
                                        <Text fontSize={"16px"} lineHeight={"32.4px"} >Borrowed: <span style={{ fontWeight: "600" }} >{data?.Borrowing[0]?.record?.name}</span></Text>
                                        <Text fontSize={"16px"} lineHeight={"32.4px"} >To Be Returned: <span style={{ fontWeight: "600" }} >{dateFormat(data?.Borrowing[0]?.endDate)}</span></Text>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Flex>
                <Flex w={"full"} borderBottomWidth={"0.5px"} gap={"2"} py={"6"} flexDir={"column"} borderColor={"#BDBDBD"} >
                    <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >Phone Number: <span style={{ fontWeight: "400" }} >{data?.phone}</span></Text>
                    <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >Email Address: <span style={{ fontWeight: "400" }} >{data?.email}</span></Text>
                </Flex>
                <Flex w={"full"} py={"6"} flexDir={"column"} gap={"4"} >
                    <Text fontSize={"18px"} lineHeight={"26.1px"} fontWeight={"600"} >Borrow History</Text>
                    <Borrowtable data={data?.Borrowing} />
                </Flex>
            </Flex>
        </LoadingAnimation>
    )
}

export default UserInfo

