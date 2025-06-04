'use client'
import { Button, Row, Col, Flex } from 'antd';
import { CaretDownOutlined, DownloadOutlined, FilterOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import CustomSearchInput from '@/components/ui/Inputs/CustomSearchInput';
import React from 'react';

interface SearchAndActionsBarProps {
    showSearch?: boolean;
    titleBtnAdd?: string;
    onSearch: (value: string) => Promise<any>;
    handleAddBtn?: React.MouseEventHandler<HTMLElement>;
    handleFilterBtn?: React.MouseEventHandler<HTMLElement>;
    placeholder?: string;
    extraButtons?: React.ReactNode;
    extraExportButton?: React.ReactNode;
    handleImportClick?: React.MouseEventHandler<HTMLElement>;
}

export default function SearchAndActionsBar({
    showSearch = true,
    onSearch,
    titleBtnAdd = "Thêm mới",
    handleAddBtn,
    placeholder = 'Tìm kiếm...',
    extraButtons,
    extraExportButton,
    handleFilterBtn,
    handleImportClick
}: Partial<SearchAndActionsBarProps>) {

    return (
        <Row style={{ width: '100%', marginBottom: '16px' }} gutter={16}>
            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                {showSearch && (
                    <CustomSearchInput
                        placeholder={placeholder}
                        fetchApi={onSearch}
                    />
                )}
            </Col>
            <Col xl={18} lg={16} md={12} sm={24} xs={24}>
                <Flex align='end' justify='end' gap={16}>
                    <Button type="primary" onClick={handleAddBtn}>
                        <PlusOutlined />
                        {titleBtnAdd}
                        <CaretDownOutlined />
                    </Button>

                    {handleImportClick && (
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={handleImportClick}
                        >
                            Import
                        </Button>
                    )}
                    {extraExportButton}
                    {/* {showExport && <Button type="primary" icon={<DownloadOutlined />}>Xuất file</Button>} */}
                    {
                        handleFilterBtn && (
                            <Button type="default" onClick={handleFilterBtn}>
                                <FilterOutlined />
                            </Button>
                        )
                    }
                </Flex>
            </Col>
            {extraButtons}
        </Row>
    );
}