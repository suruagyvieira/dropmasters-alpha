
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        success: false,
        message: 'SIMULATION_DISABLED: System is running in REAL DATA ONLY mode. Traffic injection is inactive.'
    });
}
