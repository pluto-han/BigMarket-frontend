import { useEffect, useState } from "react";
import { SkuProductResponseDTO } from "@/types/SkuProductResponseDTO";
import { creditPayExchangeSku, querySkuProductListByActivityId } from "@/apis";

// @ts-ignore
export function SkuProduct({ handleRefresh, onClose }) { // <--- 1. 新增 onClose 接收
    const [skuList, setSkuList] = useState<SkuProductResponseDTO[]>([]);

    const querySkuProductListByActivityIdHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const activityId = Number(queryParams.get('activityId'));
        if (!activityId) return;

        try {
            const result = await querySkuProductListByActivityId(activityId);
            const { code, data }: { code: string; data: SkuProductResponseDTO[] } = await result.json();
            if (code === "0000") {
                setSkuList(data); 
            }
        } catch (e) {
            console.error("加载商品失败", e);
        }
    }

    const creditPayExchangeSkuHandle = async (sku: number) => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        
        try {
            const result = await creditPayExchangeSku(userId, sku);
            const { code, info } = await result.json();
            
            if (code !== "0000") {
                window.alert("兑换失败: " + info);
                return;
            }
            
            // --- 核心修复开始 ---
            
            // 2. 先关闭弹窗，提升体验
            if (onClose) onClose();

            // 3. 延时 500ms 再刷新数据
            // 解决了 "My Credit 更新了但 Draw Times 没变" 的问题
            setTimeout(() => {
                handleRefresh();
            }, 500);

            // --- 核心修复结束 ---

        } catch (e) {
            console.error("兑换异常", e);
        }
    }

    useEffect(() => {
        querySkuProductListByActivityIdHandle();
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skuList.map((product, index) => (
                <div 
                    key={index}
                    className="relative group overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{
                        background: 'linear-gradient(135deg, #7062e0 0%, #5a49ce 100%)',
                        boxShadow: '0 8px 32px rgba(90, 73, 206, 0.25)'
                    }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="text-3xl font-black text-yellow-300 mb-4 drop-shadow-sm">
                            {product.activityCount.dayCount} Times
                        </div>

                        <div className="flex items-center gap-4 w-full justify-center">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm border border-white/10">
                                {product.productAmount}$
                            </div>

                            <button 
                                onClick={() => creditPayExchangeSkuHandle(product.sku)}
                                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7M17 13l1.4 7M9 21h6"></path></svg>
                                Redeem
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}