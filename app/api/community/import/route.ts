import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

// Firebase config (you may need to adjust this based on your setup)
const firebaseConfig = {
  // This will use environment variables or default config
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { 
      communityId, 
      members, 
      importType, 
      eventData,
      userId 
    } = requestBody;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!communityId || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { error: 'Community ID and members array are required' },
        { status: 400 }
      );
    }

    // Verify user owns the community
    const communityRef = doc(db, `users/${userId}/communities`, communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) {
      return NextResponse.json(
        { error: 'Community not found or access denied' },
        { status: 404 }
      );
    }

    const batch = writeBatch(db);
    const importedMembers = [];
    const errors = [];

    for (const member of members) {
      try {
        // Validate required fields
        if (!member.email || !member.email.includes('@')) {
          errors.push(`Invalid email for member: ${member.name || 'Unknown'}`);
          continue;
        }

        // Create member slug from name and email
        const memberSlug = `${(member.firstName || member.name || 'member')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

        const memberData = {
          id: member.id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          slug: memberSlug,
          name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
          firstName: member.firstName || member.name?.split(' ')[0] || '',
          lastName: member.lastName || member.name?.split(' ').slice(1).join(' ') || '',
          email: member.email,
          phone: member.phone || '',
          image: member.image || null,
          bio: member.bio || '',
          status: 'active',
          source: importType || 'manual',
          joinDate: new Date(),
          communityId: communityId,
          // Eventbrite specific data
          ...(importType === 'eventbrite' && {
            eventbriteId: member.id,
            eventId: member.eventId,
            eventName: member.eventName,
            ticketType: member.ticketType,
            checkedIn: member.checkedIn || false,
            orderDate: member.orderDate ? new Date(member.orderDate) : null,
          }),
          // CSV specific data
          ...(importType === 'csv' && {
            csvRowIndex: member.rowIndex,
            importDate: new Date(),
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add member to community members subcollection
        const memberRef = doc(db, `users/${userId}/communities/${communityId}/members`, memberSlug);
        batch.set(memberRef, memberData);

        // Also add to global members collection for search/discovery
        const globalMemberRef = doc(db, 'members', `${communityId}-${memberSlug}`);
        batch.set(globalMemberRef, {
          ...memberData,
          communitySlug: communityDoc.data()?.slug || communityId,
          communityName: communityDoc.data()?.name || 'Unknown Community',
        });

        importedMembers.push({
          slug: memberSlug,
          name: memberData.name,
          email: memberData.email,
        });

      } catch (memberError) {
        console.error('Error processing member:', memberError);
        errors.push(`Failed to import member: ${member.name || member.email || 'Unknown'}`);
      }
    }

    // Update community member count
    const currentData = communityDoc.data();
    const newMemberCount = (currentData?.memberCount || 0) + importedMembers.length;
    
    batch.update(communityRef, {
      memberCount: newMemberCount,
      lastImport: new Date(),
      lastImportType: importType,
      ...(importType === 'eventbrite' && eventData && {
        lastEventbriteImport: {
          eventId: eventData.eventId,
          eventName: eventData.eventName,
          importedCount: importedMembers.length,
          date: new Date(),
        }
      }),
      updatedAt: new Date(),
    });

    // Also update global community document
    const globalCommunityRef = doc(db, 'communities', communityId);
    batch.update(globalCommunityRef, {
      memberCount: newMemberCount,
      updatedAt: new Date(),
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      imported: importedMembers.length,
      total: members.length,
      errors: errors.length > 0 ? errors : undefined,
      members: importedMembers,
      message: `Successfully imported ${importedMembers.length} member${importedMembers.length === 1 ? '' : 's'}${
        errors.length > 0 ? ` with ${errors.length} error${errors.length === 1 ? '' : 's'}` : ''
      }`,
    });

  } catch (error) {
    console.error('Community import error:', error);
    return NextResponse.json(
      { error: 'Failed to import members. Please try again.' },
      { status: 500 }
    );
  }
}
