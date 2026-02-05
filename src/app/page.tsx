"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { LuckyWheelPage } from "@/app/pages/lucky/lucky-wheel-page";
import { LuckyGridPage } from "@/app/pages/lucky/lucky-grid-page";

const MemberCardButton = dynamic(async () => (await import("./components/MemberCard")).MemberCard);
const SkuProductButton = dynamic(async () => (await import("./components/SkuProduct")).SkuProduct);
const RaffleTiersButton = dynamic(async () => (await import("./components/RaffleTiers")).RaffleTiers);

export default function Home() {
    const [refresh, setRefresh] = useState(0);
    
    // ================= 弹窗状态管理 =================
    const [showSkuModal, setShowSkuModal] = useState(false);         
    const [showInfoModal, setShowInfoModal] = useState(false);       
    const [showBuyModal, setShowBuyModal] = useState(false);         
    const [showCheckInModal, setShowCheckInModal] = useState(false); 
    const [showRaffleTiersModal, setShowRaffleTiersModal] = useState(false); 
    const [prizeModalData, setPrizeModalData] = useState<{name: string, id: string} | null>(null);
    
    // 【新增】控制十连抽开发中弹窗
    const [showDrawTenModal, setShowDrawTenModal] = useState(false);

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 overflow-x-hidden relative font-sans">
            {/* Header */}
            <header className="flex justify-between items-center max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 tracking-tighter">
                    ✨ LUCKY DRAW ✨
                </h1>
                <button 
                    onClick={() => setShowInfoModal(true)}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            </header>

            {/* 会员卡 */}
            <MemberCardButton 
                allRefresh={refresh} 
                onRedeemClick={() => setShowSkuModal(true)} 
                onBuyClick={() => setShowBuyModal(true)}
                onCheckInError={() => setShowCheckInModal(true)}
            />

            {/* 游戏主区域 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 左侧：转盘 */}
                <div className="glass-panel rounded-3xl p-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="p-6 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            🎡 Fortune Wheel
                        </h3>
                        {/* 【修改点】：传入 onDrawTenTimes 回调 */}
                        <LuckyWheelPage 
                            handleRefresh={handleRefresh} 
                            onWin={(prize: {name: string, id: string}) => setPrizeModalData(prize)}
                            onDrawTenTimes={() => setShowDrawTenModal(true)}
                        />
                    </div>
                </div>

                {/* 右侧：奖品墙 */}
                <div className="glass-panel rounded-3xl p-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                🏆 Prize Gallery
                            </h3>
                            <button 
                                onClick={() => setShowRaffleTiersModal(true)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1 transition-all transform hover:scale-105 cursor-pointer"
                            >
                                <span className="text-yellow-300">★</span> View Raffle Tiers
                            </button>
                        </div>
                        
                        <div className="flex justify-center">
                             <LuckyGridPage handleRefresh={handleRefresh} />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center text-white/30 text-xs mt-12 mb-4">
                More details about this project can be found on{' '}
                <a 
                    href="https://github.com/pluto-han/BigMarket" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#3A82F3] hover:text-[#3A82F3]/80 hover:underline transition-colors cursor-pointer"
                >
                    GitHub
                </a>
                {' '}© 2026 Hancong Zhang
            </footer>

            {/* === 1. Sku Modal === */}
            {showSkuModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowSkuModal(false)}></div>
                    <div className="relative bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">🎲 Choose Your Fortune</h3>
                            <button onClick={() => setShowSkuModal(false)} className="text-gray-400 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6 bg-[#1a1a1a] max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <SkuProductButton handleRefresh={handleRefresh} onClose={() => setShowSkuModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* === 2. Info Modal === */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowInfoModal(false)}></div>
                    <div className="relative w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: 'linear-gradient(180deg, #2e2a5b 0%, #1e1b3a 100%)' }}>
                        <div className="flex justify-between items-start p-6 pb-2">
                            <h3 className="text-2xl font-black text-yellow-400 flex items-center gap-3"><span className="bg-yellow-400 w-4 h-4 rounded-sm inline-block"></span>How to Use This System</h3>
                            <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-white transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <div className="p-6 space-y-5 text-gray-200 text-sm leading-relaxed">
                            <div className="flex gap-4"><span className="text-xl">💳</span><p>Check your available credits and draw times on your <strong className="text-white">membership card</strong>.</p></div>
                            <div className="flex gap-4"><span className="text-xl">🎲</span><p>Redeem or check in to get more <strong className="text-white">draw times</strong> if needed.</p></div>
                            <div className="flex gap-4"><span className="text-xl">🎡</span><p>Spin the <strong className="text-white">Fortune Wheel</strong> to win prizes!</p></div>
                            <div className="flex gap-4"><span className="text-xl">🏆</span><p>View all possible prizes in the <strong className="text-white">Prize Gallery</strong>.</p></div>
                            <div className="flex gap-4"><span className="text-xl">🌟</span><p>Check the <strong className="text-white">Raffle Tiers</strong> for guaranteed prize ranges.</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* === 3. Buy Credits Modal === */}
            {showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowBuyModal(false)}></div>
                    <div className="relative bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full text-center border border-white/10 shadow-2xl animate-fade-in-up">
                        <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">💎 Buy Credits</h3>
                        <div className="space-y-3 py-4">
                            <p className="text-lg text-white/90 font-medium">This feature will be available soon!</p>
                            <p className="text-sm text-gray-400">Stay tuned for updates on our credit purchase system.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* === 4. Check In Alert Modal === */}
            {showCheckInModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCheckInModal(false)}></div>
                    <div className="relative bg-[#2e1d4a] rounded-3xl p-8 max-w-sm w-full text-center border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-fade-in-up">
                        <button onClick={() => setShowCheckInModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <div className="flex justify-center mb-4"><div className="bg-yellow-400/20 p-3 rounded-full"><svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div></div>
                        <h3 className="text-2xl font-bold text-white mb-4">Alert</h3>
                        <p className="text-gray-200 mb-8 leading-relaxed">Already checked in today, please come back tomorrow!</p>
                        <button onClick={() => setShowCheckInModal(false)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-10 rounded-full shadow-lg transform transition hover:scale-105">OK</button>
                    </div>
                </div>
            )}

            {/* === 5. Raffle Tiers Modal === */}
            {showRaffleTiersModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowRaffleTiersModal(false)}></div>
                    <div className="relative bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up flex flex-col max-h-[85vh]">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5 shrink-0">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><span className="text-yellow-400">✨</span> Raffle Tiers</h3>
                            <button onClick={() => setShowRaffleTiersModal(false)} className="text-gray-400 hover:text-white p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar"><RaffleTiersButton onClose={() => setShowRaffleTiersModal(false)} /></div>
                    </div>
                </div>
            )}

            {/* === 6. Prize Winner Modal === */}
            {prizeModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setPrizeModalData(null)}></div>
                    <div className="relative bg-gradient-to-b from-[#2e1d4a] to-[#1e1b3a] rounded-3xl p-8 max-w-md w-full text-center border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-fade-in-up">
                        <button onClick={() => setPrizeModalData(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <div className="mb-8 mt-4">
                            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                                Congratulations🎉! You've got prize <span className="text-yellow-400">{prizeModalData.name}</span> prizeId {prizeModalData.id}
                            </p>
                        </div>
                        <button onClick={() => setPrizeModalData(null)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-12 rounded-full shadow-lg transform transition hover:scale-105">OK</button>
                    </div>
                </div>
            )}

            {/* ================= 7. 【新增】十连抽开发中提醒弹窗 (Draw Ten Times Modal) ================= */}
            {showDrawTenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowDrawTenModal(false)}></div>
                    <div className="relative bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full text-center border border-white/10 shadow-2xl animate-fade-in-up">
                        <button onClick={() => setShowDrawTenModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">🎲 Draw Ten Times</h3>
                        <div className="space-y-3 py-4">
                            <p className="text-lg text-white/90 font-medium">This feature is currently under development!</p>
                            <p className="text-sm text-gray-400">Stay tune for the next version!</p>
                        </div>
                         <button onClick={() => setShowDrawTenModal(false)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-10 rounded-full shadow-lg transform transition hover:scale-105 mt-4">OK</button>
                    </div>
                </div>
            )}

        </div>
    );
}