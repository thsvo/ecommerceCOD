import React, { useEffect, useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const CustomVideoUploader = ({ name, label, defaultValue, onChange }) => {
  const [fileList, setFileList] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      setPreviewVideo(defaultValue);
      setFileList([
        {
          uid: "-1",
          name: "video",
          status: "done",
          url: defaultValue,
        },
      ]);
    }
  }, [defaultValue]);

  const handleRemove = () => {
    setFileList([]);
    setPreviewVideo(null);
    if (onChange) {
      onChange(null);
    }
  };

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);

    if (onChange) {
      onChange(newFileList);
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="font-bold mb-2">{label}</label>}
      {previewVideo ? (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <video
            src={previewVideo}
            controls
            style={{ width: "100%", maxHeight: "300px", marginBottom: "10px" }}
          />
          <Button
            type="dashed"
            className="bg-red-500 text-white"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
          >
            Remove Video
          </Button>
        </div>
      ) : (
        <Upload.Dragger
          listType="text"
          name={name}
          accept="video/*"
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            if (onChange) {
              onChange([file]);
            }
            return false;
          }}
          onChange={handleFileChange}
          onRemove={handleRemove}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p>Click or drag video to upload</p>
        </Upload.Dragger>
      )}
    </div>
  );
};

export default CustomVideoUploader;
