import {strategyArmory} from "@/apis";

export function StrategyArmory() {
    const strategyArmoryHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const strategyId = Number(queryParams.get('strategyId'));
        if (!strategyId){
            window.alert("Please add strategyId value at URL, i.e.：http://localhost:3000/?strategyId=100006")
            return;
        }
        const res = await strategyArmory(strategyId);
        const {code, info} = await res.json();
        if (code != "0000") {
            window.alert("Cannot armor raffle strategy! code:" + code + " info:" + info)
            return;
        }
    }

    return (
        <div
            className="px-6 py-2 mb-8 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{cursor: "pointer"}}
            onClick={strategyArmoryHandle}
        >
            装配抽奖
        </div>
    );
}