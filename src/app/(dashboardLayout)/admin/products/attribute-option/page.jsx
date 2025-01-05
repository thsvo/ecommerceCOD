"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import AttributeOptionCreate from "@/components/Dashboard/Admin/AttributeOption/AttributeOptionCreate";
import AttributeOptionEdit from "@/components/Dashboard/Admin/AttributeOption/AttributeOptionEdit";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import TableHeader from "@/components/Reusable/Table/TableHeader";
import {
  useDeleteAttributeOptionMutation,
  useDeleteBulkAttributeOptionMutation,
  useGetAttributeOptionsQuery,
  useGetSingleAttributeOptionQuery,
} from "@/redux/services/attributeOption/attributeOptionApi";
import { Dropdown, Menu, Pagination, Space, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";

const AttributeOption = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { data: attributeOptions, isFetching } = useGetAttributeOptionsQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: attributeOptionData } = useGetSingleAttributeOptionQuery(
    itemId,
    {
      skip: !itemId,
    }
  );

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [deleteAttributeOption] = useDeleteAttributeOptionMutation();
  const [deleteBulkAttributeOption] = useDeleteBulkAttributeOptionMutation();

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
      case "edit":
        setOpenEdit(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      align: "center",
      render: (item, record) =>
        record?.type === "color" ? (
          <Tag color={item} className="capitalize font-semibold ml-2">
            {item}
          </Tag>
        ) : (
          <span>{item}</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (item) => (
        <Tag
          color={item == "Active" ? "green" : "red"}
          className="capitalize font-semibold"
        >
          {item == "Active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleMenuClick(key, item.key)}
            className="w-full flex flex-col gap-2"
          >
            <Menu.Item key="edit">
              <Tooltip placement="top" title={"Edit"}>
                <button className="bg-green-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <FaEdit />
                </button>
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="delete">
              <Tooltip placement="top" title={"Delete"}>
                <button className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <MdDelete />
                </button>
              </Tooltip>
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Details"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setDetailsModalOpen(true);
                }}
                className="bg-blue-600 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <TbListDetails />
              </button>
            </Tooltip>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
              <Tooltip placement="top" title={"More"}>
                <button className="bg-blue-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <BsThreeDotsVertical />
                </button>
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const tableData = attributeOptions?.results?.map((item) => ({
    key: item._id,
    name: item?.name,
    type: item?.type,
    label: item?.label,
    status: item?.status,
  }));

  return (
    <div className="px-5">
      <TableHeader
        setOpen={setOpen}
        title={"Attribute Option"}
        selectedRowKeys={selectedRowKeys}
        itemId={itemId}
        setSearch={setSearch}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        deleteBulk={deleteBulkAttributeOption}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={attributeOptions?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <AttributeOptionCreate open={open} setOpen={setOpen} />
      <AttributeOptionEdit
        itemId={itemId}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Attribute Option"}
        details={attributeOptionData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"attribute option"}
        func={deleteAttributeOption}
      />
    </div>
  );
};

export default AttributeOption;
