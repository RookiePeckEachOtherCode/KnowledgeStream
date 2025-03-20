import {OssImage} from "../../components/oss-midea.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faIdCard, faMagnet, faPhone, faSchool, faUserGraduate} from "@fortawesome/free-solid-svg-icons";

export default function CartePage({ params }){
    const userInfo={
        id:"114514",
        bucket:"ks-course-cover",
        url:"ks-user-avatar/114514.jpg",
        name:"raymes",
        authority:"Student",
        phone:"1534658465846",
        grade:"2077",
        faculty:"赔钱学院",
        major:"区块链市场反向预测",
        signature:"wwwwwwjbwwwwwwwwwwwjbwwwwwwwwwwwjb",
    }
    const {uid}=params
    
    return(
        <div className={`w-screen p-8 h-screen bg-background flex flex-col`}>
            
            <div className={`w-full flex space-y-6 flex-col bg-primary-container rounded-2xl p-3`}>
                <div className={`w-full flex flex-row space-x-6 justify-between`}>
                    <div className={`flex flex-row space-x-6`}>
                        <OssImage
                            url={userInfo.url}
                            className={`h-64 aspect-square rounded-full shadow-2xl`}
                        >
                        </OssImage>
                        <div className={`h-full flex flex-col space-y-3 justify-center `}>
                            <div className={`text-4xl text-on-primary-container`}>{userInfo.name}</div>
                            <div className={`text-2xl text-on-primary-container`}>{userInfo.authority}</div>
                        </div>
                    </div>
                    <div className="w-1/3 mr-12 bg-inverse-primary rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full">
                            <tbody className="divide-y divide-on-surface-variant">
                            {/* 学号行 */}
                            <tr className="hover:bg-surface-variant transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3 text-body-medium">
                                        <FontAwesomeIcon icon={faIdCard} className="text-primary w-4 h-4"/>
                                        <span>ID:</span>
                                        <span className="text-on-surface">{userInfo.id}</span>
                                    </div>
                                </td>
                            </tr>

                            {/* 手机号行 */}
                            <tr className="hover:bg-surface-variant transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3 text-body-medium">
                                        <FontAwesomeIcon icon={faPhone} className="text-primary w-4 h-4"/>
                                        <span>手机号:</span>
                                        <span className="text-on-surface">{userInfo.phone || '未绑定'}</span>
                                    </div>
                                </td>
                            </tr>
                            {/*学院*/}
                            <tr className={`hover:bg-surface-variant transition-all`}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3 text-body-medium">
                                        <FontAwesomeIcon icon={faSchool} className="text-primary w-4 h-4"/>
                                        <span>学院:</span>
                                        <span className="text-on-surface">{userInfo.faculty || '未绑定'}</span>
                                    </div>
                                </td>
                            </tr>
                            {/*专业*/}
                            <tr className={`hover:bg-surface-variant transition-all`}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3 text-body-medium">
                                        <FontAwesomeIcon icon={faMagnet} className="text-primary w-4 h-4"/>
                                        <span>学院:</span>
                                        <span className="text-on-surface">{userInfo.major || '未绑定'}</span>
                                    </div>
                                </td>
                            </tr>


                            {/* 年级行 */}
                            <tr className="hover:bg-surface-variant transition-colors hover:cursor-pointer">
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3 text-body-medium">
                                        <FontAwesomeIcon icon={faUserGraduate} className="text-primary w-4 h-4"/>
                                        <span>年级:</span>
                                        <span className="text-on-surface">{userInfo.grade}</span>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={`w-1/3 bg-secondary-container min-h-32 max-h-52 outline-4 outline-outline p-3 rounded-2xl`}>
                    <text className={`w-full h-full text-center text-wrap overflow-clip text-on-secondary-container`}>{userInfo.signature}</text>
                </div>

            </div>


        </div>
    )


}