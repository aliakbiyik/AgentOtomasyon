import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // n8n'e sunucu üzerinden istek at (CORS sorunu olmaz)
        const n8nResponse = await fetch('http://localhost:5678/webhook/ticket-solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (n8nResponse.ok) {
            const data = await n8nResponse.json()
            return NextResponse.json(data)
        } else {
            // n8n hata döndürürse veya ulaşılmazsa
            console.error('n8n yanıt hatası:', n8nResponse.status)
            return NextResponse.json({ error: 'n8n servisine ulaşılamadı' }, { status: 502 })
        }

    } catch (error) {
        console.error('Proxy hatası:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
