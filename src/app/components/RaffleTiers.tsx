import React, { useEffect, useState } from "react";
import { queryRaffleStrategyRuleWeight } from "@/apis";
import { StrategyRuleWeightVO } from "@/types/StrategyRuleWeightVO";

// @ts-ignore
export function RaffleTiers({ onClose }) {
    const [ruleWeights, setRuleWeights] = useState<StrategyRuleWeightVO[]>([]);

    const queryRuleWeightHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        
        try {
            const result = await queryRaffleStrategyRuleWeight(userId, activityId);
            const { code, data }: { code: string; data: StrategyRuleWeightVO[] } = await result.json();
            if (code === "0000" && data) {
                // ==========================================================
                // 【核心修改】：按 ruleWeightCount (所需次数) 从小到大排序
                // 这样抽 10 次的 Tier 会排在抽 60 次的 Tier 前面
                // ==========================================================
                const sortedData = data.sort((a, b) => a.ruleWeightCount - b.ruleWeightCount);
                setRuleWeights(sortedData);
            }
        } catch (e) {
            console.error("Failed to load raffle tiers", e);
        }
    }

    useEffect(() => {
        queryRuleWeightHandle();
    }, [])

    return (
        <div className="space-y-6">
            {ruleWeights.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No raffle tiers configured for this activity.</div>
            ) : (
                ruleWeights.map((rule, index) => {
                    // 计算进度百分比，最大 100%
                    const progress = Math.min(100, (rule.userActivityAccountTotalUseCount / rule.ruleWeightCount) * 100);
                    
                    return (
                        <div key={index} className="bg-[#1e1e1e] rounded-2xl p-6 border border-white/10 shadow-lg">
                            {/* 标题栏 */}
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-yellow-400">✨</span> Raffle Tier {index + 1}
                                </h4>
                                <span className="text-sm font-mono text-gray-300">
                                    {rule.userActivityAccountTotalUseCount}/{rule.ruleWeightCount} Draws
                                </span>
                            </div>

                            {/* 进度条 */}
                            <div className="w-full bg-gray-700 h-3 rounded-full mb-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#3b82f6]"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            {/* 必中奖品范围 */}
                            <div className="text-sm text-gray-400 mb-3 font-medium">Guaranteed Prize Range</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {rule.strategyAwards.map((award, idx) => (
                                    <div key={idx} className="bg-[#2a2a2a] border border-white/5 p-3 rounded-lg flex items-center gap-3">
                                        <span className="text-yellow-400 font-bold text-lg font-mono">#{idx + 1}</span>
                                        <span className="text-gray-200 text-sm font-medium truncate" title={award.awardTitle}>
                                            {award.awardTitle}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}