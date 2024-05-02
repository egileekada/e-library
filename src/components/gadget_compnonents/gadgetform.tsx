import { Box, Button, Flex, Select, Text, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import InputComponent from '../shared_components/custom_input'
import ImageSelector from '../shared_components/image_selector'
import { useAddGadgetCallback, useUpdateGadgetCallback, useUploaderCallback } from '../../connections/useaction'
import { useMutation, useQueryClient } from 'react-query';
import { ICreateGadget, IGadgetData } from '../../models';
import { useEffect, useState } from 'react';
import Qrcode from '../shared_components/qrcode';

interface Props {
    open?: boolean
    edit?: boolean,
    data?: ICreateGadget
    close: (by: boolean) => void
}

function Gadgetform(props: Props) {
    const { 
        edit,
        data,
        close
    } = props


    const queryClient = useQueryClient()

    const [index, setIndex] = useState({} as IGadgetData)

    const toast = useToast()
    const { handleAddGadget } = useAddGadgetCallback();

    const { handleUpdateGadget } = useUpdateGadgetCallback();
    const { handleUploader } = useUploaderCallback()
    const [imageFile, setImageFile] = useState("");
    const loginSchema = yup.object({
        type: yup.string().required('required'),
        manufacturer: yup.string().required('required'),
        serialNumber: yup.string().required('required'),
        state: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            type: "",
            picture: "",
            manufacturer: "",
            count: 1,
            state: "ACTIVE",
            serialNumber: ""
        },
        validationSchema: loginSchema,
        onSubmit: () => { },
    });

    useEffect(() => {
        if (edit) {
            formik.setFieldValue("count", data?.count)
            formik.setFieldValue("manufacturer", data?.manufacturer)
            formik.setFieldValue("state", data?.state)
            formik.setFieldValue("type", data?.type)

            setImageFile(data?.picture ? data?.picture : "")

        }
    }, []) 

    //API call to handle adding user
    const addGadgetMutation = useMutation(async (formData: ICreateGadget) => {
        const response = await handleAddGadget(formData);


        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['gadgettable'])
            setIndex({...index, id: response?.data?.data?.id, type: response?.data?.data?.type});

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
    const updateGadgetMutation = useMutation(async (formData: { state: string; }) => {
        const response = await handleUpdateGadget(formData, data?.id ? data?.id : "");

        console.log(response?.data?.message);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['gadgettable'])

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
    const uploaderMutation = useMutation(async (gadgetdata: ICreateGadget) => {

        let formData = new FormData()
        formData.append("file", imageFile)

        const response = await handleUploader(formData, imageFile);

        if (response?.status === 201 || response?.status === 200) {

            addGadgetMutation.mutateAsync({ ...gadgetdata, picture: response?.data?.data }, {
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


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const gadgetData = {
            type: formik.values.type,
            manufacturer: formik.values.manufacturer,
            count: Number(formik.values.count),
            serialNumber: (formik.values.serialNumber).toString(),
        };

        const updateData = {
            state: formik.values.state,
            count: Number(formik.values.count),
        };

        if (!edit) {
            if (!formik.dirty || !formik.isValid) {
                toast({
                    title: "You have to fill in the form to continue",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            } else if (!imageFile) {
                toast({
                    title: "Add an image",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            }


            uploaderMutation.mutateAsync(gadgetData)
                .catch(() => {
                    toast({
                        title: "Something went wrong",
                        status: "error",
                        duration: 3000,
                        position: "top",
                    });
                });

        } else {

            if (!formik.values.count || !formik.values.state) {
                toast({
                    title: "You have to fill in the form to continue",
                    status: "error",
                    duration: 3000,
                    position: "top",
                });
                return;
            }
            updateGadgetMutation.mutateAsync(updateData)
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

    const clickHandler =(item: boolean)=> {
        close(item)
        setIndex({} as IGadgetData)
    }

    return (
        <>
            {!index?.id && (

                <form style={{ width: "full" }} onSubmit={(e) => submit(e)} >
                    <Flex w={"full"} gap={"4"} flexDir={"column"} pb={"4"} >
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Gadget</Text>
                            <InputComponent
                                name="type"
                                onChange={formik.handleChange}
                                onFocus={() =>
                                    formik.setFieldTouched("type", true, true)
                                }
                                value={formik?.values.type}
                                isDisabled={edit}
                                touch={formik.touched.type}
                                error={formik.errors.type}
                                type='text' />
                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Manufacturer</Text>
                            <InputComponent
                                name="manufacturer"
                                onChange={formik.handleChange}
                                onFocus={() =>
                                    formik.setFieldTouched("manufacturer", true, true)
                                }
                                value={formik?.values.manufacturer}
                                isDisabled={edit}
                                touch={formik.touched.manufacturer}
                                error={formik.errors.manufacturer} type='text' />
                        </Box>
                        <Flex gap={"4"} >
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Serial Number</Text>
                                <InputComponent
                                    name="serialNumber"
                                    onChange={formik.handleChange}
                                    onFocus={() =>
                                        formik.setFieldTouched("serialNumber", true, true)
                                    }
                                    isDisabled={edit}
                                    value={formik?.values.serialNumber}
                                    touch={formik.touched.serialNumber}
                                    error={formik.errors.serialNumber} type='text' />
                            </Box>
                            {edit && (
                                <Box w={"full"} >
                                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Status</Text>
                                    <Select
                                        name="state"
                                        onChange={formik.handleChange}
                                        value={formik?.values.state}
                                        onFocus={() =>
                                            formik.setFieldTouched("state", true, true)
                                        } placeholder='Select Status' fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                                        <option>ACTIVE</option>
                                        <option>TEMPORARILY_DISABLED</option>
                                        <option>PERMANENTLY_DISABLED</option>
                                    </Select>
                                </Box>
                            )}
                        </Flex>
                        {!edit && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Image</Text>
                                <ImageSelector image={data?.picture} setImage={setImageFile} />
                            </Box>
                        )}

                        <Button type="submit" isLoading={addGadgetMutation?.isLoading || updateGadgetMutation?.isLoading || uploaderMutation?.isLoading} isDisabled={addGadgetMutation?.isLoading || updateGadgetMutation?.isLoading || uploaderMutation?.isLoading} h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                            {edit ? "Update Gadget" : "Add Gadget"}
                        </Button>
                    </Flex>
                </form>
            )}
            {index?.id && ( 
                <Qrcode setOpen={clickHandler} type={index?.type} id={index?.id} />
            )}
        </>
    )
}

export default Gadgetform
