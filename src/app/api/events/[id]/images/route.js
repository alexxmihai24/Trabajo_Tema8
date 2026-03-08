import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const FOLDER = 'shop';

export async function POST(request, { params }) {
    const { id: eventId } = await params;
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

        const arrayBuffer = await request.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.length === 0) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    asset_folder: FOLDER,
                    format: 'webp',
                    aspect_ratio: '1',
                    crop: 'fill',
                    width: 852,
                    gravity: "center",
                    invalidate: true,
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // url field stores the public_id
        const eventImage = await prisma.eventImage.create({
            data: {
                url: uploadResult.public_id,
                eventId,
            }
        });

        return NextResponse.json(eventImage, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Unauthorized. Token invalid or expired." }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
