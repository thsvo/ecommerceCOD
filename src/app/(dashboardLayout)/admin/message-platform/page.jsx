"use client";

import { Tabs } from "antd";
import Link from "next/link";

const MessagePlatform = () => {
  return (
    <section>
      <div className="text-center text-2xl font-bold mb-10">
        Alternative Downloads For Different OS
      </div>
      <Tabs
        defaultActiveKey="1"
        size="large"
        centered
        items={[
          {
            label: <div className="font-semibold text-xl">Linux</div>,
            key: "1",
            children: (
              <Link
                href="https://github.com/ferdium/ferdium-app/releases/download/v7.0.0/Ferdium-linux-7.0.0-amd64.deb"
                target="_blank"
                className="flex justify-center items-center"
              >
                <button className="bg-primary text-white font-bold px-10 py-5 text-center !mt-10 rounded-xl text-lg">
                  amd64 deb
                </button>
              </Link>
            ),
          },
          {
            label: <div className="font-semibold text-xl">Windows</div>,
            key: "2",
            children: (
              <Link
                href="https://github.com/ferdium/ferdium-app/releases/download/v7.0.0/Ferdium-linux-7.0.0-amd64.deb"
                target="_blank"
                className="flex justify-center items-center"
              >
                <button className="bg-primary text-white font-bold px-10 py-5 text-center !mt-10 rounded-xl text-lg">
                  AutoSetup exe
                </button>
              </Link>
            ),
          },
          {
            label: <div className="font-semibold text-xl">Mac</div>,
            key: "3",
            children: (
              <Link
                href="https://github.com/ferdium/ferdium-app/releases/download/v7.0.0/Ferdium-linux-7.0.0-amd64.deb"
                target="_blank"
                className="flex justify-center items-center"
              >
                <button className="bg-primary text-white font-bold px-10 py-5 text-center !mt-10 rounded-xl text-lg">
                  arm64 dmg
                </button>
              </Link>
            ),
          },
        ]}
      />
    </section>
  );
};

export default MessagePlatform;
