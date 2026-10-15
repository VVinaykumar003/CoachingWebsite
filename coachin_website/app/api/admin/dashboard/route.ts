import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Courses from '@/app/models/course.model';
import Blog from '@/app/models/blog.model';
import Testimonial from '@/app/models/testimonial.model';
import Batch from '@/app/models/batch.model';
import ContactInquiry from '@/app/models/contactInquiry.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [courseCount, blogCount, testimonialCount, batchCount, enquiryCount] = await Promise.all([
      Courses.countDocuments().catch(() => 0),
      Blog.countDocuments().catch(() => 0),
      Testimonial.countDocuments().catch(() => 0),
      Batch.countDocuments().catch(() => 0),
      ContactInquiry.countDocuments().catch(() => 0),
    ]);

    const stats = [
      {
        icon: 'ti-books',
        color: 'rgba(29,158,117,0.15)',
        iconColor: '#5DCAA5',
        label: 'Active courses',
        value: courseCount.toString(),
        meta: [['Batches', batchCount.toString()]],
        metaColor: 'green',
      },
      {
        icon: 'ti-article',
        color: 'rgba(99,102,241,0.15)',
        iconColor: '#ffffff',
        label: 'Published blogs',
        value: blogCount.toString(),
        meta: [['Total blogs', blogCount.toString()]],
        metaColor: 'green',
      },
      {
        icon: 'ti-star',
        color: 'rgba(186,117,23,0.15)',
        iconColor: '#FAC775',
        label: 'Testimonials',
        value: testimonialCount.toString(),
        meta: [['Student reviews', testimonialCount.toString()]],
        metaColor: 'green',
      },
      {
        icon: 'ti-address-book',
        color: 'rgba(14,165,233,0.15)',
        iconColor: '#38BDF8',
        label: 'Student Enquiries',
        value: enquiryCount.toString(),
        meta: [['Total inquiries', enquiryCount.toString()]],
        metaColor: 'green',
      },
    ];

    const shortcutCounts = {
      courses: `${courseCount} ${courseCount === 1 ? 'course' : 'courses'}`,
      blogs: `${blogCount} ${blogCount === 1 ? 'blog' : 'blogs'}`,
      testimonials: `${testimonialCount} ${testimonialCount === 1 ? 'review' : 'reviews'}`,
    };

    return NextResponse.json({ stats, shortcutCounts });
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({
      stats: [
        { icon: 'ti-books', color: 'rgba(29,158,117,0.15)', iconColor: '#5DCAA5', label: 'Active courses', value: '0', meta: [], metaColor: 'green' },
        { icon: 'ti-article', color: 'rgba(99,102,241,0.15)', iconColor: '#ffffff', label: 'Published blogs', value: '0', meta: [], metaColor: 'green' },
        { icon: 'ti-star', color: 'rgba(186,117,23,0.15)', iconColor: '#FAC775', label: 'Testimonials', value: '0', meta: [], metaColor: 'green' },
        { icon: 'ti-address-book', color: 'rgba(14,165,233,0.15)', iconColor: '#38BDF8', label: 'Student Enquiries', value: '0', meta: [], metaColor: 'green' },
      ],
      shortcutCounts: {
        courses: '0 courses',
        blogs: '0 blogs',
        testimonials: '0 reviews',
      }
    });
  }
}