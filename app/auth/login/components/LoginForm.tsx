import React from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { showErrorMessage } from '@/ultils/message';
import { loginUser } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

const { Title, Text, Link } = Typography;

const LoginForm = () => {
    const router = useRouter()
    const setUser = useAuthStore(state => state.setUser);
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await loginUser(values);
            setUser(response.data);
            setLoading(false);

            //giải pháp tạm thời
            const data = await response.data;
            // document.cookie = `refreshToken=${data.refreshToken}; path=/; secure; sameSite=None`;
            // document.cookie = `user=${data.user}; path=/; secure; sameSite=None`;
            document.cookie = `refreshToken=${data.refreshToken}; path=/`;
            document.cookie = `user=${data.user}; path=/`;

            setTimeout(() => {
                router.push('/dashboard');
            }, 100)

            //giải pháp tạm thời

            // router.push('/dashboard');
        } catch {
            setLoading(false);
            showErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        console.log('Thành công:', values);
    };

    return (
        <div style={{ maxWidth: 380, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ marginTop: 16 }}>Đăng nhập</Title>
                <Text>Chào mừng quay lại! Vui lòng nhập thông tin của bạn để đăng nhập.</Text>
            </div>
            <Form
                name="login_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" allowClear />
                </Form.Item>

                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khóa' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" allowClear />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Duy trì đăng nhập</Checkbox>
                    </Form.Item>
                    <Link style={{ float: 'right' }} href="#">Quên mật khẩu?</Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginForm;
