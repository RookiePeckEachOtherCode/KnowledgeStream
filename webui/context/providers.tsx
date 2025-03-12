import { ScreenRecordProvider } from "./screen-record-provider";
import { ThemeProvider } from "./theme-provider";
import { NotificationProvider } from "@/context/notification-provider";

interface ProvidersProps {
  children: React.ReactNode;
}
export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <ScreenRecordProvider>{children}</ScreenRecordProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
