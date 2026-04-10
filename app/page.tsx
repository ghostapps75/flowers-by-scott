import { DesktopView } from "./DesktopPage";
import { MobileView } from "./MobilePage";

export default function Home() {
    return (
        <div className="w-full min-h-screen">
            <DesktopView />
        </div>
    );
}
