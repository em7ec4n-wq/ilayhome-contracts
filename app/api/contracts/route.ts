import { NextRequest, NextResponse } from 'next/server';
import { getContracts, getContractById, createContract, deleteContract } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to check admin auth
function checkAdminAuth(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'ilayhome2024';
  
  // Support both header formats
  const xAdminPwd = req.headers.get('x-admin-password');
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const password = xAdminPwd || bearerToken;

  if (!password || password !== adminPassword) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const contract = await getContractById(id);
      if (!contract) {
        return NextResponse.json({ error: 'Sözleşme bulunamadı.' }, { status: 404 });
      }
      return NextResponse.json(contract);
    } else {
      // Admin check
      if (!checkAdminAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const contracts = await getContracts();
      return NextResponse.json(contracts);
    }
  } catch (error: any) {
    console.error('API Contracts GET error:', error);
    return NextResponse.json({ error: error.message || 'Hata oluştu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { influencer_name, product_detail, product_value, content_count, content_type, platform, notes } = body;

    if (!influencer_name || !product_detail) {
      return NextResponse.json({ error: 'Influencer adı ve ürün detayı zorunludur.' }, { status: 400 });
    }

    const created = await createContract({
      influencer_name,
      product_detail,
      product_value: product_value || 2450,
      content_count: content_count || 1,
      content_type: content_type || 'UGC Video',
      platform: platform || 'Instagram Reels & TikTok',
      notes: notes || '',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('API Contracts POST error:', error);
    return NextResponse.json({ error: error.message || 'Hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contract ID required' }, { status: 400 });
    }

    await deleteContract(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Contracts DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Hata oluştu' }, { status: 500 });
  }
}
