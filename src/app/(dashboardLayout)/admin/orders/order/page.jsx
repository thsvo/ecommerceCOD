"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} from "@/redux/services/order/orderApi";
import { generateInvoice } from "@/utilities/lib/generateInvoice";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { toast } from "sonner";
import { IoIosRefresh } from "react-icons/io";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { FaSearch } from "react-icons/fa";

const Orders = () => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [trackingCode, setTrackingCode] = useState(null);
  const [search, setSearch] = useState("");
  const [orderStatusModal, setOrderStatusModal] = useState("");

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const apiKey = globalData?.results?.deliveryApiKey;
  const secretKey = globalData?.results?.deliverySecretKey;

  const { data: userOrders, isFetching } = useGetOrdersQuery({
    page: currentPage,
    limit: pageSize,
  });

  const { data: userOrder } = useGetSingleOrderQuery(itemId, {
    skip: !itemId,
  });

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleStatusCheck = async () => {
    const api = `https://portal.packzy.com/api/v1/status_by_trackingcode/${trackingCode}`;
    const response = await fetch(api, {
      method: "GET",
      headers: {
        "api-key": apiKey,
        "secret-key": secretKey,
      },
    });
    const result = await response.json();

    if (response.ok) {
      await updateOrder({
        id: itemId,
        data: {
          deliveryStatus: result?.delivery_status,
        },
      });
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleAutoDelivery = async (item) => {
    const api = "https://portal.packzy.com/api/v1/create_order";

    const toastId = toast.loading("Creating Order Consignment...");

    const submittedData = {
      invoice: generateInvoice(),
      recipient_name: item?.name,
      recipient_phone: item?.number,
      recipient_address: item?.address,
      cod_amount: item?.paymentType === "cod" ? 0 : Number(item?.grandTotal),
    };

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          "secret-key": secretKey,
        },
        body: JSON.stringify(submittedData),
      });

      const result = await response.json();

      if (response.ok) {
        await updateOrder({
          id: itemId,
          data: {
            invoice: submittedData?.invoice,
            trackingCode: result?.consignment?.tracking_code,
          },
        });
        toast.success(result?.message, { id: toastId });
      } else {
        console.error("Failed to create order:", result);
        toast.error("Failed to create Consignment.", { id: toastId });
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred while creating the Consignment.", {
        id: toastId,
      });
    }
  };

  const [deleteOrder] = useDeleteOrderMutation();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (item) => <div className="w-[80px]">{item}</div>,
    },
    {
      title: "Transaction ID",
      dataIndex: "tranId",
      key: "tranId",
      align: "center",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      align: "center",
    },
    {
      title: "Tracking Code",
      dataIndex: "trackingCode",
      key: "trackingCode",
      render: (item) => (
        <Tag
          color={"blue"}
          className="capitalize font-semibold cursor-pointer"
          onClick={() => setTrackingCode(item)}
        >
          {item}
        </Tag>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      align: "center",
      render: (item) => <div className="w-[300px]">{item}</div>,
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
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (item, record) => {
        let color;
        let text;

        switch (item) {
          case "pending":
            color = "orange";
            text = "Pending";
            break;
          case "delivered":
            color = "green";
            text = "delivered";
            break;
          case "returned":
            color = "red";
            text = "Returned";
            break;
          case "processing":
            color = "blue";
            text = "Processing";
            break;
          case "cancelled":
            color = "red";
            text = "Cancelled";
            break;
          case "received":
            color = "blue";
            text = "Received";
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
            onClick={() => {
              setItemId(record.key);
              setOrderStatusModal(true);
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (item, record) => {
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
          <Tag
            color={color}
            className="capitalize font-semibold cursor-pointer"
            onClick={() => {
              setItemId(record.key);
              setPaymentModalOpen(true);
            }}
          >
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
      render: (item, record) => {
        let color;

        switch (item) {
          case "delivered":
            color = "green";
            break;
          case "pending":
            color = "blue";
            break;
          case "shipped":
            color = "orange";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "gray";
            break;
        }

        return (
          <div className="flex items-center">
            <Tag color={color}>{item}</Tag>
            {record?.trackingCode && (
              <IoIosRefresh
                className="capitalize font-semibold cursor-pointer"
                onClick={() => {
                  setItemId(record.key);
                  setTrackingCode(record.trackingCode);
                  handleStatusCheck();
                }}
              />
            )}
          </div>
        );
      },
    },
    // {
    //   title: "Fraud Detection",
    //   dataIndex: "fraudDetection",
    //   key: "fraudDetection",
    //   align: "center",
    //   render: () => (
    //     <div
    //       onClick={() => {
    //         toast.info("Fraud Detection is not available in demo version.");
    //       }}
    //     >
    //       <Progress type="circle" percent={0} size={40} />
    //     </div>
    //   ),
    // },
    {
      title: "Auto Delivery",
      dataIndex: "autoDelivery",
      key: "autoDelivery",
      align: "center",
      render: (_, record) => (
        <Button
          className="capitalize font-semibold cursor-pointer"
          type="primary"
          onClick={() => handleAutoDelivery(record)}
          disabled={record.trackingCode}
        >
          Auto Delivery
        </Button>
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

  const tableData = userOrders?.results?.map((item) => ({
    key: item._id,
    orderId: item.orderId,
    tranId: item.tranId ?? "N/A",
    invoice: item.invoice ?? "N/A",
    trackingCode: item.trackingCode,
    name: item?.name,
    email: item?.email,
    number: item?.number,
    address: item?.address,
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
    orderStatus: item?.orderStatus,
  }));

  const filteredTableData = tableData?.filter((item) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();

    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const handleOrderStatus = async (values) => {
    const toastId = toast.loading("Updating Order Status...");
    try {
      const updatedData = {
        id: itemId,
        data: values,
      };

      const res = await updateOrder(updatedData);

      if (res.data.success) {
        toast.success("Order Status Updated", { id: toastId });
        setPaymentModalOpen(false);
        setOrderStatusModal(false);
      } else {
        toast.error("An error occurred while updating the Order Status.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("An error occurred while updating the Order Status.", {
        id: toastId,
      });
    }
  };

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

      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Order"}
        details={userOrder}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"order"}
        func={deleteOrder}
      />
      <Modal
        open={orderStatusModal}
        onCancel={() => setOrderStatusModal(false)}
        footer={null}
        centered
      >
        <CustomForm onSubmit={handleOrderStatus}>
          <CustomSelect
            name={"orderStatus"}
            label={"Order Status"}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Received", value: "received" },
              { label: "Delivered", value: "delivered" },
              { label: "Returned", value: "returned" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Processing", value: "processing" },
            ]}
          />
          <SubmitButton fullWidth text={"Update"} loading={isLoading} />
        </CustomForm>
      </Modal>
      <Modal
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        centered
      >
        <CustomForm onSubmit={handleOrderStatus}>
          <CustomSelect
            name={"paymentStatus"}
            label={"Payment Status"}
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Success", value: "SUCCESS" },
              { label: "Failed", value: "FAILED" },
            ]}
          />
          <SubmitButton fullWidth text={"Update"} loading={isLoading} />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default Orders;
