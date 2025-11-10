import { NextRequest, NextResponse } from 'next/server';
import { forwardAuthRequest, handleAuthApiResponse } from '@/lib/auth-middleware';

// POST /api/bill-payment/process - Process bill payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.accountId || body.accountId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Acct ID can NOT be empty...' },
        { status: 400 }
      );
    }

    if (body.accountId.length > 11) {
      return NextResponse.json(
        { error: 'Account ID must be 11 characters or less' },
        { status: 400 }
      );
    }

    if (typeof body.confirmPayment !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid value. Valid values are (Y/N)...' },
        { status: 400 }
      );
    }

    if (!body.confirmPayment) {
      return NextResponse.json(
        { error: 'Confirm to make a bill payment...' },
        { status: 400 }
      );
    }

    const response = await forwardAuthRequest(
      '/api/bill-payment/process',
      'POST',
      request,
      body
    );

    const result = await handleAuthApiResponse(response);

    if (!result.ok) {
      if (result.status === 404) {
        return NextResponse.json(
          { error: 'Account ID NOT found...' },
          { status: 404 }
        );
      }
      if (result.status === 400) {
        // Check for specific business rule errors
        if (result.data?.error?.includes('nothing to pay')) {
          return NextResponse.json(
            { error: 'You have nothing to pay...' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: result.data?.error || 'Failed to process payment' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Unable to Add Bill pay Transaction...' },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Error processing bill payment:', error);
    return NextResponse.json(
      { error: 'Failed to process bill payment' },
      { status: 500 }
    );
  }
}
