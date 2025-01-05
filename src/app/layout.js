import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import "./globals.css";
import AntDProvider from "@/components/Shared/AntDProvider";
import { GoogleTagManager } from "@next/third-parties/google";

const interFont = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Viscart",
  description: "Complete E-Commerce Site",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KWXB5SSR" />
      <body className={interFont.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWXB5SSR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <AntDProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AntDProvider>
      </body>
    </html>
  );
};

export default RootLayout;
