"use client";

import { Input } from "antd";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const TableHeader = ({
  setOpen,
  title,
  setSearch,
  selectedRowKeys,
  deleteBulk,
  setSelectedRowKeys,
}) => {
  const handleBulkDelete = async () => {
    const toastId = toast.loading(`Deleting ${title}...`);
    try {
      const res = await deleteBulk(selectedRowKeys);
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId, duration: 2000 });
        setSelectedRowKeys(null);
      } else {
        toast.error(res.data.message, { id: toastId, duration: 2000 });
      }
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      toast.error(`An error occurred while creating the ${title}.`, {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-6">
          <div
            className="flex gap-3 items-center mt-6 lg:mt-0 justify-center"
            onClick={() => setOpen(true)}
          >
            <button className="bg-primary rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300">
              <FaPlus className="text-2xl" />
              Create {title}
            </button>
          </div>

          <div>
            {selectedRowKeys?.length > 0 && (
              <div className="flex w-full gap-6">
                <button
                  className="bg-[#d11b1bf1] rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300"
                  onClick={handleBulkDelete}
                >
                  <FaTrash className="mr-2 inline-block" />
                  Bulk Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative lg:w-1/4 mt-5 lg:mt-0">
          <div className="flex">
            <Input
              suffix={<FaSearch />}
              placeholder="Search..."
              className="py-1.5"
              size="large"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TableHeader;
