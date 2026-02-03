import { calendarSignRebate, isCalendarSignRebate, queryUserActivityAccount, queryUserCreditAccount } from "@/apis";
import React, { useEffect, useState } from "react";
import { UserActivityAccountVO } from "@/types/UserActivityAccountVO";

// @ts-ignore
// 【修改点1】：新增接收 onCheckInError 参数
export function MemberCard({ allRefresh, onRedeemClick, onBuyClick, onCheckInError }) {
    const [dayCount, setDayCount] = useState(0);
    const [creditAmount, setCreditAmount] = useState(0);
    const [sign, setSign] = useState(false);
    const [userId, setUserId] = useState('');

    const getParams = async () => {
        setUserId(String(new URLSearchParams(window.location.search).get('userId')));
    }

    const queryUserActivityAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = await queryUserActivityAccount(String(queryParams.get('userId')), Number(queryParams.get('activityId')));
        const { code, data }: { code: string; data: UserActivityAccountVO } = await result.json();
        if (code === "0000") setDayCount(data.dayCountSurplus);
    }

    const queryUserCreditAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = await queryUserCreditAccount(String(queryParams.get('userId')));
        const { code, data }: { code: string; data: number } = await result.json();
        if (code === "0000") setCreditAmount(data);
    }

    const queryIsCalendarSignRebateHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userIdStr = String(queryParams.get('userId'));
        try {
            const result = await isCalendarSignRebate(userIdStr);
            const { code, data }: { code: string; data: boolean } = await result.json();
            if (code === "0000" && data === true) {
                setSign(true);
            } else {
                setSign(false);
            }
        } catch (e) {
            console.error("Check sign status failed", e);
        }
    }
    
    // 【修改点2】：拆分点击逻辑
    const handleCheckInClick = async () => {
        // 如果已经签到 (sign === true)，点击则触发报错弹窗
        if (sign) {
            if (onCheckInError) onCheckInError();
            return;
        }

        // 如果没签到，走正常的签到流程
        const queryParams = new URLSearchParams(window.location.search);
        const result = await calendarSignRebate(String(queryParams.get('userId')));
        const {code} = await result.json();

        if (code === "0000" || code === "0003") {
             setSign(true); 
             queryUserActivityAccountHandle();
             queryUserCreditAccountHandle();   
        }
    }

    useEffect(() => {
        getParams();
        queryUserActivityAccountHandle();
        queryUserCreditAccountHandle();
        queryIsCalendarSignRebateHandle();
    }, [allRefresh]);

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="relative w-full max-w-7xl mx-auto mb-8 rounded-3xl overflow-hidden glass-container-border p-6 md:p-8">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-blue-400">💎</span> Membership Card
                    </h2>
                    <div className="bg-white/10 border border-white/10 px-4 py-1 rounded-full text-xs text-white font-mono">
                        ID: {userId || 'GUEST'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-40 shadow-inner">
                        <span className="text-4xl font-black text-yellow-400 drop-shadow-md">{creditAmount.toFixed(2)}$</span>
                        <span className="text-gray-400 text-sm mt-2 font-medium">My Credit</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-40 shadow-inner">
                        <span className="text-4xl font-black text-orange-400 drop-shadow-md">{dayCount}</span>
                        <span className="text-gray-400 text-sm mt-2 font-medium">Draw Times</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-40 shadow-inner">
                        <span className="text-3xl font-bold text-blue-300 drop-shadow-md">{today}</span>
                        <span className="text-gray-400 text-sm mt-2 font-medium">Today's Date</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button 
                        onClick={onBuyClick}
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:scale-105 transform transition shadow-lg font-bold"
                    >
                        <span>💎</span> Buy Credits
                    </button>

                    <button 
                        onClick={onRedeemClick} 
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:scale-105 transform transition shadow-lg font-bold"
                    >
                        <span>🎲</span> Redeem Draw Times
                    </button>

                    {/* 【修改点3】：让已签到状态(绿色)也能点击(cursor-pointer)，并保留交互动画 */}
                    <button 
                        onClick={handleCheckInClick}
                        className={`px-6 py-2 rounded-full flex items-center gap-2 text-white shadow-lg font-bold transition transform hover:scale-105 cursor-pointer
                            ${sign 
                                ? 'bg-[#22c55e]' // 已签到：绿色
                                : 'bg-gray-600 hover:bg-gray-500' // 未签到：灰色
                            }
                        `}
                    >
                        <span>📅</span> {sign ? 'Checked In Today' : 'Check In To Get Credits!'}
                    </button>
                </div>
            </div>
        </div>
    )
}