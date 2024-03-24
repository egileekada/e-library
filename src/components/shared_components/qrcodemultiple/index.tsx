import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { useRef } from 'react'
import QRCode from 'react-qr-code'
import { PrintIcon } from '../svg'
import { useReactToPrint } from 'react-to-print'
import { ILibrary } from '../../../models'

interface Props {
    setOpen?: any
    data?: any
}

function QrcodeMultiple(props: Props) {
    const {
        data
    } = props

    const componentRef: any = useRef(null)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current as any,
        documentTitle: data[0].name,
    });

    console.log(data);
    

    return (
        <Flex w={"full"} flexDir={"column"} alignItems={"center"} >
            <Box ref={componentRef} >

                <Grid templateColumns='repeat(2, 1fr)' gap={4} py={"4"}>
                    {data?.map((item: ILibrary, index: number) => { 
                        return (
                            <GridItem key={index} width={"full"} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} >
                                <Text textAlign={'center'} fontSize={"18px"} fontWeight={"600"} lineHeight={"26px"} color={"#010203"} >{item?.name}</Text>
                                <Text textAlign={'center'} fontSize={"sm"} color={"#4F4F4F"} fontWeight={"600"} lineHeight={'20.3px'} >ID Number: <span>{item?.id}</span></Text>
                                {item?.id && (
                                    <Flex w={"full"} alignItems={"center"} justifyItems={"center"} flexDir={"column"} gap={"6"} pb={"2"} pt={"5"} >
                                        <QRCode
                                            style={{ height: "143px", maxWidth: "100%", width: "143px", zIndex: 20 }}
                                            value={item?.id+""}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </Flex>
                                )}
                            </GridItem>
                        )
                    })}
                </Grid>
            </Box>

            <Button onClick={handlePrint} mt={"4"} h={"45px"} gap={"2"} rounded={"5px"} px={"12"} bgColor={"#1F7CFF"} _hover={{ backgroundColor: "#1F7CFF" }} display={"flex"} alignItems={"center"} justifyContent={"center"} color={"white"} >
                <PrintIcon />
                Print QR Code
            </Button>
            <Text width={"full"} maxW={"339.24px"} mt={"2"} fontSize={"12px"} lineHeight={"19px"} color={"#4F4F4F"} textAlign={"center"} >Print the QR codes and stick them on the back of newly added equipment.</Text>
        </Flex>
    )
}

export default QrcodeMultiple
