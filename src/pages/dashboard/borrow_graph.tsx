import { Flex } from '@chakra-ui/react' 
import ReactECharts from "echarts-for-react";

interface IProps {
    available?: number,
    overdue?: number,
    borrow?: number
}


export default function BorrowGraph(props: IProps) {

    const {
        available,
        overdue,
        borrow
    } = props  

    let option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Records',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: available, name: 'Available' },
                    { value: borrow, name: 'Borrowed' },
                    { value: overdue, name: 'Overdue' }
                ]
            }
        ]
    };

    return (
        <Flex>
            <ReactECharts
                option={option}
                style={{ height: '300px', width: '300px ' }}
                className='echarts-for-echarts'
                theme='my_theme' />
        </Flex>
    )
}
