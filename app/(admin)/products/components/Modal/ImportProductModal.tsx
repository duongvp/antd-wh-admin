import ImportButton from '@/components/shared/ImportButton';
import { importProductsFromExcel } from '@/services/productService';
import { Modal, Radio, Typography } from 'antd';
import { useState } from 'react';

const { Text, Link } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

const ImportProductModal: React.FC<Props> = ({ open, onClose }) => {
    const [duplicateOption, setDuplicateOption] = useState('error');
    const [updateStock, setUpdateStock] = useState(false);
    const [updatePrice, setUpdatePrice] = useState(true);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <>
                    Nhập hàng hóa từ file dữ liệu (
                    <Link href="#">Tải về file mẫu: Excel file</Link>)
                </>
            }
        >
            <div style={{ marginBottom: 20 }}>
                <Text strong>Xử lý trùng mã hàng, khác tên hàng?</Text>
                <Radio.Group
                    onChange={(e) => setDuplicateOption(e.target.value)}
                    value={duplicateOption}
                    style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                >
                    <Radio value="error">Báo lỗi và dừng import</Radio>
                    <Radio value="replace">Thay thế tên hàng cũ bằng tên hàng mới</Radio>
                </Radio.Group>
            </div>

            <div style={{ marginBottom: 20 }}>
                <Text strong>Cập nhật tồn kho?</Text>
                <Radio.Group
                    onChange={(e) => setUpdateStock(e.target.value)}
                    value={updateStock}
                    style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                >
                    <Radio value={false}>Không</Radio>
                    <Radio value={true}>Có</Radio>
                </Radio.Group>
            </div>

            <div style={{ marginBottom: 30 }}>
                <Text strong>Cập nhật giá vốn?</Text>
                <Radio.Group
                    onChange={(e) => setUpdatePrice(e.target.value)}
                    value={updatePrice}
                    style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                >
                    <Radio value={false}>Không</Radio>
                    <Radio value={true}>Có</Radio>
                </Radio.Group>
            </div>

            <div style={{ textAlign: 'right' }}>
                <ImportButton importApiFn={importProductsFromExcel} onFileImport={(data) => console.log(data)} onCloseImportModal={onClose} />
            </div>
        </Modal>
    );
};

export default ImportProductModal;

