import { NextRequest, NextResponse } from 'next/server';

interface EventbriteAttendee {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    name: string;
    addresses?: any;
  };
  event_id: string;
  status: string;
  checked_in: boolean;
  cancelled: boolean;
  refunded: boolean;
  ticket_class_name: string;
  created: string;
  changed: string;
}

interface UniqueUser {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  eventIds: string[];
  eventNames: string[];
  totalTickets: number;
  firstRegistration: string;
  lastActivity: string;
  status: 'active' | 'cancelled' | 'refunded';
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Eventbrite token is required' },
        { status: 400 }
      );
    }

    // First, get user's organizations
    const orgResponse = await fetch('https://www.eventbriteapi.com/v3/users/me/organizations/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orgResponse.ok) {
      const errorData = await orgResponse.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: orgResponse.status === 401 
            ? 'Invalid Eventbrite token. Please check your token and try again.' 
            : `Eventbrite API error: ${errorData.error_description || 'Failed to fetch organizations'}`
        },
        { status: orgResponse.status }
      );
    }

    const orgData = await orgResponse.json();
    const organizations = orgData.organizations || [];
    
    if (organizations.length === 0) {
      return NextResponse.json({
        uniqueUsers: [],
        totalUniqueUsers: 0,
        totalAttendees: 0,
        eventsProcessed: 0,
        message: 'No organizations found in your Eventbrite account'
      });
    }

    // Get events from the first organization
    const orgId = organizations[0].id;
    const eventsResponse = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!eventsResponse.ok) {
      const errorData = await eventsResponse.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: eventsResponse.status === 401 
            ? 'Invalid Eventbrite token. Please check your token and try again.' 
            : `Eventbrite API error: ${errorData.error_description || 'Failed to fetch events'}`
        },
        { status: eventsResponse.status }
      );
    }

    const eventsData = await eventsResponse.json();
    const events = eventsData.events || [];

    // Fetch attendees for all events
    const allAttendees: EventbriteAttendee[] = [];
    const eventNames: { [key: string]: string } = {};
    
    for (const event of events) {
      eventNames[event.id] = event.name?.text || 'Untitled Event';
      
      try {
        const attendeesResponse = await fetch(`https://www.eventbriteapi.com/v3/events/${event.id}/attendees/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (attendeesResponse.ok) {
          const attendeesData = await attendeesResponse.json();
          const eventAttendees = attendeesData.attendees || [];
          allAttendees.push(...eventAttendees);
        }
      } catch (error) {
        console.error(`Error fetching attendees for event ${event.id}:`, error);
        // Continue with other events even if one fails
      }
    }

    // Deduplicate users by email address
    const userMap = new Map<string, UniqueUser>();

    for (const attendee of allAttendees) {
      const email = attendee.profile.email?.toLowerCase() || '';
      
      // Skip attendees with no email or privacy-protected emails
      if (!email || email === 'info requested' || email.includes('info requested')) {
        continue;
      }

      if (userMap.has(email)) {
        // Update existing user
        const existingUser = userMap.get(email)!;
        existingUser.eventIds.push(attendee.event_id);
        existingUser.eventNames.push(eventNames[attendee.event_id]);
        existingUser.totalTickets += 1;
        existingUser.lastActivity = new Date(attendee.changed) > new Date(existingUser.lastActivity) 
          ? attendee.changed 
          : existingUser.lastActivity;
        
        // Update status if cancelled or refunded
        if (attendee.cancelled) existingUser.status = 'cancelled';
        else if (attendee.refunded) existingUser.status = 'refunded';
      } else {
        // Create new user
        userMap.set(email, {
          email: attendee.profile.email,
          firstName: attendee.profile.first_name || '',
          lastName: attendee.profile.last_name || '',
          fullName: attendee.profile.name || `${attendee.profile.first_name} ${attendee.profile.last_name}`.trim(),
          eventIds: [attendee.event_id],
          eventNames: [eventNames[attendee.event_id]],
          totalTickets: 1,
          firstRegistration: attendee.created,
          lastActivity: attendee.changed,
          status: attendee.cancelled ? 'cancelled' : attendee.refunded ? 'refunded' : 'active'
        });
      }
    }

    // Convert map to array and sort by last activity
    const uniqueUsers = Array.from(userMap.values()).sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );

    // Remove duplicate event names for each user
    uniqueUsers.forEach(user => {
      user.eventNames = Array.from(new Set(user.eventNames));
      user.eventIds = Array.from(new Set(user.eventIds));
    });

    return NextResponse.json({
      uniqueUsers,
      totalUniqueUsers: uniqueUsers.length,
      totalAttendees: allAttendees.length,
      eventsProcessed: events.length,
      organizationName: organizations[0].name,
      message: `Found ${uniqueUsers.length} unique users across ${events.length} events`
    });

  } catch (error) {
    console.error('Eventbrite All Attendees API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees from Eventbrite. Please try again.' },
      { status: 500 }
    );
  }
}
