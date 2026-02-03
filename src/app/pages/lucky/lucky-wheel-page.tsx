"use client"

import React, { useEffect, useRef, useState } from 'react'
// @ts-ignore
import { LuckyWheel } from '@lucky-canvas/react'
import { queryRaffleAwardList, draw, queryUserActivityAccount } from '@/apis'
import { RaffleAwardVO } from "@/types/RaffleAwardVO";
import { UserActivityAccountVO } from "@/types/UserActivityAccountVO";

// @ts-ignore
// 【修改点1】：新增接收 onDrawTenTimes 回调
export function LuckyWheelPage({ handleRefresh, onWin, onDrawTenTimes }) {
    const [prizes, setPrizes] = useState<any[]>([])
    const myLucky = useRef<any>(null)
    const [drawLoading, setDrawLoading] = useState(false);
    const [dayCountSurplus, setDayCountSurplus] = useState(0);

    const [defaultConfig, setDefaultConfig] = useState({
        gutter: 0, 
        stopRange: 0, 
        speed: 12,
        offsetDegree: 0 
    })

    const [blocks] = useState([
        { padding: '10px', background: '#3b82f6' }, 
        { padding: '10px', background: '#ffffff' }, 
    ])

    const [buttons] = useState([
        { radius: '40%', background: '#dbeafe' }, 
        {
            radius: '35%', background: '#3b82f6',
            pointer: true,
            fonts: [{ text: 'START', top: '-10px', fontColor: '#ffffff', fontWeight: '800', fontSize: '18px' }]
        }
    ])

    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        
        try {
            const result = await queryRaffleAwardList(userId, activityId);
            const { code, data }: { code: string; data: RaffleAwardVO[] } = await result.json();
            
            if (code !== "0000") return;

            const angleOffset = 360 / data.length / 2;
            
            setDefaultConfig(prev => ({
                ...prev,
                offsetDegree: angleOffset
            }));

            const prizesData = data.map((award, index) => {
                const background = index % 2 === 0 ? '#ffffff' : '#f3f4f6'; 
                return {
                    background: background,
                    fonts: [{ 
                        id: String(award.awardId), 
                        text: award.awardTitle, 
                        top: '15px',
                        fontColor: '#3b82f6',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '16px',
                    }]
                };
            });
            setPrizes(prizesData)
        } catch (e) {
            console.error("Failed to load prizes", e);
        }
    }

    const queryUserAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        
        try {
            const result = await queryUserActivityAccount(userId, activityId);
            const { code, data }: { code: string; data: UserActivityAccountVO } = await result.json();
            if (code === "0000") {
                setDayCountSurplus(data.dayCountSurplus);
            }
        } catch (e) {
            console.error("Failed to load account info", e);
        }
    }

    const randomRaffleHandle = async () => {
        if(drawLoading) return -1;
        setDrawLoading(true);
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        try {
            const result = await draw(userId, activityId);
            const { code, info, data } = await result.json();
            if (code !== "0000") {
                window.alert("抽奖失败: " + info);
                setDrawLoading(false);
                return -1;
            }
            return data.awardIndex - 1;
        } catch (e) {
            setDrawLoading(false);
            return -1;
        }
    }

    // 【修改点2】：处理十连抽逻辑
    const handleDrawTenTimes = () => {
        if (dayCountSurplus < 10) {
            window.alert("剩余次数不足 10 次，无法进行十连抽！");
            return;
        }
        // 不再弹 alert，而是调用父组件传递的方法
        if (onDrawTenTimes) {
            onDrawTenTimes();
        }
    }

    useEffect(() => {
        queryRaffleAwardListHandle();
        queryUserAccountHandle(); 
    }, [])

    return (
        <div className="flex flex-col items-center">
            
            <div className="relative">
                <div 
                    className="absolute z-20 left-1/2 -translate-x-1/2" 
                    style={{
                        top: '-15px', 
                        width: '0', 
                        height: '0', 
                        borderLeft: '18px solid transparent', 
                        borderRight: '18px solid transparent',
                        borderTop: '36px solid #facc15', 
                        filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.2))'
                    }}
                ></div>

                <LuckyWheel
                    ref={myLucky}
                    width="360px"
                    height="360px"
                    blocks={blocks}
                    prizes={prizes}
                    buttons={buttons}
                    defaultConfig={defaultConfig}
                    onStart={() => {
                        myLucky.current.play()
                        setTimeout(() => {
                            randomRaffleHandle().then(prizeIndex => {
                                if (prizeIndex === -1) {
                                    myLucky.current.stop(0);
                                } else {
                                    myLucky.current.stop(prizeIndex);
                                }
                            });
                        }, 2000)
                    }}
                    onEnd={(prize: any) => {
                        setDrawLoading(false);
                        if(prize && prize.fonts) {
                            setTimeout(() => handleRefresh(), 500);
                            setTimeout(() => queryUserAccountHandle(), 500);
                            
                            if (onWin) {
                                onWin({
                                    name: prize.fonts[0].text,
                                    id: prize.fonts[0].id
                                });
                            }
                        }
                    }}
                />
            </div>

            <button 
                onClick={handleDrawTenTimes}
                className={`mt-8 w-80 font-bold py-3 px-6 rounded-full shadow-lg transform transition flex items-center justify-center gap-2 whitespace-nowrap
                    ${dayCountSurplus >= 10 
                        ? 'bg-[#22c55e] hover:bg-[#16a34a] hover:scale-105 text-white cursor-pointer' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }
                `}
            >
                <span>🎲</span> Draw Ten Times ({dayCountSurplus}/10)
            </button>
        </div>
    )
}