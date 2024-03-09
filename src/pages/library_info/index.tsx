import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RightArrow, ScanIcon } from '../../components/shared_components/svg'
import { focusManager, useQuery } from 'react-query'
import actionService from '../../connections/getdataaction'
import LoadingAnimation from '../../components/shared_components/loading_animation'
// import Borrowtable from '../../components/user_components/borrowtable'
// import { dateFormat } from '../../util/dateFormat'
import { useNavigate } from 'react-router-dom'
import { ILibrary } from '../../models'
import Recordborrowhistory from '../../components/library_components/recordborrowhistory'
import Returnbtn from '../../components/library_components/returnbtn'
import DeleteRecords from '../../components/library_components/delete_records'
import ModalLayout from '../../components/shared_components/modal_layout'
import Qrcode from '../../components/shared_components/qrcode'
import { capitalizeFLetter } from '../../util/capitalLetter'

interface Props { }

function LibraryInfo(props: Props) {
    const { } = props

    const toast = useToast()
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({} as ILibrary)

    const userId = localStorage.getItem("library")

    const navigate = useNavigate()

    focusManager.setFocused(false)

    // const param

    const { isLoading, isRefetching } = useQuery(['libraryinfo', userId], () => actionService.getservicedata(`/record/record/${Number(userId)}`), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: "Error occured",
            });
            console.log(error);

        },
        onSuccess: (data: any) => {
            setData(data?.data?.data);
            console.log(data?.data?.data);

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
                    <Text role='button' onClick={() => navigate("/dashboard/library")} color={"#114EA3"} lineHeight={"19.36px"} >Library</Text>
                    <RightArrow />
                    <Text color={"#515151"} lineHeight={"19.36px"} >{data?.name}</Text>
                </Flex>
                <Flex gap={"8"} pt={"10"} >
                    <Box width={"231px"} h={"225px"} rounded={"16px"} bgColor={"grey"} >
                        <Image src={data?.thumbnail} alt='image' h={"full"} w={"full"} objectFit={"cover"} rounded={"16px"} />
                    </Box>
                    <Flex flexDir={"column"} >
                        <Flex gap={"3"} pt={"6"} alignItems={"center"} >
                            <Text fontSize={"40px"} lineHeight={"48.41px"} fontWeight={"600"} >{capitalizeFLetter(data?.name)}</Text>
                        </Flex>
                        <Text fontSize={"16px"} mt={"2"} lineHeight={"32.4px"} >by {data?.author} -  {data?.publicationYear ? data?.publicationYear : data?.projectYear}</Text>

                        <Flex as={"button"} alignItems={"center"} gap={"2"} my={"auto"} onClick={() => setOpen(true)} >
                            <ScanIcon />
                            <Text as={"button"} textAlign={"left"} lineHeight={"19.36px"} fontWeight={"500"} >Qr_code</Text>
                        </Flex>
                        <Flex mt={"auto"} alignItems={"center"} justifyItems={"center"} gap={"4"} >
                            {data?.status === "NOT_AVAILABLE" && (
                                <Box w={"200px"} >
                                    <Returnbtn {...data} />
                                </Box>
                            )}
                            <DeleteRecords id={data?.id} />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex w={"full"} borderBottomWidth={"0.5px"} gap={"2"} py={"6"} flexDir={"column"} borderColor={"#BDBDBD"} >
                    {data?.IDNumber && (
                        <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >ID Number: <span style={{ fontWeight: "400" }} >{data?.IDNumber}</span></Text>
                    )}
                    {data?.ISBN && (
                        <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >ISBN: <span style={{ fontWeight: "400" }} >{data?.ISBN}</span></Text>
                    )}
                </Flex>
                <Flex w={"full"} borderBottomWidth={"0.5px"} gap={"2"} py={"6"} flexDir={"column"} color={"#4F4F4F"} borderColor={"#BDBDBD"} >
                    <Text fontSize={"14px"} lineHeight={"20.3px"} fontWeight={"600"} color={"#4F4F4F"} >Description</Text>
                    <Text fontSize={"16px"} lineHeight={"24px"} fontWeight={"400"} color={"#333333"} >{data?.description}</Text>
                    <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >Category: <span style={{ fontWeight: "400" }} >{data?.category}</span></Text>
                    <Text fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >Author: <span style={{ fontWeight: "400" }} >{data?.author}</span></Text>
                </Flex>
                <Flex w={"full"} borderBottomWidth={"0.5px"} gap={"2"} py={"6"} flexDir={"column"} color={"#4F4F4F"} borderColor={"#BDBDBD"} >
                    <Recordborrowhistory info={data} data={data?.Borrowing ? data?.Borrowing : []} />
                </Flex>
            </Flex>

            <ModalLayout size={"md"} open={open} close={setOpen} title={""} >

                <Qrcode setOpen={setOpen} type={data?.name ? data?.name : ""} id={data?.id + ""} />

            </ModalLayout>

        </LoadingAnimation>
    )
}

export default LibraryInfo

