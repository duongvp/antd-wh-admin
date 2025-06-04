import ImportButton from '@/components/shared/ImportButton';
import { importProductsFromExcel } from '@/services/productService';
import { Modal, Typography } from 'antd';

const { Text, Link } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

const ExportModal: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <>
                    Xuất file dữ liệu (
                    <Link href="#">Tải về file mẫu: Excel file</Link>)
                </>
            }
        >
            <div style={{ marginBottom: 20 }}>
                <Text strong>Bạn có chắc chắn muốn xuất file dữ liệu không?</Text>
            </div>

            <div style={{ textAlign: 'right' }}>
                <ImportButton importApiFn={importProductsFromExcel} onFileImport={(data) => console.log(data)} onCloseImportModal={onClose} />
            </div>
        </Modal>
    );
};

export default ExportModal;

