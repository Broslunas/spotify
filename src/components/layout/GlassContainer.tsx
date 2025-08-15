import { cn } from '@/lib/utils';
import { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react';

type BlurLevel = 'sm' | 'md' | 'lg' | 'xl';
type OpacityLevel = 'low' | 'medium' | 'high';
type VariantType = 'default' | 'card' | 'button' | 'nav';

interface GlassContainerOwnProps {
    children: ReactNode;
    className?: string;
    blur?: BlurLevel;
    opacity?: OpacityLevel;
    variant?: VariantType;
    as?: ElementType;
}

type GlassContainerProps<T extends ElementType = 'div'> = GlassContainerOwnProps &
    Omit<ComponentPropsWithoutRef<T>, keyof GlassContainerOwnProps>;

const blurClasses: Record<BlurLevel, string> = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
};

const opacityClasses: Record<OpacityLevel, string> = {
    low: 'bg-white/5 dark:bg-black/5',
    medium: 'bg-white/10 dark:bg-black/10',
    high: 'bg-white/20 dark:bg-black/20',
};

const variantClasses: Record<VariantType, string> = {
    default: 'border border-white/20 dark:border-white/10 shadow-glass',
    card: 'border border-white/10 dark:border-white/5 shadow-glass rounded-xl',
    button: 'border border-white/20 dark:border-white/10 shadow-glass-inset hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
    nav: 'border-b border-white/20 dark:border-white/10 shadow-sm',
};

export function GlassContainer<T extends ElementType = 'div'>({
    children,
    className,
    blur = 'md',
    opacity = 'medium',
    variant = 'default',
    as,
    ...props
}: GlassContainerProps<T>) {
    const Component = as || 'div';

    return (
        <Component
            className={cn(
                'relative',
                blurClasses[blur],
                opacityClasses[opacity],
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}