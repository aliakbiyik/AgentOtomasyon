import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status, aiSuggestion, assignedToId } = await request.json();
        const { id } = await params;
        const numericId = Number(id);

        const updatedTicket = await prisma.ticket.update({
            where: { id: numericId },
            data: {
                ...(status && { status }),
                ...(aiSuggestion && { aiSuggestion }),
                ...(assignedToId && { assignedToId }),
            },
            include: {
                customer: { select: { name: true, email: true } }
            }
        });

        // Burada normalde email atma servisi çağrılır (şimdilik sadece log)
        if (status === 'RESOLVED') {
            console.log(`Email gönderildi: ${updatedTicket.customer.email} - Konu: ${updatedTicket.subject}`);
        }

        return NextResponse.json({ success: true, ticket: updatedTicket });
    } catch (error) {
        console.error("Ticket güncelleme hatası:", error);
        return NextResponse.json(
            { error: "Güncellenemedi" },
            { status: 500 }
        );
    }
}
