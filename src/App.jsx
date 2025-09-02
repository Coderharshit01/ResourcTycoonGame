import { useMemo, useState, useEffect } from "react";
import { Coins, Factory, Store, Leaf, Ship, Plane, X ,Diamond} from "lucide-react";
import { achievementlist } from "./achievements";
import {  motion } from "framer-motion";

export default function App() {
 

  const defaultEmpire = { farm: 0, shop: 0, casino: 0, Factory: 0, ship: 0, airpot: 0 };

  const defaultData = {
    farm: { income: 5, cost: 50 },
    Factory: { income: 20, cost: 200 },
    shop: { income: 100, cost: 1000 },
    casino: { income: 1000, cost: 10000 },
    ship: { income: 10000, cost: 100000 },
    airpot: { income: 100000, cost: 1000000 }
  };
  

  const [achievements, setachievements] = useState(() => {
    const savedData = localStorage.getItem("RTD");
    let savedAchievements = [];
  try {
    const parsed = savedData ? JSON.parse(savedData) : null;
    savedAchievements = parsed?.achievements || [];
  } catch (err) {
    console.error("Invalid localStorage data, resetting achievements", err);
  }
  
    return achievementlist.map(a => {
      const saved = savedAchievements.find(s => s.id === a.id);
      return { ...a, unlocked: saved?.unlocked || false };
    });
  });


  const [popup, setPopup] = useState(null)
  const [coins, setCoins] = useState(() => {
    const Data = localStorage.getItem("RTD")
    return Data ? JSON.parse(Data).coins : 100;
  });

  const [empire, setEmpire] = useState(() => {
    const Data = localStorage.getItem("RTD")
   const savedEmpire = Data ? JSON.parse(Data).empire : {};
   return {...defaultEmpire,...savedEmpire}
  })
  const [income, setIncome] = useState(() => {
    const Data = localStorage.getItem("RTD")
    return Data ? JSON.parse(Data).income : 0;
  })
  const [data, setData] = useState(() => {
    const Data = localStorage.getItem("RTD");
    const savedData =  Data ? JSON.parse(Data).data : {};
    return {...defaultData,...savedData}
  })

  useEffect(() => {
    setachievements(prev =>
      prev.map((a) => {
        const state = { coins, empire, income, achievements: prev }; // use latest prev
        if (!a.unlocked && a.requirement(state)) {
          setPopup(a);
          return { ...a, unlocked: true };
        }
        return a;
      })
    );
  }, [coins, empire, income]);
  

  useEffect(() => {
    const ResourceTycoonData = {
      coins: coins,
      empire: empire,
      income: income,
      data: data,
      achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
    }
    localStorage.setItem("RTD", JSON.stringify(ResourceTycoonData))
  }, [coins, empire, income, data,achievements])



  useEffect(() => {
    if (income <= 0) return;
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
    if (coins >= cost) {
      const count = empire[building] + 1;


      setEmpire(prev => ({ ...prev, [building]: count }));
      setCoins(prev => prev - cost);
      setIncome(prev => prev + income);


      setData(prevData => ({ ...prevData, [building]: { ...prevData[building], cost: Math.floor(cost * 1.35) } }))
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
            {formatNumber(coins)}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl italic font-semibold text-yellow-400">
            +{formatNumber(income)} / sec
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
        shadow-2xl w-24 h-10 rounded-xl text-center p-1 text-white" onClick={() => {
              setCoins(100)
              setIncome(0)
              setEmpire(defaultEmpire)
              setData(defaultData)
              setachievements(achievementlist)
            }}>Reset all</button>
        </div>

        {/* Shop Items */}
        <div className="space-y-3">
          <div className="bg-gray-700 flex justify-between items-center p-3 rounded-xl hover:scale-105 hover:shadow-[0_0_12px_#22c55e] transition">
            <span className="flex items-center gap-2">
              <Leaf className="text-green-400" /> Farm — Cost: {formatNumber(data.farm.cost)} — +5/sec
            </span>
            <button className={` ${coins < data.farm.cost ? "bg-gray-600 opacity-80 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 cursor-pointer"} px-4 py-1 rounded-lg font-bold`}
              onClick={() => handlePurchase("farm")} disabled={coins < data.farm.cost} >
              Buy
            </button>
          </div>

          <div className="bg-gray-700 flex justify-between items-center p-3 rounded-xl hover:scale-105 hover:shadow-[0_0_12px_#3b82f6] transition">
            <span className="flex items-center gap-2">
              <Factory className="text-blue-400" /> Factory — Cost: {formatNumber(data.Factory.cost)} — +20/sec
            </span>
            <button className={` ${coins < data.Factory.cost ? "bg-gray-600 cursor-not-allowed opacity-80" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} px-4 py-1 rounded-lg font-bold`}
              onClick={() => handlePurchase("Factory")} disabled={coins < data.Factory.cost}>
              Buy
            </button>
          </div>

          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(220,247,0,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Store className="text-yellow-400" /> Shop — Cost: {formatNumber(data.shop.cost)} — +100/sec
            </span>
            <button

              className={` px-4 py-1 transition-all 
               ${coins < data.shop.cost ? "bg-gray-600 opacity-80 cursor-not-allowed" : 
               "bg-yellow-600 duration-75 hover:bg-yellow-700 cursor-pointer "}
               rounded-lg font-bold `}
              onClick={() => handlePurchase("shop")}
              disabled={coins < data.shop.cost}>
              Buy
            </button>
          </div>
          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(220,0,110,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Diamond className="text-pink-400" /> Casino — Cost: {formatNumber(data.casino.cost)} — +{data.casino.income}/sec
            </span>
            <button

              className={` px-4 py-1 transition-all 
               ${coins < data.casino.cost ? "bg-gray-600 opacity-80 cursor-not-allowed" : 
               "bg-pink-600 duration-75 hover:bg-pink-700 cursor-pointer "}
               rounded-lg font-bold `}
              onClick={() => handlePurchase("casino")}
              disabled={coins < data.casino.cost}>
              Buy
            </button>
          </div>
          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(220,6,0,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Ship className="text-red-400" /> Ship — Cost: {formatNumber(data.ship.cost)} — +10000/sec
            </span>
            <button

              className={` px-4 py-1 transition-all ${coins < data.ship.cost ? "bg-gray-600 cursor-not-allowed opacity-80" : "bg-red-600 duration-75 hover:bg-red-700 cursor-pointer "}
              rounded-lg font-bold `}
              onClick={() => handlePurchase("ship")}
              disabled={coins < data.ship.cost} >
              Buy
            </button>
          </div>
          <div className="bg-gray-700 flex justify-between items-center p-3 
          rounded-xl hover:scale-105 hover:shadow-[0px_0px_14px_rgba(140,12,100,0.8)] duration-75 ">
            <span className="flex items-center gap-2">
              <Plane className="text-purple-400" /> Airpot — Cost: {formatNumber(data.airpot.cost)} — +{data.airpot.income}/sec
            </span>
            <button
              disabled={coins < data.airpot.cost}
              className={` px-4 py-1 ${coins < data.airpot.cost ? "bg-gray-600 opacity-80 cursor-not-allowed" : "cursor-pointer duration-75  bg-purple-600 hover:bg-purple-700 "} transition-all 
              rounded-lg font-bold `}
              onClick={() => handlePurchase("airpot")}
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
          <li className="bg-gray-700 p-3 rounded-xl"> 🂡  Casino: {empire.casino} (+{empire.casino * 1000}/sec) </li>
          <li className="bg-gray-700 p-3 rounded-xl">🚢 Ship: {empire.ship} (+ {empire.ship * 10000}/sec)</li>
          <li className="bg-gray-700 p-3 rounded-xl">✈️ Airpot: {empire.airpot} (+ {empire.airpot * 1000000}/sec) </li>


        </ul>
      </div>
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"  onClick={() => setPopup(null)} >
          <motion.div 
          className="relative bg-gray-800 w-80 h-44 py-3 px-2 border-4 border-yellow-500 
          shadow-[0px_5px_12px_rgba(250,250,50,0.8)] rounded-2xl text-center " 
          onClick={(e)=> e.stopPropagation()}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.5, scale: 0.8 }}
          transition={{ ease: "easeIn", duration: 0.5 }}
          >
            <h1 className="text-green-500 drop-shadow-[0px_3px_10px_rgba(0,250,0,1)] text-xl bg-transparent">New Achievement !!</h1>
          <X className="absolute top-2 right-2 w-8 h-6 cursor-pointer" onClick={()=> setPopup(null)}/>
       
           <div className="flex flex-col gap-4 items-center justify-center p-6">
           <h2 className="text-2xl font-bold text-yellow-400">{popup.title}</h2>
            <p className="text-gray-300">{popup.desc}</p>
           </div>
          </motion.div>
        </div>
      )}
      {/* Milestones */}
      <div className="w-full max-w-2xl bg-gray-800 border-4 border-yellow-500 rounded-3xl shadow-[0_0_12px_#eab308] p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">🎉 Milestones</h2>
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li key={a.id} className={`p-2 mb-2 rounded ${a.unlocked ? "bg-green-700" : "bg-gray-700"}`}>
              <span className="font-bold">{a.title}</span> - {a.unlocked ? "Unlocked ✅" : "Locked 🔒"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
