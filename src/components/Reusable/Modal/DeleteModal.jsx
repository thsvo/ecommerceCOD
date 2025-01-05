import { Button, Modal } from "antd";
import { DeleteButton } from "../Button/CustomButton";
import { toast } from "sonner";
import deleteImage from "@/assets/images/Trash-can.png";
import Image from "next/image";

const DeleteModal = ({ modalOpen, setModalOpen, itemId, func, text }) => {
  const handleDelete = async () => {
    try {
      const res = await func(itemId);
      if (res.data.success) {
        setModalOpen(false);
        toast.success(res.data.message);
      } else {
        setModalOpen(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setModalOpen(false);
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item.");
    }
  };
  return (
    <Modal
      centered
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
      footer={null}
    >
      <div className="p-8">
        <Image
          height={60}
          width={60}
          src={deleteImage}
          alt="delete image"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-center text-2xl font-bold">
          Are your sure you want to permanently delete this {text}?
        </h2>
        <div className="lg:flex mt-10 gap-6 items-center justify-center">
          <Button
            onClick={() => setModalOpen(false)}
            type="text"
            className="!font-bold bg-transparent !text-red-500 px-10 py-4 border !border-red-500"
          >
            Cancel
          </Button>
          <DeleteButton func={handleDelete} text={"Delete"} />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
