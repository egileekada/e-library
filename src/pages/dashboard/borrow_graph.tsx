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
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        series: [
          {
            name: 'Radius Mode',
            type: 'pie',
            radius: ['10%', '70%'], 
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
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
