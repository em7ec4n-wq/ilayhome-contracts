import { getSupabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contract_id, full_name, tc_no, phone, email, address, signature_data } = body

    if (!contract_id || !full_name || !tc_no || !phone || !address || !signature_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Demo contract signing
    if (contract_id === 'ornek' || contract_id === 'demo') {
      return NextResponse.json({ 
        success: true, 
        contract: { 
          id: contract_id,
          influencer_name: full_name,
          status: 'signed' 
        } 
      }, { status: 201 })
    }

    // Check contract exists and is pending
    const { data: contract, error: contractError } = await getSupabase()
      .from('contracts')
      .select('status')
      .eq('id', contract_id)
      .single()

    if (contractError || !contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    if (contract.status !== 'pending' && contract.status !== 'overdue') {
      return NextResponse.json({ error: 'Contract is already signed or not available for signing' }, { status: 400 })
    }

    // Get IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Insert signature
    const { error: signatureError } = await getSupabase()
      .from('signatures')
      .insert({
        contract_id,
        full_name,
        tc_no,
        phone,
        email: email || '',
        address,
        signature_data,
        ip_address: ip
      })

    if (signatureError) {
      if (signatureError.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Contract already has a signature' }, { status: 400 })
      }
      return NextResponse.json({ error: signatureError.message }, { status: 500 })
    }

    // Update contract status
    const { data: updatedContract, error: updateError } = await getSupabase()
      .from('contracts')
      .update({ status: 'signed' })
      .eq('id', contract_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, contract: updatedContract }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
