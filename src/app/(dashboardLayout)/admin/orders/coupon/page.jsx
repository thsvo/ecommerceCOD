"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import CouponCreate from "@/components/Dashboard/Admin/Coupon/CouponCreate";
import CouponEdit from "@/components/Dashboard/Admin/Coupon/CouponEdit";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import TableHeader from "@/components/Reusable/Table/TableHeader";
import {
  useDeleteBulkCouponMutation,
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useGetSingleCouponQuery,
} from "@/redux/services/coupon/couponAPi";
import { Dropdown, Menu, Pagination, Space, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";

const GiftCard = () => {
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

  const searchContent = (
    <div className="">
      {/* <CustomForm onSubmit={onSubmit}>
        <div className="flex justify-end mb-4" onClick={handleCloseSearch}>
          <MdCancel className="text-white text-3xl bg-red-500 rounded-full cursor-pointer" />
        </div>
        <CustomDateRange
          label={"Date"}
          name={"date"}
          placeholder={"Search by date range"}
        />
        <SubmitButton text={"Search"} />
      </CustomForm> */}
    </div>
  );

  const { data: coupons, isFetching } = useGetCouponsQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: couponData } = useGetSingleCouponQuery(itemId, {
    skip: !itemId,
  });

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

  const [deleteCoupon] = useDeleteCouponMutation();
  const [deleteBulkCoupon] = useDeleteBulkCouponMutation();

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
      title: "Coupon Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Coupon Count",
      dataIndex: "count",
      key: "count",
      align: "center",
    },
    {
      title: "Coupon Amount Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Coupon Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Minimum Purchase Amount",
      dataIndex: "minimumAmount",
      key: "minimumAmount",
      align: "center",
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

  const tableData = coupons?.results?.map((item) => ({
    key: item._id,
    name: item?.name,
    code: item?.code,
    count: item?.count,
    type: item?.type,
    amount: item?.amount,
    minimumAmount: item?.minimumAmount,
    status: item?.status,
  }));

  return (
    <div className="px-5">
      <TableHeader
        setOpen={setOpen}
        title={"Coupon"}
        selectedRowKeys={selectedRowKeys}
        itemId={itemId}
        content={searchContent}
        setSearch={setSearch}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        deleteBulk={deleteBulkCoupon}
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
        total={coupons?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <CouponCreate open={open} setOpen={setOpen} />
      <CouponEdit itemId={itemId} open={openEdit} setOpen={setOpenEdit} />
      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Coupon"}
        details={couponData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"coupon"}
        func={deleteCoupon}
      />
    </div>
  );
};

export default GiftCard;
