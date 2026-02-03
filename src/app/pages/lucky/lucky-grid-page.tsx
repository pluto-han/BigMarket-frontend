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
            if (code === "0000") {
                // 如果数据很多，只取前9个以保证九宫格样式
                setAwards(data.slice(0, 9));
            }
        } catch (e) {
            console.error("Failed to load awards", e);
        }
    }

    useEffect(() => {
        queryRaffleAwardListHandle();
    }, [handleRefresh])

    return (
        // 使用 CSS Grid 布局：3列，间距适中
        <div className="grid grid-cols-3 gap-3 w-full">
            {awards.map((award, index) => (
                <div 
                    key={index}
                    // 卡片样式：深色玻璃质感、圆角、悬停发光
                    className="group relative flex flex-col items-center justify-center p-3 h-28 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 cursor-default"
                >
                    {/* =================================================== */}
                    {/* 【核心代码】：右上角显示百分比 (概率)                 */}
                    {/* absolute定位 + 黄色字体 + 格式化小数                   */}
                    {/* =================================================== */}
                    <div className="absolute top-2 right-2 text-[10px] font-bold text-yellow-400 font-mono">
                        {/* 假设后端传的是 0.15，这里处理成 15.00% */}
                        {award.awardRate ? `${(award.awardRate * 100).toFixed(2)}%` : ''}
                    </div>

                    {/* 中间图标：礼物盒 Emoji */}
                    <div className="text-3xl mb-2 drop-shadow-md filter group-hover:-translate-y-1 transition-transform">
                        🎁
                    </div>

                    {/* 底部名称：白色文字，最多显示两行 */}
                    <div className="text-white text-[11px] font-bold text-center leading-tight px-1 line-clamp-2 h-8 flex items-center justify-center">
                        {award.awardTitle}
                    </div>
                </div>
            ))}
            
            {/* 自动补齐逻辑：如果不足9个，渲染透明占位符，保持九宫格形状 */}
            {[...Array(Math.max(0, 9 - awards.length))].map((_, index) => (
                 <div key={`empty-${index}`} className="h-28 rounded-xl border border-white/5 bg-white/[0.02]"></div>
            ))}
        </div>
    )
}