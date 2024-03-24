import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react'
import { forwardRef, useState } from 'react'
import ModalLayout from '../shared_components/modal_layout'
import UserSearch from '../shared_components/user_search'
import { IBorrow, ILibrary, IUserData } from '../../models'
import Userform from '../user_components/userform'
import { CloseIcon } from '../shared_components/svg'
import * as yup from 'yup'
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query'
import { useRecordBorrowCallback } from '../../connections/useaction'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { dateFormat } from '../../util/dateFormat'

function Borrowbtn(props: ILibrary) {
    const {
        name,
        ISBN,
        IDNumber,
        id
    } = props

    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [userData, setUserData] = useState({} as IUserData)

    const toast = useToast()

    const queryClient = useQueryClient()

    const { handleRecordBorrow } = useRecordBorrowCallback()

    const loginSchema = yup.object({
        startDate: yup.string().required('required'),
        endDate: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            startDate: "",
            endDate: "",
        },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });

    //API call to handle adding user
    const addMutation = useMutation(async (formData: IBorrow) => {

        let response = await handleRecordBorrow(formData);


        console.log(response?.data?.message);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

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

        const borrowData = {
            "userId": userData?.id,
            "recordId": id ? id : 0,
            "startDate": formik?.values?.startDate,
            "endDate": formik?.values?.endDate
        }

        if (!formik.dirty || !formik.isValid) {
            toast({
                title: "You have to fill in the form to continue",
                status: "error",
                duration: 3000,
                position: "top",
            });
            return;
        }

        addMutation.mutateAsync(borrowData)
            .catch(() => {
                toast({
                    title: "Something went wrong",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
            });

    }

    // Function to handle date selection
    const handleStartDateChange = (date: any) => {
        formik.setFieldValue("startDate", new Date(date).toISOString()?.toString())
    };

    // Function to handle date selection
    const handleEndDateChange = (date: any) => {
        formik.setFieldValue("endDate", new Date(date).toISOString()?.toString())
    };

    const StartDateCustomInput = forwardRef(({ onClick }: any, ref: any) => (
        <Box onClick={onClick} ref={ref} w={"350px"} display={"flex"} px={"16px"} alignItems={"center"} color={"black"} height={"45px"} rounded={"6px"} border={"1px solid #BDBDBD"}  >
            {formik?.values.startDate ? dateFormat(formik?.values.startDate) : "Click to select a date"}
        </Box>
    ));

    const EndDateCustomInput = forwardRef(({ onClick }: any, ref: any) => (
        <Box onClick={onClick} ref={ref} w={"350px"} display={"flex"} px={"16px"} alignItems={"center"} color={"black"} height={"45px"} rounded={"6px"} border={"1px solid #BDBDBD"}  >
            {formik?.values.endDate ? dateFormat(formik?.values.endDate) : "Click to select a date"}
        </Box>
    ));

    const closeModal = () => {
        setOpen(false)
        formik.setFieldValue("startDate", "")
        formik.setFieldValue("endDate", "")
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                Borrow
            </Button>
            {open && (
                <Flex position={"fixed"} inset={"0px"} zIndex={"100"} justifyContent={"center"} alignItems={"center"} >
                    <Flex w={"400px"} bgColor={"white"} inset={"auto"} zIndex={"200"} position={"fixed"} flexDir={"column"} pt={"4"} px={"6"} pb={"8"} rounded={"xl"} >
                        <form onSubmit={submit} style={{ width: "100%" }} >
                            <Flex justifyContent={"center"} mb={'6'} pos={"relative"} w={"full"} >
                                <Text>Borrow Book</Text>
                                <Box as='button' onClick={() => closeModal()} position={"absolute"} right={"0px"} top={"2px"}  >
                                    <CloseIcon />
                                </Box>
                            </Flex>
                            <Text textAlign={"center"} fontSize={"20px"} lineHeight={"29px"} color={"#010203"} >{name}</Text>
                            {ISBN && (
                                <Text textAlign={"center"} fontSize={"14px"} lineHeight={"20.3px"} color={"#828282"} >ISBN: {ISBN}</Text>
                            )}
                            {IDNumber && (
                                <Text textAlign={"center"} fontSize={"14px"} lineHeight={"20.3px"} color={"#828282"} >ID Number: {IDNumber}</Text>
                            )}
                            {/* <Text textAlign={"center"} fontSize={"14px"} lineHeight={"20.3px"} color={"#828282"} >ID Number: 125678</Text> */}
                            <Text mt={"3"} mb={"1"} color={"#101928"} fontSize={"14px"} fontWeight={"500"} lineHeight={"20.3px"} >Borrow Date</Text>
                            <Box w={"full"} >
                                <DatePicker

                                    minDate={new Date()}
                                    placeholderText="Click to select start date"
                                    customInput={<StartDateCustomInput />}
                                    onChange={handleStartDateChange}
                                />
                            </Box>
                            <Text mt={"3"} mb={"1"} color={"#101928"} fontSize={"14px"} fontWeight={"500"} lineHeight={"20.3px"} >Return Date</Text>
                            <Box w={"full"} >
                                <DatePicker
                                    minDate={new Date(new Date(formik.values.startDate).getTime() + (1 * 24 * 60 * 60 * 1000))}
                                    maxDate={new Date(new Date(formik.values.startDate).getTime() + (14 * 24 * 60 * 60 * 1000))}
                                    placeholderText="Click to select end date"
                                    customInput={<EndDateCustomInput />}
                                    onChange={handleEndDateChange}
                                />
                            </Box>
                            {/* <InputComponent
                                name="endDate"
                                onChange={(e: any) => handleChange(e, "endDate")}
                                onFocus={() =>
                                    formik.setFieldTouched("endDate", true, true)
                                }
                                touch={formik.touched.endDate}
                                error={formik.errors.endDate} type='date' /> */}
                            <Box mt={"4"} w={"full"} >
                                <Flex w={"full"} justifyContent={"space-between"} >
                                    <Text mt={"3"} mb={"1"} color={"#101928"} fontSize={"14px"} fontWeight={"500"} lineHeight={"20.3px"} >Add User</Text>
                                    <Text onClick={() => setShow(true)} as={"button"} type="button" mt={"3"} mb={"1"} color={"#010203"} fontSize={"14px"} fontWeight={"600"} lineHeight={"20.3px"} >+Create New User</Text>
                                </Flex>
                                <UserSearch setuserInfo={setUserData} userInfo={userData} />
                            </Box>

                            <Button isLoading={addMutation?.isLoading} isDisabled={addMutation?.isLoading} type="submit" h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"6"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                                Continue
                            </Button>
                        </form>
                        <ModalLayout size={"md"} open={show} close={setShow} title={"Add User"} >
                            <Userform close={setShow} />
                        </ModalLayout>
                    </Flex>

                    <Flex onClick={() => closeModal()} position={"fixed"} bgColor={"black"} zIndex={"100"} opacity={"20%"} inset={"0px"} />
                </Flex>
            )}
        </>
    )
}

export default Borrowbtn
