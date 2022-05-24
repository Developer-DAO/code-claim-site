/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface VestingInterface extends ethers.utils.Interface {
  functions: {
    "addOrUpdatePayee(address,uint256)": FunctionFragment;
    "addOrUpdatePayees(address[],uint256[])": FunctionFragment;
    "codeToken()": FunctionFragment;
    "duration()": FunctionFragment;
    "epoch(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "release()": FunctionFragment;
    "releasePeriod()": FunctionFragment;
    "released(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "shares(address)": FunctionFragment;
    "start()": FunctionFragment;
    "sweep()": FunctionFragment;
    "totalEpochs()": FunctionFragment;
    "totalReleased()": FunctionFragment;
    "totalShares()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "vestedAmount(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addOrUpdatePayee",
    values: [string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: "addOrUpdatePayees",
    values: [string[], BigNumberish[]],
  ): string;
  encodeFunctionData(functionFragment: "codeToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "duration", values?: undefined): string;
  encodeFunctionData(functionFragment: "epoch", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "release", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "releasePeriod",
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: "released", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: "shares", values: [string]): string;
  encodeFunctionData(functionFragment: "start", values?: undefined): string;
  encodeFunctionData(functionFragment: "sweep", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalEpochs",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "totalReleased",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "totalShares",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: "vestedAmount",
    values: [string],
  ): string;

  decodeFunctionResult(
    functionFragment: "addOrUpdatePayee",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOrUpdatePayees",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "codeToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "duration", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "epoch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "release", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "releasePeriod",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "released", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "shares", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalEpochs",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalReleased",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalShares",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "vestedAmount",
    data: BytesLike,
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "PayeeAddedOrUpdated(address,uint256)": EventFragment;
    "PaymentReleased(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PayeeAddedOrUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PaymentReleased"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type PayeeAddedOrUpdatedEvent = TypedEvent<
  [string, BigNumber] & { _payee: string; _shares: BigNumber }
>;

export type PaymentReleasedEvent = TypedEvent<
  [string, BigNumber] & { _payee: string; _amount: BigNumber }
>;

export class Vesting extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: VestingInterface;

  functions: {
    addOrUpdatePayee(
      _account: string,
      _shares: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    addOrUpdatePayees(
      _payees: string[],
      _shares: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    codeToken(overrides?: CallOverrides): Promise<[string]>;

    duration(overrides?: CallOverrides): Promise<[BigNumber]>;

    epoch(
      _period: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    release(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    releasePeriod(overrides?: CallOverrides): Promise<[BigNumber]>;

    released(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    shares(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    start(overrides?: CallOverrides): Promise<[BigNumber]>;

    sweep(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    totalEpochs(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalReleased(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalShares(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    vestedAmount(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
  };

  addOrUpdatePayee(
    _account: string,
    _shares: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  addOrUpdatePayees(
    _payees: string[],
    _shares: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  codeToken(overrides?: CallOverrides): Promise<string>;

  duration(overrides?: CallOverrides): Promise<BigNumber>;

  epoch(_period: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  release(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  releasePeriod(overrides?: CallOverrides): Promise<BigNumber>;

  released(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  shares(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  start(overrides?: CallOverrides): Promise<BigNumber>;

  sweep(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  totalEpochs(overrides?: CallOverrides): Promise<BigNumber>;

  totalReleased(overrides?: CallOverrides): Promise<BigNumber>;

  totalShares(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  vestedAmount(_account: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    addOrUpdatePayee(
      _account: string,
      _shares: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    addOrUpdatePayees(
      _payees: string[],
      _shares: BigNumberish[],
      overrides?: CallOverrides,
    ): Promise<void>;

    codeToken(overrides?: CallOverrides): Promise<string>;

    duration(overrides?: CallOverrides): Promise<BigNumber>;

    epoch(_period: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    release(overrides?: CallOverrides): Promise<void>;

    releasePeriod(overrides?: CallOverrides): Promise<BigNumber>;

    released(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    shares(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    sweep(overrides?: CallOverrides): Promise<void>;

    totalEpochs(overrides?: CallOverrides): Promise<BigNumber>;

    totalReleased(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    vestedAmount(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "PayeeAddedOrUpdated(address,uint256)"(
      _payee?: null,
      _shares?: null,
    ): TypedEventFilter<
      [string, BigNumber],
      { _payee: string; _shares: BigNumber }
    >;

    PayeeAddedOrUpdated(
      _payee?: null,
      _shares?: null,
    ): TypedEventFilter<
      [string, BigNumber],
      { _payee: string; _shares: BigNumber }
    >;

    "PaymentReleased(address,uint256)"(
      _payee?: null,
      _amount?: null,
    ): TypedEventFilter<
      [string, BigNumber],
      { _payee: string; _amount: BigNumber }
    >;

    PaymentReleased(
      _payee?: null,
      _amount?: null,
    ): TypedEventFilter<
      [string, BigNumber],
      { _payee: string; _amount: BigNumber }
    >;
  };

  estimateGas: {
    addOrUpdatePayee(
      _account: string,
      _shares: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    addOrUpdatePayees(
      _payees: string[],
      _shares: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    codeToken(overrides?: CallOverrides): Promise<BigNumber>;

    duration(overrides?: CallOverrides): Promise<BigNumber>;

    epoch(_period: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    release(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    releasePeriod(overrides?: CallOverrides): Promise<BigNumber>;

    released(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    shares(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    sweep(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    totalEpochs(overrides?: CallOverrides): Promise<BigNumber>;

    totalReleased(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    vestedAmount(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addOrUpdatePayee(
      _account: string,
      _shares: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    addOrUpdatePayees(
      _payees: string[],
      _shares: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    codeToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    duration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    epoch(
      _period: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    release(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    releasePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    released(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    shares(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    start(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sweep(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    totalEpochs(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalReleased(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalShares(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    vestedAmount(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
