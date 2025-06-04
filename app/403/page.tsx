import React from 'react';
import { Result } from 'antd';
import Link from 'next/link';

const page: React.FC = () => (
    <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này!"
        extra={<Link href='/dashboard'>Quay về trang chủ</Link>}
    />
);

export default page;