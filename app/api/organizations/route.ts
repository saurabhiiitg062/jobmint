import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { Organization } from '@/lib/server/models/Organization';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const organizations = await Organization.find().sort({ createdAt: -1 });
    return NextResponse.json(organizations);
  } catch (error: any) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Check if organization with same slug already exists
    const existingOrg = await Organization.findOne({ slug: body.slug });
    if (existingOrg) {
      return NextResponse.json({ error: 'Organization with this slug already exists' }, { status: 400 });
    }

    const organization = new Organization(body);
    await organization.save();

    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
