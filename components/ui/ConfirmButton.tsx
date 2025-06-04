// components/ui/ConfirmButton.tsx
import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import ConfirmModal from "../templates/ConfirmModal";
import { showErrorMessage, showSuccessMessage } from "@/ultils/message";

interface ConfirmButtonProps extends ButtonProps {
    label?: string;
    customColor?: string;
    onConfirm: () => void;
    confirmMessage?: string;
    messageWhenSuccess?: string;
    messageWhenError?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    label = "",
    customColor,
    onConfirm,
    confirmMessage = "Bạn có chắc chắn muốn thực hiện thao tác này?",
    messageWhenSuccess = "Thao tác thành công",
    messageWhenError = "Có lỗi xảy ra khi thực hiện thao tác",
    style,
    ...rest
}) => {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const showConfirm = () => {
        setConfirmOpen(true);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            onConfirm();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay
            showSuccessMessage(messageWhenSuccess);
            setConfirmOpen(false);
        } catch (error) {
            showErrorMessage(messageWhenError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                {...rest}
                onClick={showConfirm}
                style={{
                    backgroundColor: customColor,
                    borderColor: customColor,
                    color: "#fff",
                    ...style,
                }}
            >
                {label}
            </Button>
            <ConfirmModal
                open={confirmOpen}
                content={
                    confirmMessage
                }
                onOk={handleOk}
                onCancel={() => setConfirmOpen(false)}
                loading={loading}
            />
        </>

    );
};

export default ConfirmButton;
