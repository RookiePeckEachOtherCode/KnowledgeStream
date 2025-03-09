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
  faChalkboard,
  faCircleUser,
  faHouse,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { CourseDetail } from "./pageview/course-detail";
import { UserHome } from "./pageview/user-home";
import { MainPage } from "./pageview/main-page";
import { api } from "@/api/instance";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [currentChildren, setCurrentChildren] = useState("mainPage");
  const [leftNavigationHidden, setLeftNavigationHidden] = useState(false);

  const ChildrenView = useCallback(() => {
    switch (currentChildren) {
      case "mainPage":
        return <MainPage></MainPage>;
      case "course":
        return <CourseDetail></CourseDetail>;
      case "userHome":
        return <UserHome></UserHome>;
    }
  }, [currentChildren]);

  return (
    <div
      className={`flex h-screen w-screen items-center justify-center bg-surface`}
    >
      <div className={`w-full h-full flex flex-col transition-all`}>
        <TopBar />
        <div
          className={`h-full w-full  flex flex-row duration-300 transition-all`}
        >
          <LeftNavigation hidden={leftNavigationHidden}>
            <NavigationItem
              title={`主页`}
              isActive={currentChildren === "mainPage"}
              isfitst={true}
              onClick={() => {
                setCurrentChildren("mainPage");
              }}
            >
              <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
            </NavigationItem>
            <NavigationItem
              title={`课程`}
              isActive={currentChildren === "course"}
              onClick={() => {
                setCurrentChildren("course");
              }}
            >
              <FontAwesomeIcon icon={faChalkboard}></FontAwesomeIcon>
            </NavigationItem>
            <NavigationItem
              title={`个人中心`}
              isActive={currentChildren === "userHome"}
              onClick={() => {
                setCurrentChildren("userHome");
              }}
            >
              <FontAwesomeIcon icon={faCircleUser}></FontAwesomeIcon>
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
            } top-1/2`}
            onClick={() =>
              setLeftNavigationHidden((prevState) => {
                return !prevState;
              })
            }
          >
            <div className="text-primary">
              {leftNavigationHidden ? (
                <FontAwesomeIcon
                  className={` hover:scale-125 hover:cursor-pointer  transition-all duration-200`}
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
            className={`w-full h-full bg-background text-on-background transition-all`}
          >
            {ChildrenView()}
          </div>
        </div>
      </div>
    </div>
  );
}
