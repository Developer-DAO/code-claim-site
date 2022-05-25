/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ClaimCODE, ClaimCODEInterface } from "../ClaimCODE";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimPeriodEnds",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_codeToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Address0Error",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "InitError",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_claimant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "MerkleRootChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "Sweep",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "claimPeriodEnds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "codeToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "isClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "setMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
    ],
    name: "sweep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_proof",
        type: "bytes32[]",
      },
      {
        internalType: "bytes32",
        name: "_leaf",
        type: "bytes32",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b506040516110aa3803806110aa83398101604081905261002f916100d3565b61003833610083565b6000805460ff60a01b191690556001600160a01b03811661006c576040516324560b2960e11b815260040160405180910390fd5b6003919091556001600160a01b0316608052610110565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100e657600080fd5b825160208401519092506001600160a01b038116811461010557600080fd5b809150509250929050565b608051610f716101396000396000818161019c015281816102a5015261090d0152610f716000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80638456cb591161008c578063972a2a6211610066578063972a2a62146101be5780639a114cb2146101e85780639e34070f146101fb578063f2fde38b1461022c57600080fd5b80638456cb591461016a5780638da5cb5b14610172578063904d20221461019757600080fd5b80635c975abb116100c85780635c975abb1461012857806366deac4714610146578063715018a61461014f5780637cb647591461015757600080fd5b806301681a62146100ef5780632eb4a7ab146101045780633f4ba83a14610120575b600080fd5b6101026100fd366004610d23565b61023f565b005b61010d60025481565b6040519081526020015b60405180910390f35b6101026104a5565b600054600160a01b900460ff165b6040519015158152602001610117565b61010d60035481565b610102610509565b610102610165366004610d53565b61056d565b61010261063c565b6000546001600160a01b03165b6040516001600160a01b039091168152602001610117565b61017f7f000000000000000000000000000000000000000000000000000000000000000081565b6101d16101cc366004610db8565b61069e565b604080519215158352602083019190915201610117565b6101026101f6366004610e04565b6106ee565b610136610209366004610d53565b600881901c60009081526001602081905260409091205460ff9092161b16151590565b61010261023a366004610d23565b61099a565b6000546001600160a01b0316331461029e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b60008190507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826001600160a01b03161480156102e657506003544211155b1561031d576040517f72c38d2900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b806001600160a01b031663a9059cbb61033e6000546001600160a01b031690565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b038516906370a082319060240160206040518083038186803b15801561039657600080fd5b505afa1580156103aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ce9190610e50565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561042c57600080fd5b505af1158015610440573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104649190610e69565b506040516001600160a01b03831681527f807273efecfbeb7ae7d3a2189d1ed5a7db80074eed86e7d80b10bb925cd1db739060200160405180910390a15050565b6000546001600160a01b031633146104ff5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610295565b610507610a7c565b565b6000546001600160a01b031633146105635760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610295565b6105076000610b3d565b6000546001600160a01b031633146105c75760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610295565b60025415610601576040517fb071c0a400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60028190556040518181527f1b930366dfeaa7eb3b325021e4ae81e36527063452ee55b86c95f85b36f4c31c9060200160405180910390a150565b6000546001600160a01b031633146106965760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610295565b610507610ba5565b6000806106e2858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250506002549150869050610c55565b91509150935093915050565b600054600160a01b900460ff16156107485760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152606401610295565b6040517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b166020820152603481018490526000906054016040516020818303038152906040528051906020012090506000806107a985858561069e565b91509150816107e4576040517f09bde33900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61080b81600881901c60009081526001602081905260409091205460ff9092161b16151590565b15610842576040517f646cf55800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60035442111561087e576040517f4f184b7e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600881901c6000908152600160208190526040909120805460ff84169290921b909117905560405186815233907f47cee97cb7acd717b3c0aa1435d004cd5b3c8c57d70dbceb4e4458bbd60e39d49060200160405180910390a26040517fa9059cbb000000000000000000000000000000000000000000000000000000008152336004820152602481018790527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a9059cbb90604401602060405180830381600087803b15801561095957600080fd5b505af115801561096d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109919190610e69565b50505050505050565b6000546001600160a01b031633146109f45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610295565b6001600160a01b038116610a705760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610295565b610a7981610b3d565b50565b600054600160a01b900460ff16610ad55760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152606401610295565b600080547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600054600160a01b900460ff1615610bff5760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152606401610295565b600080547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610b203390565b6000808281805b8751811015610d1757610c70600283610eba565b91506000888281518110610c8657610c86610ed9565b60200260200101519050808411610cc8576040805160208101869052908101829052606001604051602081830303815290604052805190602001209350610d04565b6040805160208101839052908101859052606001604051602081830303815290604052805190602001209350600183610d019190610f08565b92505b5080610d0f81610f20565b915050610c5c565b50941495939450505050565b600060208284031215610d3557600080fd5b81356001600160a01b0381168114610d4c57600080fd5b9392505050565b600060208284031215610d6557600080fd5b5035919050565b60008083601f840112610d7e57600080fd5b50813567ffffffffffffffff811115610d9657600080fd5b6020830191508360208260051b8501011115610db157600080fd5b9250929050565b600080600060408486031215610dcd57600080fd5b833567ffffffffffffffff811115610de457600080fd5b610df086828701610d6c565b909790965060209590950135949350505050565b600080600060408486031215610e1957600080fd5b83359250602084013567ffffffffffffffff811115610e3757600080fd5b610e4386828701610d6c565b9497909650939450505050565b600060208284031215610e6257600080fd5b5051919050565b600060208284031215610e7b57600080fd5b81518015158114610d4c57600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000816000190483118215151615610ed457610ed4610e8b565b500290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60008219821115610f1b57610f1b610e8b565b500190565b6000600019821415610f3457610f34610e8b565b506001019056fea2646970667358221220f4279228aabaac1b10861b33c563fe2f0a0d9ba79ad8872e9d42631d7826bae964736f6c63430008090033";

export class ClaimCODE__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _claimPeriodEnds: BigNumberish,
    _codeToken: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ClaimCODE> {
    return super.deploy(
      _claimPeriodEnds,
      _codeToken,
      overrides || {},
    ) as Promise<ClaimCODE>;
  }
  getDeployTransaction(
    _claimPeriodEnds: BigNumberish,
    _codeToken: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(
      _claimPeriodEnds,
      _codeToken,
      overrides || {},
    );
  }
  attach(address: string): ClaimCODE {
    return super.attach(address) as ClaimCODE;
  }
  connect(signer: Signer): ClaimCODE__factory {
    return super.connect(signer) as ClaimCODE__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ClaimCODEInterface {
    return new utils.Interface(_abi) as ClaimCODEInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): ClaimCODE {
    return new Contract(address, _abi, signerOrProvider) as ClaimCODE;
  }
}
