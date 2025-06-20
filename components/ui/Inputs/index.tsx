// import { Input, InputProps, InputNumber, InputNumberProps } from 'antd';
// import { ReactNode } from 'react';

// interface CustomInputProps extends InputProps {
//     label?: ReactNode;
//     isNumber?: boolean;
//     inputNumberProps?: InputNumberProps;
//     lablelStyle?: React.CSSProperties;
//     groupStyle?: React.CSSProperties;
// }

// export default function CustomInput({
//     label,
//     isNumber = false,
//     inputNumberProps,
//     lablelStyle,
//     groupStyle,
//     ...props
// }: CustomInputProps) {
//     return (
//         <div style={{ display: 'flex', alignItems: 'center', ...groupStyle }}>
//             {label && (
//                 <div style={{ width: 120, fontSize: 14, ...lablelStyle }}>
//                     {label}
//                 </div>
//             )}
//             {isNumber ? (
//                 <InputNumber
//                     className="custom-right-input"
//                     style={{
//                         border: 'none',
//                         borderBottom: '1px solid #d9d9d9',
//                         borderRadius: 0,
//                         boxShadow: 'none',
//                         flex: 1,
//                         width: '100%',
//                         ...inputNumberProps?.style,
//                     }}
//                     controls={false}
//                     min={0}
//                     value={inputNumberProps?.value}
//                     {...inputNumberProps}
//                 />
//             ) : (
//                 <Input
//                     {...props}
//                     style={{
//                         border: 'none',
//                         borderBottom: '1px solid #d9d9d9',
//                         borderRadius: 0,
//                         boxShadow: 'none',
//                         flex: 1,
//                         ...props.style,
//                     }}
//                 />
//             )}
//         </div>
//     );
// }

import { Input, InputProps, InputNumber, InputNumberProps } from 'antd';
import { ReactNode, useRef } from 'react';

interface CustomInputProps extends InputProps {
    label?: ReactNode;
    isNumber?: boolean;
    inputNumberProps?: InputNumberProps;
    lablelStyle?: React.CSSProperties;
    groupStyle?: React.CSSProperties;
}

export default function CustomInput({
    label,
    isNumber = false,
    inputNumberProps,
    lablelStyle,
    groupStyle,
    ...props
}: CustomInputProps) {
    const inputNumberRef = useRef<any>(null);

    const handleFocus = () => {
        setTimeout(() => {
            inputNumberRef.current?.focus?.();     // đảm bảo đã focus
            inputNumberRef.current?.select?.();    // chọn toàn bộ nội dung
        }, 0);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', ...groupStyle }}>
            {label && (
                <div style={{ width: 120, fontSize: 14, ...lablelStyle }}>
                    {label}
                </div>
            )}
            {isNumber ? (
                <InputNumber
                    ref={inputNumberRef}
                    onFocus={handleFocus}
                    className="custom-right-input"
                    style={{
                        border: 'none',
                        borderBottom: '1px solid #d9d9d9',
                        borderRadius: 0,
                        boxShadow: 'none',
                        flex: 1,
                        width: '100%',
                        ...inputNumberProps?.style,
                    }}
                    controls={false}
                    min={0}
                    {...inputNumberProps}
                />
            ) : (
                <Input
                    {...props}
                    style={{
                        border: 'none',
                        borderBottom: '1px solid #d9d9d9',
                        borderRadius: 0,
                        boxShadow: 'none',
                        flex: 1,
                        ...props.style,
                    }}
                />
            )}
        </div>
    );
}
