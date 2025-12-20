import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCV } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    // CV başvurusunu bul
    const application = await prisma.cVApplication.findUnique({
      where: { id: Number(id) },
    });

    if (!application) {
      return NextResponse.json(
        { error: "CV başvurusu bulunamadı" },
        { status: 404 }
      );
    }

    if (!application.cvText) {
      return NextResponse.json(
        { error: "CV metni bulunamadı" },
        { status: 400 }
      );
    }

    // Gemini ile değerlendir
    const result = await evaluateCV(application.cvText, application.position);

    // Veritabanını güncelle
    const updated = await prisma.cVApplication.update({
      where: { id: Number(id) },
      data: {
        aiScore: result.score,
        aiAnalysis: result.analysis,
      },
    });

    return NextResponse.json({
      success: true,
      score: result.score,
      analysis: result.analysis,
    });
  } catch (error) {
    console.error("CV değerlendirme hatası:", error);
    return NextResponse.json(
      { error: "CV değerlendirme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}