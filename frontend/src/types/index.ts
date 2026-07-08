export type Role = 'Producer' | 'Processor' | 'Distributor' | 'Retailer' | 'Auditor' | 'Admin';

export interface Actor {
  id: string;
  address: string;
  role: Role;
  name: string;
  contactInfo?: string;
  kycStatus: string;
  active: boolean;
  createdAt: string;
}

export interface ChainEvent {
  id: string;
  batchChainId: string;
  fromAddr: string;
  toAddr: string;
  fromActor?: Actor;
  toActor?: Actor;
  location: string;
  docHash?: string;
  docIpfsCid?: string;
  docIpfsUrl?: string;
  txHash?: string;
  ledger?: number;
  eventTimestamp: string;
}

export interface Batch {
  id: string;
  chainId: string;
  producerAddr: string;
  producer?: Actor;
  metadataHash: string;
  metadata?: Record<string, unknown>;
  qrCodePath?: string;
  currentHolder: string;
  createdAt: string;
  events: ChainEvent[];
}

export interface PrepareResponse {
  unsignedXdr: string;
  metadataHash: string;
  ipfsCids: string[];
}

export interface TransferPrepareResponse {
  unsignedXdr: string;
  docHash?: string;
  docIpfsCid?: string;
}
