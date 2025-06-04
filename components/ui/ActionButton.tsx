// components/ActionButton.tsx
import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";

interface ActionButtonProps extends ButtonProps {
    label?: string;
    bgColor?: string; // custom background color
}

const ActionButton: React.FC<ActionButtonProps> = ({
    label = "",
    bgColor,
    style,
    ...rest
}) => {
    return (
        <Button
            {...rest}
            style={{
                backgroundColor: bgColor,
                borderColor: bgColor,
                color: "#fff",
                ...style,
            }}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
