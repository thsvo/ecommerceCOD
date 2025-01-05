"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import RoleModal from "@/components/Reusable/Modal/RoleModal";
import StatusModal from "@/components/Reusable/Modal/StatusModal";
import {
  useGetSingleUserQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "@/redux/services/auth/authApi";
import { Input, Pagination, Space, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { toast } from "sonner";

const AdminDonation = () => {
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentUserStatus, setCurrentUserStatus] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const { data: users, isFetching } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: userData } = useGetSingleUserQuery(itemId, {
    skip: !itemId,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleStatusUpdate = async () => {
    let updatedData;
    if (currentUserStatus === "active") {
      updatedData = {
        id: itemId,
        data: {
          status: "inactive",
        },
      };
    } else if (currentUserStatus === "inactive") {
      updatedData = {
        id: itemId,
        data: {
          status: "active",
        },
      };
    }
    try {
      const res = await updateUserStatus(updatedData);
      if (res.data.success) {
        setOpenStatusModal(false);
        toast.success(res.data.message);
      } else {
        setOpenStatusModal(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setOpenStatusModal(false);
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status.");
    }
  };

  const handleRoleUpdate = async () => {
    let updatedData;
    if (currentUserRole === "admin") {
      updatedData = {
        id: itemId,
        data: {
          role: "user",
        },
      };
    } else if (currentUserRole === "user") {
      updatedData = {
        id: itemId,
        data: {
          role: "admin",
        },
      };
    }
    try {
      const res = await updateUserRole(updatedData);
      if (res.data.success) {
        setOpenRoleModal(false);
        toast.success(res.data.message);
      } else {
        setOpenRoleModal(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setOpenRoleModal(false);
      console.error("Error updating role:", error);
      toast.error("An error occurred while updating role.");
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role, record) => (
        <Tag
          color={role === "admin" ? "green" : "blue"}
          className="capitalize font-semibold cursor-pointer"
          onClick={() => {
            setItemId(record.key);
            setCurrentUserRole(record.role);
            setOpenRoleModal(true);
          }}
        >
          {role === "admin" ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (item, record) => {
        let color;
        let text;

        switch (item) {
          case "Active":
            color = "green";
            text = "Active";
            break;
          case "Inactive":
            color = "red";
            text = "Inactive";
            break;
        }

        return (
          <Tag
            color={color}
            className="capitalize font-semibold cursor-pointer"
            onClick={() => {
              setItemId(record.key);
              setCurrentUserStatus(record.status);
              setOpenStatusModal(true);
            }}
          >
            {text}
          </Tag>
        );
      },
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
                  setDetailsModalOpen(true);
                }}
                className="bg-blue-600 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <TbListDetails />
              </button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const tableData = users?.results?.map((item) => ({
    key: item._id,
    name: item.name ?? "N/A",
    email: item?.email ?? "N/A",
    role: item?.role,
    createdAt: moment(item.createdAt).format("Do MMM, YYYY"),
    status: item?.status,
  }));

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
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
        scroll={{ x: 500 }}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={users?.meta?.totalCount}
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
        title={"User"}
        details={userData}
      />
      <StatusModal
        modalOpen={openStatusModal}
        setModalOpen={setOpenStatusModal}
        handleStatus={handleStatusUpdate}
        text={"Are you sure you want to change the user status?"}
      />
      <RoleModal
        modalOpen={openRoleModal}
        setModalOpen={setOpenRoleModal}
        handleStatus={handleRoleUpdate}
        text={"Are you sure you want to change the user role?"}
      />
    </div>
  );
};

export default AdminDonation;
