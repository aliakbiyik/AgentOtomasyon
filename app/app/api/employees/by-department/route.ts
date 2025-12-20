import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    if (!department) {
      return NextResponse.json(
        { error: "Departman parametresi gerekli" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findFirst({
      where: {
        department: department,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        department: true,
        position: true,
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Bu departmanda çalışan bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Çalışan getirme hatası:", error);
    return NextResponse.json(
      { error: "Çalışan bilgisi alınamadı" },
      { status: 500 }
    );
  }
}