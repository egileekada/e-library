import { Box, Button, Flex, Radio, RadioGroup, Stack, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ModalLayout from '../shared_components/modal_layout'
import { ILibrary } from '../../models'
import InputComponent from '../shared_components/custom_input'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useMutation, useQueryClient } from 'react-query'
import { useReturnRecordCallback } from '../../connections/useaction'
import { QrReader } from 'react-qr-reader'

function Returnbtn(props: ILibrary) {
    const {
        name,
        ISBN,
        IDNumber, 
        id,
        table,
        borrowId
    } = props

    const toast = useToast()

    const queryClient = useQueryClient()

    const { handleReturnRecord } = useReturnRecordCallback()

    const loginSchema = yup.object({
        recordId: yup.string().required('required'),
        return_state: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            recordId: "",
            return_state: "",
        },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });


    const datastate = [
        {
            name: "satisfactory",
            value: "SATISFACTORY"
        },
        {
            name: "damaged",
            value: "DAMAGED"
        },
        {
            name: "unusable",
            value: "UNUSABLE"
        },
    ]

    const typestate = [
        {
            name: "Scan QR Code",
            value: "1"
        },
        {
            name: "Input Details Manually",
            value: "2"
        },
    ]

    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState("2")
    const [type, setType] = useState("0")
    const [qrCode, setQrCode] = useState("")

    useEffect(() => {
        formik?.setFieldValue("recordId", borrowId)
    }, [])


    //API call to handle adding user
    const addMutation = useMutation(async () => {

        let response = await handleReturnRecord(formik?.values);
 

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['libraryinfo'])
            queryClient.invalidateQueries(['librarytable'])
            
            setOpen(false)

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

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (!formik.dirty || !formik.isValid) {
            toast({
                title: "You have to fill in the form to continue",
                status: "error",
                duration: 3000,
                position: "top",
            });
            return;
        }

        addMutation.mutateAsync()
            .catch(() => {
                toast({
                    title: "Something went wrong",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
            });

    }

    const clickHandler = () => {
        setTab("0")
        setOpen(true)
    }

    useEffect(() => {
        setTab("2")
    }, [qrCode])

    return (
        <>
            {table && (
                <Text fontWeight={"600"} color={"#1F7CFF"} onClick={() => setOpen(true)} >Return</Text>
            )}
            {!table && (
                <Button onClick={() => clickHandler()} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} px={"8"} fontWeight={"600"} fontSize={"14px"} bgColor={"#FFF"} border={"2px solid #1F7CFF"} _hover={{ backgroundColor: "#FFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"#1F7CFF"} >
                    Return
                </Button>
            )}
            <ModalLayout size={"md"} open={open} close={setOpen} title={"Return Book"} >
                <Flex w={"full"} flexDir={"column"} pb={"6"} >
                    <Text textAlign={"center"} fontSize={"20px"} lineHeight={"29px"} color={"#010203"} >{name}</Text>
                    {ISBN && (
                        <Text textAlign={"center"} fontSize={"14px"} lineHeight={"20.3px"} color={"#828282"} >ISBN: {ISBN}</Text>
                    )}
                    {IDNumber && (
                        <Text textAlign={"center"} fontSize={"14px"} lineHeight={"20.3px"} color={"#828282"} >ID Number: {IDNumber}</Text>
                    )}
                    {tab === "0" && (
                        <Flex w={"full"} alignItems={"center"} flexDir={"column"} >
                            <RadioGroup mt={"3"} onChange={(e) => setType(e)} value={qrCode}>
                                <Stack direction='row'>
                                    {typestate?.map((item: {
                                        name: string,
                                        value: string
                                    }, index: number) => {
                                        return (
                                            <Radio key={index} value={item?.value} >{item?.name}</Radio>
                                        )
                                    })}
                                </Stack>
                            </RadioGroup>
                            <Button onClick={() => setTab(type)} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"6"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                                Continue
                            </Button>
                        </Flex>
                    )}
                    {tab === "1" && (
                        <Flex w={"full"} alignItems={"center"} flexDir={"column"} >
                            <Box w={"70%"} > 
                                    <QrReader
                                        onResult={(result: any) => {
                                            if (!!result) {
                                                console.log(result);

                                                setQrCode(result?.text);
                                                formik?.setFieldValue("recordId", result?.text)
                                            }
                                        }}

                                        constraints={{ facingMode: "user" }}
                                        videoStyle={{ width: '100%', innerHeight: "150px" }}
                                    // style={{ width: '100%' }}
                                    /> 
                            </Box>
                            <Text color={"#4F4F4F"} lineHeight={"19px"} textAlign={"center"} mt={"2"} >Hold the QR code steady on camera</Text>
                            {/* <Button onClick={() => setTab(type)} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"6"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                                Continue
                            </Button> */}
                        </Flex>
                    )}
                    {tab === "2" && (

                        <form onSubmit={submit} style={{ width: "100%" }} >

                            <Text mt={"3"} mb={"1"} color={"#101928"} fontSize={"14px"} fontWeight={"500"} lineHeight={"20.3px"} >Borrow ID</Text>
                            <InputComponent
                                name="recordId"
                                onChange={formik.handleChange}
                                onFocus={() =>
                                    formik.setFieldTouched("recordId", true, true)
                                }
                                value={formik?.values?.recordId}
                                disabled={(id || qrCode) ? true : false}
                                touch={formik.touched.recordId}
                                error={formik.errors.recordId} type='text' />
                            <Text mt={"3"} mb={"1"} color={"#101928"} fontSize={"14px"} fontWeight={"500"} lineHeight={"20.3px"} >Select Condition</Text>

                            <RadioGroup onChange={(e) => formik.setFieldValue("return_state", e)} value={formik.values.return_state}>
                                <Stack direction='row'>
                                    {datastate?.map((item: {
                                        name: string,
                                        value: string
                                    }, index: number) => {
                                        return (
                                            <Radio key={index} value={item?.value} >{item?.name}</Radio>
                                        )
                                    })}
                                </Stack>
                            </RadioGroup>

                            <Button isLoading={addMutation?.isLoading} isDisabled={addMutation?.isLoading} type="submit" h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"6"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                                Continue
                            </Button>
                        </form>
                    )}
                </Flex>
            </ModalLayout>
        </>
    )
}

export default Returnbtn
