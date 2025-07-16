'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

const DashBoard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data từ API
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/registrations');
      const data = await response.json();
      
      if (response.ok) {
        setRegistrations(data.registrations || []);
      } else {
        setError(data.error || 'Không thể tải dữ liệu');
      }
    } catch (error) {
      setError('Lỗi kết nối server');
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data theo search term
  const filteredRegistrations = registrations.filter(reg =>
    reg.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.cccd.includes(searchTerm)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    // Trừ đi 5 giờ để điều chỉnh (vì hiện tại nhanh hơn 2 tiếng so với thực tế)
    const vietnamTime = new Date(date.getTime() + (5 * 60 * 60 * 1000));
    
    return vietnamTime.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Thêm function để format giới tính
  const formatGender = (gender) => {
    if (!gender) return 'N/A';
    
    const genderStr = gender.toString().toLowerCase().trim();
    
    if (genderStr === 'n?' || genderStr === 'nữ' || genderStr === 'nu' || genderStr === 'female' || genderStr === 'f') {
      return 'Nữ';
    } else if (genderStr === 'nam' || genderStr === 'male' || genderStr === 'm') {
      return 'Nam';
    }
    
    return gender; // Trả về giá trị gốc nếu không match
  };

  // Xuất Excel
  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      // Chuẩn bị dữ liệu cho Excel
      const excelData = filteredRegistrations.map((reg, index) => ({
        'STT': index + 1,
        'Họ và tên': reg.student_name,
        'Giới tính': formatGender(reg.gender),
        'Ngày sinh': formatDate(reg.birthday),
        'Số điện thoại': reg.phone,
        'Email': reg.email,
        'CCCD': reg.cccd,
        'Tên phụ huynh': reg.parent_name,
        'SĐT phụ huynh': reg.parent_phone,
        'Địa chỉ': `${reg.ward}, ${reg.city}`,
        'Khóa tu': reg.course,
        'Ngày đăng ký': formatDateTime(reg.created_at)
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thiết lập độ rộng cột
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 25 },  // Họ và tên
        { wch: 10 },  // Giới tính
        { wch: 12 },  // Ngày sinh
        { wch: 15 },  // SĐT
        { wch: 25 },  // Email
        { wch: 15 },  // CCCD
        { wch: 25 },  // Tên phụ huynh
        { wch: 15 },  // SĐT phụ huynh
        { wch: 30 },  // Địa chỉ
        { wch: 30 },  // Khóa tu
        { wch: 18 }   // Ngày đăng ký
      ];
      ws['!cols'] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đăng ký');

      // Tạo tên file với ngày hiện tại
      const currentDate = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      const fileName = `Danh_sach_dang_ky_khoa_tu_${currentDate}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);

      alert(`Xuất file Excel thành công! Tổng ${filteredRegistrations.length} bản ghi.`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Có lỗi khi xuất file Excel!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đăng ký này?')) {
      try {
        const response = await fetch(`/api/registrations/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setRegistrations(registrations.filter(reg => reg.id !== id));
          alert('Xóa thành công!');
        } else {
          alert('Có lỗi khi xóa!');
        }
      } catch (error) {
        alert('Lỗi kết nối!');
        console.error('Error deleting:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Lỗi:</strong> {error}
        <button 
          onClick={fetchRegistrations}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-[#d4a017] text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">DANH SÁCH ĐĂNG KÝ KHÓA TU</h1>
        </div>

        {/* Search và Stats */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Tổng số đăng ký: <strong>{registrations.length}</strong>
              </span>
              <span className="text-sm text-gray-600">
                Hiển thị: <strong>{filteredRegistrations.length}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, SĐT, email, CCCD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a017] w-80"
              />
              <button
                onClick={fetchRegistrations}
                className="bg-[#d4a017] text-white px-4 py-2 rounded-lg hover:bg-[#b8941a]"
              >
                Làm mới
              </button>
              <button
                onClick={exportToExcel}
                disabled={isExporting || filteredRegistrations.length === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isExporting || filteredRegistrations.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white flex items-center gap-2`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ huynh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT PH</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ĐK</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có đăng ký nào'}
                  </td>
                </tr>
              ) : (
                currentItems.map((registration, index) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {registration.student_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatGender(registration.gender)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(registration.birthday)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.cccd}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.parent_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.parent_phone}
                      </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.ward}, {registration.city}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registration.created_at ? formatDateTime(registration.created_at) : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(registration.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredRegistrations.length)}</span> trong{' '}
                  <span className="font-medium">{filteredRegistrations.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-[#d4a017] border-[#d4a017] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashBoard

