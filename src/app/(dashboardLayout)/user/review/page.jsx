"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteReviewMutation,
  useGetSingleReviewByUserQuery,
} from "@/redux/services/review/reviewApi";
import { Input, Pagination, Space, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const AdminReview = () => {
  const user = useSelector(useCurrentUser);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const { data: reviews, isFetching } = useGetSingleReviewByUserQuery(
    user?._id
  );

  const [deleteReview] = useDeleteReviewMutation();

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      align: "start",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      align: "start",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      align: "start",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "start",
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
        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Details"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setDeleteModalOpen(true);
                }}
                className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <MdDelete />
              </button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const tableData = reviews?.map((item) => ({
    key: item._id,
    user: item?.user?.name,
    product: item?.product?.map((item) => item.name).join(", "),
    rating: item?.rating,
    comment: item?.comment,
    status: item?.status,
  }));

  const filteredTableData = tableData?.filter((item) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();

    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="px-5">
      <div className="flex justify-between">
        <div></div>
        <Input
          suffix={<FaSearch />}
          placeholder="Search..."
          className="py-1.5 lg:w-1/4"
          size="large"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={filteredTableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={reviews?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"review"}
        func={deleteReview}
      />
    </div>
  );
};

export default AdminReview;
