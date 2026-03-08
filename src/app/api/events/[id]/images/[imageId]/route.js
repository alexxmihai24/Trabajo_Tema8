import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    const { id: eventId, imageId } = await params;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const token = authHeader.split(' ')[1] || authHeader;

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const eventImage = await prisma.eventImage.findUnique({
            where: { id: parseInt(imageId, 10) }
        });

        if (!eventImage || eventImage.eventId !== eventId) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        // url field stores the public_id
        await cloudinary.uploader.destroy(eventImage.url, { invalidate: true });

        await prisma.eventImage.delete({ where: { id: eventImage.id } });

        return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Unauthorized. Token invalid or expired." }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
