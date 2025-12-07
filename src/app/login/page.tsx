"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 中间件可能传递 redirect 参数
    const redirect = searchParams.get("redirect") || "/";

    // 免登录：自动跳转
    router.replace(redirect);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "60px",
        fontSize: "18px",
        color: "#888",
      }}
    >
      正在为您打开页面…
    </div>
  );
}
