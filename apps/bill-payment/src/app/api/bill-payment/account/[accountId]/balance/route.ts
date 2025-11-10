import { NextRequest, NextResponse } from 'next/server';
import { forwardAuthRequest, handleAuthApiResponse } from '@/lib/auth-middleware';

// GET /api/bill-payment/account/:accountId/balance - Get account balance
export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

    // Validate account ID
    if (!accountId || accountId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Account ID cannot be empty' },
        { status: 400 }
      );
    }

    if (accountId.length > 11) {
      return NextResponse.json(
        { error: 'Account ID must be 11 characters or less' },
        { status: 400 }
      );
    }

    const response = await forwardAuthRequest(
      `/api/bill-payment/account/${accountId}/balance`,
      'GET',
      request
    );

    const result = await handleAuthApiResponse(response);

    if (!result.ok) {
      if (result.status === 404) {
        return NextResponse.json(
          { error: 'Account ID NOT found...' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch account balance' },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account balance' },
      { status: 500 }
    );
  }
}
