import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FileIcon, Home, Library, Logout, Menu, User } from '../svg'
import { useLocation, useNavigate } from 'react-router-dom'
import ModalLayout from '../modal_layout' 
import { useMutation } from 'react-query'
import { useEditProfileCallback, useUploaderCallback } from '../../../connections/useaction'
import ImageSelector from '../image_selector'

interface Props { }

function Sidebar(props: Props) {
    const { } = props

    const [activeTab, setActiveTab] = useState("/dashboard")
    const [show, setShow] = useState(false)

    const [open, setOpen] = useState(false)

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
        },
        {
            name: "Transaction",
            router: "/dashboard/transaction"
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
        },
        {
            name: "Transaction",
            router: "/dashboard/transaction"
        },
        {
            name: "Profile",
            router: "#"
        }
    ]

    useEffect(() => {
        setActiveTab(path.pathname)
    }, [path])

    const clickHandler = (item: string) => {
        if (item === "#") {
            setOpen(true)
        } else {
            navigate(item)
            setActiveTab(item)
        }
    }

    const logOut = () => {
        localStorage.clear()
        navigate("/")
    }

    const role = localStorage.getItem("role");

    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");

    let pic = localStorage.getItem("profilePicture") as string
    const name = localStorage.getItem("name");
    const toast = useToast()
    const { handleUploader } = useUploaderCallback()
    const [imageFile, setImageFile] = useState("");

    const { handleEditProfile } = useEditProfileCallback()
    const id = localStorage.getItem("id");

    const [userData, setData] = useState({
        name: name, 
        phone: phone, 
        email: email
    })

    useEffect(() => {
        setData({
            name: name,
            phone: phone,
            email: email
        })
    }, [])


    //API call to handle adding user
    const uploaderMutation = useMutation(async () => {

        let formData = new FormData()
        formData.append("file", imageFile)

        const response = await handleUploader(formData, imageFile);

        if (response?.status === 201 || response?.status === 200) {

            editProfile.mutateAsync({ ...userData, profilePicture: response?.data?.data }, {
                onSuccess: (data: any) => {
                    if (data) {
                        // close(false)
                    }
                },
            })
                .catch(() => {
                    toast({
                        title: "Something went wrong",
                        status: "error",
                        duration: 3000,
                        position: "top",
                    });
                });


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


    //API call to handle adding user
    const editProfile = useMutation(async (formData: any) => {

        let response = await handleEditProfile(formData, id);

        if (response?.status === 201 || response?.status === 200) {

            console.log(response);
            

            console.log(response?.data.data);
 
            localStorage.setItem("phone", response?.data?.data?.phone);
            localStorage.setItem("profilePicture", response?.data?.data?.profilePicture);
            localStorage.setItem("name", response?.data?.data?.name); 
            

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });
            setOpen(false) 
            navigate(0)
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


    const submitHandler = () => {
        if(imageFile) {
            uploaderMutation.mutate()
        } else {
            editProfile.mutate(userData)
        }
    }

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
                                            {(item?.name === "User" || item?.name === "Profile") && (
                                                <User color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Library" && (
                                                <Library color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Transaction" && (
                                                <FileIcon color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
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
                                            {(item?.name === "User" || item?.name === "Profile") && (
                                                <User color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Library" && (
                                                <Library color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
                                            )}
                                            {item?.name === "Transaction" && (
                                                <FileIcon color={item?.router.includes(activeTab) ? "#114EA3" : ""} />
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
            <ModalLayout title={"Edit Profile"} size={"lg"} open={open} close={setOpen} >
                <Flex flexDirection={"column"} gap={"4"} fontSize={"14px"} >
                    <Flex flexDir={"column"} gap={"1"} >
                        <Text>Full Name</Text>
                        <Input w={"full"} value={userData?.name + ""} onChange={(e) => setData({ ...userData, name: e.target.value })} />
                    </Flex>
                    <Flex flexDir={"column"} gap={"1"} >
                        <Text>Email</Text>
                        <Input w={"full"} value={userData?.email + ""} onChange={(e) => setData({ ...userData, email: e.target.value })}  />
                    </Flex>
                    <Flex flexDir={"column"} gap={"1"} >
                        <Text>Role</Text>
                        <Input w={"full"} value={role + ""} disabled={true} />
                    </Flex>
                    <Flex flexDir={"column"} gap={"1"} >
                        <Text>Phone Number</Text>
                        <Input w={"full"} value={userData?.phone + ""} onChange={(e) => setData({ ...userData, phone: e.target.value })} />
                    </Flex>

                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Image</Text>
                        <ImageSelector image={pic} setImage={setImageFile} />
                    </Box>
                    <Button onClick={submitHandler} isLoading={editProfile?.isLoading || uploaderMutation?.isLoading} isDisabled={editProfile?.isLoading || uploaderMutation?.isLoading} type="button" h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"6"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                        Continue
                    </Button>
                </Flex>
            </ModalLayout>
        </>
    )
}

export default Sidebar
