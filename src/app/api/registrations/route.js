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
