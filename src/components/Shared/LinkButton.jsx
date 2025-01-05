"use client";

import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";

const LinkButton = ({ href, children }) => {
  return (
    <Link href={href}>
      <button
        className="w-full"
        onClick={() => sendGTMEvent("item_click", "itemClick", { value: href })}
      >
        {children}
      </button>
    </Link>
  );
};

export default LinkButton;
