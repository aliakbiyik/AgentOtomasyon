import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, aiSuggestion } = await request.json();

    // Veritabanını güncelle
    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        aiSuggestion: aiSuggestion,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Ticket güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Ticket güncelleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}