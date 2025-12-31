import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    let cvText = formData.get('cvText') as string || '';
    const cvFile = formData.get('cvFile') as File | null;

    let cvFilePath = null;

    if (cvFile && cvFile.size > 0) {
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `cv_${Date.now()}_${cvFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cv');
      
      const fs = await import('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      cvFilePath = `/uploads/cv/${fileName}`;

      const fileExt = cvFile.name.toLowerCase().split('.').pop();
      
      if (fileExt === 'txt') {
        cvText = buffer.toString('utf-8');
      } else if (fileExt === 'pdf') {
        try {
          // @ts-ignore
          const pdfParse = (await import('pdf-parse')).default ?? (await import('pdf-parse'));
          const pdfData = await pdfParse(buffer);
          if (pdfData.text?.trim()) cvText = pdfData.text;
        } catch (e) {
          console.error('PDF hata:', e);
        }
      } else if (fileExt === 'docx') {
        try {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ buffer });
          if (result.value?.trim()) cvText = result.value;
        } catch (e) {
          console.error('DOCX hata:', e);
        }
      }
    }

    const application = await prisma.cVApplication.create({
      data: { name, email, phone, position, cvText, cvFile: cvFilePath, status: 'PENDING' }
    });

    try {
      await fetch('http://localhost:5678/webhook/cv-auto-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: application.id, name, email, phone, position, cvText, cvFile: cvFilePath })
      });
    } catch (n8nError) {
      console.error('n8n hatası:', n8nError);
    }

    return NextResponse.json({ success: true, application: { id: application.id, name, position } });
  } catch (error) {
    console.error("CV hatası:", error);
    return NextResponse.json({ error: "Başvuru kaydedilemedi" }, { status: 500 });
  }
}