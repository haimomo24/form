import { NextResponse } from 'next/server';
import { connectDB, sql } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const pool = await connectDB();
    
    const query = `DELETE FROM register WHERE id = @id`;
    
    const dbRequest = pool.request();
    dbRequest.input('id', sql.Int, parseInt(id));
    
    const result = await dbRequest.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký để xóa' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Xóa thành công!' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Database error:', error);
    
    return NextResponse.json(
      { error: 'Lỗi server. Không thể xóa!' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const pool = await connectDB();
    
    const query = `SELECT * FROM register WHERE id = @id`;
    
    const dbRequest = pool.request();
    dbRequest.input('id', sql.Int, parseInt(id));
    
    const result = await dbRequest.query(query);
    
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { registration: result.recordset[0] },
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
