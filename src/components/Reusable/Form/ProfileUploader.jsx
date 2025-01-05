/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Form, Image, Upload } from "antd";
import { LiaCloudUploadAltSolid } from "react-icons/lia";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProfileUploader = ({ name, label, required, multiple, defaultValue }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (defaultValue) {
      setFileList([
        {
          uid: "-1",
          name: "Uploaded Image",
          status: "done",
          url: defaultValue,
        },
      ]);
    }
  }, [defaultValue]);

  const handleRemove = () => {
    setFileList([]);
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
        <Upload
          listType="picture-circle"
          className="border border-primary rounded-full border-dashed"
          name={"file"}
          style={{
            display: fileList.length > 0 ? "none" : "block",
          }}
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
          {fileList?.length === 0 && (
            <button
              style={{
                // border: 0,
                background: "none",
              }}
              type="button"
              className="avatar-uploader flex w-full flex-col items-center justify-center"
            >
              <LiaCloudUploadAltSolid
                style={{
                  fontSize: 25,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          )}
        </Upload>
      </Form.Item>
    </>
  );
};

export default ProfileUploader;
