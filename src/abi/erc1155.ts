import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type ApprovalForAll0Event = ([account: string, operator: string, approved: boolean] & {account: string, operator: string, approved: boolean})

export type Create0Event = ([_creator: string, _account: string, _id: ethers.BigNumber, _initialSupply: ethers.BigNumber, _maxSupply: ethers.BigNumber, _fractionalized: boolean] & {_creator: string, _account: string, _id: ethers.BigNumber, _initialSupply: ethers.BigNumber, _maxSupply: ethers.BigNumber, _fractionalized: boolean})

export type CreatorGaveUpControl0Event = ([id: ethers.BigNumber, creator: string] & {id: ethers.BigNumber, creator: string})

export type Lock0Event = ([id: ethers.BigNumber, supply: ethers.BigNumber] & {id: ethers.BigNumber, supply: ethers.BigNumber})

export type RoleAdminChanged0Event = ([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})

export type RoleGranted0Event = ([role: string, account: string, sender: string] & {role: string, account: string, sender: string})

export type RoleRevoked0Event = ([role: string, account: string, sender: string] & {role: string, account: string, sender: string})

export type SecondarySaleFee0Event = ([id: ethers.BigNumber, recipient: string, value: ethers.BigNumber] & {id: ethers.BigNumber, recipient: string, value: ethers.BigNumber})

export type TransferBatch0Event = ([operator: string, from: string, to: string, ids: Array<ethers.BigNumber>, values: Array<ethers.BigNumber>] & {operator: string, from: string, to: string, ids: Array<ethers.BigNumber>})

export type TransferSingle0Event = ([operator: string, from: string, to: string, id: ethers.BigNumber, value: ethers.BigNumber] & {operator: string, from: string, to: string, id: ethers.BigNumber, value: ethers.BigNumber})

export type URI0Event = ([value: string, id: ethers.BigNumber] & {value: string, id: ethers.BigNumber})

export interface EvmLog {
  data: string;
  topics: string[];
}

function decodeEvent(signature: string, data: EvmLog): any {
  return abi.decodeEventLog(
    abi.getEvent(signature),
    data.data || "",
    data.topics
  );
}

export const events = {
  "ApprovalForAll(address,address,bool)": {
    topic: abi.getEventTopic("ApprovalForAll(address,address,bool)"),
    decode(data: EvmLog): ApprovalForAll0Event {
      return decodeEvent("ApprovalForAll(address,address,bool)", data)
    }
  }
  ,
  "Create(address,address,uint256,uint256,uint256,bool)": {
    topic: abi.getEventTopic("Create(address,address,uint256,uint256,uint256,bool)"),
    decode(data: EvmLog): Create0Event {
      return decodeEvent("Create(address,address,uint256,uint256,uint256,bool)", data)
    }
  }
  ,
  "CreatorGaveUpControl(uint256,address)": {
    topic: abi.getEventTopic("CreatorGaveUpControl(uint256,address)"),
    decode(data: EvmLog): CreatorGaveUpControl0Event {
      return decodeEvent("CreatorGaveUpControl(uint256,address)", data)
    }
  }
  ,
  "Lock(uint256,uint256)": {
    topic: abi.getEventTopic("Lock(uint256,uint256)"),
    decode(data: EvmLog): Lock0Event {
      return decodeEvent("Lock(uint256,uint256)", data)
    }
  }
  ,
  "RoleAdminChanged(bytes32,bytes32,bytes32)": {
    topic: abi.getEventTopic("RoleAdminChanged(bytes32,bytes32,bytes32)"),
    decode(data: EvmLog): RoleAdminChanged0Event {
      return decodeEvent("RoleAdminChanged(bytes32,bytes32,bytes32)", data)
    }
  }
  ,
  "RoleGranted(bytes32,address,address)": {
    topic: abi.getEventTopic("RoleGranted(bytes32,address,address)"),
    decode(data: EvmLog): RoleGranted0Event {
      return decodeEvent("RoleGranted(bytes32,address,address)", data)
    }
  }
  ,
  "RoleRevoked(bytes32,address,address)": {
    topic: abi.getEventTopic("RoleRevoked(bytes32,address,address)"),
    decode(data: EvmLog): RoleRevoked0Event {
      return decodeEvent("RoleRevoked(bytes32,address,address)", data)
    }
  }
  ,
  "SecondarySaleFee(uint256,address,uint256)": {
    topic: abi.getEventTopic("SecondarySaleFee(uint256,address,uint256)"),
    decode(data: EvmLog): SecondarySaleFee0Event {
      return decodeEvent("SecondarySaleFee(uint256,address,uint256)", data)
    }
  }
  ,
  "TransferBatch(address,address,address,uint256[],uint256[])": {
    topic: abi.getEventTopic("TransferBatch(address,address,address,uint256[],uint256[])"),
    decode(data: EvmLog): TransferBatch0Event {
      return decodeEvent("TransferBatch(address,address,address,uint256[],uint256[])", data)
    }
  }
  ,
  "TransferSingle(address,address,address,uint256,uint256)": {
    topic: abi.getEventTopic("TransferSingle(address,address,address,uint256,uint256)"),
    decode(data: EvmLog): TransferSingle0Event {
      return decodeEvent("TransferSingle(address,address,address,uint256,uint256)", data)
    }
  }
  ,
  "URI(string,uint256)": {
    topic: abi.getEventTopic("URI(string,uint256)"),
    decode(data: EvmLog): URI0Event {
      return decodeEvent("URI(string,uint256)", data)
    }
  }
  ,
}


function decodeFunction(data: string): any {
  return abi.decodeFunctionData(data.slice(0, 10), data)
}

export const functions = {
}

interface ChainContext  {
  _chain: Chain
}

interface BlockContext  {
  _chain: Chain
  block: Block
}

interface Block  {
  height: number
}

interface Chain  {
  client:  {
    call: <T=any>(method: string, params?: unknown[]) => Promise<T>
  }
}

export class Contract  {
  private readonly _chain: Chain
  private readonly blockHeight: number
  readonly address: string

  constructor(ctx: BlockContext, address: string)
  constructor(ctx: ChainContext, block: Block, address: string)
  constructor(ctx: BlockContext, blockOrAddress: Block | string, address?: string) {
    this._chain = ctx._chain
    if (typeof blockOrAddress === 'string')  {
      this.blockHeight = ctx.block.height
      this.address = ethers.utils.getAddress(blockOrAddress)
    }
    else  {
      assert(address != null)
      this.blockHeight = blockOrAddress.height
      this.address = ethers.utils.getAddress(address)
    }
  }

  async ADMIN_ROLE(): Promise<string> {
    return this.call("ADMIN_ROLE", [])
  }

  async DEFAULT_ADMIN_ROLE(): Promise<string> {
    return this.call("DEFAULT_ADMIN_ROLE", [])
  }

  async MINTER_ROLE(): Promise<string> {
    return this.call("MINTER_ROLE", [])
  }

  async OWNER_ROLE(): Promise<string> {
    return this.call("OWNER_ROLE", [])
  }

  async VERSION(): Promise<string> {
    return this.call("VERSION", [])
  }

  async balanceOf(account: string, id: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("balanceOf", [account, id])
  }

  async balanceOfBatch(accounts: Array<string>, ids: Array<ethers.BigNumber>): Promise<Array<ethers.BigNumber>> {
    return this.call("balanceOfBatch", [accounts, ids])
  }

  async decimals(): Promise<number> {
    return this.call("decimals", [])
  }

  async exists(_id: ethers.BigNumber): Promise<boolean> {
    return this.call("exists", [_id])
  }

  async fractionalized(_id: ethers.BigNumber): Promise<boolean> {
    return this.call("fractionalized", [_id])
  }

  async getRoleAdmin(role: string): Promise<string> {
    return this.call("getRoleAdmin", [role])
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    return this.call("hasRole", [role, account])
  }

  async idMode(): Promise<number> {
    return this.call("idMode", [])
  }

  async initialized(): Promise<boolean> {
    return this.call("initialized", [])
  }

  async isApprovedForAll(_owner: string, _operator: string): Promise<boolean> {
    return this.call("isApprovedForAll", [_owner, _operator])
  }

  async maxSupply(_id: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("maxSupply", [_id])
  }

  async name(): Promise<string> {
    return this.call("name", [])
  }

  async proxyRegistry(): Promise<string> {
    return this.call("proxyRegistry", [])
  }

  async royaltyInfo(_tokenId: ethers.BigNumber, _salePrice: ethers.BigNumber): Promise<([receiver: string, royaltyAmount: ethers.BigNumber] & {receiver: string, royaltyAmount: ethers.BigNumber})> {
    return this.call("royaltyInfo", [_tokenId, _salePrice])
  }

  async isProxy(_address: string, _operator: string): Promise<boolean> {
    return this.call("isProxy", [_address, _operator])
  }

  async cap(_id: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("cap", [_id])
  }

  async contractURI(): Promise<string> {
    return this.call("contractURI", [])
  }

  async secondarySaleFee(id: ethers.BigNumber): Promise<([recipient: string, value: ethers.BigNumber] & {recipient: string, value: ethers.BigNumber})> {
    return this.call("secondarySaleFee", [id])
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    return this.call("supportsInterface", [interfaceId])
  }

  async symbol(): Promise<string> {
    return this.call("symbol", [])
  }

  async token(arg0: ethers.BigNumber): Promise<([totalSupply: ethers.BigNumber, maxSupply: ethers.BigNumber, creator: string, locked: boolean] & {totalSupply: ethers.BigNumber, maxSupply: ethers.BigNumber, creator: string, locked: boolean})> {
    return this.call("token", [arg0])
  }

  async tokenURIPostfix(): Promise<string> {
    return this.call("tokenURIPostfix", [])
  }

  async tokenURIPrefix(): Promise<string> {
    return this.call("tokenURIPrefix", [])
  }

  async totalSupply(_id: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("totalSupply", [_id])
  }

  async uri(_id: ethers.BigNumber): Promise<string> {
    return this.call("uri", [_id])
  }

  async uriScheme(_id: ethers.BigNumber): Promise<string> {
    return this.call("uriScheme", [_id])
  }

  private async call(name: string, args: any[]) : Promise<any> {
    const fragment = abi.getFunction(name)
    const data = abi.encodeFunctionData(fragment, args)
    const result = await this._chain.client.call('eth_call', [{to: this.address, data}, this.blockHeight])
    const decoded = abi.decodeFunctionResult(fragment, result)
    return decoded.length > 1 ? decoded : decoded[0]
  }
}

function getJsonAbi(): any {
  return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "minter",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_contractURI",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_tokenURIPrefix",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_tokenURIPostfix",
          "type": "string"
        },
        {
          "internalType": "enum HasTokenURI.IDMode",
          "name": "_idMode",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_fractionalized",
          "type": "bool"
        }
      ],
      "name": "Create",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "CreatorGaveUpControl",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supply",
          "type": "uint256"
        }
      ],
      "name": "Lock",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "SecondarySaleFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MINTER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "OWNER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VERSION",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "fractionalized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "idMode",
      "outputs": [
        {
          "internalType": "enum HasTokenURI.IDMode",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isOperator",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "maxSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxyRegistry",
      "outputs": [
        {
          "internalType": "contract ProxyRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_salePrice",
          "type": "uint256"
        }
      ],
      "name": "royaltyInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "royaltyAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isProxy",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "cap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "secondarySaleFee",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "internalType": "struct HasSecondarySaleFee.Fee",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "token",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxSupply",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "locked",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenURIPostfix",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenURIPrefix",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "uriScheme",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
