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

    // Validate ngày sinh khi người dùng thay đổi
    if (name === 'birthday') {
      const birthdayError = validateBirthday(value);
      setErrors(prev => ({
        ...prev,
        birthday: birthdayError
      }));
    } else {
      // Xóa error của field khác khi người dùng nhập
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setErrors({});

    // Validate ngày sinh trước khi submit
    const birthdayError = validateBirthday(formData.birthday);
    if (birthdayError) {
      setErrors({ birthday: birthdayError });
      setMessage('Vui lòng kiểm tra lại thông tin ngày sinh');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Đăng ký thành công!');
        // Reset form
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
        setMessage(result.error || 'Có lỗi xảy ra khi đăng ký');
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
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]"
              required
            >
              <option value="">Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
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
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
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
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]" 
              required
            />
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

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Địa chỉ liên hệ (*)</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="p-2 rounded text-black text-sm bg-[#FFFFFF]"
              required
            >
              <option value="">Chọn Tỉnh/Thành Phố</option>
              <option value="Thành phố Hà Nội">Thành phố Hà Nội</option>
              <option value="Tỉnh Cao Bằng">Tỉnh Cao Bằng</option>
              <option value="Tỉnh Tuyên Quang">Tỉnh Tuyên Quang</option>
              <option value="Tỉnh Điện Biên">Tỉnh Điện Biên</option>
              <option value="Tỉnh Lai Châu">Tỉnh Lai Châu</option>
              <option value="Tỉnh Sơn La">Tỉnh Sơn La</option>
              <option value="Tỉnh Lào Cai">Tỉnh Lào Cai</option>
              <option value="Tỉnh Thái Nguyên">Tỉnh Thái Nguyên</option>
              <option value="Tỉnh Lạng Sơn">Tỉnh Lạng Sơn</option>
              <option value="Tỉnh Quảng Ninh">Tỉnh Quảng Ninh</option>
              <option value="Tỉnh Bắc Ninh">Tỉnh Bắc Ninh</option>
              <option value="Tỉnh Phú Thọ">Tỉnh Phú Thọ</option>
              <option value="Thành phố Hải Phòng">Thành phố Hải Phòng</option>
              <option value="Tỉnh Hưng Yên">Tỉnh Hưng Yên</option>
              <option value="Tỉnh Ninh Bình">Tỉnh Ninh Bình</option>
              <option value="Tỉnh Thanh Hóa">Tỉnh Thanh Hóa</option>
              <option value="Tỉnh Nghệ An">Tỉnh Nghệ An</option>
              <option value="Tỉnh Hà Tĩnh">Tỉnh Hà Tĩnh</option>
              <option value="Tỉnh Quảng Trị">Tỉnh Quảng Trị</option>
              <option value="Thành phố Huế">Thành phố Huế</option>
              <option value="Thành phố Đà Nẵng">Thành phố Đà Nẵng</option>
              <option value="Tỉnh Quảng Ngãi">Tỉnh Quảng Ngãi</option>
              <option value="Tỉnh Gia Lai">Tỉnh Gia Lai</option>
              <option value="Tỉnh Khánh Hòa">Tỉnh Khánh Hòa</option>
              <option value="Tỉnh Đắk Lắk">Tỉnh Đắk Lắk</option>
              <option value="Tỉnh Lâm Đồng">Tỉnh Lâm Đồng</option>
              <option value="Tỉnh Đồng Nai">Tỉnh Đồng Nai</option>
              <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
              <option value="Tỉnh Tây Ninh">Tỉnh Tây Ninh</option>
              <option value="Tỉnh Đồng Tháp">Tỉnh Đồng Tháp</option>
              <option value="Tỉnh Vĩnh Long">Tỉnh Vĩnh Long</option>
              <option value="Tỉnh An Giang">Tỉnh An Giang</option>
              <option value="Thành phố Cần Thơ">Thành phố Cần Thơ</option>
              <option value="Tỉnh Cà Mau">Tỉnh Cà Mau</option>
            </select>
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
  
