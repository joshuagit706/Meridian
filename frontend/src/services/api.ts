import type { Actor, Batch, PrepareResponse, TransferPrepareResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getAuthHeadersNoContentType(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
      else if (data?.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function getBatch(id: string): Promise<Batch> {
  const res = await fetch(`${BASE_URL}/batches/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Batch>(res);
}

export async function getActors(role?: string): Promise<Actor[]> {
  const url = role
    ? `${BASE_URL}/actors?role=${encodeURIComponent(role)}`
    : `${BASE_URL}/actors`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse<Actor[]>(res);
}

export async function getMyBatches(): Promise<Batch[]> {
  const res = await fetch(`${BASE_URL}/batches/mine`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Batch[]>(res);
}

export async function registerActor(data: {
  address: string;
  role: string;
  name: string;
  contactInfo?: string;
}): Promise<Actor> {
  const res = await fetch(`${BASE_URL}/actors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Actor>(res);
}

export async function prepareBatch(formData: FormData): Promise<PrepareResponse> {
  const res = await fetch(`${BASE_URL}/batches/prepare`, {
    method: 'POST',
    headers: getAuthHeadersNoContentType(),
    body: formData,
  });
  return handleResponse<PrepareResponse>(res);
}

export async function submitBatch(data: {
  signedXdr: string;
  metadataHash: string;
  metadata: object;
  ipfsCids: string[];
}): Promise<Batch> {
  const res = await fetch(`${BASE_URL}/batches/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Batch>(res);
}

export async function prepareTransfer(
  batchId: string,
  formData: FormData
): Promise<TransferPrepareResponse> {
  const res = await fetch(`${BASE_URL}/batches/${batchId}/transfer/prepare`, {
    method: 'POST',
    headers: getAuthHeadersNoContentType(),
    body: formData,
  });
  return handleResponse<TransferPrepareResponse>(res);
}

export async function submitTransfer(
  batchId: string,
  data: {
    signedXdr: string;
    toAddress: string;
    location: string;
    docHash?: string;
    docIpfsCid?: string;
  }
): Promise<void> {
  const res = await fetch(`${BASE_URL}/batches/${batchId}/transfer/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  await handleResponse<void>(res);
}

export async function getChallenge(address: string): Promise<{ challenge: string }> {
  const res = await fetch(
    `${BASE_URL}/auth/challenge?address=${encodeURIComponent(address)}`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return handleResponse<{ challenge: string }>(res);
}

export async function verifySignature(
  address: string,
  challenge: string,
  signedXdr: string
): Promise<{ token: string; actor: Actor }> {
  const res = await fetch(`${BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, challenge, signedXdr }),
  });
  return handleResponse<{ token: string; actor: Actor }>(res);
}
