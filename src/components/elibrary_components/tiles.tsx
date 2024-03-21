import { Box, Flex, Image, Text, Button, Spinner, useToast} from '@chakra-ui/react'
import { PinIcon } from '../shared_components/svg'
import { IPartner } from '../../models'
import { useNavigate } from 'react-router-dom'
import Updateform from './update_form'
import { usePinCallback } from '../../connections/useaction'
import { useMutation, useQueryClient } from 'react-query'
import { capitalizeFLetter } from '../../util/capitalLetter'
// import React from 'react' 

function Tiles(props: IPartner) {
    const {
        imageUrl,
        partnerName,
        partnerResourceName,
        pinned,
        id, 
    } = props

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const clickHandler = () => {
        localStorage.setItem("currentpartner", id + "")
        navigate("/dashboard/elibrary/info")
    }

    const { handlePin } = usePinCallback()

    const toast = useToast()


    //API call to handle adding user
    const pinMutation = useMutation(async () => {
        const response = await handlePin(id);


        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['partnertable']) 

            return response;
        } else if (response?.data?.statusCode === 400) {
            toast({
                title: response?.data?.message,
                status: "error",
                duration: 3000,
                position: "top",
            });
            return
        }
    });

    const pinHandler =()=> {

        pinMutation.mutateAsync()
        .catch(() => {
            toast({
                title: "Something went wrong",
                status: "error",
                duration: 3000,
                position: "top",
            });
        });
    }

    return (
        <Box w={"full"} textAlign={"left"} pos={"relative"} p={"4"} >
            <Flex justifyContent={"center"} alignItems={"center"} w={"30px"} pt={"2px"} pr={"2px"} h={"30px"} rounded={"full"} bgColor={pinned ? "#1F7CFF1A" : ""}  onClick={()=> pinHandler()} as='button' position={"absolute"} right={"3"} top={"3"} >
                {pinMutation?.isLoading && (
                    <Spinner size={"sm"} />
                )}
                {!pinMutation?.isLoading && (
                    <PinIcon color={pinned ? "#3C41F0" : ""}  />
                )}
            </Flex>
            <Flex w={"full"} gap={"2"} alignItems={"end"} >

                <Box w={"80px"} h={"auto"} bgColor="gray" borderWidth={"3px"} rounded={"12px"}  >
                    <Image w={"full"} h={"full"} rounded={"12px"} src={imageUrl} objectFit={"contain"} alt='parnter' />
                </Box> 
            </Flex>
            <Text color={"#1E1B39"} lineHeight={"21.7px"} fontSize={"18px"} fontWeight={"600"} mt={"4"} >{capitalizeFLetter(partnerName)}</Text>
            <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >Partner: {partnerResourceName}</Text>
            {/* <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >PID Number: {id}</Text> */}
            <Flex w={"full"} gap={"4"} >
                <Button onClick={() => clickHandler()} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    View
                </Button>
                <Updateform data={props} />
            </Flex>
        </Box>
    )
}

export default Tiles

