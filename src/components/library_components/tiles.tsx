import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { EyeArrow } from '../shared_components/svg'
import { ILibrary } from '../../models'
import Borrowbtn from './borrowbtn'
import { useNavigate } from 'react-router-dom'
import Returnbtn from './returnbtn'
import { capitalizeFLetter } from '../../util/capitalLetter'
import { textLimit } from '../../util/textlimit'
// import React from 'react' 

function Tiles(props: ILibrary) {
    const {
        name,
        author,
        ISBN,
        value,
        thumbnail,
        IDNumber,
        id,
        status,
        Borrowing
    } = props


    const navigate = useNavigate()

    const statuscomponent = (item: any) => {
        if (item === "AVAILABLE") {
            return (
                <Flex bgColor={"#DEFFEB"} rounded={"20px"} px={"12px"} py={"4px"} justifyContent={"center"} alignItems={"center"} >
                    <Text fontSize={"12px"} lineHeight={"20.3px"} color={"#00451C"} >Available</Text>
                </Flex>
            )
        } else {
            return (
                <Flex bgColor={"#FFDCDC"} rounded={"20px"} px={"12px"} py={"4px"} justifyContent={"center"} alignItems={"center"} >
                    <Text fontSize={"12px"} lineHeight={"20.3px"} color={"#C50000"} >Unavailable</Text>
                </Flex>
            )
        }
    }

    const clickHandler = () => {
        navigate("/dashboard/library/info")
        localStorage.setItem("library", id + "")
    }

    return (
        <Flex textAlign={"left"} w={"full"} h={"full"} flexDir={"column"} pos={"relative"} p={"4"} > 
            <Flex gap={"2"} alignItems={"end"} >

                <Flex w={"full"} gap={"2"} alignItems={"end"} >
                    <Box w={"80px"} h={"auto"} bgColor="gray" borderWidth={"3px"} rounded={"12px"}  >
                        <Image w={"full"} h={"auto"} rounded={"12px"} src={thumbnail} objectFit={"contain"} alt='parnter' />
                    </Box>
                </Flex> 
                {statuscomponent(status ? status : "")}
            </Flex>
            <Text color={"#1E1B39"} lineHeight={"21.7px"} fontSize={"18px"} fontWeight={"600"} mt={"4"} >{textLimit(capitalizeFLetter(name), 30)}</Text>
            <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >Author: {textLimit(author+"", 30)}</Text>
            {ISBN && (
                <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >ISBN: {ISBN}</Text>
            )}
            {IDNumber && (
                <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >ID Number: {IDNumber}</Text>
            )}
            <Text fontSize={"14px"} lineHeight={"23.2px"} color={"#828282"} >Value: {value}</Text>
            <Flex gap={"4"} h={"60px"} alignItems={"end"} mt={"auto"} >
                <Button onClick={clickHandler} h={"45px"} gap={"3"} rounded={"5px"} width={"full"} bgColor={"#1F7CFF0D"} _hover={{ backgroundColor: "#1F7CFF0D" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"#597AB8"} >
                    <Box w={"fit-content"} >
                        <EyeArrow />
                    </Box>
                    View
                </Button>
                {status === "AVAILABLE" && (
                    <Borrowbtn {...props} />
                )}
                {(status !== "AVAILABLE" && Borrowing) && (
                    <Returnbtn borrowId={Borrowing?.length > 0 ? Borrowing[0]?.id : ""} {...props} />
                )}
            </Flex>
        </Flex>
    )
}

export default Tiles
