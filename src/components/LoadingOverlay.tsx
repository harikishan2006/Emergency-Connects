import { Activity } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-background/30 animate-fade-in">
      <div className="relative">
        {/* Glowing Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-150 blur-xl"></div>
        
        {/* Main Spinner Container */}
        <div className="glass-card p-6 flex flex-col items-center gap-4 border-primary/30 shadow-[0_0_50px_rgba(0,206,230,0.2)]">
          <div className="relative h-12 w-12">
            <Activity className="h-12 w-12 text-primary animate-pulse" />
            <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground tracking-widest uppercase">Processing</span>
            <div className="flex gap-1 mt-1">
              <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
