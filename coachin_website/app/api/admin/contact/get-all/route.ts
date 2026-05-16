import {connectDB} from "@/app/lib/mongodb";
import Contact from "@/app/models/contactInquiry.model";
import {NextRequest, NextResponse} from "next/server";

export const GET = async (req: NextRequest) => {
    if (req.method !== 'GET') {
        return NextResponse.json({error: 'Method Not Allowed'}, {status: 405});
    }
    try {
        await connectDB();
        const contacts = await Contact.find().sort({createdAt: -1});
        return NextResponse.json(contacts, {status: 200});
    }
    catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
};

