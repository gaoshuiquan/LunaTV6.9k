import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 🔥 直接放行所有请求，不做任何登录检查
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:path*', // 对所有路由执行 middleware，但我们内部直接放行
  ],
}
