import { NextResponse } from 'next/server';
import { connectDB, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await connectDB();
    
    const query = `
      SELECT 
        id, student_name, gender, birthday, phone, email, cccd,
        parent_name, parent_phone, city, ward, course, created_at
      FROM register 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.request().query(query);
    
    return NextResponse.json(
      { 
        registrations: result.recordset,
        total: result.recordset.length
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Database error:', error);
    
    return NextResponse.json(
      { error: 'Lỗi server. Không thể tải dữ liệu!' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const pool = await connectDB();
    const data = await request.json();
    
    const { 
      student_name, gender, birthday, phone, email, cccd,
      parent_name, parent_phone, city, ward, course 
    } = data;

    // Kiểm tra trùng lặp một lần duy nhất
    const duplicateCheckQuery = `
      SELECT 
        phone,
        cccd
      FROM register 
      WHERE phone = @phone OR cccd = @cccd
    `;
    
    const duplicateResult = await pool.request()
      .input('phone', sql.VarChar, phone)
      .input('cccd', sql.VarChar, cccd)
      .query(duplicateCheckQuery);

    if (duplicateResult.recordset.length > 0) {
      const existingRecords = duplicateResult.recordset;
      const phoneExists = existingRecords.some(record => record.phone === phone);
      const cccdExists = existingRecords.some(record => record.cccd === cccd);
      
      let errorMessage = 'Không thể đăng ký do: ';
      const errors = [];
      
      if (phoneExists) {
        errors.push('Số điện thoại đã được đăng ký');
      }
      if (cccdExists) {
        errors.push('Số căn cước công dân đã được đăng ký');
      }
      
      errorMessage += errors.join(' và ');
      
      return NextResponse.json(
        { 
          error: 'Không thể đăng ký!',
          message: errorMessage,
          duplicateFields: {
            phone: phoneExists,
            cccd: cccdExists
          }
        },
        { status: 400 }
      );
    }

    // Chỉ thêm đăng ký mới khi không có trùng lặp
    const insertQuery = `
      INSERT INTO register (
        student_name, gender, birthday, phone, email, cccd,
        parent_name, parent_phone, city, ward, course, created_at
      ) 
      VALUES (
        @student_name, @gender, @birthday, @phone, @email, @cccd,
        @parent_name, @parent_phone, @city, @ward, @course, GETDATE()
      )
    `;
    
    await pool.request()
      .input('student_name', sql.NVarChar, student_name)
      .input('gender', sql.VarChar, gender)
      .input('birthday', sql.Date, birthday)
      .input('phone', sql.VarChar, phone)
      .input('email', sql.VarChar, email)
      .input('cccd', sql.VarChar, cccd)
      .input('parent_name', sql.NVarChar, parent_name)
      .input('parent_phone', sql.VarChar, parent_phone)
      .input('city', sql.NVarChar, city)
      .input('ward', sql.NVarChar, ward)
      .input('course', sql.NVarChar, course)
      .query(insertQuery);

    return NextResponse.json(
      { 
        success: true,
        message: 'Đăng ký thành công!' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Database error:', error);
    
    return NextResponse.json(
      { 
        error: 'Không thể đăng ký!',
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
        technical: error.message
      },
      { status: 500 }
    );
  }
}
