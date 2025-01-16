import { Box, Button, Flex, HStack, Image, PinInput, PinInputField, Text, useToast } from "@chakra-ui/react";
import { useFormik } from 'formik';
import * as yup from 'yup'
import React from "react";
// import { useNavigate } from "react-router-dom";
import InputComponent from "../../components/shared_components/custom_input";
import { useResetPassWordCallback, useSendOtpCallback, useVerifyOtpCallback } from "../../connections/useauth";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, Lock, Mail } from "../../components/shared_components/svg";


export default function ForgatPasswordPage() {

    const toast = useToast()
    const navigate = useNavigate()
    const { handleResetPassWord } = useResetPassWordCallback();
    const { handleSendOtp } = useSendOtpCallback();
    const { handleVerifyOtp } = useVerifyOtpCallback();
    const loginSchema = yup.object({
        email: yup.string().email('This email is not valid').required('Your email is required'),
    })

    const otpSchema = yup.object({
        otp: yup.string().required('Required'),
    })

    const passwordSchema = yup.object({
        password: yup.string().required('Required'),
    })

    // formik
    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });


    // formik
    const formikOtp = useFormik({
        initialValues: { otp: '' },
        validationSchema: otpSchema,
        onSubmit: () => { },
    });

    // formik
    const formikPassword = useFormik({
        initialValues: { password: '' },
        validationSchema: passwordSchema,
        onSubmit: () => { },
    });


    const [searchParams] = useSearchParams();

    // Access specific query parameters
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    //API call to handle user login
    const SendOtpMutation = useMutation(async (formData: {
        email: string
    }) => {
        const response = await handleSendOtp(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
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

    //API call to handle user login
    const VerifyOtpMutation = useMutation(async (formData: {
        otp: string
    }) => {
        const response = await handleVerifyOtp(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
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

    //API call to handle user login
    const PasswordMutation = useMutation(async (formData: {
        password: string;
        id: any
    }) => {
        const response = await handleResetPassWord(formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });
            navigate("/")

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

        if (!email && !id) {
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
                email: formik.values.email.toLocaleLowerCase().trim()
            };
            SendOtpMutation.mutateAsync(loginData, {
                onSuccess: () => {
                    navigate(`/forgot?email=${formik?.values?.email}`)


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
        } else if (email) {
            if (!formikOtp.dirty || !formikOtp.isValid) {
                toast({
                    title: "You have to fill in the form to continue",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            }

            const loginData = {
                otp: formikOtp.values.otp.toLocaleLowerCase().trim()
            };
            VerifyOtpMutation.mutateAsync(loginData, {
                onSuccess: (data: any) => {

                    navigate(`/forgot?id=${data?.data?.data?.id}`)

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
        } else if (id) {
            if (!formikPassword.dirty || !formikPassword.isValid) {
                toast({
                    title: "You have to fill in the form to continue",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            }

            const loginData = {
                password: formikPassword.values.password,
                id: id + ""
            };

            PasswordMutation.mutateAsync(loginData, {
                onSuccess: () => {

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
    }

    return (
        <Flex w={"screen"} h={"100vh"} >
            <Flex w={"full"} height={"100vh"} bgColor={"GrayText"} >
                <Image src="/login.jpg" alt="login" width={"full"} height={"full"} objectFit={"cover"} />
                {/* <img className=" w-full h-full object-cover " alt="lgin" src="/login.jpg" /> */}
            </Flex>
            <Flex w={"full"} height={"100vh"} px={"6"} justifyContent={"center"} alignItems={"center"} >
                {!email && !id && (
                    <form onSubmit={(e) => submit(e)} style={{ maxWidth: "500px", width: "100%", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "30px", padding: "50px" }} >
                        <Text fontSize={"35px"} lineHeight={"42.36px"} textAlign={"center"} fontWeight={"bold"} >Send Otp</Text>
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
                        <Button type="submit" h={"45px"} isLoading={SendOtpMutation.isLoading} isDisabled={(!formik.values.email) || SendOtpMutation.isLoading ? true : false} marginTop={"3"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                            Submit
                        </Button>
                    </form>
                )}
                {email && (
                    <form onSubmit={(e) => submit(e)} style={{ maxWidth: "500px", width: "100%", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "30px", padding: "50px" }} >
                        <Text fontSize={"24px"} textAlign={"center"} fontWeight={"bold"} >Otp has been sent to {email}</Text>
                        <Box mt={"6"} >
                            {/* <InputComponent
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
                                type="email" placeholder="Email Address" /> */}
                            <Text fontSize={"16px"} fontWeight={"600"} mb={"1"} >Enter Otp</Text>
                            <HStack alignItems={"center"} justifyContent={"center"} >
                                <PinInput size={"xl"} otp onChange={(value) => formikOtp?.setFieldValue("otp", value)} >
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                    <PinInputField h={"60px"} rounded={"xl"} />
                                </PinInput>
                            </HStack>
                        </Box>
                        <Button type="submit" h={"45px"} isLoading={VerifyOtpMutation.isLoading} isDisabled={(!formikOtp.values.otp) || VerifyOtpMutation.isLoading ? true : false} marginTop={"3"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                            Submit
                        </Button>
                    </form>
                )}
                {id && (
                    <form onSubmit={(e) => submit(e)} style={{ maxWidth: "500px", width: "100%", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "30px", padding: "50px" }} >
                        <Text fontSize={"35px"} lineHeight={"42.36px"} textAlign={"center"} fontWeight={"bold"} >Reset Password</Text>
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
                                onChange={formikPassword.handleChange}
                                onFocus={() =>
                                    formikPassword.setFieldTouched("password", true, true)
                                }
                                touch={formikPassword.touched.password}
                                error={formikPassword.errors.password}
                                type="password" placeholder="Password" />
                        </Box>
                        <Button type="submit" h={"45px"} isLoading={PasswordMutation.isLoading} isDisabled={(!formikPassword.values.password) || PasswordMutation.isLoading ? true : false} marginTop={"3"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                            Submit
                        </Button>
                    </form>
                )}
            </Flex>
        </Flex>
    )
} 
