import React, { useEffect, useState } from 'react';
import contract from './contract/contracts/LivePairPrice.sol/LivePairPrice.json';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typography, Radio, RadioGroup, FormControlLabel, CircularProgress } from '@mui/material';

const contractAddress = '0x374fc50458690e2E683d0C4E5266bd72Eab9e73e';
const abi = contract.abi;

const App = () => {
  const [selectedPair, setSelectedPair] = useState('btcUsd');
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({
    btcUsd: null,
    ethUsd: null,
    linkUsd: null,
    btcEth: null,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true);

        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          const result = await contractInstance.getLatestPrices();

          setPrices({
            btcUsd: result[0].toString(),
            ethUsd: result[1].toString(),
            linkUsd: result[2].toString(),
            btcEth: result[3].toString(),
          });
        } catch (error) {
          console.error('Error fetching prices:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    fetchPrices();
  }, [selectedPair]);

  const formatPrice = (price) => {
    const decimals = selectedPair === 'btcEth' ? 18 : 8;
    return ethers.utils.formatUnits(price, decimals);
  };

  return (
      <div className="container mt-5">
        <div className="card p-4 shadow" style={{ backgroundColor: '#87CEEB', transition: 'background-color 0.5s' }}>
          <Typography variant="h4" className="mb-4">
            Live Conversion Prices
          </Typography>
          <RadioGroup row value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)} className="mb-4">
            <FormControlLabel value="btcUsd" control={<Radio />} label="Bitcoin/USD" />
            <FormControlLabel value="ethUsd" control={<Radio />} label="ETH/USD" />
            <FormControlLabel value="linkUsd" control={<Radio />} label="LINK/USD" />
            <FormControlLabel value="btcEth" control={<Radio />} label="Bitcoin/ETH" />
          </RadioGroup>
          <div className="row">
            {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <CircularProgress />
                </div>
            ) : prices[selectedPair] !== null ? (
                <div className="text-center">
                  <Typography variant="h5" className="font-weight-bold mb-4">
                    {selectedPair.toUpperCase()} Conversion:
                  </Typography>
                  <Typography variant="h6">
                    1 {selectedPair.toUpperCase().slice(0, -3)} = {formatPrice(prices[selectedPair])}{' '}
                    {selectedPair.toUpperCase().substring(selectedPair.length - 3)}
                  </Typography>
                </div>
            ) : (
                <Typography variant="h6" className="text-center">
                  No data available.
                </Typography>
            )}
          </div>
        </div>
      </div>
  );
};

export default App;
