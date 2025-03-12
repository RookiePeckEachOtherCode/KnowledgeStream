"use client";

import { api } from "@/api/instance";
import AnimatedContent from "@/app/components/animated-content";
import MDButton from "@/app/components/md-button";
import MDInput from "@/app/components/md-input";
import SplitText from "@/app/components/split-text";
import { useNotification } from "@/context/notification-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();

  const login = async () => {
    const resp = await api.userService.login({
      phone: phone,
      password: password,
    });
    if (resp.base.code !== 200) {
      showNotification({
        title: "登陆失败",
        content: resp.base.msg,
        type: "error",
      });
      return;
    }
    showNotification({
      title: "登陆成功",
      content: "欢迎回来",
      type: "success",
    });

    localStorage.setItem("token", resp.token);
    localStorage.setItem("username", resp.name);
    localStorage.setItem("uid", resp.id);

    router.push("/");
  };

  const gotoRegister = () => {
    router.push("/auth/register");
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-row gap-8 w-ful items-center">
        <AnimatedContent
          distance={150}
          reverse={true}
          config={{ tension: 80, friction: 20 }}
        >
          <div className="flex flex-col bg-surface-container p-24 rounded-3xl border-2 border-surface-variant shadow-xl gap-4 w-full">
            <SplitText
              text="KnowledgeStream 涟漪学习平台"
              className="text-4xl font-semibold text-center"
              delay={100}
              animationFrom={{
                opacity: 0,
                transform: "translate3d(0,50px,0)",
              }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.2}
              rootMargin="-50px"
            />
            <div className="h-4"></div>
            <MDInput
              value={phone}
              onValueChange={setPhone}
              placeholder="手机号码"
            />
            <MDInput
              value={password}
              onValueChange={setPassword}
              placeholder="登陆密码"
              type="password"
            />
            <MDButton className="w-1/2 mx-auto" onClick={login}>
              登陆
            </MDButton>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={150}
          delay={500}
          config={{ tension: 80, friction: 20 }}
        >
          <div className="flex flex-col bg-surface-container p-8 rounded-3xl border-2 border-surface-variant shadow-xl gap-4">
            <SplitText
              text="加入我们"
              className="text-2xl font-semibold text-center"
              delay={150}
              animationFrom={{ opacity: 0, transform: "translate3d(0,30px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.2}
              rootMargin="-30px"
            />
            <p className="text-sm text-center text-on-surface-variant">
              立即注册获取更多学习资源和专属服务
            </p>
            <MDButton className="w-full" onClick={gotoRegister}>
              注册
            </MDButton>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
