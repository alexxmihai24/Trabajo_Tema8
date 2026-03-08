import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function GET(request) {

    const offset = +request.nextUrl.searchParams.get("offset") || 0;
    const limit = +request.nextUrl.searchParams.get("limit") || 10;

    const select = {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        price: true,
        slug: true,
        capacity: true,
        images: { select: { url: true } },
        user: {
            select: {
                id: true,
                email: true,
                fullName: true,
                isActive: true,
                roles: true,
            },
        },
    };

    try {
        const events = await prisma.event.findMany({ select, take: limit, skip: offset });

        const formattedEvents = events.map(event => ({
            ...event,
            images: event.images.map(image => image.url),
        }));

        return NextResponse.json(
            formattedEvents,
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





export async function POST(request) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }

    const token = authHeader.split(' ')[1] || authHeader;

    // VERIFICAMOS TOKEN
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }

    try {
        const { title, description, date, location, price, slug, capacity, images } = await request.json();

        if (!title || price === undefined || !slug || !date || !location || !images) {
            return NextResponse.json(
                { error: "Missing data" },
                { status: 400 }
            )
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                price,
                slug,
                capacity,
                images: {
                    create: images.map(image => ({ url: image }))
                },
                userId: id,
            },
            // incluimos las imágenes en la respuesta
            include: {
                images: true,
            }
        });
        return NextResponse.json(
            event,
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Event title or slug already exists" },
            { status: 409 }
        )
    }
}