'use client';
import React from 'react';
import { Layout, Row, Col, Card } from 'antd'
import Image from 'next/image';
import LoginForm from './components/LoginForm';
import '@ant-design/v5-patch-for-react-19';

const { Content } = Layout;

const Page = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content>
                <Image
                    src="/warehouse1.jpg"
                    alt="Warehouse"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', // lớp phủ mờ
                        zIndex: 1,
                    }}
                />
                <Card style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: '0 auto', zIndex: 2 }}>
                    <LoginForm />
                </Card>
            </Content>
        </Layout>
    );
};

export default Page;

