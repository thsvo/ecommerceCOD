"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import ProductCreate from "@/components/Dashboard/Admin/Product/ProductCreate";
import ProductEdit from "@/components/Dashboard/Admin/Product/ProductEdit";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import TableHeader from "@/components/Reusable/Table/TableHeader";
import {
  useDeleteBulkProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetSingleProductQuery,
} from "@/redux/services/product/productApi";
import {
  Dropdown,
  Image,
  Menu,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";

const AdminProducts = () => {
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

  const { data: products, isFetching } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: productData } = useGetSingleProductQuery(itemId, {
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

  const [deleteProduct] = useDeleteProductMutation();
  const [deleteBulkProduct] = useDeleteBulkProductMutation();

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
      title: "Image",
      dataIndex: "attachment",
      key: "attachment",
      align: "start",
      render: (item) => (
        <Image
          src={
            item ??
            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
          }
          alt={"brand image"}
          className="!w-12 !h-12 rounded-full"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "start",
      render: (item, record) => (
        <Link href={`/products/cart/${record?.slug}`} target="_blank">
          {item}
        </Link>
      ),
    },
    {
      title: "Brand Name",
      dataIndex: "brand",
      key: "brand",
      align: "start",
      render: (item) => <div>{item ? item : "N/A"}</div>,
    },
    {
      title: "Category Name",
      dataIndex: "category",
      key: "category",
      align: "start",
      render: (item) => <div>{item ? item : "N/A"}</div>,
    },
    {
      title: "Buying Price",
      dataIndex: "buyingPrice",
      key: "buyingPrice",
      align: "start",
      render: (item) => <div>{item ? item : "N/A"}</div>,
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      align: "start",
      render: (item) => <div>{item ? item : "N/A"}</div>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "start",
      render: (item, record) => {
        const totalStock = record.variants
          ? record.variants.reduce(
              (sum, variant) => sum + (variant.stock || 0),
              0
            )
          : 0;

        return <div>{item || totalStock || "N/A"}</div>;
      },
    },
    {
      title: "Is Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      align: "center",
      render: (item) => (
        <Tag
          color={item ? "green" : "blue"}
          className="capitalize font-semibold"
        >
          {item ? "Featured" : "Not Featured"}
        </Tag>
      ),
    },
    {
      title: "Is Variant",
      dataIndex: "isVariant",
      key: "isVariant",
      align: "center",
      render: (item) => (
        <Tag
          color={item ? "green" : "blue"}
          className="capitalize font-semibold"
        >
          {item ? "Variant" : "Not Variant"}
        </Tag>
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

  const tableData = products?.results?.map((item) => ({
    key: item._id,
    name: item?.name,
    sku: item?.sku,
    slug: item?.slug,
    brand: item?.brand?.name,
    category: item?.category?.name,
    buyingPrice: item?.buyingPrice,
    sellingPrice: item?.sellingPrice,
    stock: item?.stock,
    isVariant: item?.isVariant,
    isFeatured: item?.isFeatured,
    variants: item?.variants,
    attachment: item?.mainImage,
    status: item?.status,
  }));

  return (
    <div className="lg:px-5">
      <TableHeader
        setOpen={setOpen}
        title={"Product"}
        selectedRowKeys={selectedRowKeys}
        itemId={itemId}
        setSearch={setSearch}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        deleteBulk={deleteBulkProduct}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
        scroll={{ x: 1000 }}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={products?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <ProductCreate open={open} setOpen={setOpen} />
      <ProductEdit itemId={itemId} open={openEdit} setOpen={setOpenEdit} />
      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Product"}
        details={productData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"product"}
        func={deleteProduct}
      />
    </div>
  );
};

export default AdminProducts;
