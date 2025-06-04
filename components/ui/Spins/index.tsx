import { Spin } from 'antd';
import React from 'react';

interface CustomSpinProps {
    openSpin: boolean;
}

const CustomSpin = ({ openSpin }: CustomSpinProps) => {
    return (
        <div>
            {openSpin && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Spin size="large" />
                </div>
            )}

        </div>
    );
}

export default CustomSpin;
