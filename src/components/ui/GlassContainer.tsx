import { cn } from "@/lib/utils";

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    blur?: "sm" | "md" | "lg";
    opacity?: number;
}

export function GlassContainer({
    children,
    className,
    blur = "md",
    opacity = 0.1,
}: GlassContainerProps) {
    const blurClasses = {
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border border-white/20 shadow-xl",
                blurClasses[blur],
                className
            )}
            style={{
                backgroundColor: `rgba(255, 255, 255, ${opacity})`,
            }}
        >
            {children}
        </div>
    );
}