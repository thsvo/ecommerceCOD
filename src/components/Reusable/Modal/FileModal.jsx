import { Image, Modal } from "antd";

const FileModal = ({ modalOpen, setModalOpen, value }) => {
  const isImage = /\.(jpg|jpeg|png)$/i.test(value);
  const isPreview = /\.(pdf|txt)$/i.test(value);

  return (
    <Modal
      centered
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
      footer={null}
    >
      <div className="py-6 flex flex-col items-center justify-center">
        {isImage ? (
          <Image
            height={200}
            width={400}
            src={value}
            alt="file preview"
            className="rounded-xl"
          />
        ) : isPreview ? (
          <iframe
            src={value}
            title="file preview"
            style={{ width: "100%", height: "80vh" }}
          />
        ) : (
          <div>
            <p>File: {value}</p>
            <a href={value} download>
              Download
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileModal;
