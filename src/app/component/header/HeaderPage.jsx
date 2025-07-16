import React from 'react'

const HeaderPage = () => {
  return (
    <header className="bg-[#8b1414] py-2.5">
    <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-center flex-wrap">
      <img
        src="https://chuabaidinhninhbinh.com/upload/news/icon//30.2023/130x60px.png"
        alt="Logo Chùa Bái Đính"
        className="w-[130px] h-[60px] border-2 border-[#8b1414] rounded-[10px] p-[5px] mr-[30px] object-contain object-center bg-[#8b1414] max-md:mr-0 max-md:mb-[10px]"
      />
      <nav className="flex gap-[25px] flex-wrap justify-center max-md:gap-[15px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-[10px]">
        {[
          "Đăng ký khóa trải nhiệm 2025- chùa Bái Đính",
         
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className="text-white font-bold relative px-0 py-[5px] transition-all duration-300 hover:text-orange-400 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-400 hover:after:w-full after:transition-all after:duration-300"
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  </header>
  )
}

export default HeaderPage