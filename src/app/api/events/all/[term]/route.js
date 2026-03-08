import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(request, { params }) {
    const { term } = await params;


    try {
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: term,
                            mode: 'insensitive',
                        }
                    },
                    {
                        slug: {
                            contains: term,
                            mode: 'insensitive',
                        }
                    }
                ]
            },
        });

        return NextResponse.json(
            events,
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}


