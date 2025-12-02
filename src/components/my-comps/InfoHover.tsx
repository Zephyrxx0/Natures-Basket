import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";
import { Info } from "lucide-react";

export default function LoginInfo() {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Info />
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="shadow-input mx-auto h-full w-full max-w-md rounded-none bg-card/90 backdrop-blur-[2.5px]  md:rounded-2xl md:p-4 border-2 border-accent">
                    Press Login to Reveal credentials
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}