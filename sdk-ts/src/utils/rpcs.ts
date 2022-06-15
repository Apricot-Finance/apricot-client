import { Commitment, Connection, ConnectionConfig } from '@solana/web3.js';
import invariant from 'tiny-invariant';
import { RPC } from '../types';
import { LogInfo } from './Logger';

export class RpcNode {
  public readonly rpc;
  public readonly url;
  private _connection: Connection | null;

  constructor(rpc: RPC, url: string) {
    this.rpc = rpc;
    invariant(url && typeof url === 'string', `Invalid url ${url} for RPC ${rpc}`);
    this.url = url;
    this._connection = null;
  }

  getConnection(commitmentOrConfig?: Commitment | ConnectionConfig) {
    if (!this._connection) {
      const _config = { commitment: 'confirmed' } as ConnectionConfig;
      if (commitmentOrConfig && typeof commitmentOrConfig !== 'object') {
        _config.commitment = commitmentOrConfig;
      } else if (commitmentOrConfig) {
        Object.assign(_config, commitmentOrConfig);
      }

      this._connection = new Connection(this.url, _config);
    }
    return this._connection;
  }
}

export const rpcNodes = [
  [
    RPC.Triton,
    (process.env.RPC_TRITON_URL as string) || 'https://apricot-main-67cd.mainnet.rpcpool.com/',
  ],
  [RPC.Serum, 'https://solana-api.projectserum.com'],
  [RPC.GenesysGo, 'https://apricot.genesysgo.net'],
]
  .map((a) => new RpcNode(a[0] as RPC, a[1]))
  .reduce<Record<RPC, RpcNode>>((pre, cur) => {
    pre[cur.rpc] = cur;
    return pre;
  }, {} as Record<RPC, RpcNode>);

// The connection here is intended to be used by the backend!
export const getRPCConnection = (
  rpcish?: RPC | string,
  commitmentOrConfig?: Commitment | ConnectionConfig,
) => {
  invariant(typeof window === 'undefined', `This function shouldn't be called in a browser!`);
  let node;
  if (rpcish) {
    for (const rpc in rpcNodes) {
      if (rpc === rpcish || new RegExp(rpc, 'i').test(rpcish as string)) {
        node = rpcNodes[rpc as RPC];
      }
    }
    invariant(node, `Can't get RPC connection per name: ${rpcish}`);
  } else {
    node = rpcNodes.Serum;
  }
  LogInfo(`RPC Node: ${node.rpc}, ${node.url}`);

  return node.getConnection(commitmentOrConfig);
};
