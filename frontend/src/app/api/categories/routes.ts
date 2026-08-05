import { NextResponse } from "next/server";

export default async function GET() {
    const response = await fetch(`${process.env.API_URL}/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" } 
    });
    
    const data = await response.json();
    return NextResponse.json(data); 
}
