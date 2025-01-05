import { PlusOutlined } from "@ant-design/icons";
import {
  findNonMatchingItems,
  formatProductData,
} from "@/utilities/lib/variant";
import { Button, Form, Input, InputNumber, Table, Upload } from "antd";
import { useCallback, useEffect, useState } from "react";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  record,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber
        controls={false}
        changeOnWheel={false}
        width={"full"}
        value={record[dataIndex]}
        onChange={(value) => {
          record[dataIndex] = value;
        }}
      />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const getBase64 = (file) =>
  // eslint-disable-next-line no-undef
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProductVariantOption = ({
  combination,
  onCustomSubmit,
  data: editData,
  reset,
}) => {
  const [variantForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const handleFileUpload = (info, record) => {
    const newFiles = info.fileList
      .map((file) => {
        const isFile =
          file.originFileObj instanceof Blob ||
          file.originFileObj instanceof File;
        const url = isFile ? URL.createObjectURL(file.originFileObj) : file.url;

        // Only return files that have both originFileObj and url
        if (file.originFileObj && url) {
          return {
            uid: file.uid,
            originFileObj: file.originFileObj || null,
            name: file.name,
            url: url,
          };
        }
        return null;
      })
      .filter((file) => file !== null);

    setData((prevState) =>
      prevState.map((item) => {
        if (item.key === record.key) {
          const updatedImages = [
            ...(item.images || []),
            ...newFiles
              .filter(
                (file) => !item.images?.some((img) => img.name === file.name)
              )
              .map((file) => file.originFileObj),
          ];

          const updatedPreviews = [
            ...(item.previews || []),
            ...newFiles
              .filter(
                (file) =>
                  !item.previews?.some((preview) => preview === file.url)
              )
              .map((file) => file.url),
          ];

          return {
            ...item,
            images: updatedImages,
            previews: updatedPreviews,
          };
        }
        return item;
      })
    );
  };

  const handleRemove = (file, record) => {
    setData((prevState) =>
      prevState.map((item) => {
        if (item.key === record.key) {
          const fileIndex = item.images.findIndex((img) => img === file.url);

          if (fileIndex === -1) return item;

          const updatedImages = item?.images?.filter((img) => img !== file.url);
          const updatedPreviews = item?.previews?.filter(
            (preview) => preview !== file.url
          );

          return {
            ...item,
            images: updatedImages,
            previews: updatedPreviews,
          };
        }

        return item;
      })
    );
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    const imgWindow = window.open(file.url || file.preview, "_blank");
    imgWindow?.document.write(
      `<img src="${
        file.url || file.preview
      }" style="max-width: 100%; margin: auto; display: block; max-height: 100%;" />`
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 330,
      editable: true,
      render: (name) => (
        <span className="text-dark text-xs md:text-sm">{name}</span>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      editable: true,
      width: 130,
      render: (sku) => <span className="text-xs md:text-sm">{sku}</span>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      editable: true,
      width: 100,
      render: (stock) => <span className="text-xs md:text-sm">{stock}</span>,
    },
    {
      title: "Buying Price",
      dataIndex: "buyingPrice",
      key: "buyingPrice",
      align: "center",
      editable: true,
      width: 150,
      render: (buyingPrice) => (
        <span className="text-xs md:text-sm">{buyingPrice}</span>
      ),
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      align: "center",
      width: 150,
      editable: true,
      render: (sellingPrice) => (
        <span className="text-xs md:text-sm">{sellingPrice}</span>
      ),
    },
    {
      title: "Upload Files",
      key: "upload",
      render: (_, record) => {
        const fileList =
          record.images?.map((file, index) => {
            const isUrl = typeof file === "string";

            return {
              uid: index.toString(),
              name: isUrl ? `Image-${index}` : file?.name,
              url: isUrl
                ? file
                : file instanceof Blob
                ? URL.createObjectURL(file)
                : null,
              status: "done",
              originFileObj: isUrl ? null : file,
            };
          }) || [];

        return (
          <div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={(info) => handleFileUpload(info, record)}
              onRemove={(file) => handleRemove(file, record)}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 130,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex items-center gap-2 justify-center font-bold">
            <Button size="small" onClick={cancel}>
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => save(record.key)}
            >
              Save
            </Button>
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Button size="small" onClick={() => edit(record)}>
              Edit
            </Button>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "sellingPrice" ||
          col.dataIndex === "buyingPrice" ||
          col.dataIndex === "stock"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const mapCombinationToData = () => {
      if (!editData) {
        const variantDataSource =
          combination
            ?.filter((item) => item.name)
            .map((item) => ({
              key: item.key,
              name: item.name,
              sku: item.sku,
              stock: item.stock || 0,
              sellingPrice: item.sellingPrice || 0,
              buyingPrice: item.buyingPrice || 0,
              attributeCombination: item.attributeCombination || [],
            })) ?? [];
        setData(variantDataSource);
        setSelectedRowKeys(variantDataSource.map((item) => item.key));
      } else {
        const formattedData = formatProductData(
          editData?.variants,
          editData?.name,
          editData?.sku
        );
        const variantDataSource =
          combination
            ?.filter((item) => item.name)
            .map((item) => ({
              key: item.key,
              name: item.name,
              sku: item.sku,
              stock: item.stock || 0,
              sellingPrice: item.sellingPrice || 0,
              buyingPrice: item.buyingPrice || 0,
              attributeCombination: item.attributeCombination || [],
            })) ?? [];
        const nonMatchingItems = findNonMatchingItems(
          formattedData,
          variantDataSource
        );
        const newData = [
          ...(Array.isArray(formattedData) ? formattedData : []),
          ...nonMatchingItems,
        ];
        setData(newData);
        setSelectedRowKeys(newData.map((item) => item.key));
      }
    };
    mapCombinationToData();
  }, [combination, editData, reset]);

  const edit = (record) => {
    variantForm.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await variantForm.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          attributeCombination: item.attributeCombination,
        });
        setData(newData);
        setEditingKey("");
      }
    } catch (err) {
      console.error("Error saving row:", err);
    }
  };

  const handleCustomSubmit = useCallback(
    () => ({
      selectedRowData: data.filter((item) =>
        selectedRowKeys.includes(item.key)
      ),
    }),
    [data, selectedRowKeys]
  );
  onCustomSubmit(handleCustomSubmit);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  if (combination.length) {
    return (
      <Form form={variantForm} component={false}>
        <Table
          className="mb-5"
          components={{ body: { cell: EditableCell } }}
          title={() => <>Product Variant Options</>}
          size="small"
          pagination={false}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          scroll={{ x: "max-content" }}
          rowSelection={rowSelection}
        />
      </Form>
    );
  }
  return null;
};

export default ProductVariantOption;
