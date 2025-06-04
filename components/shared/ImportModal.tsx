import React from "react";
import { Modal, Typography } from "antd";
import ImportButton from "./ImportButton";

const { Title, Paragraph, Link } = Typography;

interface ImportModalProps {
    open: boolean;
    onClose: () => void;
    title?: string
    notes?: string[];
    importApiFn: (formData: FormData) => Promise<any>,
    linkExcel: string
}

const ImportModal: React.FC<ImportModalProps> = ({
    open,
    onClose,
    notes,
    title = "Tạo từ file dữ liệu",
    importApiFn,
    linkExcel
}) => {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Paragraph>
                Tải về file mẫu:{" "}
                <Link href={linkExcel} download>
                    Excel file
                </Link>
            </Paragraph>

            <div style={{ background: "#FFFBE6", padding: "12px", marginTop: 16, borderRadius: 4 }}>
                <Paragraph style={{ marginBottom: 8 }}>
                    <strong>⚠ Lưu ý</strong>
                </Paragraph>
                {
                    notes && notes.length > 0 && (
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            {notes.map((note, index) => (
                                <li key={index} style={{ marginBottom: 8, lineHeight: 1.5 }}>
                                    <span style={{ marginRight: 6 }}>-</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    )
                }
            </div>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <ImportButton importApiFn={importApiFn} onFileImport={(data) => console.log(data)} onCloseImportModal={onClose} />
            </div>
        </Modal>
    );
};

export default ImportModal;


