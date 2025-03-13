import {useScreenRecord} from "../../context/screen-record-provider";
import {useEffect, useRef, useState} from "react";
import {IconButton} from "../components/icon-button";
import {useOss} from "../../context/oss-uploader-provider.js";
import {OssVideo} from "../components/oss-midea.tsx";

export function ScreenRecordControlPage(props){
    const {isRecording,startRecording,stopRecording,recordedBlob,liveStream} = useScreenRecord();
    const previewVideoRef = useRef(null);//实时预览流

    const [testUrl, setTestUrl] = useState()
    var {handleFileUpload,generateSignedUrl} = useOss();

    // 实时视频更新
    useEffect(() => {
        if (previewVideoRef.current && liveStream) {
            previewVideoRef.current.srcObject = liveStream;
        }
    }, [liveStream]);
    
    const UploadVideo=async ()=>{
       await handleFileUpload(recordedBlob,"test","ks-video")
    }



    return (
        <div className={`w-full  space-x-6  h-full flex flex-row p-8`}>
            <div className={`h-full flex flex-col space-y-6`}>
                {!isRecording?
                    <IconButton 
                        className={` bg-secondary  text-on-secondary
                     hover:text-on-primary hover:bg-primary w-24 h-12`}
                        text={`开始录制`}
                        onClick={startRecording}>
                    </IconButton>:  <IconButton 
                        className={`w-24 h-12 bg-error-container text-on-error-container 
                        hover:bg-error hover:text-on-error
                        `} 
                        text={`停止录制`} 
                        onClick={stopRecording}>
                    </IconButton >
                }
                <IconButton
                    className={` bg-tertiary-container  text-on-tertiary-container
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
                    onClick={UploadVideo}
                    text={`上传录屏`}
                >
                </IconButton>
                <IconButton
                    className={` bg-surface-dim  text-on-surface
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
                    text={`重新录制`}
                >
                </IconButton>
                {recordedBlob&&<IconButton
                    className={` bg-primary-fixed text-on-primary-fixed
                     hover:text-on-primary-fixed-dim hover:bg-primary-fixed-dim w-24 h-12`}
                    text={`下载录屏`}
                >
                </IconButton>}
            </div>

            <div className={`w-full items-center flex  justify-center`}>
                {/*{*/}
                {/*    isRecording?<video*/}
                {/*        ref={previewVideoRef}*/}
                {/*        autoPlay={true}*/}
                {/*        muted={true}*/}
                {/*        className={`w-3/4 object-cover`}*/}
                {/*        ></video>*/}
                {/*    :recordedBlob&&(*/}
                {/*        <video*/}
                {/*            controls*/}
                {/*            src={URL.createObjectURL(recordedBlob)}*/}
                {/*            className={`w-3/4 object-cover`}*/}
                {/*        />*/}
                {/*    )*/}
                {/*}*/}
                    <OssVideo className={`w-3/4 `} bucket={"ks-video"} fileName={"test"} ></OssVideo>
            </div>
        </div>
    )

}