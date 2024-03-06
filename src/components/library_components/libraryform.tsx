import { Box, Button, Flex, Select, Text, useToast } from '@chakra-ui/react'
// import React from 'react'
import InputComponent from '../shared_components/custom_input'
import ImageSelector from '../shared_components/image_selector'
import * as yup from 'yup'
import { useState } from 'react';
import { useFormik } from 'formik';
import { useQueryClient, useMutation } from 'react-query';
import { useAddBookCallback, useAddJornalCallback, useAddReportCallback, useUploaderCallback } from '../../connections/useaction';
import { ILibrary } from '../../models';
import Yearselector from '../../models/yearselector';

interface Props {
    close: (by: boolean) => void
}

function Libraryform(props: Props) {
    const {
        close
    } = props

    const [imageFile, setImageFile] = useState("");
    const [type, setType] = useState("Journal");

    const [otherData, setOtherData] = useState({} as {
        IDNumber?: string,
        projectYear?: string,
        projectLocation?: string,
        ISBN?: string,
        ISSN?: string,
        DOI?: string
    })
    
    const queryClient = useQueryClient()

    const toast = useToast()
    const { handleAddBook } = useAddBookCallback();
    const { handleAddJornal } = useAddJornalCallback();
    const { handleAddReport } = useAddReportCallback();

    const { handleUploader } = useUploaderCallback()
    const partnerSchema = yup.object({
        name: yup.string().required('required'),
        description: yup.string().required('required'),
        author: yup.string().required('required'),
        count: yup.string().required('required'),
        publicationYear: yup.string().required('required'),
        language: yup.string().required('required'),
        category: yup.string().required('required'),
        value: yup.string().required('required'),
    })

    // formik
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            author: "",
            count: "",
            publicationYear: "",
            language: "",
            category: "",
            value: "",
        },
        validationSchema: partnerSchema,
        onSubmit: () => { },
    });

    //API call to handle adding user
    const addMutation = useMutation(async (formData: ILibrary) => { 
        
        let response: any

        if (type === "Journal") {
            response = await handleAddJornal(formData);
        } else if (type === "Book") {
            response = await handleAddBook(formData);
        } else {
            response = await handleAddReport(formData);
        }


        console.log(response?.data?.message);

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['librarytable'])

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
    const uploaderMutation = useMutation(async (literaturedata: ILibrary) => {

        let formData = new FormData()
        formData.append("file", imageFile)

        const response = await handleUploader(formData, imageFile);

        if (response?.status === 201 || response?.status === 200) {

            addMutation.mutateAsync({ ...literaturedata, thumbnail: response?.data?.data }, {
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

        const literatureData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            count: formik.values.count,
            value: formik.values.value,
            publicationYear: formik.values.publicationYear,
            language: formik.values.language,
            category: formik.values.category, 
            ISSN: otherData?.ISSN, 
        };

        const BookData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            count: formik.values.count,
            value: formik.values.value,
            publicationYear: formik.values.publicationYear,
            language: formik.values.language,
            category: formik.values.category,
            ISBN: otherData?.ISBN, 
        };

        const reportData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            count: formik.values.count,
            value: formik.values.value,
            publicationYear: formik.values.publicationYear,
            language: formik.values.language,
            category: formik.values.category,
            IDNumber: otherData?.IDNumber,
            projectYear: otherData?.projectYear,
            projectLocation: otherData?.projectLocation
        };

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
        uploaderMutation.mutateAsync(type === "Report" ? reportData : type === "Book" ? BookData : literatureData)
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
                        error={formik.errors.name} placeholder="Name" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Literature Type</Text>
                    <Select onChange={(e) => setType(e.target.value)} fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                        <option>Journal</option>
                        <option>Book</option>
                        <option>Report</option>
                    </Select>
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Value</Text>
                    <InputComponent
                        name="value"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("value", true, true)
                        }
                        touch={formik.touched.value}
                        error={formik.errors.value} placeholder="" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Number of Books</Text>
                    <InputComponent
                        name="count"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("count", true, true)
                        }
                        touch={formik.touched.count}
                        error={formik.errors.count} placeholder="" type='number' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Category</Text>
                    <InputComponent
                        name="category"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("category", true, true)
                        }
                        touch={formik.touched.category}
                        error={formik.errors.category} placeholder="" type='text' /> 
                </Box>
                {type === "Book" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ISBN</Text>
                        <InputComponent onChange={(e: any) => setOtherData({
                            ...otherData,
                            ISBN: e.target.value
                        })} placeholder="" type='text' />
                    </Box>
                )}
                {type === "Journal" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ISSN</Text>
                        <InputComponent onChange={(e: any) => setOtherData({
                            ...otherData,
                            ISSN: e.target.value
                        })} placeholder="" type='text' />
                    </Box>
                )}
                {type === "Journal" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter DOI</Text>
                        <InputComponent onChange={(e: any) => setOtherData({
                            ...otherData,
                            DOI: e.target.value
                        })} placeholder="" type='text' />
                    </Box>
                )}
                {type === "Report" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ID Number</Text>
                        <InputComponent onChange={(e: any) => setOtherData({
                            ...otherData,
                            IDNumber: e.target.value
                        })} placeholder="" type='text' />
                    </Box>
                )}
                {type === "Report" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter Project Year</Text>
                         
                        <Yearselector onChange={(e: any) => setOtherData({
                            ...otherData,
                            projectYear: e.target.value
                        })}  />
                    </Box>
                )}
                {type === "Report" && (
                    <Box w={"full"} >
                        <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter Project Location</Text>
                        <InputComponent onChange={(e: any) => setOtherData({
                            ...otherData,
                            projectLocation: e.target.value
                        })} placeholder="" type='text' />
                    </Box>
                )}
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Publication Year</Text>
                    <Yearselector
                        name="publicationYear"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("publicationYear", true, true)
                        }
                        touch={formik.touched.publicationYear}
                        error={formik.errors.publicationYear} />

                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Author</Text>
                    <InputComponent
                        name="author"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("author", true, true)
                        }
                        touch={formik.touched.author}
                        error={formik.errors.author} placeholder="Author Name" type='text' />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Language</Text>
                    <Select
                        name="language"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("language", true, true)
                        } fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                        <option value={""} >Select Language</option>
                        <option>English</option>
                    </Select>
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Image</Text>
                    <ImageSelector setImage={setImageFile} />
                </Box>
                <Box w={"full"} >
                    <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Description</Text>
                    <InputComponent
                        name="description"
                        onChange={formik.handleChange}
                        onFocus={() =>
                            formik.setFieldTouched("description", true, true)
                        }
                        textarea={true}
                        placeholder="Enter short description"
                        touch={formik.touched.description}
                        error={formik.errors.description} type='text' />
                </Box>

                <Button isLoading={uploaderMutation?.isLoading || addMutation?.isLoading} isDisabled={uploaderMutation?.isLoading || addMutation?.isLoading} type="submit" h={"45px"} gap={"2"} rounded={"5px"} width={"full"} mt={"4"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                    Create
                </Button>
            </Flex>
        </form>
    )
}

export default Libraryform
