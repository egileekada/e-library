import { Box, Button, Flex, Text, useToast, Select } from '@chakra-ui/react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import InputComponent from '../shared_components/custom_input'
// import ImageSelector from '../shared_components/image_selector'
import { useAddAdminCallback, useUploaderCallback } from '../../connections/useaction'
import { useMutation, useQueryClient } from 'react-query';
import { IAdmin, ICreateUser } from '../../models';
// import { useState } from 'react';
import { Eye, Lock } from '../shared_components/svg';

interface Props {
    close: (by: boolean) => void
}

function Adminform(props: Props) {
    const {
        close
    } = props


    const queryClient = useQueryClient()
 
    const toast = useToast()
    const { handleAddAdmin } = useAddAdminCallback();
    const { handleUploader } = useUploaderCallback()
    // const [imageFile, setImageFile] = useState("");
    const loginSchema = yup.object({
        email: yup.string().email('This email is not valid').required('Your email is required'),
        name: yup.string().required('required'),
        phone: yup.string().required('required'),
        staffId: yup.string().required('required'),
        role: yup.string().required('required'),
        password: yup.string().required('Your password is required').min(6, 'A minimium of 6 characters')
    })

    // formik
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            staffId: "",
            password: "",
            role: ""
        },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });

    //API call to handle adding user
    const addAdminMutation = useMutation(async (formData: IAdmin) => {
        const response = await handleAddAdmin(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.messae,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['admintable'])

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
        // formData.append("file", imageFile)

        const response = await handleUploader(formData, "");

        if (response?.status === 201 || response?.status === 200) { 

            addAdminMutation.mutateAsync({ ...userdata, profilePicture: response?.data?.data }, {
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

        const userData = {
            email: formik.values.email.toLocaleLowerCase().trim(),
            name: formik.values.name,
            phone: formik.values.phone,
            password: formik.values.password,
            staffId: formik.values.staffId, 
        };

        // if (!imageFile) {
        addAdminMutation.mutateAsync(userData, {
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
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Email Address</Text>
                    <InputComponent
                        name="email"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("email", true, true)
                        }
                        autoComplete="off"
                        touch={formik.touched.email}
                        error={formik.errors.email} type='email' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Role</Text>
                    <Select placeholder='Select Role'
                            name="role"
                            onChange={formik.handleChange}
                            onFocus={() =>
                                formik.setFieldTouched("role", true, true)
                            }
                        fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                        <option>SUPER_ADMIN</option>
                        <option>ADMIN</option>
                    </Select>
                </Box>
                <Flex gap={"4"} >
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Staff ID</Text>
                        <InputComponent
                            name="staffId"
                            onChange={formik.handleChange}
                            onFocus={() =>
                                formik.setFieldTouched("staffId", true, true)
                            }
                            touch={formik.touched.staffId}
                            error={formik.errors.staffId} type='text' />
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
                <Box>
                    <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} >Password</Text>
                    <InputComponent
                        name="password"
                        left={true}
                        leftIcon={
                            <Lock />
                        }
                        right={true}
                        rightIcon={
                            <Eye />
                        }
                        autoComplete="off"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("password", true, true)
                        }
                        touch={formik.touched.password}
                        error={formik.errors.password}
                        type="password" placeholder="Password" />
                </Box>
                <Button type="submit" isLoading={addAdminMutation?.isLoading || uploaderMutation?.isLoading} isDisabled={addAdminMutation?.isLoading || uploaderMutation?.isLoading} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    Add Admin
                </Button>
            </Flex>
        </form>
    )
}

export default Adminform
