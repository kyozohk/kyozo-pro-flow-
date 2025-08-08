import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Eventbrite token is required' },
        { status: 400 }
      );
    }

    // Fetch user's events from Eventbrite API
    const response = await fetch('https://www.eventbriteapi.com/v3/users/me/events/', {
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
            : `Eventbrite API error: ${errorData.error_description || 'Failed to fetch events'}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform events data for our frontend
    const events = data.events?.map((event: any) => ({
      id: event.id,
      name: event.name?.text || 'Untitled Event',
      description: event.description?.text || '',
      start: event.start?.utc,
      end: event.end?.utc,
      url: event.url,
      status: event.status,
      capacity: event.capacity,
      venue: event.venue_id ? {
        id: event.venue_id,
        name: event.venue?.name || 'TBD'
      } : null
    })) || [];

    return NextResponse.json({
      events,
      total: events.length,
      message: events.length > 0 
        ? `Found ${events.length} event${events.length === 1 ? '' : 's'}` 
        : 'No events found in your Eventbrite account'
    });

  } catch (error) {
    console.error('Eventbrite API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Eventbrite. Please try again.' },
      { status: 500 }
    );
  }
}
