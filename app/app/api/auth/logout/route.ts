import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ success: true })

    // Cookie'yi sil
    response.cookies.delete('admin_session')
    response.cookies.delete('customer_session')

    return response
}
