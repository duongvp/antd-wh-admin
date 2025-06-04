// CustomSelect.tsx
import React, { useState } from 'react';
import DebounceSelect, { DebounceSelectProps } from './DebounceSelect';

type ValueTypeBase = { key?: string; label: React.ReactNode; value: string | number };

interface CustomSelectProps<ValueType extends ValueTypeBase = any> extends DebounceSelectProps<ValueType> { }

const CustomSelect = <
    ValueType extends ValueTypeBase = any,
>({
    value: propValue,
    onChange: propOnChange,
    fetchOptions,
    ...restProps
}: CustomSelectProps<ValueType>) => {
    const [internalValue, setInternalValue] = useState<ValueType[]>();

    const isControlled = propValue !== undefined && propOnChange !== undefined;
    const value = isControlled ? propValue : internalValue;
    const onChange = (newValue: any, option: any) => {
        if (isControlled) {
            propOnChange?.(newValue, option);
        } else {
            if (Array.isArray(newValue)) {
                setInternalValue(newValue);
            } else {
                setInternalValue([newValue]);
            }
        }
    };

    return (
        <DebounceSelect<ValueType>
            fetchOptions={fetchOptions} // bắt buộc có
            {...restProps}
            value={value}
            onChange={onChange}
            maxTagCount="responsive"
            style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}
        />
    );
};

export default CustomSelect;
