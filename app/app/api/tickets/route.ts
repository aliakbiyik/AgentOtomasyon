import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tüm ticket'ları getir (admin için)
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          }
        },
        assignedTo: {
          select: {
            name: true,
          }
        }
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

// Yeni ticket oluştur (admin için)
export async function POST(request: Request) {
  try {
    const { subject, description, priority, customerId, assignedToId } = await request.json();

    const ticketNumber = `TKT-${Date.now()}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        subject,
        description,
        priority: priority || 'MEDIUM',
        customerId,
        assignedToId,
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