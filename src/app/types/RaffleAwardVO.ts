/**
 * 策略奖品值对象
 */
export interface RaffleAwardVO {
    awardId: number;
    awardTitle: string;
    awardSubtitle: string;
    sort: number;
    awardRuleLockCount: number;
    isAwardUnlock: boolean;
    waitUnlockCount: number;
    /**
     * 中奖概率 (0.00 - 1.00 或 百分比)
     * 后端返回示例: 0.25 (代表25%) 或 25
     */
    awardRate: number; 
}