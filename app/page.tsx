import { DesktopView } from "./DesktopPage";
import { MobileView } from "./MobilePage";

export default function Home() {
    return (
        <div className="w-full min-h-screen">
            {/* Desktop View (Hidden on mobile) */}
            <div className="hidden md:block w-full h-full">
                <DesktopView />
            </div>

            {/* Mobile View (Hidden on desktop) */}
            <div className="block md:hidden w-full h-full">
                <MobileView />
            </div>
        </div>
    );
}
