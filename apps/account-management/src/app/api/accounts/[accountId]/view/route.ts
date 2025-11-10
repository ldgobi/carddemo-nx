import { NextRequest, NextResponse } from 'next/server';
import { forwardAuthRequest, handleAuthApiResponse } from '@/lib/auth-middleware';

// GET /api/accounts/:accountId/view - Get account view with customer details
export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    
    // Validate account ID format
    const cleanedAccountId = accountId.replace(/\D/g, '');
    if (cleanedAccountId.length !== 11 || cleanedAccountId === '00000000000') {
      return NextResponse.json(
        { error: 'Account ID must be a non-zero 11-digit number' },
        { status: 400 }
      );
    }
    
    const response = await forwardAuthRequest(
      `/api/accounts/${accountId}/view`,
      'GET',
      request
    );
    
    const result = await handleAuthApiResponse(response);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Error fetching account view:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Account not found in the system' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch account view' },
      { status: 500 }
    );
  }
}
