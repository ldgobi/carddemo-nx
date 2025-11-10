import { NextRequest, NextResponse } from 'next/server';
import { forwardAuthRequest, handleAuthApiResponse } from '@/lib/auth-middleware';

// PUT /api/accounts/:accountId/update - Update account and customer information
export async function PUT(
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
    
    const body = await request.json();
    
    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body cannot be empty' },
        { status: 400 }
      );
    }
    
    // Validate active status if provided
    if (body.activeStatus && body.activeStatus !== 'Y' && body.activeStatus !== 'N') {
      return NextResponse.json(
        { error: 'Active status must be Y or N' },
        { status: 400 }
      );
    }
    
    // Validate monetary amounts if provided
    const monetaryFields = ['currentBalance', 'creditLimit', 'cashCreditLimit', 'currentCycleCredit', 'currentCycleDebit'];
    for (const field of monetaryFields) {
      if (body[field] !== undefined && (typeof body[field] !== 'number' || body[field] < 0)) {
        return NextResponse.json(
          { error: `${field} must be a non-negative number` },
          { status: 400 }
        );
      }
    }
    
    // Validate FICO score if provided
    if (body.ficoScore !== undefined) {
      if (typeof body.ficoScore !== 'number' || body.ficoScore < 300 || body.ficoScore > 850) {
        return NextResponse.json(
          { error: 'FICO score must be between 300 and 850' },
          { status: 400 }
        );
      }
    }
    
    // Validate SSN if provided
    if (body.ssn) {
      const cleanedSSN = body.ssn.replace(/\D/g, '');
      if (cleanedSSN.length !== 9) {
        return NextResponse.json(
          { error: 'SSN must be a 9-digit number' },
          { status: 400 }
        );
      }
    }
    
    // Validate names if provided (alphabetic only)
    const nameFields = ['firstName', 'middleName', 'lastName'];
    for (const field of nameFields) {
      if (body[field] && !/^[A-Za-z\s]+$/.test(body[field])) {
        return NextResponse.json(
          { error: `${field} must contain only alphabetic characters` },
          { status: 400 }
        );
      }
    }
    
    // Validate state code if provided
    if (body.stateCode && !/^[A-Z]{2}$/.test(body.stateCode)) {
      return NextResponse.json(
        { error: 'State code must be 2 uppercase letters' },
        { status: 400 }
      );
    }
    
    // Validate ZIP code if provided
    if (body.zipCode && !/^\d{5}$/.test(body.zipCode)) {
      return NextResponse.json(
        { error: 'ZIP code must be 5 digits' },
        { status: 400 }
      );
    }
    
    // Validate phone numbers if provided
    const phoneFields = ['phoneNumber1', 'phoneNumber2'];
    for (const field of phoneFields) {
      if (body[field]) {
        const cleaned = body[field].replace(/\D/g, '');
        if (cleaned.length !== 10) {
          return NextResponse.json(
            { error: `${field} must be a valid 10-digit phone number` },
            { status: 400 }
          );
        }
      }
    }
    
    // Validate primary card holder indicator if provided
    if (body.primaryCardHolderIndicator && 
        body.primaryCardHolderIndicator !== 'Y' && 
        body.primaryCardHolderIndicator !== 'N') {
      return NextResponse.json(
        { error: 'Primary card holder indicator must be Y or N' },
        { status: 400 }
      );
    }
    
    const response = await forwardAuthRequest(
      `/api/accounts/${accountId}/update`,
      'PUT',
      request,
      body
    );
    
    const result = await handleAuthApiResponse(response);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Error updating account:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Account or customer not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('409')) {
        return NextResponse.json(
          { error: 'Record was modified by another user. Please refresh and try again.' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}
