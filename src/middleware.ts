import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = "luna_auth"

// 用于判断哪些路径无需鉴权
function shouldSkipAuth(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/logo.png') ||
    pathname.startsWith('/screenshot.png') ||
    pathname.startsWith('/login') ||          // 必须跳过
    pathname.startsWith('/warning') ||        // 必须跳过
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/register') ||
    pathname.startsWith('/api/logout') ||
    pathname.startsWith('/api/cron') ||
    pathname.startsWith('/api/server-config')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是免鉴权路径，则直接放行
  if (shouldSkipAuth(pathname)) {
    return NextResponse.next()
  }

  // 读取环境变量（兼容 Docker、NAS、构建环境）
  const ENV_PASSWORD =
    process.env.PASSWORD ||
    process.env.NEXT_PUBLIC_PASSWORD ||
    ""

  // 如果你想“完全免登录”，直接 return NextResponse.next()
  // 但这里我们根据你需求：有 PASSWORD 则需要登录；无 PASSWORD 则警告
  const hasPassword = ENV_PASSWORD.trim().length > 0

  // 情况 A：未设置 PASSWORD → 显示安全警告页
  if (!hasPassword) {
    const warningUrl = new URL('/warning', request.url)
    return NextResponse.redirect(warningUrl)
  }

  // 情况 B：检查 cookie 是否已经登录
  const authCookie = request.cookies.get(COOKIE_NAME)?.value
  if (!authCookie) {
    // 未登录 → 强制跳转到登录页
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 情况 C：已经有 cookie → 认为登录成功（简化模式，适配老人使用）
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/login|api/register|api/logout|api/cron|api/server-config).*)',
  ],
}
