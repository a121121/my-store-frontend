import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import { RegionProvider } from "@/providers/region";
import { SecondCol } from "@/components/SecondCol";
import { CartProvider } from "@/providers/cart";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

export const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-quicksand",
});

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-nunito",
});



export const metadata: Metadata = {
  title: "Snuglee Baby",
  description: "Crafted with love and care for your baby. Coz your baby deserves the best.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn(nunito.variable, quicksand.variable)}
      suppressHydrationWarning>
      <body className="bg-ui-bg-subtle w-full h-full"
        suppressHydrationWarning>
        <div className={cn(
          " min-h-screen w-full"
        )}>


          <RegionProvider>
            <CartProvider>
              <Navbar />
              <div >
                {/* <div className={cn(
                "flex gap-2 lg:my-16 my-4",
                "lg:w-[758px] lg:mx-auto w-full mx-4"
              )}> */}
                {/* <div className="flex flex-col gap-2 lg:w-1/2 w-full"> */}
                {/* <div className=""> */}
                {children}
                {/* </div> */}
                {/* <SecondCol /> */}
              </div>
            </CartProvider>
          </RegionProvider>

        </div>
      </body>
    </html>

  );
}
