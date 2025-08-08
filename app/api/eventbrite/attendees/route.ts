import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, eventId } = await request.json();

    if (!token || !eventId) {
      return NextResponse.json(
        { error: 'Eventbrite token and event ID are required' },
        { status: 400 }
      );
    }

    // First, fetch event details to get the event name
    const eventResponse = await fetch(`https://www.eventbriteapi.com/v3/events/${eventId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let eventName = 'Unknown Event';
    if (eventResponse.ok) {
      const eventData = await eventResponse.json();
      eventName = eventData.name?.text || 'Unknown Event';
    }

    // Fetch attendees from Eventbrite API
    const response = await fetch(`https://www.eventbriteapi.com/v3/events/${eventId}/attendees/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: response.status === 401 
            ? 'Invalid Eventbrite token. Please check your token and try again.' 
            : response.status === 404
            ? 'Event not found. Please check the event ID.'
            : `Eventbrite API error: ${errorData.error_description || 'Failed to fetch attendees'}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform attendees data for our system
    const attendees = data.attendees?.map((attendee: any) => {
      const profile = attendee.profile || {};
      const answers = attendee.answers || [];
      
      // Extract phone number from custom questions if available
      const phoneAnswer = answers.find((answer: any) => 
        answer.question?.toLowerCase().includes('phone') ||
        answer.question?.toLowerCase().includes('mobile') ||
        answer.question?.toLowerCase().includes('contact')
      );

      return {
        id: attendee.id,
        name: profile.name || 'Unknown',
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: phoneAnswer?.answer || '',
        image: profile.image_url || null,
        status: attendee.status || 'attending',
        checkedIn: attendee.checked_in || false,
        orderDate: attendee.created,
        ticketType: attendee.ticket_class_name || 'General',
        source: 'eventbrite',
        eventId: eventId,
        eventName: eventName
      };
    }).filter((attendee: any) => 
      // Only include attendees with valid email addresses
      attendee.email && attendee.email.includes('@')
    ) || [];

    return NextResponse.json({
      attendees,
      total: attendees.length,
      eventId,
      message: attendees.length > 0 
        ? `Found ${attendees.length} attendee${attendees.length === 1 ? '' : 's'} with valid email addresses` 
        : 'No attendees with valid email addresses found for this event'
    });

  } catch (error) {
    console.error('Eventbrite attendees API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees from Eventbrite. Please try again.' },
      { status: 500 }
    );
  }
}
