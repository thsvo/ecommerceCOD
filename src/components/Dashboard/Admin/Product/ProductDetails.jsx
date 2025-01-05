import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import { Descriptions, Modal, Spin, Tag } from "antd";
import moment from "moment";
import React from "react";

const formatLabel = (label) => {
  const withSpaces = label.replace(/_/g, " ");
  const spacedLabel = withSpaces.replace(/([a-z])([A-Z])/g, "$1 $2");
  const capitalizedLabel = spacedLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return <strong className="capitalize">{capitalizedLabel}</strong>;
};

const ProductDetails = ({ modalOpen, setModalOpen, title, details }) => {
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const excludedKeys = details ? ["__v", "updatedAt", "_id"] : [];

  const formatStatus = (value) => (
    <Tag color={value ? "green" : "red"} className="capitalize">
      {value ? "Active" : "Inactive"}
    </Tag>
  );

  const formatTrending = (value) => (
    <Tag color={value ? "blue" : "red"} className="capitalize">
      {value ? "Trending" : "Not Trending"}
    </Tag>
  );

  const formatDate = (value) => moment(value).format("Do MMM, YYYY");
  return (
    <Modal
      centered
      open={modalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={"50%"}
    >
      {details ? (
        <div className="p-5">
          <h2 className="text-center text-xl font-bold pb-2 w-1/3 mx-auto border-b-2 border-gray-500 mb-10">
            {title} Details
          </h2>

          <Descriptions bordered column={1}>
            {Object.entries(details).map(([key, value]) => (
              <Descriptions.Item
                key={key}
                label={formatLabel(key)}
              ></Descriptions.Item>
            ))}
          </Descriptions>

          <div className="flex justify-end mt-10">
            <SubmitButton func={handleCloseModal} text={"Ok"} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin />
        </div>
      )}
    </Modal>
  );
};

export default ProductDetails;
