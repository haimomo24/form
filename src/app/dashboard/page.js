'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashBoard from '../component/dashboard/DashBoard'

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa - sử dụng cùng key với login page
    const sessionToken = localStorage.getItem('sessionToken')
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (sessionToken && isLoggedIn === 'true') {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      // Redirect về trang đăng nhập nếu chưa đăng nhập
      router.push('/login')
    }
  }, [router])

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    )
  }

  // Chỉ render dashboard khi đã xác thực
  if (!isAuthenticated) {
    return null
  }

  return (
    <div>
      <DashBoard />
    </div>
  )
}

export default DashboardPage
