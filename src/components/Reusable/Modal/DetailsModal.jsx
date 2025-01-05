import { Modal, Spin, Descriptions, Tag, Image } from "antd";
import moment from "moment";
import { SubmitButton } from "../Button/CustomButton";
import { formatImagePath } from "@/utilities/lib/formatImagePath";

const formatLabel = (label) => {
  const withSpaces = label.replace(/_/g, " ");
  const spacedLabel = withSpaces.replace(/([a-z])([A-Z])/g, "$1 $2");
  const capitalizedLabel = spacedLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return <strong className="capitalize">{capitalizedLabel}</strong>;
};

const DetailsModal = ({ modalOpen, setModalOpen, title, details }) => {
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const excludedKeys = details ? ["__v", "updatedAt", "_id", "variants"] : [];

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

  const renderValue = (key, value) => {
    if (key.toLowerCase().includes("date") || key === "createdAt") {
      return formatDate(value);
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} label={formatLabel(key)}>
          {value.map((item, index) =>
            typeof item === "object" ? (
              <div
                key={index}
                className="my-4 grid grid-cols-1 border-t border-primary/20 first:border-0"
              >
                {Object.entries(item)
                  .filter(([subKey]) => !excludedKeys.includes(subKey))
                  .map(([subKey, subValue]) => (
                    <div key={subKey} className="flex items-center gap-2 mt-2">
                      <strong>{formatLabel(subKey)}:</strong>{" "}
                      {renderValue(subKey, subValue)}
                    </div>
                  ))}
              </div>
            ) : (
              <div key={index}>{item}</div>
            )
          )}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="my-4 border-t border-primary/20 first:border-0">
          {Object.entries(value)
            .filter(([subKey]) => !excludedKeys.includes(subKey))
            .map(([subKey, subValue]) => (
              <div key={subKey} className="flex items-center gap-2 mt-2">
                <strong>{formatLabel(subKey)}:</strong>{" "}
                {renderValue(subKey, subValue)}
              </div>
            ))}
        </div>
      );
    }

    return value;
  };

  const filteredDetails = details
    ? Object.entries(details).reduce((acc, [key, value]) => {
        if (
          !excludedKeys.includes(key) &&
          (!key.toLowerCase().includes("id") ||
            key.toLowerCase().includes("nid")) &&
          !(typeof value === "string" && value.startsWith("http"))
        ) {
          acc[key] = value;
        }
        return acc;
      }, {})
    : {};

  const urlKeys = details
    ? Object.entries(details).filter(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          (!key.toLowerCase().includes("id") ||
            key.toLowerCase().includes("nid")) &&
          typeof value === "string" &&
          value.startsWith("http")
      )
    : [];

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
            {Object.entries(filteredDetails).map(([key, value]) => (
              <Descriptions.Item key={key} label={formatLabel(key)}>
                {key === "status"
                  ? formatStatus(value)
                  : key === "trending"
                  ? formatTrending(value)
                  : renderValue(key, value)}
              </Descriptions.Item>
            ))}

            {urlKeys.length > 0 &&
              urlKeys.map(([key, value]) => (
                <Descriptions.Item key={key} label={formatLabel(key)}>
                  <Image src={value} alt={key} style={{ maxWidth: 200 }} />
                </Descriptions.Item>
              ))}
            {details?.images?.length > 0 &&
              details?.images?.map((image, index) => (
                <Descriptions.Item key={index} label={`Images ${index + 1}`}>
                  <Image
                    src={formatImagePath(image)}
                    alt={index}
                    style={{ maxWidth: 200 }}
                  />
                </Descriptions.Item>
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

export default DetailsModal;
