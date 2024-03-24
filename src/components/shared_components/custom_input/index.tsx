import { InputGroup, InputLeftElement, Input, InputRightElement, Box, Text, Textarea } from "@chakra-ui/react"
import React from "react"
import { motion } from "framer-motion";

interface Props {
    left?: boolean,
    leftIcon?: any,
    right?: boolean,
    rightIcon?: any,
    type: string,
    h?: string,
    touch?: any,
    error?: any,
    textarea?: boolean,
    [x: string]: any;
}

export default function InputComponent({ left, leftIcon, right, rightIcon, type, touch, error, textarea, h, ...rest }: Props) {

    // const [showPassword, setShowPassword] = React.useState(false)
    const [intialType, setIntialType] = React.useState(type)

    const ViewPassword = () => {
        if (intialType === "text") {
            setIntialType("password")
        } else if (intialType === "password") {
            setIntialType("text")
        } else {
            setIntialType(type)
        }
    }

    return (
        <>
            {!textarea && ( 
                <InputGroup >
                    {left && (
                        <InputLeftElement
                            children={
                                <Box display="flex" height={h ? h : "35px"} justifyContent="center" alignItems="center" marginTop="6px" marginLeft="12px" >
                                    {leftIcon}
                                </Box>
                            }
                        />
                    )} 
                    
                    <Input {...rest} type={intialType} textColor="#000" paddingLeft={left ? "45px" : ""} fontSize="14px" fontWeight="400" bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={h ? h : "45px"} />
                    {right && (
                        <InputRightElement
                            children={
                                <Box display="flex" height={h ? h : "35px"} justifyContent="center" alignItems="center" marginTop="6px" paddingRight="30px" marginLeft="12px" >
                                    <Box type="button" as="button" fontSize={"14px"} fontWeight={"600"} onClick={() => ViewPassword()} >
                                        {rightIcon && (
                                            rightIcon
                                        )}
                                        {!rightIcon && (
                                            <>
                                                {intialType === "password" ? "Show" : "Hide"}
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            }
                        />
                    )}
                </InputGroup>
            )}
            {textarea && (
                <Textarea  {...rest} textColor="#000" paddingLeft={left ? "45px" : ""} fontSize="14px" fontWeight="400" bgColor="#FCFCFC" borderColor="#BDBDBD" _hover={{ borderColor: "#BDBDBD" }} _focus={{ backgroundColor: "#FCFCFC" }} focusBorderColor="#BDBDBD" height={h ? h : "auto"} />
            )}
            {touch && error && (
                <Text as={motion.p}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }} color="#E84545" fontWeight="600" fontSize="xs" mt="3px" textAlign="left" >{error}</Text>
            )}
        </>
    )
}