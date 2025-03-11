import React from 'react';
import { CoinCard } from './coin-card';
import { CoinGridProps } from '@/types/trending';

export const CoinGrid: React.FC<CoinGridProps> = ({
  coins,
  animatedRows,
  isDeploying,
  selectedCoin,
  onCopy,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 sm:px-0">
      {coins.map((coin, index) => (
        <CoinCard
          key={coin.ticker}
          coin={coin}
          index={index}
          isAnimated={animatedRows[index]}
          isDeploying={isDeploying}
          selectedCoinTicker={selectedCoin?.ticker}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}; 