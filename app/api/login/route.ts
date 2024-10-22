import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        // Forward the request to the FastAPI backend
        const response = await axios.post('http://localhost:8000/api/v1/auth/staff-login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true, // Include credentials (cookies)
        });

        // Return the response from the backend to the client
        return NextResponse.json(response.data);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            return NextResponse.json({ detail: err.response.data.detail }, { status: err.response.status });
        } else {
            return NextResponse.json({ detail: 'An unexpected error occurred.' }, { status: 500 });
        }
    }
}
