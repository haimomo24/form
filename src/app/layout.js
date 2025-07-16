import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderPage from "./component/header/HeaderPage";
import FooterPage from "./component/footer/FooterPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Đăng kí khóa sinh",
  description: "Đăng kí khóa sinh",
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStBTkvGG1_accmUjeNgyfuZWikuAnyLCSa-w&s', 
    sizes: '130x60', 
    type: 'image/png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderPage/>
        {children}
        <FooterPage/>
      </body>
    </html>
  );
}
