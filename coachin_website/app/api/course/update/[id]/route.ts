import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/app/lib/cloudinary";
import { connectDB } from "@/app/lib/mongodb";
import Courses from "@/app/models/course.model";

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    // IMPORTANT
    const { id } = await context.params;

    const formData =
      await request.formData();

    // console.log(
    //   "Updating course with id:",
    //   id
    // );

    // console.log(
    //   "FormData received:",
    //   Object.fromEntries(
    //     formData.entries()
    //   )
    // );

    if (!id) {
      return NextResponse.json(
        {
          message:
            "Course ID is missing from URL.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedData: any = {};

    // Extract text fields
    formData.forEach((value, key) => {
      if (key !== "thumbnail") {
        updatedData[key] = value;
      }
    });

    // Handle thumbnail upload
    const thumbnailFile =
      formData.get("thumbnail");

    if (
      thumbnailFile instanceof File &&
      thumbnailFile.size > 0
    ) {
      const arrayBuffer =
        await thumbnailFile.arrayBuffer();

      const buffer =
        Buffer.from(arrayBuffer);

      const result: any =
        await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "course_thumbnails",
                },
                (
                  error,
                  result
                ) => {
                  if (error)
                    reject(error);
                  else
                    resolve(result);
                }
              );

            uploadStream.end(buffer);
          }
        );

      updatedData.thumbnail =
        result.secure_url;
    }

    const updatedCourse =
      await Courses.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedCourse) {
      return NextResponse.json(
        {
          message:
            "Course not found.",
        },
        {
          status: 404,
        }
      );
    }

    // console.log(
    //   "Updated Course:",
    //   updatedCourse
    // );

    return NextResponse.json(
      {
        message:
          "Course updated successfully.",
        course: updatedCourse,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Update failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong.",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}