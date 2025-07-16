import { NextResponse } from 'next/server';
import { connectDB, sql } from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate dữ liệu
    const requiredFields = [
      'student_name', 'gender', 'birthday', 'phone', 'email', 'cccd', 
      'parent_name', 'parent_phone', 'city', 'ward', 'course'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Trường ${field} là bắt buộc` },
          { status: 400 }
        );
      }
    }

    // Kết nối database
    const pool = await connectDB();
    
    // Tạo thời gian hiện tại theo múi giờ Việt Nam
    const vietnamTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
    const currentTime = new Date(vietnamTime);
    
    // Tạo query với created_at được set thủ công
    const query = `
      INSERT INTO register (
        student_name, gender, birthday, phone, email, cccd, 
        parent_name, parent_phone, city, ward, course, created_at
      ) 
      VALUES (
        @student_name, @gender, @birthday, @phone, @email, @cccd,
        @parent_name, @parent_phone, @city, @ward, @course, @created_at
      )
    `;
    
    const sqlRequest = pool.request();
    
    // Thêm parameters
    sqlRequest.input('student_name', sql.NVarChar(100), data.student_name);
    sqlRequest.input('gender', sql.NVarChar(10), data.gender);
    sqlRequest.input('birthday', sql.Date, new Date(data.birthday));
    sqlRequest.input('phone', sql.NVarChar(20), data.phone);
    sqlRequest.input('email', sql.NVarChar(100), data.email);
    sqlRequest.input('cccd', sql.NVarChar(50), data.cccd);
    sqlRequest.input('parent_name', sql.NVarChar(100), data.parent_name);
    sqlRequest.input('parent_phone', sql.NVarChar(20), data.parent_phone);
    sqlRequest.input('city', sql.NVarChar(100), data.city);
    sqlRequest.input('ward', sql.NVarChar(100), data.ward);
    sqlRequest.input('course', sql.NVarChar(100), data.course);
    sqlRequest.input('created_at', sql.DateTime, currentTime);
    
    // Thực thi query
    const result = await sqlRequest.query(query);
    
    return NextResponse.json(
      { 
        message: 'Đăng ký thành công!',
        success: true
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Database error:', error);
    
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại sau!', details: error.message },
      { status: 500 }
    );
  }
}

// API để test connection
export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'Database connected successfully!' });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
