'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { X as CloseIcon } from 'lucide-react';
import { DeploySuccessModalProps } from '@/types/modals';

export default function DeploySuccessModal({
  isOpen,
  onClose,
  tokenData,
}: DeploySuccessModalProps) {
  // State for animation and modal visibility
  const [visible, setVisible] = useState(false);

  // Control body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal when escape key is pressed
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  // Don't render anything if modal isn't open
  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Fixed overlay - covers entire viewport */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop with blur - fully covers viewport */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal container - fixed positioning ensures it stays centered */}
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } transition-all duration-300 z-[101]`}
        >
          {/* Modal content */}
          <div className="relative w-full bg-[#0d0f17] rounded-xl border-4 border-[#87efac] overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 p-2 text-[#0d0f17] bg-[#87efac] hover:bg-[#87efac]/80 rounded-full z-20"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Success header */}
            <div className="bg-[#87efac] p-4 text-center">
              <h2 className="text-[#0d0f17] text-xl font-bold font-mono uppercase tracking-wider">
                CONGRATULATIONS DEGEN!
              </h2>
            </div>

            {/* Meme content */}
            <div className="p-6 text-center">
              {/* Success message */}
              <div className="mb-8">
                <div className="bg-[#1b1d28] rounded-lg p-5 mb-5 relative shadow-inner">
                  <h3 className="text-lg font-bold mb-3 text-white">
                    <span className="text-[#87efac]">${tokenData.symbol}</span>{' '}
                    HAS BEEN LAUNCHED! 🚀
                  </h3>

                  <p className="text-gray-300 text-sm">
                    You have successfully deployed a copy of {tokenData.name}!
                    <br />
                    <span className="text-[#87efac] font-semibold">
                      LFG! You&apos;re officially based now.
                    </span>
                  </p>
                </div>

                {/* Meme content */}
                <div className="my-6 space-y-4">
                  {/* Meme phrases */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl font-bold text-[#87efac]">
                      💎 HODL 💎
                    </div>
                    <div className="text-lg font-bold text-white">WAGMI</div>
                    <div className="px-4 py-2 rounded-lg bg-[#87efac]/10 text-[#87efac] font-mono text-base font-bold inline-block">
                      GM! Deploy More Tokens = More Lambos
                    </div>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="space-y-4">
                <Button
                  className="w-full bg-[#87efac] hover:bg-[#87efac]/90 text-[#0d0f17] font-bold py-3 h-auto text-base"
                  onClick={onClose}
                >
                  Deploy Another Token
                </Button>

                <div className="text-xs text-gray-500 mt-2">
                  Not financial advice. Always DYOR.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
