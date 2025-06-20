"use client"
import React from 'react';
import {
    Card,
    Col,
    Row,
    Statistic,
    Skeleton,
    Tag,
    Flex,
    DatePicker
} from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    ShoppingOutlined,
    WarningOutlined,
    InboxOutlined,
    FileDoneOutlined
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import dayjs from 'dayjs';

interface DashboardStats {
    totalProducts: number;
    lowStock: number;
    incomingShipments: number;
    outboundOrders: number;
}

interface ChartDataItem {
    name: string;
    type: string;
    value: number;
}

const Page: React.FC = () => {
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState<DashboardStats>({
        totalProducts: 0,
        lowStock: 0,
        incomingShipments: 0,
        outboundOrders: 0
    });
    const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                totalProducts: 1245,
                lowStock: 23,
                incomingShipments: 15,
                outboundOrders: 42
            });

            // Format data for Ant Design Charts
            const rawData = [
                { name: 'Tháng 1', nhập: 400, xuất: 240 },
                { name: 'Tháng 2', nhập: 300, xuất: 139 },
                { name: 'Tháng 3', nhập: 200, xuất: 980 },
                { name: 'Tháng 4', nhập: 278, xuất: 390 },
                { name: 'Tháng 5', nhập: 189, xuất: 480 },
                { name: 'Tháng 6', nhập: 239, xuất: 380 },
                { name: 'Tháng 7', nhập: 400, xuất: 240 },
                { name: 'Tháng 8', nhập: 300, xuất: 139 },
                { name: 'Tháng 9', nhập: 200, xuất: 980 },
                { name: 'Tháng 10', nhập: 278, xuất: 390 },
                { name: 'Tháng 11', nhập: 189, xuất: 480 },
                { name: 'Tháng 12', nhập: 239, xuất: 380 },
            ];

            const formattedData = rawData.flatMap(item => [
                { name: item.name, type: 'Nhập', value: item.nhập },
                { name: item.name, type: 'Xuất', value: item.xuất }
            ]);

            setChartData(formattedData);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const chartConfig = {
        data: chartData,
        xField: 'name',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [4, 4, 0, 0],
        },
        color: ['#1890ff', '#52c41a'],
        legend: {
            position: 'top',
        },
        animation: {
            appear: {
                animation: 'scale-in-y',
            },
        },
        label: {
            style: {
                fill: '#fff',
            },
            offset: 10,
            position: 'top' as const,
        },
        yAxis: {
            min: 0,
        },
        responsive: true,
    };

    // Custom card style with shadow
    const cardStyle: React.CSSProperties = {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        borderRadius: '8px',
        transition: '0.3s',
        height: '100%', // Thêm chiều cao 100% cho các card
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            <Row gutter={[16, 16]} style={{ flexShrink: 0 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={cardStyle}
                        hoverable
                        actions={[
                            <Tag color="blue" icon={<ShoppingOutlined />}>Giao dịch</Tag>,
                            <Tag color="cyan">Đối tác</Tag>
                        ]}
                        styles={{ body: { padding: '20px' } }}
                    >
                        <Statistic
                            title={<><ShoppingOutlined style={{ marginRight: 8 }} /> Tổng sản phẩm</>}
                            value={stats.totalProducts}
                            valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                            prefix={<ArrowUpOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={cardStyle}
                        hoverable
                        actions={[
                            <Tag color="orange" icon={<WarningOutlined />}>Cảnh báo</Tag>,
                            <Tag color="gold">Quản lý chi nhánh</Tag>
                        ]}
                        styles={{ body: { padding: '20px' } }}
                    >
                        <Statistic
                            title={<><WarningOutlined style={{ marginRight: 8 }} /> Sản phẩm sắp hết</>}
                            value={stats.lowStock}
                            valueStyle={{ color: '#cf1322', fontSize: '24px' }}
                            prefix={<ArrowDownOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={cardStyle}
                        hoverable
                        actions={[
                            <Tag color="magenta" icon={<FileDoneOutlined />}>Đơn hàng</Tag>,
                            <Tag color="volcano">Thành viên</Tag>
                        ]}
                        styles={{ body: { padding: '20px' } }}
                    >
                        <Statistic
                            title={<><FileDoneOutlined style={{ marginRight: 8 }} /> Đơn hàng đang xử lý</>}
                            value={stats.outboundOrders}
                            valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                            prefix={<ArrowUpOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card
                        style={cardStyle}
                        hoverable
                        actions={[
                            <Tag color="green" icon={<InboxOutlined />}>Nhập kho</Tag>,
                            <Tag color="purple">Quản trị viên</Tag>
                        ]}
                        styles={{ body: { padding: '20px' } }}
                    >
                        <Statistic
                            title={<><InboxOutlined style={{ marginRight: 8 }} /> Lô hàng sắp đến</>}
                            value={stats.incomingShipments}
                            valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                            prefix={<ArrowUpOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Card biểu đồ chiếm hết phần còn lại */}
            <Card
                title={
                    <Flex justify='space-between'>
                        <span style={{ fontWeight: 'revert' }}>Biểu đồ nhập xuất hàng theo tháng</span>
                        <DatePicker
                            // showTime={{ format: 'HH:mm' }}
                            defaultValue={dayjs(new Date())}
                            // value={dateTime}
                            // onChange={(value) => setDateTime(value)}
                            picker='year'
                            allowClear={false}
                            // suffixIcon={null}
                            size="small"
                            variant="borderless"
                            className="custom-datepicker"
                        />
                    </Flex>
                }
                style={{
                    ...cardStyle,
                    flex: 1, // Chiếm hết không gian còn lại
                    marginBottom: 0
                }}
                hoverable
                styles={{
                    body: {
                        padding: '20px',
                        height: 'calc(100% - 56px)', // Trừ đi chiều cao header của card
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                {loading ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                ) : (
                    <div style={{ flex: 1 }}>
                        <Column {...chartConfig} />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Page;