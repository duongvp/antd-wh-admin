"use client"
import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme, Spin } from 'antd';
import Header from './Header';
import SideMenu from './SideMenu';
import '@ant-design/v5-patch-for-react-19';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
// import dynamic from 'next/dynamic';
// const SideMenu = dynamic(() => import('./SideMenu'), {
//   ssr: false,
// });

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

dayjs.locale('vi');

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children
}: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Spin size="large" fullscreen />;

  return (
    <ConfigProvider locale={viVN}>
      <Layout style={{ minHeight: '100vh' }}>
        <SideMenu collapsed={collapsed} toggle={toggle} />
        <Layout>
          <Header collapsed={collapsed} toggle={toggle} />
          <Content
            style={{
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="site-layout-background"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;