import { ArrowUpRight, Users, CheckCircle2, DollarSign, Clock, Hourglass } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-10 pb-20 md:pb-0">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Saved Card */}
        <div className="bg-[#1C1C1E] p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:bg-[#222224] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6">
            <DollarSign size={20} className="text-white" />
          </div>
          <p className="text-[#A1A1AA] text-sm font-medium mb-2">Total Saved</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-semibold font-sora tracking-tight text-white">$1000</h3>
            <div className="flex items-center gap-1 text-[#4ADE80] text-xs font-semibold">
              <span>+200%</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Active Pools Card */}
        <div className="bg-[#1C1C1E] p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:bg-[#222224] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6">
            <Users size={20} className="text-white" />
          </div>
          <p className="text-[#A1A1AA] text-sm font-medium mb-2">Active Pools</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-semibold font-sora tracking-tight text-white">8</h3>
            <div className="flex items-center gap-1 text-[#4ADE80] text-xs font-semibold">
              <span>+200%</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Next Payout Card */}
        <div className="bg-[#1C1C1E] p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:bg-[#222224] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6">
            <div className="relative">
              <DollarSign size={16} className="text-white absolute -top-1 -right-1" />
              <div className="w-5 h-4 border-2 border-white rounded-sm mt-1"></div>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-sm font-medium mb-2">Next Payout</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-semibold font-sora tracking-tight text-white">$50</h3>
            <div className="flex items-center gap-1 text-[#4ADE80] text-xs font-semibold">
              <span>+200%</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Completed Circles Card */}
        <div className="bg-[#1C1C1E] p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:bg-[#222224] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <p className="text-[#A1A1AA] text-sm font-medium mb-2">Completed Circles</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-semibold font-sora tracking-tight text-white">12</h3>
            <div className="flex items-center gap-1 text-[#4ADE80] text-xs font-semibold">
              <span>+200%</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Savings Section */}
      <div>
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold font-sora text-white shrink-0">Active savings</h2>
          <div className="ml-4 h-[1px] bg-[#ffffff1a] w-full"></div>
        </div>

        <div className="space-y-4">
          {/* Active Savings Card 1: Family savings */}
          <div className="bg-[#212124] p-6 md:p-8 rounded-[24px]">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <h3 className="text-xl font-bold text-white font-sora tracking-wide">Family savings</h3>
                  <span className="px-2.5 py-1 text-[10px] font-medium bg-[#ffffff1a] text-[#ffffff] rounded-full uppercase tracking-wider">Your turn</span>
                </div>
                <p className="text-[#888888] text-xs ml-6">Created by Emeka</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Members</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Users size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">2</span>
                </div>
              </div>
              
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Contributions</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <DollarSign size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">3 USDT</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Duration</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">2 Days</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Current Rounds</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Hourglass size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">1/3</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#ffffff0f] shrink-0">
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors text-center">
                Make Contribution (50 USDT)
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#5E686A] hover:bg-[#4d5658] text-white text-sm font-medium rounded-lg transition-colors text-center ml-auto sm:ml-0 md:ml-auto">
                Claim Reward
              </button>
            </div>
          </div>

          {/* Active Savings Card 2: School fees */}
          <div className="bg-[#212124] p-6 md:p-8 rounded-[24px]">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <h3 className="text-xl font-bold text-white font-sora tracking-wide">School fees</h3>
                </div>
                <p className="text-[#888888] text-xs ml-6">Created by Emmanuel</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Members</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Users size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">6</span>
                </div>
              </div>
              
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Contributions</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <DollarSign size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">40 USDT</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Duration</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">12 Days</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Current Rounds</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Hourglass size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">3/4</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#ffffff0f]">
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors text-center">
                Make Contribution (2 USDT)
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#78787B] hover:bg-[#636366] text-[#E0E0E0] text-sm font-medium rounded-lg transition-colors text-center ml-auto sm:ml-0 md:ml-auto">
                Claim Reward
              </button>
            </div>
          </div>

          {/* Active Savings Card 3: Family savings 2 */}
          <div className="bg-[#212124] p-6 md:p-8 rounded-[24px]">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <h3 className="text-xl font-bold text-white font-sora tracking-wide">Family savings</h3>
                  <span className="px-2.5 py-1 text-[10px] font-medium bg-[#ffffff1a] text-[#ffffff] rounded-full uppercase tracking-wider">Your turn</span>
                </div>
                <p className="text-[#888888] text-xs ml-6">Created by Emeka</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Members</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Users size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">2</span>
                </div>
              </div>
              
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Contributions</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <DollarSign size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">30 USDT</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Duration</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">2 Days</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Current Rounds</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Hourglass size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">1/3</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#ffffff0f]">
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors text-center">
                Make Contribution (5 USDT)
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors text-center ml-auto sm:ml-0 md:ml-auto">
                Claim Reward
              </button>
            </div>
          </div>
          
           {/* Active Savings Card 4: School fees 2 */}
          <div className="bg-[#212124] p-6 md:p-8 rounded-[24px]">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <h3 className="text-xl font-bold text-white font-sora tracking-wide">School fees</h3>
                </div>
                <p className="text-[#888888] text-xs ml-6">Created by Emmanuel</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Members</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Users size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">4</span>
                </div>
              </div>
              
              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Contributions</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <DollarSign size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">40 USDT</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Duration</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">12 Days</span>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1AA] text-sm font-medium mb-2">Current Rounds</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#ffffff0f] flex items-center justify-center shrink-0">
                    <Hourglass size={16} className="text-[#A1A1AA]" />
                  </div>
                  <span className="text-xl font-semibold text-white">2/5</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#ffffff0f]">
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors text-center">
                Make Contribution (10 USDT)
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[#78787B] hover:bg-[#636366] text-[#E0E0E0] text-sm font-medium rounded-lg transition-colors text-center ml-auto sm:ml-0 md:ml-auto">
                Claim Reward
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
