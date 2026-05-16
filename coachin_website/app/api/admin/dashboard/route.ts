import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/app/lib/mongodb';

// TODO: Import your Mongoose models here when you are ready to connect to the DB
// import User from '@/app/models/User';
// import Course from '@/app/models/Course';
// import Batch from '@/app/models/Batch';
// import Payment from '@/app/models/Payment';
// import Registration from '@/app/models/Registration';

export async function GET(request: NextRequest) {
  // 1. Extract and verify the Authorization token
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // TODO: Validate the token here using your authentication provider or JWT library
  // if (!isValidToken(token)) {
  //   return NextResponse.json({ error: 'Forbidden: Invalid token' }, { status: 403 });
  // }

  try {
    // --- 1. DATE HELPERS FOR METRICS ---
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    /* =========================================================================
       2. ACTUAL DATABASE QUERIES (Mongoose)
       Uncomment and adjust the model imports to match your database schema.
       ========================================================================= */
    /*
    await connectDB(); // Establish the MongoDB connection

    const [
      totalStudents,
      studentsThisMonth,
      activeCourses,
      batchesRunning,
      revenueThisMonthAgg,
      revenueLastMonthAgg,
      recentDbRegistrations,
    ] = await Promise.all([
      // 1. Students count
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'STUDENT', createdAt: { $gte: startOfThisMonth } }),
      
      // 2. Courses & Batches count
      Course.countDocuments({ status: 'ACTIVE' }),
      Batch.countDocuments({ status: 'RUNNING' }),
      
      // 3. Revenue aggregation
      Payment.aggregate([
        { $match: { status: 'COMPLETED', createdAt: { $gte: startOfThisMonth } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'COMPLETED', createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ]),
      
      // 4. Recent registrations
      Registration.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user')
        .populate('course')
        .populate('batch')
    ]);

    // Calculate Revenue Metrics
    const revenueThisMonth = revenueThisMonthAgg[0]?.totalAmount || 0;
    const revenueLastMonth = revenueLastMonthAgg[0]?.totalAmount || 0;
    const revenueGrowth = revenueLastMonth === 0 
      ? 100 
      : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);

    // Map DB Results to Frontend format
    const stats = [
      {
        icon: 'ti-users',
        color: 'rgba(99,102,241,0.15)',
        iconColor: '#ffffff',
        label: 'Total students',
        value: totalStudents.toLocaleString(),
        meta: [['Applied this month', studentsThisMonth.toString()], ['Growth', '↗ 22%']],
        metaColor: 'green',
      },
      {
        icon: 'ti-books',
        color: 'rgba(29,158,117,0.15)',
        iconColor: '#5DCAA5',
        label: 'Active courses',
        value: activeCourses.toString(),
        meta: [['Batches running', batchesRunning.toString()], ['New this month', '↗ 4']],
        metaColor: 'green',
      },
      {
        icon: 'ti-currency-dollar',
        color: 'rgba(186,117,23,0.15)',
        iconColor: '#FAC775',
        label: 'Monthly revenue',
        value: `$${(revenueThisMonth / 1000).toFixed(1)}k`,
        meta: [
          ['vs last month', `${revenueGrowth >= 0 ? '↗' : '↘'} ${Math.abs(revenueGrowth)}%`], 
          ['Increase', `${revenueGrowth >= 0 ? '+' : '-'}$${Math.abs((revenueThisMonth - revenueLastMonth) / 1000).toFixed(1)}k`]
        ],
        metaColor: revenueGrowth >= 0 ? 'green' : 'red',
      },
    ];

    const registrations = recentDbRegistrations.map((reg: any) => {
      const nameParts = (reg.user?.name || 'Unknown User').split(' ');
      const initials = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');

      return {
        initials: initials.toUpperCase(),
        name: reg.user?.name || 'Unknown',
        email: reg.user?.email || 'Unknown',
        course: reg.course?.title || 'Unknown Course',
        batch: reg.batch?.name || 'Unknown Batch',
        date: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
        status: reg.status || 'Pending'
      };
    });

    return NextResponse.json({ stats, registrations });
    */

    // --- 3. MOCK DATA FALLBACK (Remove when DB is connected) ---
    const stats = [
      { icon: 'ti-users', color: 'rgba(99,102,241,0.15)', iconColor: '#ffffff', label: 'Total students', value: '1,200', meta: [['Applied this month', '320'], ['Growth', '↗ 22%']], metaColor: 'green' },
      { icon: 'ti-books', color: 'rgba(29,158,117,0.15)', iconColor: '#5DCAA5', label: 'Active courses', value: '24', meta: [['Batches running', '8'], ['New this month', '↗ 4']], metaColor: 'green' },
      { icon: 'ti-currency-dollar', color: 'rgba(186,117,23,0.15)', iconColor: '#FAC775', label: 'Monthly revenue', value: '$89.4k', meta: [['vs last month', '↗ 18%'], ['Increase', '+$14k']], metaColor: 'green' },
    ];

    const registrations = [
      { initials: 'JD', name: 'John Doe', email: 'john@example.com', course: 'React Mastery', batch: 'Batch 3', date: 'Oct 24', status: 'Active' },
      { initials: 'JS', name: 'Jane Smith', email: 'jane@example.com', course: 'Advanced Node', batch: 'Batch 1', date: 'Oct 23', status: 'Pending' },
      { initials: 'AK', name: 'Arjun Kumar', email: 'arjun@example.com', course: 'UI/UX Design', batch: 'Batch 2', date: 'Oct 22', status: 'Active' },
    ];

    return NextResponse.json({ stats, registrations });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}