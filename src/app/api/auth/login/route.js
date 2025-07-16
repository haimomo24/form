import { NextResponse } from 'next/server';
import { connectDB, sql } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    // Kết nối database
    await connectDB();

    // Tìm user trong database (so sánh password trực tiếp)
    const result = await sql.query`
      SELECT id, username, password, email, created_at 
      FROM users 
      WHERE username = ${username} AND password = ${password}
    `;

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    const user = result.recordset[0];

    // Tạo session token đơn giản
    const sessionToken = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Trả về thông tin user (không bao gồm password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      sessionToken: sessionToken
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server: ' + error.message },
      { status: 500 }
    );
  }
}
