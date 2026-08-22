import { NextRequest, NextResponse } from 'next/server';
import { signContract } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      contract_id, 
      full_name, 
      instagram_username, 
      selected_product, 
      product_value, 
      tc_no, 
      phone, 
      email, 
      address, 
      signature_data 
    } = body;

    if (!contract_id || !full_name || !tc_no || !phone || !address || !signature_data) {
      return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const result = await signContract({
      contract_id,
      full_name,
      instagram_username,
      selected_product,
      product_value,
      tc_no,
      phone,
      email: email || '',
      address,
      signature_data,
      ip_address: ip
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('API Sign POST error:', error);
    return NextResponse.json({ error: error.message || 'Sözleşme imzalanırken bir hata oluştu.' }, { status: 500 });
  }
}
