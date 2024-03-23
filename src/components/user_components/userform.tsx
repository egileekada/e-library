import { Box, Button, Flex, Select, Text, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import InputComponent from '../shared_components/custom_input'
import ImageSelector from '../shared_components/image_selector'
import { useAddUserCallback, useAddUserGuestCallback, useUploaderCallback } from '../../connections/useaction'
import { useMutation, useQueryClient } from 'react-query';
import { ICreateUser } from '../../models';
import { useState } from 'react';

interface Props {
    close: (by: boolean) => void
}

function Userform(props: Props) {
    const {
        close
    } = props


    const queryClient = useQueryClient()

    const [role, setRole] = useState("")
    const [staffId, setStaffId] = useState("")
    const [department, setDepartment] = useState("")
    const toast = useToast()
    const { handleAddUser } = useAddUserCallback();

    const { handleAddUserGuest } = useAddUserGuestCallback()

    const { handleUploader } = useUploaderCallback()
    const [imageFile, setImageFile] = useState("");
    const loginSchema = yup.object({
        email: yup.string().email('This email is not valid').required('Your email is required'),
        name: yup.string().required('required'),
        phone: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
        },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });

    //API call to handle adding user
    const addUserMutation = useMutation(async (formData: ICreateUser) => {
        const response = await handleAddUser(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['usertable'])

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
    const addUserGuestMutation = useMutation(async (formData: ICreateUser) => {
        const response = await handleAddUserGuest(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['usertable'])

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
    const uploaderMutation = useMutation(async (userdata: ICreateUser) => {

        let formData = new FormData()
        formData.append("file", imageFile)

        const response = await handleUploader(formData, imageFile);

        if (response?.status === 201 || response?.status === 200) {

            // toast({
            //     title: response?.data?.message,
            //     status: "success",
            //     duration: 3000,
            //     position: "top",
            // });
            if (role === "Staff") {

                addUserMutation.mutateAsync({ ...userdata, profilePicture: response?.data?.data }, {
                    onSuccess: (data: any) => {
                        if (data) {
                            close(false)
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

            } else {

                addUserGuestMutation.mutateAsync({ ...userdata, profilePicture: response?.data?.data }, {
                    onSuccess: (data: any) => {
                        if (data) {
                            close(false)
                        }
                    },
                }).catch(() => {
                    toast({
                        title: "Something went wrong",
                        status: "error",
                        duration: 3000,
                        position: "top",
                    });
                });

            }


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
        } else if (!role) {
            toast({
                title: "Select user's role",
                status: "error",
                duration: 3000,
                position: "top",
            });
            return;
        }


        const userData = {
            email: formik.values.email.toLocaleLowerCase().trim(),
            name: formik.values.name,
            phone: formik.values.phone,
            staffId: staffId.toString(),
            department: department.toString(),
        };

        if (!imageFile) {
            addUserMutation.mutateAsync(userData, {
                onSuccess: (data: any) => {
                    if (data) {
                        close(false)
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
        } else {

            uploaderMutation.mutateAsync(userData)
                .catch(() => {
                    toast({
                        title: "Something went wrong",
                        status: "error",
                        duration: 3000,
                        position: "top",
                    });
                });
        }


    }

    return (
        <form style={{ width: "full" }} onSubmit={(e) => submit(e)} >
            <Flex w={"full"} gap={"4"} flexDir={"column"} pb={"4"} >
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Name</Text>
                    <InputComponent
                        name="name"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("name", true, true)
                        }
                        touch={formik.touched.name}
                        error={formik.errors.name}
                        type='text' />
                </Box>
                <Flex gap={"4"} >
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Email</Text>
                        <InputComponent
                            name="email"
                            onChange={formik.handleChange}
                            onFocus={() =>
                                formik.setFieldTouched("email", true, true)
                            }
                            touch={formik.touched.email}
                            error={formik.errors.email} type='email' />
                    </Box>
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Phone Number</Text>
                        <InputComponent
                            name="phone"
                            onChange={formik.handleChange}
                            onFocus={() =>
                                formik.setFieldTouched("phone", true, true)
                            }
                            touch={formik.touched.phone}
                            error={formik.errors.phone} type='tel' />
                    </Box>
                </Flex>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Role</Text>
                    <Select placeholder='Select Role' onChange={(e: any) => setRole(e.target.value)} fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                        <option>Guest</option>
                        <option>Staff</option>
                    </Select>
                </Box>
                {role === "Staff" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Staff ID</Text>
                        <InputComponent placeholder="000-000-000"
                            onChange={(e: any) => setStaffId(e.target.value)}
                            type='text' />
                    </Box>
                )}
                {role === "Staff" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Department</Text>
                        <InputComponent placeholder="Enter Department"
                            onChange={(e: any) => setDepartment(e.target.value)}
                            type='text' />
                    </Box>
                )}
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Image</Text>
                    <ImageSelector setImage={setImageFile} />
                </Box>

                <Button type="submit" isLoading={addUserMutation?.isLoading || uploaderMutation?.isLoading} isDisabled={addUserMutation?.isLoading || uploaderMutation?.isLoading} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    Add User
                </Button>
            </Flex>
        </form>
    )
}

export default Userform
