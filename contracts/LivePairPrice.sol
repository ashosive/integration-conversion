// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LivePairPrice {

    AggregatorV3Interface internal btcUsd;
    AggregatorV3Interface internal ethUsd;
    AggregatorV3Interface internal linkUsd;
    AggregatorV3Interface internal btcEth;

    constructor() {
        btcUsd = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
        ethUsd = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        linkUsd = AggregatorV3Interface(0xc59E3633BAAC79493d908e63626716e204A45EdF);
        btcEth = AggregatorV3Interface(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22);
    }

    function getLatestPrices() external view returns (int256, int256, int256, int256) {
        // Fetch the latest prices from Chainlink
        int256 btcUsdPrice = getLatestPrice(btcUsd);
        int256 ethUsdPrice = getLatestPrice(ethUsd);
        int256 linkUsdPrice = getLatestPrice(linkUsd);
        int256 btcEthPrice = getLatestPrice(btcEth);

        return (btcUsdPrice, ethUsdPrice, linkUsdPrice, btcEthPrice);
    }

    function getLatestPrice(AggregatorV3Interface _priceFeed) internal view returns (int256) {
        (, int256 price, , ,) = _priceFeed.latestRoundData();
        return price;
    }
}
