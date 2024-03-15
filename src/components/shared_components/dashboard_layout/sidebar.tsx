import { Box, Flex, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FileIcon, Home, Library, Logout, Menu, User } from '../svg'
import { useLocation, useNavigate } from 'react-router-dom'

interface Props { }

function Sidebar(props: Props) {
    const { } = props

    const [activeTab, setActiveTab] = useState("/dashboard")
    const [show, setShow] = useState(false)

    const path = useLocation()
    const navigate = useNavigate()

    const menulist = [
        {
            name: "Dashboard",
            router: "/dashboard/home"
        },
        {
            name: "Inventory",
            router: "/dashboard/inventory"
        },
        {
            name: "Library",
            router: "/dashboard/library"
        },
        {
            name: "E-Library",
            router: "/dashboard/elibrary"
        },
        {
            name: "User",
            router: "/dashboard/user"
        }
    ]

    const adminlist = [
        {
            name: "Dashboard",
            router: "/dashboard/home"
        },
        {
            name: "Inventory",
            router: "/dashboard/inventory"
        },
        {
            name: "Library",
            router: "/dashboard/library"
        },
        {
            name: "E-Library",
            router: "/dashboard/elibrary"
        },
        {
            name: "Personnel",
            router: "/dashboard/personnel"
        },
        {
            name: "User",
            router: "/dashboard/user"
        }
    ]

    useEffect(() => {
        setActiveTab(path.pathname)
    }, [path])

    const clickHandler = (item: string) => {
        navigate(item)
        setActiveTab(item)
    }

    const logOut = () => {
        localStorage.clear()
        navigate("/")
    }

    const role = localStorage.getItem("role");


    return (
        <>
            {!show && (
                <Flex w={"300px"} flexDir={"column"} h={"100vh"} py={"7"} px={"4"} >
                    <Flex w={"full"} px={"2"} alignItems={"center"} justifyContent={"space-between"} >
                        <Flex alignItems={"center"} gap={"2"} >
                            <Box width={"50px"} >
                                <img alt='image' src='/logo.svg' className=' w-full ' />
                            </Box>
                            <Text fontWeight={"600"} fontSize={"16px"} >NDDC Library</Text>
                        </Flex>
                        <Flex onClick={() => setShow((prev) => !prev)} as={"button"} justifyContent={"center"} alignItems={"center"} height={"59px"} px={"4"}  >
                            <Menu />
                        </Flex>
                    </Flex>
                    {role !== "SUPER_ADMIN" && (
                        <Flex w={"full"} py={"8"} flexDir={"column"} gap={"3"} >
                            {menulist.map((item: { name: string, router: string }, index: number) => {
                                return (
                                    <Flex onClick={() => clickHandler(item?.router)} as={"button"} key={index} w={"full"} h={"45px"} px={"4"} gap={"2"} alignItems={"center"} bgColor={item?.router.includes(activeTab) ? "#1F7CFF1A" : ""} rounded={"3px"} >
                                        <Box width={"25px"}>
                                            {item?.name === "Dashboard" && (
                                                <Home color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {(item?.name === "Inventory" || item?.name === "E-Library" || item?.name === "Personnel") && (
                                                <FileIcon color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "User" && (
                                                <User color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Library" && (
                                                <Library color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                        </Box>
                                        <Text color={item?.router.includes(activeTab) ? "#114EA3" : "#8C8C8C"} fontWeight={"medium"} lineHeight={"16.94px"} fontSize={"14px"} >{item.name}</Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    )}
                    {role === "SUPER_ADMIN" && (
                        <Flex w={"full"} py={"8"} flexDir={"column"} gap={"3"} >
                            {adminlist.map((item: { name: string, router: string }, index: number) => {
                                return (
                                    <Flex onClick={() => clickHandler(item?.router)} as={"button"} key={index} w={"full"} h={"45px"} px={"4"} gap={"2"} alignItems={"center"} bgColor={item?.router.includes(activeTab) ? "#1F7CFF1A" : ""} rounded={"3px"} >
                                        <Box width={"25px"}>
                                            {item?.name === "Dashboard" && (
                                                <Home color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {(item?.name === "Inventory" || item?.name === "E-Library" || item?.name === "Personnel") && (
                                                <FileIcon color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "User" && (
                                                <User color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Library" && (
                                                <Library color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                        </Box>
                                        <Text color={item?.router.includes(activeTab) ? "#114EA3" : "#8C8C8C"} fontWeight={"medium"} lineHeight={"16.94px"} fontSize={"14px"} >{item.name}</Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    )}
                    <Flex onClick={logOut} mt={"auto"} as={"button"} w={"full"} h={"45px"} px={"4"} gap={"2"} alignItems={"center"} rounded={"3px"} >
                        <Box width={"25px"}>
                            <Logout />
                        </Box>
                        <Text color={"#8C8C8C"} fontWeight={"medium"} lineHeight={"16.94px"} fontSize={"14px"} >Logout</Text>
                    </Flex>
                </Flex>
            )}

            {show && (
                <Flex width={"50px"} pt={"14"} >
                    <Flex onClick={() => setShow((prev) => !prev)} as={"button"} justifyContent={"center"} alignItems={"center"} height={"59px"} width={"full"}  >
                        <Menu />
                    </Flex>
                </Flex>
            )}
        </>
    )
}

export default Sidebar
