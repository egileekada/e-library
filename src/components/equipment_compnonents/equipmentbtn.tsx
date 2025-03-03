import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import ModalLayout from '../shared_components/modal_layout'
import { AddIcon } from '../shared_components/svg' 
import EquipmentForm from './equipmentform'

interface Props { }

function Equipmentbtn(props: Props) {
    const { } = props

    const [open, setOpen] = useState(false)

    return ( 
        <>
            <Button onClick={() => setOpen(true)} h={"45px"} gap={"2"} rounded={"5px"} px={"7"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                <AddIcon />
                Add Equipment
            </Button>
            <ModalLayout size={"md"} open={open} close={setOpen} title={"Add Equipment"} >
                <EquipmentForm close={setOpen} />
            </ModalLayout>
        </>
    )
}

export default Equipmentbtn 