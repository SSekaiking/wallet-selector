import type { NetworkId } from "@near-wallet-selector/core";
import { HereWallet } from "@here-wallet/core";
import type BN from "bn.js";

import type { SelectorInit } from "./types";

export const initHereWallet: SelectorInit = async (config) => {
  const { store, logger, emitter, options, defaultProvider, defaultStrategy } =
    config;

  const here = new HereWallet({
    networkId: options.network.networkId as NetworkId,
    nodeUrl: options.network.nodeUrl,
    defaultProvider,
    defaultStrategy,
  });

  return {
    get networkId() {
      return here.networkId;
    },

    async account(id) {
      logger.log("HereWallet:account");
      return await here.account(id);
    },

    async switchAccount(id) {
      logger.log("HereWallet:switchAccount");
      await here.switchAccount(id);
    },

    async getAccountId() {
      logger.log("HereWallet:getAccountId");
      return await here.getAccountId();
    },

    async isSignedIn() {
      logger.log("HereWallet:isSignedIn");
      return await here.isSignedIn();
    },

    async signIn(data) {
      logger.log("HereWallet:signIn");

      const account = await here.signIn(data);
      emitter.emit("signedIn", {
        contractId: data.contractId,
        methodNames: data.methodNames ?? [],
        accounts: [{ accountId: account }],
      });

      return [{ accountId: account }];
    },

    async getHereBalance() {
      logger.log("HereWallet:getHereBalance");
      return await here.getHereBalance();
    },

    async getAvailableBalance(): Promise<BN> {
      logger.log("HereWallet:getAvailableBalance");
      return await here.getAvailableBalance();
    },

    async signOut() {
      logger.log("HereWallet:signOut");
      await here.signOut();
    },

    async getAccounts() {
      logger.log("HereWallet:getAccounts");
      const accounts = await here.getAccounts();
      return accounts.map((accountId) => ({ accountId }));
    },

    async signAndSendTransaction(data) {
      logger.log("HereWallet:signAndSendTransaction", data);

      const { contract } = store.getState();
      if (!here.isSignedIn || !contract) {
        throw new Error("Wallet not signed in");
      }

      return await here.signAndSendTransaction({
        receiverId: contract.contractId,
        ...data,
      });
    },

    async verifyOwner() {
      logger.log("HereWallet:verifyOwner");
      throw new Error("verifyOwner is not support");
    },

    async signMessage({ signerId, message }) {
      logger.log("HereWallet:signMessage", { signerId, message });
      return await here.signMessage({
        signerId: signerId ?? (await here.getAccountId()),
        message,
      });
    },

    async signAndSendTransactions(data) {
      logger.log("HereWallet:signAndSendTransactions", data);
      return await here.signAndSendTransactions(data);
    },
  };
};
