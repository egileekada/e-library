import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react'
// import React from 'react'
import InputComponent from '../shared_components/custom_input'
import ImageSelector from '../shared_components/image_selector'
import * as yup from 'yup'
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQueryClient, useMutation } from 'react-query';
import { useAddPartnerCallback, useUpdatePartnerCallback, useUploaderCallback } from '../../connections/useaction';
import { IPartner } from '../../models';

interface Props {
    close: (by: boolean) => void
    edit?: boolean,
    data?: IPartner
}

function Portalform(props: Props) {
    const {
        close,
        edit,
        data
    } = props

    const [imageFile, setImageFile] = useState("");
    const [imageName, setImageName] = useState("");


    const queryClient = useQueryClient()

    const toast = useToast()
    const { handleAddPartner } = useAddPartnerCallback();
    const { handleUpdatePartner } = useUpdatePartnerCallback();

    const { handleUploader } = useUploaderCallback()
    const partnerSchema = yup.object({
        partnerName: yup.string().required('required'),
        partnerResourceName: yup.string().required('required'),
        partnerResourceUrl: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            partnerName: "",
            partnerResourceName: "",
            partnerResourceUrl: ""
        },
        validationSchema: partnerSchema,
        onSubmit: () => { },
    });

    //API call to handle adding user
    const addPartnerMutation = useMutation(async (formData: IPartner) => {
        const response = await handleAddPartner(formData);

        console.log(response?.data?.message);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['/partner/filter'])

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
    const updatePartnerMutation = useMutation(async (formData: IPartner) => {
        const response = await handleUpdatePartner(data?.id ? data?.id : "", formData);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['/partner/filter'])
            close(false)

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
    const uploaderMutation = useMutation(async (partnerdata: IPartner) => {

        let formData = new FormData()
        formData.append("file", imageFile)

        const response = await handleUploader(formData, imageFile);

        if (response?.status === 201 || response?.status === 200) {

            if (edit) {
                updatePartnerMutation.mutateAsync({ ...partnerdata, imageUrl: response?.data?.data })
                    .catch(() => {
                        toast({
                            title: "Something went wrong",
                            status: "error",
                            duration: 3000,
                            position: "top",
                        });
                    });

            } else {

                addPartnerMutation.mutateAsync({ ...partnerdata, imageUrl: response?.data?.data }, {
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

        const partnerData = {
            partnerName: formik.values.partnerName,
            partnerResourceName: formik.values.partnerResourceName,
            partnerResourceUrl: formik.values.partnerResourceUrl,
        };

        if (!formik.dirty || !formik.isValid) {
            toast({
                title: "You have to fill in the form to continue",
                status: "error",
                duration: 3000,
                position: "top",
            });
            return;
        }
        if (edit) {

            if (!imageFile) {
                updatePartnerMutation.mutateAsync({ ...partnerData, imageUrl: imageName ?? "" })
                    .catch(() => {
                        toast({
                            title: "Something went wrong",
                            status: "error",
                            duration: 3000,
                            position: "top",
                        });
                    });
            } else {
                uploaderMutation.mutateAsync(partnerData)
                    .catch(() => {
                        toast({
                            title: "Something went wrong",
                            status: "error",
                            duration: 3000,
                            position: "top",
                        });
                    });
            }

        } else {
            if (!imageFile) {
                toast({
                    title: "Add an image",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            }
            uploaderMutation.mutateAsync(partnerData)
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

    useEffect(() => { 

        if (edit) {
            formik.setFieldValue("partnerName", data?.partnerName)
            formik.setFieldValue("partnerResourceName", data?.partnerResourceName)
            formik.setFieldValue("partnerResourceUrl", data?.partnerResourceUrl)
            setImageName(data?.imageUrl ? data?.imageUrl : "")
        }
    }, [data])    

    return (
        <form style={{ width: "full" }} onSubmit={(e) => submit(e)} >
            <Flex w={"full"} gap={"4"} flexDir={"column"} pb={"4"} >
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Partner Name</Text>
                    <InputComponent
                        name="partnerName"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("partnerName", true, true)
                        }
                        value={formik?.values?.partnerName}
                        touch={formik.touched.partnerName}
                        error={formik.errors.partnerName} placeholder="Partner Name" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Partner Resource Name</Text>
                    <InputComponent
                        name="partnerResourceName"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("partnerResourceName", true, true)
                        }
                        value={formik?.values?.partnerResourceName}
                        touch={formik.touched.partnerResourceName}
                        error={formik.errors.partnerResourceName} placeholder="Partner ResourceName" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Partner Link</Text>
                    <InputComponent
                        name="partnerResourceUrl"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("partnerResourceUrl", true, true)
                        }
                        value={formik?.values?.partnerResourceUrl}
                        touch={formik.touched.partnerResourceUrl}
                        error={formik.errors.partnerResourceUrl} placeholder="https://xyz.com" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Image</Text>
                    <ImageSelector imageInfo={imageName} setImage={setImageFile} />
                </Box>

                <Button isLoading={uploaderMutation?.isLoading || addPartnerMutation?.isLoading || updatePartnerMutation.isLoading} isDisabled={uploaderMutation?.isLoading || addPartnerMutation?.isLoading || updatePartnerMutation?.isLoading} type="submit" h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    {edit ? "Update Partner" : "Create Partner"}
                </Button>
            </Flex>
        </form>
    )
}

export default Portalform
