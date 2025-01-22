// import React from 'react'

import { Button } from "@chakra-ui/react"
import ModalLayout from "../shared_components/modal_layout"
import { useState } from "react"
import { ILibrary } from "../../models"
import LibraryformEdit from "./libraryformEdit"
import { useNavigate } from "react-router-dom"

interface Props {
    data: ILibrary
}

function EditLibrarybtn(props: Props) {
    const {
        data
    } = props

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const clickHandler = () => {
        setOpen(true)
        navigate(`/dashboard/library/info?type=${data?.type}`)
    }

    return (
        <>
            <Button onClick={() => clickHandler()} h={"45px"} gap={"2"} rounded={"5px"} px={"7"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                Edit Literature
            </Button>
            <ModalLayout size={"md"} open={open} close={setOpen} title={"Edit Literature"} >
                <LibraryformEdit data={data} close={setOpen} />
            </ModalLayout>
        </>
    )
}

export default EditLibrarybtn
