"use client";
import { useTheme } from "@/context/theme-provider";
import {
  LeftNavigation,
  NavigationItem,
} from "@/app/components/left-navigation";
import { TopBar } from "@/app/components/top-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faBell,
  faChalkboard,
  faCircleUser,
  faHouse,
  faMoon,
  faSun,
  faUserGraduate,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { CourseDetail } from "./pageview/course-detail";
import { UserHome } from "./pageview/user-home";
import { MainPage } from "./pageview/main-page";
import { ScreenRecordControlPage } from "./pageview/screen-recorder";
import { AdminPage } from "./pageview/admin-page.tsx";
import { NotificationList } from "./pageview/notification-list";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [currentChildren, setCurrentChildren] = useState("mainPage");

  const [leftNavigationHidden, setLeftNavigationHidden] = useState(false);
  const [animationClass, setAnimationClass] = useState(""); //用于子组件视图切换

  const ChildrenView = useCallback(() => {
    switch (currentChildren) {
      case "mainPage":
        return <MainPage />;
      case "notification":
        return <NotificationList />;
      case "course":
        return <CourseDetail />;
      case "userHome":
        return <UserHome />;
      case "screenRecord":
        return <ScreenRecordControlPage />;
      case "admin":
        return <AdminPage />;
    }
  }, [currentChildren]);

  //设置切换动画
  useEffect(() => {
    setAnimationClass(`hidden`);

    const timer = setTimeout(() => {
      setAnimationClass(`opacity-0 translate-x-1/3`);

      requestAnimationFrame(() => {
        setAnimationClass(
          "opacity-100 translate-x-0 z-0 transition-all duration-500"
        );
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [currentChildren]);

  return (
    <div
      className={`flex h-screen -mt-1  max-h-screen w-full flex-col transition-all overflow-hidden  items-center justify-center  bg-surface`}
    >
      <TopBar />
      <div
        className={`h-8/9 w-full  flex flex-row duration-300  transition-all`}
      >
        <LeftNavigation hidden={leftNavigationHidden}>
          <NavigationItem
            title={`主页`}
            isActive={currentChildren === "mainPage"}
            isfitst={true}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("mainPage");
            }}
          >
            <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
          </NavigationItem>
          <NavigationItem
            title={`课程`}
            isActive={currentChildren === "course"}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("course");
            }}
          >
            <FontAwesomeIcon icon={faChalkboard}></FontAwesomeIcon>
          </NavigationItem>
          <NavigationItem
            title={`个人中心`}
            isActive={currentChildren === "userHome"}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("userHome");
            }}
          >
            <FontAwesomeIcon icon={faCircleUser}></FontAwesomeIcon>
          </NavigationItem>
          <NavigationItem
            title="我的通知"
            isActive={currentChildren === "notification"}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("notification");
            }}
          >
            <FontAwesomeIcon icon={faBell} />
          </NavigationItem>
          <NavigationItem
            title={`录制`}
            isActive={currentChildren === "screenRecord"}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("screenRecord");
            }}
          >
            <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>
          </NavigationItem>
          <NavigationItem
            title={`管理员页面`}
            isActive={currentChildren === "admin"}
            onClick={() => {
              setAnimationClass("hidden");
              setCurrentChildren("admin");
            }}
          >
            <FontAwesomeIcon icon={faUserGraduate}></FontAwesomeIcon>
          </NavigationItem>
          <NavigationItem
            title={theme === "dark" ? `亮色模式` : `暗色模式`}
            onClick={() => {
              toggleTheme();
            }}
          >
            {theme === "dark" ? (
              <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
            )}
          </NavigationItem>
        </LeftNavigation>

        <div
          className={`absolute duration-200 transition-all ${
            leftNavigationHidden ? `left-0` : `left-1/16`
          } top-1/2 z-10`}
          onClick={() =>
            setLeftNavigationHidden((prevState) => {
              return !prevState;
            })
          }
        >
          <div className="text-primary ">
            {leftNavigationHidden ? (
              <FontAwesomeIcon
                className={` hover:scale-125 hover:cursor-pointer   transition-all duration-200`}
                size={`xl`}
                icon={faAngleRight}
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                className={` hover:scale-125 hover:cursor-pointer  transition-all duration-200`}
                size={`xl`}
                icon={faAngleLeft}
              ></FontAwesomeIcon>
            )}
          </div>
        </div>
        <div
          className={`w-full  ${animationClass} relative overflow-auto h-full bg-background text-on-background transition-all`}
        >
          <div className={`absolute h-full w-full flex transition-all`}>
            {ChildrenView()}
          </div>
        </div>
      </div>
    </div>
  );
}
