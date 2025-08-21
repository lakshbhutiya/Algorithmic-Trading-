import { cn } from "@/lib/utils";

interface TradingCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'profit' | 'loss' | 'accent' | 'none';
  variant?: 'default' | 'gradient';
}

export function TradingCard({ children, className, glow = 'none', variant = 'default' }: TradingCardProps) {
  return (
    <div className={cn(
      variant === 'gradient' ? "gradient-border p-6 rounded-xl" : "trading-card p-6 rounded-xl",
      "transition-all duration-300 hover:scale-[1.01]",
      glow === 'profit' && "profit-glow",
      glow === 'loss' && "loss-glow",
      glow === 'accent' && "accent-glow",
      className
    )}>
      {children}
    </div>
  );
}
