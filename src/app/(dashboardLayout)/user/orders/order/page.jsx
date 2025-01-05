"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetOrdersByUserQuery } from "@/redux/services/order/orderApi";
import { useAddReviewMutation } from "@/redux/services/review/reviewApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { Button, Form, Input, Modal, Pagination, Rate, Table, Tag } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserOrders = () => {
  const user = useSelector(useCurrentUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [singleOrder, setSingleOrder] = useState({});
  const [search, setSearch] = useState("");

  const { data: userOrders, isFetching } = useGetOrdersByUserQuery({
    page: currentPage,
    limit: pageSize,
    id: user?._id,
  });

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "tranId",
      key: "tranId",
      align: "center",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      align: "center",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
      align: "center",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "center",
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "center",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (item) => {
        let color;
        let text;

        switch (item) {
          case "SUCCESS":
            color = "green";
            text = "Success";
            break;
          case "PENDING":
            color = "orange";
            text = "Pending";
            break;
          case "FAILED":
            color = "red";
            text = "Failed";
            break;
          default:
            color = "gray";
            text = "Unknown";
            break;
        }

        return (
          <Tag color={color} className="capitalize font-semibold">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      align: "center",
      render: (item) => {
        let color;
        let text;

        switch (item) {
          case "delivered":
            color = "green";
            text = "Delivered";
            break;
          case "pending":
            color = "blue";
            text = "Pending";
            break;
          case "shipped":
            color = "orange";
            text = "Shipped";
            break;
          case "returned":
            color = "red";
            text = "Returned";
            break;
          default:
            color = "gray";
            text = "Unknown";
            break;
        }

        return (
          <Tag
            color={color}
            className="capitalize font-semibold cursor-pointer"
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      align: "center",
      render: (record) => (
        <Button
          className="capitalize font-semibold cursor-pointer"
          type="primary"
          onClick={() => {
            setReviewModalOpen(true);
            setSingleOrder(record);
          }}
        >
          Add Review
        </Button>
      ),
    },
  ];

  const tableData = userOrders?.results?.map((item) => ({
    key: item._id,
    tranId: item.tranId ?? "N/A",
    products: item?.products
      ?.map((product) => product?.productName)
      .join(" , "),
    quantity: item?.products?.map((product) => product?.quantity).join(" , "),
    subTotal: item?.subTotal,
    shippingFee: item?.shippingFee,
    discount: item?.discount ?? 0,
    grandTotal: item?.grandTotal,
    paymentStatus: item?.paymentStatus,
    deliveryStatus: item?.deliveryStatus,
    paymentMethod: item?.paymentMethod,
    review: item,
  }));

  const [addReview, { isLoading: isReviewLoading }] = useAddReviewMutation();

  const handleReview = async (values) => {
    const toastId = toast.loading("Creating Review...");

    try {
      const submittedData = {
        ...values,
        user: user?._id,
        product: singleOrder?.products?.map((item) => item?.product?._id),
      };

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addReview(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setReviewModalOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the review.", {
        id: toastId,
      });
      console.error("Error creating review:", error);
    }
  };

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
        total={userOrders?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <Modal
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        footer={null}
        centered
      >
        <CustomForm onSubmit={handleReview}>
          <CustomInput
            type={"textarea"}
            name={"comment"}
            label={"Review"}
            required
          />
          <Form.Item name={"rating"} label={"Rating"} required>
            <Rate />
          </Form.Item>
          <SubmitButton
            fullWidth
            text={"Add Review"}
            loading={isReviewLoading}
          />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default UserOrders;
