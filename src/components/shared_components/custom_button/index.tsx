import { Button } from '@chakra-ui/react'
import React from 'react'

interface Props {
    heigth?: string,
    h?: string,
    width?: string,
    w?: string,
    children: React.ReactNode,
    [x: string]: any,
    backgroundColor?: string,
    rounded: string
}

function CustomButton(props: Props) {
    const {
        rounded,
        children,
        ...rest
    } = props

    return (
        <Button {...rest} h={"45px"} rounded={rounded ? rounded : "5px"} width={"full"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
            Create
        </Button>
    )
}

export default CustomButton
