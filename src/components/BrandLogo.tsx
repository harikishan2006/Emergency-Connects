import { Heart } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
}

const BrandLogo = ({ className = "flex items-center gap-2", iconClassName = "h-6 w-6" }: BrandLogoProps) => {
  return (
    <div className={className}>
      <div className="relative flex items-center justify-center group">
        {/* Colorful Glow Backdrop */}
        <div className="absolute inset-0 blur-lg opacity-40 bg-gradient-to-tr from-[#FF416C] to-[#FF4B2B] rounded-full group-hover:opacity-70 transition-opacity duration-500" />
        
        <div className="relative z-10 p-1.5 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
          <Heart 
            className={`${iconClassName} fill-[#FF416C] stroke-[#FF4B2B] animate-pulse-glow`} 
            style={{ 
              filter: "drop-shadow(0 0 5px rgba(255, 65, 108, 0.6))"
            }} 
          />
        </div>
      </div>
      <div className="flex flex-col ml-1">
        <span className="text-base font-black text-foreground tracking-tighter leading-none">Emergency</span>
        <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] -mt-0.5">Connect</span>
      </div>
    </div>
  );
};

export default BrandLogo;
