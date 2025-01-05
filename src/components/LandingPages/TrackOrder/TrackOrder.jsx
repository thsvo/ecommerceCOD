"use client";

import { Button, Form, Input } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "sonner";

const TrackOrder = () => {
  const onSubmit = () => {
    toast.info("Order tracking is available right now!");
  };

  return (
    <section className="my-container flex justify-center items-center h-[50vh]">
      <div>
        <Form
          onFinish={onSubmit}
          className="flex flex-col items-center lg:w-[500px] relative"
        >
          <Input
            placeholder="Enter your tracking code"
            type="text"
            size="large"
            className="rounded"
            required
            prefix={<FaLocationDot />}
          />
          <Button
            htmlType="submit"
            type="primary"
            className="rounded font-bold lg:px-10 mt-2"
          >
            Track Order
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default TrackOrder;
