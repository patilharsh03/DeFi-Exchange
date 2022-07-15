import { Contract } from "ethers";
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS
} from "../constants";

export const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei,
    provider,
    ethSelected,
    ethBalance,
    reservedCD
) => {
    const exchangeContract = new Contract (
        EXCHANGE_CONTRACT_ABI,
        EXCHANGE_CONTRACT_ADDRESS,
        provider
    );
    let amountOfTokens;

    if (ethSelected) {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            ethBalance,
            reservedCD
        );
    } else {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCD,
            ethBalance
        );
    }
    return amountOfTokens;
}

export const swapTokens = async (
    signer,
    swapAmountWei,
    tokenToBeReceivedAfterSwap,
    ethSelected
) => {
    const exchangeContract = new Contract (
        EXCHANGE_CONTRACT_ABI,
        EXCHANGE_CONTRACT_ADDRESS,
        signer
    );
    const tokenContract = new Contract (
        TOKEN_CONTRACT_ABI,
        TOKEN_CONTRACT_ADDRESS,
        signer
    );
    let tx;
    if (ethSelected) {
        tx = await exchangeContract.ethToCryptoDevToken(
            tokenToBeReceivedAfterSwap,
            {
                value: swapAmountWei,
            }
        );
    } else {
        tx = await tokenContract.approve(
            EXCHANGE_CONTRACT_ADDRESS,
            swapAmountWei.toString()
        );
        await tx.wait();
        tx = await exchangeContract.cryptoDevTokenToEth(
            swapAmountWei,
            tokenToBeReceivedAfterSwap
        );
    }
    await tx.wait();
}