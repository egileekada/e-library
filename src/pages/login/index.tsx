import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useFormik } from 'formik';
import * as yup from 'yup'
import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import InputComponent from "../../components/shared_components/custom_input";
import { LoginDataType, useLoginCallback } from "../../connections/useauth";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Eye, Lock, Logo, Mail } from "../../components/shared_components/svg";


export default function LoginPage() {

    const toast = useToast()
    const navigate = useNavigate() 
    const { handleLogin } = useLoginCallback();
    const loginSchema = yup.object({
        email: yup.string().email('This email is not valid').required('Your email is required'),
        password: yup.string().required('Your password is required').min(6, 'A minimium of 6 characters')
    })

    // formik
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });

    //API call to handle user login
    const loginMutation = useMutation(async (formData: LoginDataType) => {
        const response = await handleLogin(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: "Login Successful",
                status: "success",
                duration: 3000,
                position: "top",
            });

            localStorage.setItem("token", response.data?.data?.token);

            return response;
        } else if (response?.data?.statusCode === 400) {
            toast({
                title: response?.data?.message,
                status: "error",
                duration: 3000,
                position: "top",
            });
            return
        } else {
            toast({
                title: "Something went wrong",
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

        const loginData = {
            email: formik.values.email.toLocaleLowerCase().trim(),
            password: formik.values.password,
        };

        loginMutation.mutateAsync(loginData, {
            onSuccess: (data: any) => { 
                if (data) { 
                    localStorage.setItem("email", data?.data?.data?.details?.email);
                    localStorage.setItem("phone", data?.data?.data?.details?.phone);
                    localStorage.setItem("id", data?.data?.data?.details?.id);
                    localStorage.setItem("name", data?.data?.data?.details?.name);
                    localStorage.setItem("role", data?.data?.data?.details?.role);
                    localStorage.setItem("notoken", "");
                    navigate("/dashboard/home")
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

    useEffect(()=> {
        if(localStorage.getItem("notoken") === "true"){ 
            toast({
                title: "Token expire, please login",
                status: "error",
                duration: 3000,
                position: "top",
            });
        }
    }, [])

    return (
        <Flex w={"full"} h={"100vh"} py={"9"} px={"6"} overflowY={"auto"} flexDir={"column"} gap={"4"} alignItems={"center"} >
            <Flex alignItems={"center"} mb={"2"} flexDir={"column"} maxW={"500px"} >
                <Logo />
                <Text fontSize={"40px"} textAlign={"center"} lineHeight={"55.17px"} fontWeight={"600"} color={"#1E1B39"} >NDDC Library Management System</Text>
            </Flex>
            <form onSubmit={(e) => submit(e)} style={{ maxWidth: "500px", width: "100%", display: "flex", flexDirection: "column", gap: "16px", border: "1px solid #1B3A88", borderRadius: "30px", padding: "50px" }} >
                <Text fontSize={"35px"} lineHeight={"42.36px"} textAlign={"center"} fontWeight={"bold"} >Log In</Text>
                <Box>
                    <Text fontSize={"14px"} fontWeight={"600"} mb={"1"} >Email Address</Text>
                    <InputComponent
                        name="email"
                        left={true}
                        leftIcon={
                            <Mail />
                        }
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("email", true, true)
                        }
                        touch={formik.touched.email}
                        error={formik.errors.email}
                        type="email" placeholder="Email Address" />
                </Box>
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
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("password", true, true)
                        } 
                        touch={formik.touched.password}
                        error={formik.errors.password}
                        type="password" placeholder="Password" />
                </Box>

                <Button type="submit" h={"45px"} isLoading={loginMutation.isLoading} isDisabled={(!formik.values.email && !formik.values.password) || loginMutation.isLoading ? true : false} marginTop={"3"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    Login
                </Button>
            </form>
        </Flex>
    )
} 
