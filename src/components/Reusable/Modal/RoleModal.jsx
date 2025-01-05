import { Button, Modal } from "antd";
import { FaInfoCircle } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const props = {
  footer: null,
  centered: true,
  maskClosable: true,
};

const RoleModal = ({
  text,
  modalOpen,
  setModalOpen,
  handleStatus,
  isLoading,
}) => {
  return (
    <Modal
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      title={
        <div className="flex items-center gap-3">
          <FaInfoCircle
            style={{
              fontSize: "20px",
            }}
          />
          <span>Role Update</span>
        </div>
      }
      closeIcon={<HiX className="text-2xl text-gray-600 hover:text-gray-800" />}
      centered
      {...props}
    >
      <div className="p-5">
        <span className="my-4 text-base font-semibold">
          {text ?? "Do you want to update your role?"}
        </span>
        <div className="flex w-full items-center justify-end gap-3 mt-6">
          <Button onClick={() => setModalOpen(false)}>No</Button>
          <Button type="primary" onClick={handleStatus} loading={isLoading}>
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleModal;
