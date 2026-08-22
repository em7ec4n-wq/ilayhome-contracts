export interface Contract {
  id: string;
  influencer_name: string;
  product_detail: string;
  product_value: number;
  content_count: number;
  content_type: string;
  platform: string;
  notes: string;
  status: "pending" | "signed" | "overdue";
  created_at: string;
  delivery_deadline: string;
}

export interface Signature {
  id: string;
  contract_id: string;
  full_name: string;
  instagram_username?: string;
  tc_no?: string;
  phone: string;
  email: string;
  address: string;
  signature_data: string;
  signed_at: string;
  ip_address: string;
}

export interface ContractWithSignature extends Contract {
  signatures: Signature | null;
}
