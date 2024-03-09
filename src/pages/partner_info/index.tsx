import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RightArrow } from '../../components/shared_components/svg'
import { useQuery } from 'react-query'
import actionService from '../../connections/getdataaction'
import LoadingAnimation from '../../components/shared_components/loading_animation'
// import Borrowtable from '../../components/user_components/borrowtable'
import { dateFormat } from '../../util/dateFormat'
import { useNavigate } from 'react-router-dom'
import { IPartner } from '../../models'
import { capitalizeFLetter } from '../../util/capitalLetter'

interface Props { }

function PartnerInfo(props: Props) {
    const { } = props

    const toast = useToast()
    const [data, setData] = useState({} as IPartner)

    const userId = localStorage.getItem("currentpartner")

    const navigate = useNavigate()


    // const param

    const { isLoading, isRefetching } = useQuery(['partnerindex', userId], () => actionService.getservicedata(`/partner/${userId}`), {
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
                    <Text role='button' onClick={() => navigate("/dashboard/elibrary")} color={"#114EA3"} lineHeight={"19.36px"} >ELibrary</Text>
                    <RightArrow />
                    <Text color={"#515151"} lineHeight={"19.36px"} >{data?.partnerName}</Text>
                </Flex>
                <Flex gap={"8"} pt={"10"} >
                    <Box width={"231px"} h={"225px"} rounded={"2px"}  >
                        <Image w={"full"} h={"full"} rounded={"2px"} src={data?.imageUrl ? data?.imageUrl : "/avatar.png"} objectFit={"cover"} alt='image' />
                    </Box>
                    <Box pt={"4"} >
                        <Flex gap={"3"} >
                            <Text fontSize={"40px"} lineHeight={"48.41px"} fontWeight={"600"} >{capitalizeFLetter(data?.partnerName)}</Text> 
                        </Flex>
                        <Text fontSize={"16px"} mt={"3"} lineHeight={"32.4px"} >Joined: <span style={{ fontWeight: "600" }} >{dateFormat(data?.createdAt)}</span></Text>
                        <Text fontSize={"16px"} lineHeight={"32.4px"} >Partner Resource Name: <span style={{ fontWeight: "600" }} >{data?.partnerResourceName}</span></Text> 
                    </Box>
                </Flex> 

                <Flex w={"full"} borderBottomWidth={"0.5px"} gap={"2"} py={"6"} flexDir={"column"} color={"#4F4F4F"} borderColor={"#BDBDBD"} >
                    <Text fontSize={"14px"} color={"#114EA3"} lineHeight={"32.4px"} >Partner Url: <a href={data?.partnerResourceUrl} target="_blank" style={{ fontWeight: "600", color: "#114EA3" }} >{data?.partnerResourceUrl}</a></Text> 
                </Flex>
            </Flex>
        </LoadingAnimation>
    )
}

export default PartnerInfo

