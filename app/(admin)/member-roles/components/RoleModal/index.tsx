"use client";
import {
    Modal,
    Form,
    Input,
    Button,
    Row,
    Col,
    Checkbox,
    Typography
} from "antd";
import React, { useEffect, useState } from "react";
import {
    CloseCircleOutlined,
    SaveOutlined,
    CaretRightFilled,
    CaretDownFilled,
} from "@ant-design/icons";
import CustomSpin from "@/components/ui/Spins";
import { showErrorMessage, showSuccessMessage } from "@/ultils/message";
import useRoleStore from "@/stores/roleStore";
import { ActionType } from "@/enums/action";
import { createRole, updateRole } from "@/services/roleService";

const { Title } = Typography;

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

// Cấu trúc permission chi tiết với các action có sẵn cho từng mục
const permissionsStructure = {
    "Hệ thống": {
        "Người dùng": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["user_view", "user_create", "user_edit", "user_delete"]
        },
        "Chi nhánh": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["branch_view", "branch_create", "branch_edit", "branch_delete"]
        },
        "Tổng quan": {
            actions: ["Xem DS"],
            keys: ["dashboard_view"]
        }
    },
    "Hàng hóa": {
        "Sản phẩm": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["product_view", "product_create", "product_edit", "product_delete"]
        },
        "Danh mục sản phẩm": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["category_view", "category_create", "category_edit", "category_delete"]
        },
        "Đơn vị tính": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["unit_view", "unit_create", "unit_edit", "unit_delete"]
        },
        "Nhóm hàng": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["product_group_view", "product_group_create", "product_group_edit", "product_group_delete"]
        },
        "Kiểm kho": {
            actions: ["Xem DS", "Điều chỉnh"],
            keys: ["stock_check_view", "stock_check_create"]
        }
    },
    "Giao dịch": {
        // "Đơn hàng": {
        //     actions: ["Xem DS", "Tạo mới", "Cập nhật", "Xoá", "Hủy"],
        //     keys: ["order_view", "order_create", "order_edit", "order_delete", "order_cancel"]
        // },
        "Hóa đơn": {
            actions: ["Xem DS", "Tạo mới", "Hủy"],
            keys: ["invoice_view", "invoice_create", "invoice_void"]
        },
        "Trả hàng": {
            actions: ["Xem DS", "Xử lý"],
            keys: ["return_view", "return_process"]
        },
        "Nhập hàng": {
            actions: ["Xem DS", "Tạo mới", "Cập nhật"],
            keys: ["import_view", "import_create", "import_edit"]
        }
    },
    "Đối tác": {
        "Khách hàng": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["customer_view", "customer_create", "customer_edit", "customer_delete"]
        },
        "Nhà cung cấp": {
            actions: ["Xem DS", "Thêm mới", "Cập nhật", "Xoá"],
            keys: ["supplier_view", "supplier_create", "supplier_edit", "supplier_delete"]
        }
    }
};

const RoleModal = () => {
    const [form] = Form.useForm();
    const { modal, resetModal, setShouldReload } = useRoleStore();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
    const [checkedGroups, setCheckedGroups] = useState<{ [key: string]: string[] }>({});

    const onCloseModal = () => {
        resetModal();
        form.resetFields();
        setCheckedGroups({});
        setExpandedGroups({});
    };

    const toggleGroup = (key: string) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const onParentCheck = (key: string, checked: boolean) => {
        // Lấy danh sách actions có sẵn cho item này
        let itemActions: string[] = [];
        Object.values(permissionsStructure).forEach(group => {
            if (key in group) {
                itemActions = (group[key as keyof typeof group] as { actions: string[] }).actions;
            }
        });

        const actions = checked ? itemActions : [];
        setCheckedGroups(prev => ({ ...prev, [key]: actions }));
        form.setFieldValue(['permissions', key], actions);
    };

    const onChildCheck = (key: string, values: string[]) => {
        setCheckedGroups(prev => ({ ...prev, [key]: values }));
        // form.setFieldValue(['permissions', key], values);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            setLoadingModalVisible(true);

            // Chuyển đổi dữ liệu từ form sang dạng API cần
            const permissions = convertFormPermissionsToApi(form.getFieldValue('permissions') || {});

            const roleData = {
                role_name: values.roleName,
                description: values.description || "",
                permissions
            };

            // Gọi API ở đây
            console.log('Data to submit:', roleData);
            console.log('Modal type:', modal);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            if (modal.type === ActionType.CREATE) {
                await createRole(roleData);
            } else if (modal.type === ActionType.UPDATE) {
                await updateRole(modal.role?.role_id || 0, roleData);
            }

            showSuccessMessage(`${modal.title} thành công!`);
            setShouldReload(true);
            onCloseModal();
        } catch (error) {
            console.error("Lỗi submit:", error);
            showErrorMessage(`${modal.title} thất bại!`);
        } finally {
            setLoadingModalVisible(false);
        }
    };

    const convertFormPermissionsToApi = (
        formPermissions: Record<string, string[]> = {}
    ): Array<{ key: string, name: string }> => {
        console.log('🚀 ~ convertFormPermissionsToApi ~ formPermissions:', formPermissions);
        const result: Array<{ key: string, name: string }> = [];

        Object.entries(permissionsStructure).forEach(([groupName, groupItems]) => {
            Object.entries(groupItems).forEach(([itemName, itemData]) => {
                const { actions, keys } = itemData;
                const formActions = formPermissions?.[itemName] || [];

                actions.forEach((action, index) => {
                    if (formActions.includes(action)) {
                        const key = keys[index];
                        const permission = modal.role?.permissions.find(p => p.key === key) || {
                            key,
                            name: `${itemName} ${key.split('_').pop()}`
                        };
                        result.push({
                            key: permission.key,
                            name: permission.name,
                        });
                    }
                });
            });
        });

        return result;
    };


    // Hàm kiểm tra xem một item có được chọn toàn bộ hay không
    const isAllChecked = (itemName: string) => {
        const itemData = getItemData(itemName);
        if (!itemData) return false;

        return checkedGroups[itemName]?.length === itemData.actions.length;
    };

    // Hàm kiểm tra xem một item có được chọn một phần hay không
    const isIndeterminate = (itemName: string) => {
        const itemData = getItemData(itemName);
        if (!itemData) return false;

        const checkedCount = checkedGroups[itemName]?.length || 0;
        return checkedCount > 0 && checkedCount < itemData.actions.length;
    };

    // Hàm lấy dữ liệu item
    const getItemData = (itemName: string): { actions: string[]; keys: string[] } | null => {
        for (const group of Object.values(permissionsStructure)) {
            if (group[itemName as keyof typeof group]) {
                return group[itemName as keyof typeof group] as { actions: string[]; keys: string[] };
            }
        }
        return null;
    };

    useEffect(() => {
        if (!modal.open) return;
        if (modal.role) {
            // Đặt giá trị cơ bản
            form.setFieldsValue({
                roleName: modal.role.role_name,
                description: modal.role.description
            });

            // Xử lý permissions từ API
            const initialChecked: { [key: string]: string[] } = {};

            const apiPermissions = new Set(modal.role.permissions.map(p => p.key));

            // Duyệt qua cấu trúc permissions để map đúng checkbox
            Object.entries(permissionsStructure).forEach(([groupName, groupItems]) => {
                Object.entries(groupItems).forEach(([itemName, itemData]) => {
                    const { actions, keys } = itemData;
                    const itemActions: string[] = [];

                    keys.forEach((key, index) => {
                        if (apiPermissions.has(key)) {
                            itemActions.push(actions[index]);
                        }
                    });

                    if (itemActions.length > 0) {
                        initialChecked[itemName] = itemActions;
                    }
                });
            });

            setCheckedGroups(initialChecked);
            form.setFieldValue('permissions', initialChecked);

            // // Mở rộng tất cả các nhóm khi là chỉnh sửa
            // const allGroups = Object.values(permissionsStructure).flatMap(group => Object.keys(group));
            // const expandedState = allGroups.reduce((acc, group) => ({ ...acc, [group]: true }), {});
            // setExpandedGroups(expandedState);
        } else {
            // Nếu là thêm mới, reset tất cả
            form.resetFields();
            setCheckedGroups({});
            setExpandedGroups({});
        }
    }, [modal.role, form, modal.open]);

    return (
        <>
            <CustomSpin openSpin={loadingModalVisible} />
            <Modal
                title={modal.title}
                open={modal.open}
                onCancel={onCloseModal}
                width={800}
                centered
                footer={[
                    <Button
                        key="back"
                        onClick={onCloseModal}
                        icon={<CloseCircleOutlined />}
                    >
                        Huỷ
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        icon={<SaveOutlined />}
                    >
                        Lưu
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    {...formItemLayout}
                    labelAlign="left"
                >
                    <Form.Item
                        name="roleName"
                        label="Vai trò"
                        rules={[{ required: true, message: "Vui lòng nhập tên vai trò!" }]}
                    >
                        <Input placeholder="Nhập tên vai trò" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea placeholder="Nhập mô tả" rows={3} />
                    </Form.Item>

                    <Title level={5}>Phân quyền</Title>
                    <Row gutter={[24, 16]}>
                        {Object.entries(permissionsStructure).map(([groupName, groupItems]) => (
                            <Col xs={24} sm={12} md={8} key={groupName}>
                                <p style={{ fontWeight: 500, marginBottom: 12 }}>{groupName}</p>
                                {Object.keys(groupItems).map((itemName) => {
                                    const isExpanded = expandedGroups[itemName] ?? false;
                                    const currentChecked = checkedGroups[itemName] || [];
                                    const itemData = getItemData(itemName);
                                    const actionsToShow = itemData?.actions || [];

                                    return (
                                        <div
                                            key={itemName}
                                            style={{
                                                paddingBottom: 8,
                                                marginBottom: 8,
                                                borderBottom: '1px solid #f0f0f0'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                <span
                                                    onClick={() => toggleGroup(itemName)}
                                                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                                >
                                                    {isExpanded ? <CaretDownFilled style={{ color: 'rgb(107 102 102)' }} /> : <CaretRightFilled style={{ color: 'rgb(107 102 102)' }} />}
                                                </span>
                                                <Checkbox
                                                    checked={isAllChecked(itemName)}
                                                    indeterminate={isIndeterminate(itemName)}
                                                    onChange={(e) => onParentCheck(itemName, e.target.checked)}
                                                >
                                                    {itemName}
                                                </Checkbox>
                                            </div>

                                            {isExpanded && itemData && (
                                                <Form.Item
                                                    name={['permissions', itemName]}
                                                    style={{ marginTop: 8, marginLeft: 40 }}
                                                >
                                                    <Checkbox.Group
                                                        style={{ display: 'flex', flexDirection: 'column' }}
                                                        options={actionsToShow}
                                                        value={currentChecked}
                                                        onChange={(checked) =>
                                                            onChildCheck(itemName, checked as string[])
                                                        }
                                                    />
                                                </Form.Item>
                                            )}
                                        </div>
                                    );
                                })}
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default RoleModal;