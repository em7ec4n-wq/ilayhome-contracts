import { Contract, Signature, ContractWithSignature } from './types';

interface DatabaseSchema {
  contracts: Contract[];
  signatures: Signature[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'em7ec4n-wq/ilayhome-contracts';
const DB_FILE_PATH = 'data/db.json';

// In-memory fallback cache
let memoryDb: DatabaseSchema = {
  contracts: [],
  signatures: []
};

// Helper to fetch db.json from GitHub
async function getDb(): Promise<{ data: DatabaseSchema; sha?: string }> {
  if (!GITHUB_TOKEN) {
    return { data: memoryDb };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { data: memoryDb };
    }

    const json = await res.json();
    const content = Buffer.from(json.content, 'base64').toString('utf-8');
    const parsed: DatabaseSchema = JSON.parse(content);
    memoryDb = parsed;
    return { data: parsed, sha: json.sha };
  } catch (error) {
    console.error('Error fetching DB from GitHub:', error);
    return { data: memoryDb };
  }
}

// Helper to save db.json to GitHub with automatic sha refresh
async function saveDb(data: DatabaseSchema): Promise<boolean> {
  memoryDb = data;

  if (!GITHUB_TOKEN) {
    return true;
  }

  try {
    // Always fetch latest SHA to prevent 409 conflict
    let currentSha: string | undefined;
    const check = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store'
    });
    
    if (check.ok) {
      const checkJson = await check.json();
      currentSha = checkJson.sha;
    }

    const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update contracts database [skip ci]',
        content: contentBase64,
        sha: currentSha
      })
    });

    return res.ok;
  } catch (error) {
    console.error('Error saving DB to GitHub:', error);
    return false;
  }
}

export async function getContracts(): Promise<ContractWithSignature[]> {
  const { data } = await getDb();
  
  // Check and update overdue status
  const today = new Date().toISOString().split('T')[0];
  let changed = false;

  const result: ContractWithSignature[] = data.contracts.map(contract => {
    if (contract.status === 'pending' && contract.delivery_deadline < today) {
      contract.status = 'overdue';
      changed = true;
    }
    const signature = data.signatures.find(s => s.contract_id === contract.id) || null;
    return {
      ...contract,
      signatures: signature
    };
  });

  if (changed) {
    await saveDb(data);
  }

  // Sort newest first
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getContractById(id: string): Promise<ContractWithSignature | null> {
  const { data } = await getDb();

  const contract = data.contracts.find(c => c.id === id);
  const signature = data.signatures.find(s => s.contract_id === id) || null;

  if (contract) {
    return {
      ...contract,
      signatures: signature
    };
  }

  // Fallback for new signing session if not created in admin
  return {
    id: id,
    influencer_name: '',
    product_detail: 'Çift Kişilik Uyku Seti',
    product_value: 2450,
    content_count: 1,
    content_type: 'UGC Video',
    platform: 'Instagram Reels & TikTok',
    notes: 'İlay Home Barter İş Birliği Sözleşmesi',
    status: 'pending',
    delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    signatures: signature
  };
}

export async function createContract(params: {
  influencer_name: string;
  product_detail: string;
  product_value: number;
  content_count?: number;
  content_type?: string;
  platform?: string;
  notes?: string;
}): Promise<Contract> {
  const { data } = await getDb();

  // 7 business days from now
  const date = new Date();
  let addedDays = 0;
  while (addedDays < 7) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      addedDays++;
    }
  }
  const delivery_deadline = date.toISOString().split('T')[0];

  const newContract: Contract = {
    id: 'c_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    influencer_name: params.influencer_name,
    product_detail: params.product_detail,
    product_value: params.product_value || 2450,
    content_count: params.content_count || 1,
    content_type: params.content_type || 'UGC Video',
    platform: params.platform || 'Instagram Reels & TikTok',
    notes: params.notes || '',
    status: 'pending',
    delivery_deadline,
    created_at: new Date().toISOString(),
  };

  data.contracts.unshift(newContract);
  await saveDb(data);
  return newContract;
}

export async function signContract(params: {
  contract_id: string;
  full_name: string;
  instagram_username?: string;
  selected_product?: string;
  product_value?: number;
  tc_no?: string;
  phone: string;
  email: string;
  address: string;
  signature_data: string;
  ip_address: string;
}): Promise<{ success: boolean; contract: Contract; signature: Signature }> {
  const { data } = await getDb();
  
  let contract = data.contracts.find(c => c.id === params.contract_id);

  // If contract doesn't exist yet (e.g. signed directly from /sozlesme), create it!
  if (!contract) {
    const date = new Date();
    let addedDays = 0;
    while (addedDays < 7) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        addedDays++;
      }
    }

    contract = {
      id: params.contract_id,
      influencer_name: params.full_name,
      product_detail: params.selected_product || 'Çift Kişilik Uyku Seti',
      product_value: params.product_value || 2450,
      content_count: 1,
      content_type: 'UGC Video',
      platform: 'Instagram Reels & TikTok',
      notes: `Instagram: @${(params.instagram_username || '').replace(/^@/, '')}`,
      status: 'signed',
      delivery_deadline: date.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    data.contracts.unshift(contract);
  } else {
    // Update existing
    contract.status = 'signed';
    contract.influencer_name = params.full_name;
    if (params.selected_product) {
      contract.product_detail = params.selected_product;
    }
  }

  // Create signature record
  const newSignature: Signature = {
    id: 's_' + Math.random().toString(36).substring(2, 9),
    contract_id: params.contract_id,
    full_name: params.full_name,
    instagram_username: params.instagram_username || '',
    tc_no: params.tc_no,
    phone: params.phone,
    email: params.email,
    address: params.address,
    signature_data: params.signature_data,
    signed_at: new Date().toISOString(),
    ip_address: params.ip_address,
  };

  // Remove previous signature for this contract if any
  data.signatures = data.signatures.filter(s => s.contract_id !== params.contract_id);
  data.signatures.unshift(newSignature);

  await saveDb(data);
  return { success: true, contract, signature: newSignature };
}

export async function deleteContract(id: string): Promise<boolean> {
  const { data } = await getDb();
  data.contracts = data.contracts.filter(c => c.id !== id);
  data.signatures = data.signatures.filter(s => s.contract_id !== id);
  return await saveDb(data);
}
