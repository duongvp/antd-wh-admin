// import React, { useEffect, useState } from 'react';
// import { Tabs } from 'antd';
// import TableWithActions from './TableWithActions';
// import { getReturnOrderById } from '@/services/returnService';

// interface DecriptionTableProps {
//     data: any;
// }

// const DecriptionTable: React.FC<DecriptionTableProps> = ({ data }) => {
//     const [tableData, setTableData] = useState<any>([]);
//     const [returnOrderDetails, setReturnOrderDetails] = useState<any>({});
//     const [returnOrderSummary, setReturnOrderSummary] = useState<any>({});

//     useEffect(() => {
//         const fetchApiTableData = async () => {
//             const res = await getReturnOrderById(data.return_id);
//             const { items, summary, ...rest } = res
//             setTableData(items.map((item: any) => ({ ...item, key: item.return_detail_id })));
//             setReturnOrderDetails(rest);
//             setReturnOrderSummary(summary);
//         };
//         fetchApiTableData();
//     }, [data.return_order_id]);

//     const tabItems = [
//         {
//             key: '1',
//             label: 'Thông tin',
//             children: (
//                 <TableWithActions
//                     data={tableData}
//                     returnOrderDetails={returnOrderDetails}
//                     returnOrderSummary={returnOrderSummary}
//                 />
//             ),
//         },
//     ];

//     return <Tabs defaultActiveKey="1" items={tabItems} />;
// };

// export default DecriptionTable;


import React from 'react';
import { Tabs } from 'antd';
import TableWithActions from './TableWithActions';
import { useReturnTableData } from '@/hooks/useReturnTableData';
import useReturnStore from '@/stores/returnStore';

interface DecriptionTableProps {
    data: any;
}

const DecriptionTable: React.FC<DecriptionTableProps> = ({ data }) => {
    const shouldReload = useReturnStore((state) => state.shouldReload);

    const {
        tableData,
        returnOrderDetails,
        returnOrderSummary,
        loading,
        error,
    } = useReturnTableData(data.return_id, [shouldReload]);


    const tabItems = [
        {
            key: '1',
            label: 'Thông tin',
            children: (
                <TableWithActions
                    data={tableData}
                    returnOrderDetails={returnOrderDetails}
                    returnOrderSummary={returnOrderSummary}
                />
            ),
        },
    ];

    if (loading) return <></>

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default DecriptionTable;
