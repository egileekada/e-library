import { Box, Button, Flex, Select, Text, useToast } from '@chakra-ui/react'
// import React from 'react'
import InputComponent from '../shared_components/custom_input'
import ImageSelector from '../shared_components/image_selector'
import * as yup from 'yup'
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQueryClient, useMutation } from 'react-query';
import { useAddBookCallback, useAddJornalCallback, useAddReportCallback, useUploaderCallback } from '../../connections/useaction';
import { ILibrary } from '../../models';
import Yearselector from '../../models/yearselector';
// import Qrcode from '../shared_components/qrcode';
import QrcodeMultiple from '../shared_components/qrcodemultiple';

interface Props {
    close?: any,
    data?: ILibrary
}

function Libraryform(props: Props) {
    const {
        close,
        data
    } = props

    const [imageFile, setImageFile] = useState("");
    const [type, setType] = useState(data?.type ? data?.type : "Journal");

    const [index, setIndex] = useState(Array<ILibrary>)


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
        count: yup.number().required('required'),
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
            count: 0,
            publicationYear: "",
            language: "",
            category: "",
            value: "",
        },
        validationSchema: partnerSchema,
        onSubmit: () => { },
    });

    useEffect(() => {
        if (data?.name) {
            formik?.setValues({
                name: data?.name,
                description: data?.description,
                author: data?.author + "",
                count: Number(data?.count),
                publicationYear: data?.publicationYear + "",
                language: data?.language + "",
                category: data?.category + "",
                value: data?.value + "",
            })
            setOtherData({
                IDNumber: data?.IDNumber,
                projectYear: data?.projectYear,
                projectLocation: data?.projectLocation,
                ISBN: data?.ISBN,
                // ISSN: data?.ISSN,
                // DOI: data?.DOI
            })
            setType(data?.type+"")
        }
    }, []) 

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

        if (response?.status === 201 || response?.status === 200) {

            toast({
                title: response?.data?.message,
                status: "success",
                duration: 3000,
                position: "top",
            });

            queryClient.invalidateQueries(['librarytable'])
            setIndex(response?.data?.data);

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

        const literatureData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            value: formik.values.value,
            publicationYear: formik.values.publicationYear,
            language: formik.values.language,
            count: Number(formik.values.count),
            category: formik.values.category,
            ISSN: otherData?.ISSN,
            DOI: otherData?.DOI
        };

        const BookData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            value: formik.values.value,
            count: Number(formik.values.count),
            publicationYear: formik.values.publicationYear,
            language: formik.values.language,
            category: formik.values.category,
            ISBN: otherData?.ISBN,
        };

        const reportData = {
            name: formik.values.name,
            description: formik.values.description,
            author: formik.values.author,
            value: formik.values.value,
            count: Number(formik.values.count),
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

    const clickHandler = (item: boolean) => {
        close(item)
        setIndex([])
    }

    const book_categories = [
        "Literary Fiction",
        "Mystery",
        "Romance",
        "Science Fiction",
        "Fantasy",
        "Thriller",
        "Horror",
        "Biography/Autobiography",
        "History",
        "Memoir",
        "Self-Help",
        "Business/Finance",
        "Science",
        "Cookbooks",
        "Travel",
        "Religion/Spirituality",
        "Essay/Criticism",
        "Reference",
        "Picture Books",
        "Middle Grade",
        "Young Adult",
        "Textbooks",
        "Research Papers",
        "Poetry",
        "Graphic Novels/Comics",
        "Art/Photography",
        "Alternate History",
        "Cyberpunk",
        "Dystopian",
        "Space Opera",
        "Crime",
        "Detective",
        "Legal",
        "Legal Thriller",
        "Psychological Thriller",
        "Contemporary Romance",
        "Historical Romance",
        "Paranormal Romance",
        "Supernatural Horror",
        "Psychological Horror",
        "Diet and Nutrition",
        "Fitness",
        "Mental Health"
    ]

    return (
        <>
            {!index[0]?.name && (
                <form style={{ width: "full" }} onSubmit={(e) => submit(e)} >
                    <Flex w={"full"} gap={"4"} flexDir={"column"} pb={"4"} >
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Name</Text>
                            <InputComponent
                                value={formik?.values?.name}
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
                            <Select value={type} onChange={(e) => setType(e.target.value)} fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                                <option>Journal</option>
                                <option>Book</option>
                                <option>Report</option>
                            </Select>
                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Value</Text>
                            <Select value={formik?.values?.value} placeholder='Select Value' onChange={(e) => formik.setFieldValue("value", e.target.value)} fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"} >
                                <option value={"Less than ₦20,000"} >Less than ₦20,000</option>
                                <option>₦20,000 - ₦40,000</option>
                                <option>₦40,000 - ₦60,000</option>
                                <option>₦60,000 - ₦80,000</option>
                                <option>₦80,000 - ₦100,000</option>
                                <option>Above ₦100,000</option>
                            </Select>
                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Category</Text>
                            <Select value={formik?.values?.category} placeholder='Select Category' onChange={(e) => formik.setFieldValue("category", e.target.value)} fontSize={"14px"} bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={"45px"}>
                                {book_categories?.map((item: string, index: number) => {
                                    return (
                                        <option key={index} >{item}</option>
                                    )
                                })}
                            </Select>
                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Number Of Books</Text>
                            <InputComponent 
                                name="count"
                                onChange={formik.handleChange}
                                // onFocus={() =>
                                //     formik.setFieldTouched("count", true, true)
                                // }
                                touch={formik.touched.count}
                                onFocus={(e: any) => { formik.setFieldTouched("count", true, true), e.target.addEventListener("wheel", function (e: any) { e.preventDefault() }, { passive: false }) }}
                                error={formik.errors.count} placeholder="Number Of Books" type='number' />
                        </Box>
                        {type === "Book" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ISBN</Text>
                                <InputComponent
                                    value={otherData?.ISBN} onChange={(e: any) => setOtherData({
                                        ...otherData,
                                        ISBN: e.target.value
                                    })} placeholder="" type='text' />
                            </Box>
                        )}
                        {type === "Journal" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ISSN</Text>
                                <InputComponent
                                    value={otherData?.ISSN} onChange={(e: any) => setOtherData({
                                        ...otherData,
                                        ISSN: e.target.value
                                    })} placeholder="" type='text' />
                            </Box>
                        )}
                        {type === "Journal" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter DOI(optional)</Text>
                                <InputComponent
                                    value={otherData?.DOI} onChange={(e: any) => setOtherData({
                                        ...otherData,
                                        DOI: e.target.value
                                    })} placeholder="" type='text' />
                            </Box>
                        )}
                        {type === "Report" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter ID Number</Text>
                                <InputComponent
                                    value={otherData?.IDNumber} onChange={(e: any) => setOtherData({
                                        ...otherData,
                                        IDNumber: e.target.value
                                    })} placeholder="" type='text' />
                            </Box>
                        )}
                        {type === "Report" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter Project Year</Text>

                                <Yearselector 
                                value={otherData?.projectYear}
                                 onChange={(e: any) => setOtherData({
                                    ...otherData,
                                    projectYear: e.target.value
                                })} />
                            </Box>
                        )}
                        {type === "Report" && (
                            <Box w={"full"} >
                                <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Enter Project Location</Text>
                                <InputComponent
                                    value={otherData?.projectLocation} onChange={(e: any) => setOtherData({
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
                                value={formik?.values?.publicationYear}
                                onFocus={() =>
                                    formik.setFieldTouched("publicationYear", true, true)
                                }
                                touch={formik.touched.publicationYear}
                                error={formik.errors.publicationYear} />

                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Author</Text>
                            <InputComponent
                                value={formik?.values?.author}
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
                                value={formik?.values?.language}
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
                            <ImageSelector image={data?.thumbnail} setImage={setImageFile} />
                        </Box>
                        <Box w={"full"} >
                            <Text color={"#101928"} fontSize={"14px"} fontWeight={"500"} mb={"1"} >Description</Text>
                            <InputComponent
                                value={formik?.values?.description}
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
            )}
            {index[0]?.name && (
                <QrcodeMultiple setOpen={clickHandler} data={index} />
            )}
        </>
    )
}

export default Libraryform
