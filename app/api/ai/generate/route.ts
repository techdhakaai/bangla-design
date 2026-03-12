import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateContent, generateImage } from '@/lib/ai/builder';
import { db } from '@/db';
import { aiGenerations } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/ai/generate - Generate content using AI
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { prompt, type, siteId, language = 'en' } = body;

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, type' },
        { status: 400 }
      );
    }

    // Check user's AI generation limit
    const userGenerations = await db.query.aiGenerations.findMany({
      where: eq(aiGenerations.userId, session.user.id),
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const generationsThisMonth = userGenerations.filter(
      (g) => g.createdAt >= startOfMonth
    ).length;

    // Get user's plan limits (mock for now)
    const maxGenerations = 50; // Should come from user's subscription plan

    if (generationsThisMonth >= maxGenerations) {
      return NextResponse.json(
        { error: 'AI generation limit exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    // Generate content based on type
    let result;
    
    if (type === 'image') {
      const imageResult = await generateImage(prompt);
      result = { url: imageResult.url };
    } else {
      const generationResult = await generateContent({
        prompt,
        type,
        siteId,
        language: language as 'en' | 'bn',
        userId: session.user.id,
      });
      result = generationResult;
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

// GET /api/ai/generate - Get user's AI generation history
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const generations = await db.query.aiGenerations.findMany({
      where: eq(aiGenerations.userId, session.user.id),
      limit,
      offset,
      orderBy: (aiGenerations, { desc }) => [desc(aiGenerations.createdAt)],
    });

    return NextResponse.json({
      success: true,
      data: generations,
    });
  } catch (error) {
    console.error('Get AI generations error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI generations' },
      { status: 500 }
    );
  }
}
