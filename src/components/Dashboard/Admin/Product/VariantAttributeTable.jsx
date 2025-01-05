import { HolderOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Modal, Table } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";

import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { updateVariantOptions } from "@/utilities/lib/variant";

const AttributeOptions = ({ options, onSelect, record, variantOptions }) => {
  return (
    <>
      <CustomSelect
        mode="multiple"
        options={options}
        placeholder="Attributes Options"
        customStyle={true}
        onChange={(value, option) => onSelect(value, option, record.id)}
        value={variantOptions[record.id] ?? []}
        noStyle={true}
      />
    </>
  );
};

export const VariantAttributeTable = ({
  dataSource,
  setDataSource,
  variantOptions,
  variantAttributesName,
  setVariantOptions,
  setVariantAttributesName,
  setReset,
}) => {
  const RowContext = React.createContext({});

  const onSelect = (value, option, id) => {
    setVariantOptions((prev) => ({
      ...prev,
      [id]: value,
    }));

    setVariantAttributesName((prev) => ({
      ...prev,
      [id]: option.map((item) => item.label),
    }));
  };

  useEffect(() => {
    updateVariantOptions(dataSource, variantOptions, variantAttributesName);
  }, [dataSource, variantOptions, variantAttributesName]);

  const variantAttributeColumns = [
    {
      key: "sort",
      align: "center",
      width: 80,
      render: () => <DragHandle />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 130,
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      align: "center",
      render: (options, record) => {
        const attribute_options = options?.map((item) => {
          return {
            value: item?._id,
            label: item?.name,
          };
        });

        return (
          <AttributeOptions
            record={record}
            options={attribute_options}
            onSelect={onSelect}
            setDataSource={setDataSource}
            variantOptions={variantOptions}
          />
        );
      },
    },
  ];

  const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
      <Button
        type="text"
        size="small"
        icon={<HolderOutlined />}
        style={{
          cursor: "move",
        }}
        ref={setActivatorNodeRef}
        {...listeners}
      />
    );
  };

  const Row = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };
    const contextValue = useMemo(
      () => ({
        setActivatorNodeRef,
        listeners,
      }),
      [setActivatorNodeRef, listeners]
    );
    return (
      <RowContext.Provider value={contextValue}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes} />
      </RowContext.Provider>
    );
  };

  const [showModal, setShowModal] = useState(false);

  const [dragEnd, setDragEnd] = useState({});

  const onDragEnd = ({ active, over }) => {
    setShowModal(true);
    setDragEnd({ active, over });
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const handleDrag = () => {
    const { active, over } = dragEnd;
    setShowModal(false);
    if (active?.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.key === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.key === over?.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });

      setReset(true);
    }
  };

  return (
    <>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            rowKey="key"
            components={{
              body: {
                row: Row,
              },
            }}
            size="small"
            pagination={false}
            columns={variantAttributeColumns}
            dataSource={dataSource}
            className="mb-5"
          />
        </SortableContext>
      </DndContext>

      <Modal
        title={false}
        openModal={showModal}
        hideModal={hideModal}
        width={650}
        showCloseButton={false}
      >
        <span className="text-base text-center w-full">
          If you change order, your data will be lost. Do you want to continue?
        </span>

        <div className="flex justify-end w-full items-center gap-3 pt-10">
          <Button type="" onClick={hideModal}>
            No
          </Button>
          <Button type="primary" onClick={handleDrag}>
            Yes
          </Button>
        </div>
      </Modal>
    </>
  );
};
