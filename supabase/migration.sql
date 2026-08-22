-- Create contracts table
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_name TEXT NOT NULL,
  product_detail TEXT NOT NULL,
  product_value DECIMAL(10,2) NOT NULL,
  content_count INTEGER NOT NULL DEFAULT 1,
  content_type TEXT NOT NULL DEFAULT 'UGC Video',
  platform TEXT NOT NULL DEFAULT 'Instagram Reels',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'overdue')),
  delivery_deadline DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create signatures table
CREATE TABLE signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  tc_no TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  address TEXT NOT NULL,
  signature_data TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT DEFAULT 'unknown',
  UNIQUE(contract_id)
);

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Create policies: allow all operations with anon key (auth handled in API)
CREATE POLICY "Allow all on contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on signatures" ON signatures FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_signatures_contract_id ON signatures(contract_id);
