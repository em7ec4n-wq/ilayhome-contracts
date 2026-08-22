import { getSupabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Helper to check admin auth
function checkAdminAuth(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  // Support both header formats
  const xAdminPwd = req.headers.get('x-admin-password')
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const password = xAdminPwd || bearerToken

  if (!adminPassword || password !== adminPassword) {
    return false
  }
  return true
}

// Calculate delivery deadline (7 business days from now)
function calculateDeliveryDeadline() {
  const date = new Date()
  let addedDays = 0
  while (addedDays < 7) {
    date.setDate(date.getDate() + 1)
    // 0 is Sunday, 6 is Saturday
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      addedDays++
    }
  }
  return date.toISOString().split('T')[0]
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      // Fetch single contract with signature (public access)
      const { data, error } = await getSupabase()
        .from('contracts')
        .select(`
          *,
          signatures(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      
      // Transform signatures array to single object
      const contract = {
        ...data,
        signatures: Array.isArray(data.signatures) ? data.signatures[0] || null : data.signatures
      }

      return NextResponse.json(contract)
    } else {
      // Fetch all contracts (admin only)
      if (!checkAdminAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Check and update overdue contracts first
      const today = new Date().toISOString().split('T')[0]
      await getSupabase()
        .from('contracts')
        .update({ status: 'overdue' })
        .eq('status', 'pending')
        .lt('delivery_deadline', today)

      const { data, error } = await getSupabase()
        .from('contracts')
        .select(`
          *,
          signatures(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      const contracts = data.map(contract => ({
        ...contract,
        signatures: Array.isArray(contract.signatures) ? contract.signatures[0] || null : contract.signatures
      }))

      return NextResponse.json(contracts)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { influencer_name, product_detail, product_value, content_count, content_type, platform, notes } = body

    if (!influencer_name || !product_detail || product_value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const delivery_deadline = calculateDeliveryDeadline()

    const { data, error } = await getSupabase()
      .from('contracts')
      .insert({
        influencer_name,
        product_detail,
        product_value,
        content_count: content_count || 1,
        content_type: content_type || 'UGC Video',
        platform: platform || 'Instagram Reels',
        notes: notes || '',
        status: 'pending',
        delivery_deadline
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Contract ID required' }, { status: 400 })
    }

    const { error } = await getSupabase()
      .from('contracts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
