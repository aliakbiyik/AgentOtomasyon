import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, aiScore } = await request.json();

    // aiScore string olarak gelebilir, parse edelim
    let score = 0;
    let analysis = "";

    try {
      // JSON formatında gelirse parse et
      const parsed = JSON.parse(aiScore);
      score = parsed.score || 0;
      analysis = parsed.analysis || "";
    } catch {
      // Düz metin olarak geldiyse
      analysis = aiScore;
      // Metinden puan çıkarmaya çalış
      const scoreMatch = aiScore.match(/"score":\s*(\d+)/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[1]);
      }
    }

    // Veritabanını güncelle
    const updated = await prisma.cVApplication.update({
      where: { id: Number(id) },
      data: {
        aiScore: score,
        aiAnalysis: analysis,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("CV güncelleme hatası:", error);
    return NextResponse.json(
      { error: "CV güncelleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}