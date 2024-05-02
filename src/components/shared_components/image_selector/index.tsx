import { Flex, Text, useToast } from '@chakra-ui/react'
import { useState } from 'react';
// import React from 'react'

interface Props { 
    image?: string
    setImage: (by: string) => void
    imageInfo?: string, 
}

function ImageSelector(props: Props) {
    const {
        image,
        setImage,
        imageInfo
    } = props

    const [imageName, setImageName] = useState("");
    const toast = useToast()

    const handleImageChange = (e: any) => {

        const selected = e.target.files[0];
        const TYPES = ["image/png", "image/jpg", "image/jpeg"];
        if (selected && TYPES.includes(selected.type)) {
            setImage(selected)
            setImageName(selected.name);
        } else {

            toast({
                title: "Can only accept png, jgp and jpeg",
                status: "error",
                duration: 3000,
                position: "top",
            });
            console.log('Error')
        }
    } 

    return (
        <Flex h={"45px"} w={"full"} rounded={"5px"} justifyContent={"center"} alignItems={"center"} borderStyle={"dashed"} borderWidth={"1px"} borderColor={"#ADADAD"}  >

            <label role='button' style={{ width: "100%", height: "45px", borderRadius: "5px", justifyContent: "center", alignItems: "center", display: "flex" }}  >
                <input type="file" onChange={handleImageChange} style={{ display: "none" }} />
                <Text color={imageName ? "name" : "#909090"} lineHeight={"20.3px"} textAlign={"center"} fontSize={"14px"} >{image ? image : imageName ? imageName: imageInfo ? imageInfo : "Click to upload"}</Text>
            </label>
        </Flex>
    )
}

export default ImageSelector
