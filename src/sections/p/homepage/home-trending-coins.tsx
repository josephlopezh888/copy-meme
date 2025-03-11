'use client';

import { useState, useEffect, useRef } from 'react';
import { CoinData } from '@/types/coin';
import DeploySuccessModal from './deploy-success-modal';
import { SectionHeader } from '@/components/trending/section-header';
import { SortingControls } from '@/components/trending/sorting-controls';
import { CoinGrid } from '@/components/trending/coin-grid';
import { CoinMobileList } from '@/components/trending/coin-mobile-list';
import { mockCoins } from '@/data/mock';
import { DeployedTokenData } from '@/types/tokens';

export default function HomeTrendingCoins() {
  // State for coins and UI
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isVisible, setIsVisible] = useState(false);
  const [animatedRows, setAnimatedRows] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // States for deployment and success modal
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [deployedTokenData, setDeployedTokenData] = useState<DeployedTokenData>({
    name: '',
    symbol: '',
    contractAddress: '',
    raydiumUrl: '',
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  // Check if mobile view based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tabletten küçük ekranlarda mobil görünüm
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load initial data
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        // In a real implementation, we would fetch from an API
        // For now, we're using the mock data from our data/mock.ts file
        setCoins(mockCoins);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    };

    fetchTrendingCoins();
    setAnimatedRows(new Array(mockCoins.length).fill(false));

    // Stagger row animations
    const timer = setTimeout(() => {
      mockCoins.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedRows((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 100);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle refresh action with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setAnimatedRows(new Array(coins.length).fill(false));

    // First hide all rows
    setTimeout(() => {
      // Sort coins and then show them again in sequence
      const shuffled = [...coins].sort(() => Math.random() - 0.5);
      setCoins(shuffled);

      // Animate rows back in with delay
      shuffled.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedRows((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });

          // Mark refresh as complete after last animation
          if (index === shuffled.length - 1) {
            setIsRefreshing(false);
          }
        }, index * 100);
      });
    }, 300);
  };

  // Handle coin copy/deploy
  const handleCopy = (selectedCoin: CoinData) => {
    setSelectedCoin(selectedCoin);
    setIsDeploying(true);

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);

      // Prepare the deployed token data
      setDeployedTokenData({
        name: `Copy ${selectedCoin.title}`,
        symbol: `C${selectedCoin.ticker}`,
        contractAddress: `7XkWXye6hVbGRDLbU6iYEHpyGedHhbXVR3zFobRnMeGq${Math.floor(Math.random() * 10000)}`,
        raydiumUrl: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=C${selectedCoin.ticker}`,
      });

      // Show success modal
      setDeploymentSuccess(true);
    }, 3000);
  };

  // Close success modal
  const closeSuccessModal = () => {
    setDeploymentSuccess(false);
    setSelectedCoin(null);
  };

  // Handle sorting
  const handleSort = (sortColumn: string) => {
    // Reset row animations first
    setAnimatedRows(new Array(coins.length).fill(false));

    if (sortBy === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortColumn);
      setSortDirection('desc'); // Default to descending on new column
    }

    // Re-animate rows after sorting
    setTimeout(() => {
      coins.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedRows((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 80);
      });
    }, 50);
  };

  // Sort the coins based on current sort settings
  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortBy) return 0;

    let comparison = 0;
    if (sortBy === 'marketCap') {
      // Extract numeric value from market cap string (removing $ and M)
      const aValue = parseFloat(a.marketCap.replace(/[$M]/g, ''));
      const bValue = parseFloat(b.marketCap.replace(/[$M]/g, ''));
      comparison = aValue - bValue;
    } else if (sortBy === 'replies') {
      comparison = a.replies - b.replies;
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'ticker') {
      comparison = a.ticker.localeCompare(b.ticker);
    } else if (sortBy === 'lastTrade') {
      // Simple string comparison for demo
      comparison = a.lastTrade.localeCompare(b.lastTrade);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <section
      id="trending-coins"
      ref={sectionRef}
      className={`py-8 md:py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative">
        {/* Background elements */}
        <div className="absolute -right-20 top-10 w-40 h-40 bg-[#87efac]/5 rounded-full blur-[80px] z-0 hidden sm:block"></div>
        <div className="absolute -left-20 bottom-10 w-40 h-40 bg-[#ebb305]/5 rounded-full blur-[80px] z-0 hidden sm:block"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Section header */}
          <SectionHeader
            title="Trending Coins on Pump.fun"
            description="Discover and copy the hottest tokens"
            coinCount={coins.length}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* Sorting controls */}
          <SortingControls
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Responsive coins display - Mobile view or Desktop Grid with same card design */}
          {isMobile ? (
            <CoinMobileList
              coins={sortedCoins}
              animatedRows={animatedRows}
              isDeploying={isDeploying}
              selectedCoin={selectedCoin}
              onCopy={handleCopy}
            />
          ) : (
            <CoinGrid
              coins={sortedCoins}
              animatedRows={animatedRows}
              isDeploying={isDeploying}
              selectedCoin={selectedCoin}
              onCopy={handleCopy}
            />
          )}
        </div>
      </div>

      {/* Deployment Success Modal */}
      <DeploySuccessModal
        isOpen={deploymentSuccess}
        onClose={closeSuccessModal}
        tokenData={{
          name: deployedTokenData.name,
          symbol: deployedTokenData.symbol,
          contractAddress: deployedTokenData.contractAddress,
          raydiumUrl: deployedTokenData.raydiumUrl,
        }}
      />
    </section>
  );
}
