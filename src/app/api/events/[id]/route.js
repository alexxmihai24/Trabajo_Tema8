import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function GET(request, { params }) {
    const { id: idOrSlug } = await params;


    try {
        const event = await prisma.event.findFirst({
            where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
            select: {
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
            },
        });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        const formattedEvent = {
            ...event,
            images: event.images.map((image) => image.url),
        };
        return NextResponse.json(
            formattedEvent,
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




export async function PUT(request, { params }) {
    const { id } = await params;

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }

    const token = authHeader.split(' ')[1] || authHeader;

    // VERIFICAMOS TOKEN
    const { id: idUser } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: idUser } });

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: { images: true }
        });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { title, description, date, location, price, slug, capacity, images = [] } = body;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                ...(date && { date: new Date(date) }),
                location,
                price,
                slug,
                capacity,
                images: {
                    connectOrCreate: images.map(url => ({
                        where: { url },
                        create: { url }
                    })),
                    // set: images.map(url => ({
                    //     url
                    // }))
                },
                userId: idUser,
            },
            // incluimos las imágenes en la respuesta
            include: {
                images: true,
            }
        });

        return NextResponse.json(
            updatedEvent,
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




export async function DELETE(request, { params }) {
    const { id } = await params;

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }

    const token = authHeader.split(' ')[1] || authHeader;

    // VERIFICAMOS TOKEN
    const { id: idUser } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: idUser } });

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized. Token expired or invalid." },
            { status: 401 }
        )
    }


    try {
        const event = await prisma.event.findUnique({ where: { id } });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        const deletedEvent = await prisma.event.delete({
            where: { id },
            // incluimos las imágenes en la respuesta
            include: {
                images: true,
            }
        });

        return NextResponse.json(
            deletedEvent,
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Event title or slug already exists" },
            { status: 409 }
        )
    }

}



