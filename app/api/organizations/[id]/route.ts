import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { Organization } from '@/lib/server/models/Organization';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const organization = await Organization.findById(resolvedParams.id);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(organization);
  } catch (error: any) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const body = await req.json();

    // Check slug collision
    if (body.slug) {
      const existingOrg = await Organization.findOne({ slug: body.slug, _id: { $ne: resolvedParams.id } });
      if (existingOrg) {
        return NextResponse.json({ error: 'Another organization with this slug already exists' }, { status: 400 });
      }
    }

    const organization = await Organization.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(organization);
  } catch (error: any) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const organization = await Organization.findByIdAndDelete(resolvedParams.id);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Organization deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
