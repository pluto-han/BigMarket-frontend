"use client"

import React, { useEffect, useState } from 'react'
import { queryRaffleAwardList } from '@/apis'
import { RaffleAwardVO } from "@/types/RaffleAwardVO";

// @ts-ignore
export function LuckyGridPage({ handleRefresh }) {
    const [awards, setAwards] = useState<RaffleAwardVO[]>([])

    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        
        try {
            const result = await queryRaffleAwardList(userId, activityId);
            const { code, data }: { code: string; data: RaffleAwardVO[] } = await result.json();
            
            if (code === "0000" && data) {
                // ==========================================================
                // 【核心修改】：按 awardRate (中奖概率) 从小到大排序
                // 这样 0.22% (稀有) 会排在前面，40% (普通) 排在后面
                // ==========================================================
                const sortedData = data.sort((a, b) => b.awardRate - a.awardRate);
                
                // 只取前 9 个填满九宫格
                setAwards(sortedData.slice(0, 9));
            }
        } catch (e) {
            console.error("Failed to load grid awards", e);
        }
    }

    useEffect(() => {
        queryRaffleAwardListHandle();
    }, [handleRefresh]) // 监听刷新事件，以便抽奖后也能更新（如果需要）

    return (
        <div className="grid grid-cols-3 gap-3 w-full">
            {awards.map((award, index) => (
                <div 
                    key={index} 
                    className="relative bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center min-h-[100px] hover:bg-white/10 transition-colors group"
                >
                    {/* 右上角显示概率标签 */}
                    <div className="absolute top-1 right-1 bg-yellow-400/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold">
                        {(award.awardRate * 100).toFixed(2)}%
                    </div>

                    {/* 奖品图标 (这里用 emoji 简单模拟，实际可用 Image) */}
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition-transform">
                        🎁
                    </div>

                    {/* 奖品名称 */}
                    <div className="text-white text-xs font-medium text-center line-clamp-2 px-1 leading-tight">
                        {award.awardTitle}
                    </div>
                </div>
            ))}
            
            {/* 假如不足9个，补齐空格子 (可选) */}
            {[...Array(Math.max(0, 9 - awards.length))].map((_, i) => (
                <div key={`empty-${i}`} className="bg-white/5 border border-white/5 rounded-xl opacity-30"></div>
            ))}
        </div>
    )
}