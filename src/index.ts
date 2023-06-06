import {
  NetworkName,
} from "@aptos-labs/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { Types } from "aptos";
// import { TxnBuilderTypes, Types } from "aptos";
import { WelldonePluginProvider } from "./injected-welldone";


interface WelldoneWindow extends Window {
  welldone_aptos?: WelldonePluginProvider;
}

declare const window: WelldoneWindow;

export const WelldoneWalletName = "WELLDONE" as WalletName<"WELLDONE">;

export class WelldoneWallet implements AdapterPlugin {
  readonly name = WelldoneWalletName;
  readonly url =
    "https://chrome.google.com/webstore/detail/welldone-wallet-for-multi/bmkakpenjmcpfhhjadflneinmhboecjf";
  readonly icon =
    "data:image/png;base64,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";
  readonly providerName = 'welldone_aptos';

  provider: WelldonePluginProvider | undefined =
    typeof window !== "undefined" && window.dapp ? window.welldone_aptos : undefined;

  constructor () {
    if (typeof window != 'undefined' && window.dapp) {
      window.welldone_aptos = new WelldonePluginProvider();
    }
  }

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${WelldoneWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${WelldoneWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      // if ((response as AptosWalletErrorResult).code) {
      //   throw new Error((response as AptosWalletErrorResult).message);
      // }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  /*
  // TODO: signTransaction
  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Uint8Array | null> {
    try {
      const response = await this.provider?.signTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response;
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
  */

  /*
  async signAndSubmitBCSTransaction(
    transaction: TxnBuilderTypes.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
  */

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${WelldoneWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${WelldoneWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${WelldoneWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: {
        networkName: NetworkInfo;
      }): Promise<void> => {
        callback({
          name: newNetwork.networkName.name,
          chainId: newNetwork.networkName.chainId,
          api: newNetwork.networkName.url,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
}
