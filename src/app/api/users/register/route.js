import User from '@/models/User';
import connectDB from '@/utils/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  await connectDB();

  const { username, email, password } = await request.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists!' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  return new Response(JSON.stringify({ message: 'User registered successfully!' }), { status: 201 });
}
