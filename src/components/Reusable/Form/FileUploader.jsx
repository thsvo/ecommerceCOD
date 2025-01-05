/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Form, Image, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FileUploader = ({
  name,
  label,
  required,
  multiple,
  defaultValue,
  small = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (defaultValue) {
      setShowUploader(true);
    }
  }, [defaultValue]);

  const handleRemove = () => {
    setFileList([]);
    setShowUploader(null);
  };

  const handlePreview = async (file) => {
    if (!file?.url && !file?.preview) {
      file.preview = await getBase64(file?.originFileObj);
    }
    setPreviewImage(file?.url || file?.preview);
    setPreviewOpen(true);
  };
  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList?.slice(-1);

    newFileList = newFileList?.map((file) => {
      if (file?.response) {
        file.url = file?.response?.url;
      }

      return file;
    });

    setFileList(newFileList);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      {previewImage && (
        <Image
          alt="something"
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: required, message: `${label} is required` }]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload.Dragger
          listType="picture-card"
          name={"file"}
          style={{
            display: fileList.length > 0 || showUploader ? "none" : "block",
          }}
          className={`group`}
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          onRemove={handleRemove}
          onPreview={handlePreview}
          multiple={multiple}
          maxCount={multiple ? 20 : 2}
        >
          {(fileList?.length < 1 || multiple) && (
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
              className="w-full flex flex-col items-center justify-center group-hover:text-primary duration-500"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              {!small && (
                <>
                  <p className="ant-upload-text"></p>
                  Click or drag file to this area to upload
                </>
              )}
            </button>
          )}
        </Upload.Dragger>
      </Form.Item>
    </>
  );
};

export default FileUploader;
