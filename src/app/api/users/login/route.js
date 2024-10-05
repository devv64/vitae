import User from '@/models/User';
import connectDB from '@/utils/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await connectDB();

  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found!' }), { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: 'Invalid credentials!' }), { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ token }), { status: 200 });
}
