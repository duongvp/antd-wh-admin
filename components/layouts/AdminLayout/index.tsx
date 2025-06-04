"use client"
import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme, Spin, Alert, notification } from 'antd';
import Header from './Header';
// import SideMenu from './SideMenu';
import '@ant-design/v5-patch-for-react-19';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const SideMenu = dynamic(() => import('./SideMenu'), {
  ssr: false,
});
// import { useAuthStore } from '@/stores/authStore';

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

dayjs.locale('vi');

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  requiredPermission
}: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  // const { user, hasPermission } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Kiểm tra quyền mỗi khi route thay đổi
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setLoading(true);

  //     try {
  //       // Tải lại user data nếu cần
  //       // if (!user) await loadUserData();

  //       // Nếu không có user -> về trang login
  //       if (!user) {
  //         router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
  //         return;
  //       }

  //       // Kiểm tra quyền nếu có yêu cầu
  //       if (requiredPermission && !hasPermission(requiredPermission)) {
  //         notification.error({
  //           message: 'Từ chối truy cập',
  //           description: 'Bạn không có quyền truy cập trang này'
  //         });
  //         router.push('/403'); // Hoặc trang mặc định
  //         return;
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [pathname, requiredPermission, user]); // Chạy lại khi pathname thay đổi

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // if (loading || !user) {
  //   return (
  //     <div style={{
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       height: '100vh'
  //     }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <ConfigProvider locale={viVN}>
      <Layout style={{ minHeight: '100vh' }}>
        <SideMenu collapsed={collapsed} />
        <Layout>
          <Header collapsed={collapsed} toggle={toggle} />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;