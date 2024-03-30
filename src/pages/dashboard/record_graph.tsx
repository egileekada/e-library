import { Flex } from '@chakra-ui/react' 
import ReactECharts from "echarts-for-react";

interface IProps {
    book?: number,
    journal?: number,
    report?: number
}

export default function RecordGraph(props: IProps) {

    const {
        book,
        journal,
        report
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
                    // { value: 1048, name: 'Search Engine' },
                    { value: book, name: 'Books' },
                    { value: journal, name: 'Journals' },
                    { value: report, name: 'Reports' }, 
                ]
            }
        ]
    };
    return (
        <Flex>

            <ReactECharts
                option={option}
                style={{ height: '300px', width: '300px' }}
                className='echarts-for-echarts'
                theme='my_theme' />
        </Flex>
    )
}
