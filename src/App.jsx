import { useRef, useState ,useEffect} from "react";
import { Coins, Factory, Store, Leaf, Ship, Plane } from "lucide-react";
import "./glow.css";

export default function App() {
  const [coins, setCoins] = useState(()=>{
    const Data = localStorage.getItem("RTD")
    return Data ? JSON.parse(Data).coins :100 ;
  });

  const [empire, setEmpire] = useState(()=>{
    const Data = localStorage.getItem("RTD")
    return Data ? JSON.parse(Data).empire : {farm:0 , shop:0 , Factory:0,ship:0,airpot:0};
  })
  const [income,setIncome] = useState(()=>{
    const Data = localStorage.getItem("RTD")
    return Data ? JSON.parse(Data).income : 0;
  })
  const [data,setData] = useState(()=>{
    const Data = localStorage.getItem("RTD");
    return Data ? JSON.parse(Data).data : {
      farm : {income: 5 , cost : 50},
      Factory: {income:20 , cost:200},
      shop : {income:100 , cost:1000},
      ship : {income:10000 , cost:100000},
      airpot : {income:100000 , cost:1000000}
    }
  })


  useEffect(()=>{
    const ResourceTycoonData = {
      coins : coins , 
      empire : empire,
      income : income,
      data : data,
    }
    localStorage.setItem("RTD" , JSON.stringify(ResourceTycoonData))
  },[coins,empire,income,data])



  useEffect(() => {
    if (income <=0 ) return;
    const interval = setInterval(() => {
      setCoins(prev => prev + income)
    }, 1000);
  
    return () => clearInterval(interval); 
  }, [income]);


  const formatNumber = (n) => {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n;
  };
  

  const handlePurchase = (building) => {
    const { cost, income } = data[building];
    if(coins >= cost){
      const count = empire[building] + 1;
      
     
      setEmpire(prev => ({ ...prev, [building]: count }));
      setCoins(prev => prev - cost);
      setIncome(prev => prev + income);
      
     
      setData(prevData => ({...prevData , [building] : {...prevData[building] ,cost : Math.floor(cost * 1.35)}}))
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <div className="w-full max-w-2xl h-20 bg-gray-800 border-4 border-purple-600 shadow-[0_0_15px_#9d00ff] rounded-3xl flex items-center justify-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-purple-600 drop-shadow-[0_0_12px_rgba(125,10,225,0.8)]">
          Resource Tycoon
        </h1>
      </div>

      {/* Stats Panel */}
      <div className="bg-gray-800 px-8 py-3 md:py-0 gap-1 md:gap-0 w-full max-h-3xl max-w-2xl border-4  border-blue-500 shadow-[0_0_12px_#3b82f6] flex flex-col md:flex-row md:justify-between h-24 items-center rounded-3xl">
        <div className="flex items-center  gap-3">
          <Coins className="text-green-400" size={32} />
          <h2 className="text-3xl font-extrabold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
            {coins}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl italic font-semibold text-yellow-400">
            +{income} / sec
          </h2>
        </div>
      </div>

      {/* Shop Section */}
      <div className="flex flex-col w-full max-w-2xl p-4 gap-4 border-4 border-green-400 rounded-3xl shadow-[0_0_12px_rgba(0,255,0,0.7)]">
        <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-green-400 drop-shadow-[0_0_12px_rgba(0,255,19,0.8)]">
          🏪 Shop
        </h2>
        <button className="bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-80 
        shadow-2xl w-24 h-10 rounded-xl text-center p-1 text-white" onClick={()=>{
          setCoins(100)
          setIncome(0)
          setEmpire({farm:0 , shop:0 , Factory:0,ship:0,airpot:0})
          setData({
            farm : {income: 5 , cost : 50},
            Factory: {income:20 , cost:200},
            shop : {income:100 , cost:1000},
            ship : {income:10000 , cost:100000},
            airpot : {income:100000 , cost:1000000}
          })
        }}>Reset all</button>
        </div>

        {/* Shop Items */}
        <div className="space-y-3">
          <div className="bg-gray-700 flex justify-between items-center p-3 rounded-xl hover:scale-105 hover:shadow-[0_0_12px_#22c55e] transition">
            <span className="flex items-center gap-2">
              <Leaf className="text-green-400" /> Farm — Cost: {data.farm.cost} — +5/sec
            </span>
            <button className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg font-bold"
             onClick={()=> handlePurchase("farm")} disabled={coins < data.farm.cost} >
              Buy
            </button>
          </div>

          <div className="bg-gray-700 flex justify-between items-center p-3 rounded-xl hover:scale-105 hover:shadow-[0_0_12px_#3b82f6] transition">
            <span className="flex items-center gap-2">
              <Factory className="text-blue-400" /> Factory — Cost: {data.Factory.cost} — +20/sec
            </span>
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg font-bold" 
            onClick={()=> handlePurchase("Factory")}disabled={coins < data.Factory.cost}>
              Buy
            </button>
          </div>

          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(220,247,0,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Store className="text-yellow-400"  /> Shop — Cost: {data.shop.cost} — +100/sec
            </span>
            <button
              
              className="bg-yellow-600 px-4 py-1 transition-all 
              duration-75 hover:bg-yellow-700 rounded-lg font-bold cursor-pointer"
              onClick={()=> handlePurchase("shop")}
            disabled={coins < data.shop.cost}>
              Buy
            </button>
          </div>
          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(220,6,0,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Ship className="text-red-400"  /> Ship — Cost: {formatNumber(data.ship.cost)} — +10000/sec
            </span>
            <button
              
              className="bg-red-600 px-4 py-1 transition-all 
              duration-75 hover:bg-red-700 rounded-lg font-bold cursor-pointer"
              onClick={()=> handlePurchase("ship")}
           disabled={coins < data.ship.cost} >
              Buy
            </button>
          </div>
          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(140,12,100,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Plane className="text-purple-400"  /> Airpot — Cost: {formatNumber(data.airpot.cost)} — +{data.airpot.income}/sec
            </span>
            <button
              disabled={coins < data.airpot.cost}
              className={` px-4 py-1 ${coins < data.airpot.cost ? "bg-gray-500 opacity-70 cursor-not-allowed" : "cursor-pointer duration-75  bg-purple-600 hover:bg-purple-700 "} transition-all 
              rounded-lg font-bold `}
              onClick={()=> handlePurchase("airpot")}
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* Empire Section */}
      <div className="w-full max-w-2xl bg-gray-800 border-4 border-pink-500 rounded-3xl shadow-[0_0_12px_#ec4899] p-4">
        <h2 className="text-2xl font-bold mb-4 text-pink-400">
          📊 Your Empire
        </h2>
        <ul className="space-y-2">
          <li className="bg-gray-700 p-3 rounded-xl">🌾 Farms: {empire.farm} (+{empire.farm * 5}/sec)</li>
          <li className="bg-gray-700 p-3 rounded-xl">🏭 Factories: {empire.Factory} (+{empire.Factory * 20}/sec)</li>
          <li className="bg-gray-700 p-3 rounded-xl">🏬 Shops: {empire.shop} (+{empire.shop * 100}/sec) </li>
          <li className="bg-gray-700 p-3 rounded-xl">🚢 Ship: {empire.ship} (+ {empire.ship *10000}/sec)</li>
          <li className="bg-gray-700 p-3 rounded-xl">✈️ Airpot: {empire.airpot} (+ {empire.airpot * 1000000}/sec) </li>


        </ul>
      </div>

      {/* Milestones */}
      <div className="w-full max-w-2xl bg-gray-800 border-4 border-yellow-500 rounded-3xl shadow-[0_0_12px_#eab308] p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">🎉 Milestones</h2>
        <ul className="space-y-2">
          <li>🔓 Unlock Factory at 200 coins</li>
          <li>🔓 Unlock Shop at 1000 coins</li>
          <li>🏆 Achievement: First Farm Bought!</li>
        </ul>
      </div>
    </div>
  );
}
