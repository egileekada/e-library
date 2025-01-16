import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { FileColored, Notification } from '../svg'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
// import React from 'react'

interface Props { }

function Navbar(props: Props) {
    const { } = props

    const path = useLocation()

    let name = localStorage.getItem("name") as string
    let pic = localStorage.getItem("profilePicture") as string

    const [nameData, setNameData] = useState("")
    const [picData, setPicData] = useState("")

    useEffect(()=> {
        setNameData(name)
        setPicData(pic)
    }, [name, pic])


    return (
        <Flex px={"6"} py={"4"} width={"full"} alignItems={"center"} justifyContent={"space-between"} >
            <Flex alignItems={"center"} gap={"2"} >
                <FileColored />
                <Text color={"#333333"} lineHeight={"24.2px"} fontWeight={"medium"} fontSize={"20px"} >
                    {path.pathname === "/dashboard/home" && (
                        "Dashboard"
                    )}
                    {path.pathname === "/dashboard/elibrary" && (
                        "E-Library"
                    )}
                    {path.pathname === "/dashboard/user" && (
                        "User"
                    )}
                    {path.pathname === "/dashboard/user/info" && (
                        "User"
                    )}
                    {path.pathname === "/dashboard/inventory" && (
                        "Inventory"
                    )}
                    {path.pathname === "/dashboard/inventory/gadgets" && (
                        "Gadgets"
                    )}
                    {path.pathname === "/dashboard/inventory/equipments" && (
                        "Equipments"
                    )}
                    {path?.pathname === "/dashboard/personnel" && (
                        "Personnel"
                    )}
                    {path?.pathname === "/dashboard/library" && (
                        "Library"
                    )}
                    {path?.pathname === "/dashboard/library/info" && (
                        "Library"
                    )}

                </Text>
            </Flex>
            <Flex alignItems={"center"} >
                <Notification />
                <Box width={"36px"} height={"36px"} rounded={"full"} bgColor={"#D9D9D9"} ml={"6"} >
                    <Image w={"full"} h={"full"} rounded={"full"} src={picData ?? "/avatar.png"} objectFit={"cover"} alt='profile' />
                </Box>
                <Text color={"#010203"} lineHeight={"19.36px"} ml={"2"} >{name?.length > 12 ? name?.slice(0, 12) + "..." : nameData}</Text>
            </Flex>
        </Flex>
    )
}

export default Navbar
