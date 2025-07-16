import Link from 'next/link'
import React from 'react'

const FooterPage = () => {
  return (
   <>
    <footer className="bg-[#8b1414] text-white py-5 mt-[50px]">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between flex-wrap relative">
        {/* Logo bên trái */}
        <div className="mb-3 md:mb-0">
        <Link href="/login" className="inline-block">
  <img
    src="https://chuabaidinhninhbinh.com/upload/news/icon//30.2023/130x60px.png"
    alt="Logo Chùa Bái Đính"
    className="w-[130px] h-[60px] border-2 border-[#8b1414] rounded-[10px] p-[5px] mr-[30px] object-contain object-center bg-[#8b1414] max-md:mr-0 max-md:mb-[10px] cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
  />
</Link>
        </div>

        {/* Nội dung ở giữa */}
        <div className="flex-1 px-5 text-sm text-center md:text-left mb-3 md:mb-0">
          <p>Địa chỉ: Xóm 6, phường Tây Hoa Lư, tỉnh Ninh Bình</p>
          <p>
            Điện thoại: 0913899135 &nbsp; E-mail:
            baidinh@chuabaidinh.com.vn
          </p>
        </div>

        {/* Biểu tượng mạng xã hội */}
        <div className="flex gap-2">
          <a href="#">
            <div className="w-[40px] h-[40px] rounded-full bg-[#1877f2] flex justify-center items-center font-bold text-white">
              f
            </div>
          </a>
          <a href="#">
            <div className="w-[40px] h-[40px] rounded-full bg-[#ff0000] flex justify-center items-center font-bold text-white">
              ▶
            </div>
          </a>
          <a href="#">
            <div className="w-[40px] h-[40px] rounded-full bg-[#00c4ff] flex justify-center items-center font-bold text-white">
              Z
            </div>
          </a>
          <a href="#">
            <div className="w-[40px] h-[40px] rounded-full bg-[#833ab4] flex justify-center items-center font-bold text-white text-xl">
              📷
            </div>
          </a>
        </div>
      </div>
    </footer>
   </>
  )
}

export default FooterPage