"use client";
import { api } from "@/api/instance";
import AnimatedContent from "@/app/components/animated-content";
import MDButton from "@/app/components/md-button";
import MDInput from "@/app/components/md-input";
import SplitText from "@/app/components/split-text";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {useNotification} from "@/context/notification-provider";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordIsValid = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword]
  );
  var {message,showNotification} = useNotification();
  const notify = (msg: string,type:string="error") => {
    showNotification({type:type,message:message});
  };


  const register = async () => {
    if (username.length == 0) {
      notify("用户名不能为空");
      return;
    }
    if (phone.length == 0) {
      notify("手机号不能为空");
      return;
    }
    if (password.length == 0) {
      notify("密码不能为空");
      return;
    }

    if (!passwordIsValid) {
      notify("两次输入的密码不一致");
      return;
    }

    const resp = await api.userService.register({
      name: username,
      phone: phone,
      password: password,
    });

    if (resp.base.code !== 200) {
      notify("注册失败: ",resp.base.msg);
      return;
    }

    notify("注册成功，正在跳转登陆页面","success");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 min-h-screen mt-12">
      <AnimatedContent
        distance={150}
        reverse={true}
        config={{ tension: 80, friction: 20 }}
      >
        <div className="flex flex-col items-center justify-center bg-surface-container px-24 py-12 rounded-3xl shadow-xl border-2 border-surface-variant w-4xl mx-auto">
          <SplitText
            text="注册到 KnowledgeStream 涟漪学习平台"
            className="text-3xl font-semibold text-center"
            delay={100}
            animationFrom={{
              opacity: 0,
              transform: "translate3d(0,50px,0)",
            }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            threshold={0.2}
            rootMargin="-50px"
          />
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={150}
        reverse={false}
        config={{ tension: 80, friction: 20 }}
      >
        <div className="flex flex-col p-24 pt-12 bg-surface-container shadow-xl rounded-3xl border-2 border-surface-variant w-4xl mx-auto gap-8">
          <div className="text-center text-2xl font-semibold">
            填写信息 喵喵喵
          </div>
          <MDInput
            className="w-full"
            value={username}
            placeholder="用户名"
            onValueChange={setUsername}
          />
          <MDInput
            className="w-full"
            value={phone}
            placeholder="手机号"
            onValueChange={setPhone}
          />
          <MDInput
            className={clsx("w-full")}
            value={password}
            placeholder="密码"
            onValueChange={setPassword}
            isUnValid={!passwordIsValid}
            type="password"
          />
          <MDInput
            value={confirmPassword}
            placeholder="确认密码"
            onValueChange={setConfirmPassword}
            isUnValid={!passwordIsValid}
            type="password"
          />
          <MDButton onClick={register}>注册</MDButton>
        </div>
      </AnimatedContent>
    </div>
  );
}
