export function LoadingSkeleton() {
    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4">
                <div className="h-full min-h-[600px] bg-white/[0.06] rounded-[32px] p-10 animate-pulse">
                    <div className="text-center mb-10">
                        <div className="h-4 w-28 bg-white/[0.08] rounded mx-auto mb-3" />
                        <div className="h-8 w-20 bg-white/[0.08] rounded mx-auto" />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-white/[0.08] rounded-full mb-8" />
                        <div className="h-24 w-40 bg-white/[0.08] rounded-xl mb-6" />
                        <div className="h-6 w-32 bg-white/[0.06] rounded mb-10" />
                    </div>
                    <div className="h-px bg-white/[0.06] mb-8" />
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/[0.04] rounded-2xl p-5 h-24" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Hourly */}
                <div className="bg-white/[0.06] rounded-[28px] overflow-hidden animate-pulse">
                    <div className="px-8 py-5 border-b border-white/[0.05]">
                        <div className="h-5 w-36 bg-white/[0.08] rounded" />
                    </div>
                    <div className="p-6">
                        <div className="flex gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-[80px] h-32 bg-white/[0.04] rounded-2xl flex-shrink-0" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily */}
                <div className="flex-1 bg-white/[0.06] rounded-[28px] overflow-hidden animate-pulse">
                    <div className="px-8 py-5 border-b border-white/[0.05]">
                        <div className="h-5 w-36 bg-white/[0.08] rounded" />
                    </div>
                    <div className="p-5 space-y-2">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="h-14 bg-white/[0.04] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
