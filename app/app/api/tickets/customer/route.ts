import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Müşterinin ticket'larını getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId gerekli" },
        { status: 400 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        customerId: parseInt(customerId)
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        description: true,
        status: true,
        priority: true,
        aiSuggestion: true,
        createdAt: true,
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Ticket getirme hatası:", error);
    return NextResponse.json(
      { error: "Ticketlar alınamadı" },
      { status: 500 }
    );
  }
}

// Yeni ticket oluştur
export async function POST(request: Request) {
  try {
    const { subject, description, priority, email, customerId } = await request.json();

    // Ticket numarası oluştur
    const ticketNumber = `TKT-${Date.now()}`;

    // Önce müşteriyi bul veya email ile eşleştir
    let customer;
    
    if (customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });
    }
    
    if (!customer && email) {
      customer = await prisma.customer.findUnique({
        where: { email: email }
      });
    }

    if (!customer) {
      return NextResponse.json(
        { error: "Müşteri bulunamadı. Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        subject,
        description,
        priority: priority || 'MEDIUM',
        customerId: customer.id,
        status: 'OPEN',
      },
    });

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Ticket oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Ticket oluşturulamadı" },
      { status: 500 }
    );
  }
}