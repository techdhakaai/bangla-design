import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, plans, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/auth/register - Register a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, plan: planSlug = 'free' } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        status: 'active',
      })
      .returning();

    // Get the plan
    const plan = await db.query.plans.findFirst({
      where: eq(plans.slug, planSlug),
    });

    // Create free subscription if plan exists
    if (plan) {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      await db.insert(subscriptions).values({
        userId: user.id,
        planId: plan.id,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthLater,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
