import {ScreenRecordProvider} from "./screen-record-provider";
import {ThemeProvider} from "./theme-provider";
import {NotificationProvider} from "@/context/notification-provider";
import {OssUploaderProvider} from "@/context/oss-uploader-provider";
import {ModalProvider} from "@/context/modal-provider";
import {AIDrawerProvider} from "@/context/ai-drawer-provider";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({children}: ProvidersProps) {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <ScreenRecordProvider>
                    <OssUploaderProvider>
                        <ModalProvider>
                            <AIDrawerProvider>
                                {children}
                            </AIDrawerProvider>
                        </ModalProvider>
                    </OssUploaderProvider>
                </ScreenRecordProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
}
