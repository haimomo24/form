'use client'

import React, { useState } from 'react'

const HomePage = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    gender: '',
    birthday: '',
    phone: '',
    email: '',
    cccd: '',
    parent_name: '',
    parent_phone: '',
    city: '',
    ward: '',
    course: 'Tuổi trẻ tri ân - Trở về nguồn sáng'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // State cho dropdown tỉnh thành
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Danh sách tỉnh thành
  const provinces = [
    " Hà Nội",
    " Cao Bằng",
    " Tuyên Quang",
    " Điện Biên",
    " Lai Châu",
    " Sơn La",
    " Lào Cai",
    " Thái Nguyên",
    " Lạng Sơn",
    " Quảng Ninh",
    " Bắc Ninh",
    " Phú Thọ",
    " Hải Phòng",
    " Hưng Yên",
    " Ninh Bình",
    " Thanh Hóa",
    " Nghệ An",
    " Hà Tĩnh",
    " Quảng Trị",
    " phố Huế",
    " phố Đà Nẵng",
    " Quảng Ngãi",
    " Gia Lai",
    " Khánh Hòa",
    " Đắk Lắk",
    " Lâm Đồng",
    " Đồng Nai",
    "Thành phố Hồ Chí Minh",
    " Tây Ninh",
    " Đồng Tháp",
    " Vĩnh Long",
    " An Giang",
    "Thành phố Cần Thơ",
    " Cà Mau"
  ];

  // Lọc tỉnh theo từ khóa tìm kiếm
  const filteredProvinces = provinces.filter(province =>
    province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateBirthday = (birthday) => {
    if (!birthday) return 'Ngày sinh là bắt buộc';
    
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (birthYear < 2001) {
      return 'Quá tuổi đăng ký. Chỉ nhận học viên sinh từ năm 2001 trở lên';
    }
    
    if (birthYear > 2009) {
      return 'Chưa đủ tuổi đăng ký. Chỉ nhận học viên sinh đến năm 2009';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'birthday') {
      const birthdayError = validateBirthday(value);
      setErrors(prev => ({
        ...prev,
        birthday: birthdayError
      }));
    } else if (name === 'gender') {
      // Clear gender error khi đã chọn
      if (value !== '') {
        setErrors(prev => ({
          ...prev,
          gender: ''
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Xử lý chọn tỉnh
  const handleProvinceSelect = (province) => {
    setFormData(prev => ({
      ...prev,
      city: province
    }));
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Xử lý tìm kiếm tỉnh
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setErrors({});

    // Validate giới tính
    if (!formData.gender || formData.gender === '') {
      setErrors({ gender: 'Vui lòng chọn giới tính' });
      setMessage('Vui lòng chọn giới tính');
      setIsSubmitting(false);
      return;
    }

    const birthdayError = validateBirthday(formData.birthday);
    if (birthdayError) {
      setErrors({ birthday: birthdayError });
      setMessage('Vui lòng kiểm tra lại thông tin ngày sinh');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Đăng ký thành công!');
        setFormData({
          student_name: '',
          gender: '',
          birthday: '',
          phone: '',
          email: '',
          cccd: '',
          parent_name: '',
          parent_phone: '',
          city: '',
          ward: '',
          course: 'Tuổi trẻ tri ân - Trở về nguồn sáng'
        });
        setErrors({});
      } else {
        if (result.duplicateFields) {
          const newErrors = {};
          if (result.duplicateFields.phone) {
            newErrors.phone = 'Số điện thoại đã được đăng ký';
          }
          if (result.duplicateFields.cccd) {
            newErrors.cccd = 'Số căn cước đã được đăng ký';
          }
          setErrors(newErrors);
        }
        
        setMessage(result.message || result.error || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      setMessage('Lỗi kết nối. Vui lòng thử lại!');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-600 max-w-[600px] mx-auto mt-[30px] p-[30px] md:p-[40px] mt-[-10px] rounded-[5px] text-white">
      <h2 className="text-center mb-[25px] text-xl font-semibold">ĐĂNG KÝ KHÓA TRẢI NHIỆM</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-center ${
          message.includes('thành công') ? 'bg-blue-600' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-[15px]">
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Họ và tên khóa sinh (*)</label>
            <input 
              type="text" 
              name="student_name"
              value={formData.student_name}
              onChange={handleInputChange}
              placeholder="Nguyễn Văn Nam" 
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Giới tính (*)</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`p-2 rounded text-black text-sm bg-[#FFFFFF] ${
                errors.gender ? 'border-2 border-red-500' : ''
              }`}
              required
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            {errors.gender && (
              <span className="text-red-300 text-xs mt-1">{errors.gender}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Ngày sinh (*)</label>
            <input 
              type="date" 
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              min="2001-01-01"
              max="2009-12-31"
              className={`p-2 rounded text-black text-sm bg-[#FFFFFF] ${
                errors.birthday ? 'border-2 border-red-500' : ''
              }`}
              required
            />
            {errors.birthday && (
              <span className="text-red-300 text-xs mt-1">{errors.birthday}</span>
            )}
            <span className="text-yellow-200 text-xs mt-1">
              Chỉ nhận học viên sinh từ năm 2001 đến 2009
            </span>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Số điện thoại (*)</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`p-2 rounded text-black text-sm bg-[#FFFFFF] ${
                errors.phone ? 'border-2 border-red-500' : ''
              }`}
              required
            />
            {errors.phone && (
              <span className="text-red-300 text-xs mt-1">{errors.phone}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">E-mail (*)</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm">Số CCCD / Mã số định danh (*)</label>
            <input 
              type="text" 
              name="cccd"
              value={formData.cccd}
              onChange={handleInputChange}
              className={`p-2 rounded text-black text-sm bg-[#FFFFFF] ${
                errors.cccd ? 'border-2 border-red-500' : ''
              }`}
              required
            />
            {errors.cccd && (
              <span className="text-red-300 text-xs mt-1">{errors.cccd}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Họ và tên phụ huynh (*)</label>
            <input 
              type="text" 
              name="parent_name"
              value={formData.parent_name}
              onChange={handleInputChange}
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Số điện thoại phụ huynh (*)</label>
            <input 
              type="tel" 
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleInputChange}
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
          </div>

          {/* Custom dropdown cho tỉnh thành */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-sm">Địa chỉ liên hệ (*)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.city || searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Tìm kiếm tỉnh/thành phố..."
                className="p-2 rounded text-black text-sm bg-[#FFFFFF] w-full"
                required
              />
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto z-10">
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province, index) => (
                      <div
                        key={index}
                        onClick={() => handleProvinceSelect(province)}
                        className="p-2 text-black text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {province}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-black text-sm text-gray-500">
                      Không tìm thấy tỉnh/thành phố
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Click outside để đóng dropdown */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-5"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm">Xã, Phường (*)</label>
            <input 
                           type="text" 
                           name="ward"
                           value={formData.ward}
                           onChange={handleInputChange}
                           placeholder="Nhập tên xã, phường" 
                           className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
                           required
                         />
                       </div>
             
                       <div className="flex flex-col md:col-span-2">
                         <label className="mb-1 text-sm">Đăng ký khóa trải nghiệm (*)</label>
                         <select 
                           name="course"
                           value={formData.course}
                           onChange={handleInputChange}
                           className="p-2 rounded text-black text-sm bg-[#FFFFFF]"
                           required
                         >
                           <option value="Tuổi trẻ tri ân - Trở về nguồn sáng">Tuổi trẻ tri ân - Trở về nguồn sáng</option>
                         </select>
                       </div>
             
                       <div className="md:col-span-2 text-right">
                         <button
                           type="submit"
                           disabled={isSubmitting || errors.birthday}
                           className={`font-bold px-5 py-2 rounded ${
                             isSubmitting || errors.birthday
                               ? 'bg-gray-500 cursor-not-allowed' 
                               : 'bg-[#b32626] hover:bg-[#931d1d]'
                           } text-white`}
                           >
                             {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                           </button>
                         </div>
                       </div>
                     </form>
                   </div>
                 )
               }
               
               export default HomePage
             