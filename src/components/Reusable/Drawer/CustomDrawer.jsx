import { Drawer } from "antd";
import { GiCancel } from "react-icons/gi";

const CustomDrawer = ({ setOpen, open, children, title, placement }) => {
  return (
    <Drawer
      placement={placement}
      width={1000}
      onClose={() => setOpen(false)}
      open={open}
      keyboard={true}
      destroyOnClose
    >
      <div className="mb-10 flex items-center gap-4">
        <button
          className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
          onClick={() => setOpen(false)}
        >
          <GiCancel className="text-xl text-gray-700" />
        </button>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      {children}
    </Drawer>
  );
};

export default CustomDrawer;
