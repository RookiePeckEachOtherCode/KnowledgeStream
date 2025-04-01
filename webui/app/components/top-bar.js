import MDInput from "./md-input.tsx";
import {useEffect, useState} from "react";
import {api} from "../../api/instance.ts";
import {OssImage} from "./oss-midea.tsx";
import { useRouter } from "next/navigation";
export function TopBar(props) {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState('')

  const [userInfo, setUserInfo] = useState({})

  const [avatarIsHover, setAvatarIsHover] = useState(false)
  
  const GetUserInfo=async ()=>{
    const resp = await api.userService.queryInfo({});
    if(resp.base.code!==200){
      return
    }
    setUserInfo(resp.userinfo)
  }
  
  const Logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("uid");
    router.push("/auth/login");
  }
  
  useEffect(()=>{
    async function fetchData(){
      await GetUserInfo()
    }
    fetchData()
  },[])
  
  return (
      <div
          className={`w-full flex flex-row h-1/10  items-center pl-8 pr-8  justify-between transition-all bg-surface-container-high text-on-surface`}
      >
        <div className={`text-3xl`}>KnowledgeStream</div>
        <div className={`w-1/8 hover:w-1/3 transition-all duration-300`}>
          <MDInput
              value={searchKeyword}
              onValueChange={e => setSearchKeyword(e)}
              placeholder={`搜索课程`}
          ></MDInput>
        </div>
        <div
            onMouseOver={() => setAvatarIsHover(true)}
            onMouseLeave={() => setAvatarIsHover(false)}
            className={`h-full w-auto items-center transition-all flex justify-center relative`}>
          <OssImage
              className={`h-3/4 aspect-square rounded-full hover:scale-110 transition-all duration-200`}
              url={userInfo.avatar}/>
          <div
              onClick={Logout}
              className={`absolute top-full hover:cursor-pointer ${
                  avatarIsHover ? `z-[999] opacity-100` : `z-[-1] opacity-0`
              } transition-all duration-200 flex rounded-sm min-w-max bg-error items-center justify-center`}>
            <text className={`text-on-error px-2 whitespace-nowrap`}>{"退出登录"}</text>
          </div>
        </div>

      </div>
  );
}
 