import express from 'express';
import debugUser from 'debug';


const router = express.Router();


router.use(express.urlencoded({ extended: false }));

const usersArray = [
  {
    id: 'u1',
    email: 'alice@example.com',
    password: 'password123',
    givenName: 'Alice',
    familyName: 'Smith',
    role: 'admin',
    createdAt: '2025-09-01T10:00:00.000Z'
  },
  {
    id: 'u2',
    email: 'bob@example.com',
    password: 'password456',
    givenName: 'Bob',
    familyName: 'Johnson',
    role: 'user',
    createdAt: '2025-09-02T11:00:00.000Z'
  },
  {
    id: 'u3',
    email: 'carol@example.com',
    password: 'password789',
    givenName: 'Carol',
    familyName: 'Williams',
    role: 'user',
    createdAt: '2025-09-03T12:00:00.000Z'
  }
];

router.get('/list', (req, res) => {
    debugUser('GET /api/user/list called');
  res.json(usersArray);

});


router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = usersArray.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: `User ${userId} not found.` });
  }
  res.json(user);
});


import { nanoid } from 'nanoid';

router.post('/register', (req, res) => {
  const { email, password, givenName, familyName, role } = req.body;
  let invalid = [];
  if (!email || typeof email !== 'string' || !email.trim()) invalid.push('email');
  if (!password || typeof password !== 'string' || !password.trim()) invalid.push('password');
  if (!givenName || typeof givenName !== 'string' || !givenName.trim()) invalid.push('givenName');
  if (!familyName || typeof familyName !== 'string' || !familyName.trim()) invalid.push('familyName');
  if (!role || typeof role !== 'string' || !role.trim()) invalid.push('role');
  if (invalid.length > 0) {
    return res.status(400).type('text/plain').send(`Invalid or missing: ${invalid.join(', ')}`);
  }
  if (usersArray.find(u => u.email === email.trim())) {
    return res.status(400).type('text/plain').send('Email already registered.');
  }
  const newUser = {
    id: nanoid(),
    email: email.trim(),
    password: password.trim(),
    givenName: givenName.trim(),
    familyName: familyName.trim(),
    role: role.trim(),
    createdAt: new Date().toISOString()
  };
  usersArray.push(newUser);
  res.status(200).type('text/plain').send('New user registered!');
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).type('text/plain').send('Please enter your login credentials.');
  }
  const user = usersArray.find(u => u.email === email && u.password === password);
  if (user) {
    res.status(200).type('text/plain').send('Welcome back!');
  } else {
    res.status(404).type('text/plain').send('Invalid login credential provided. Please try again.');
  }
});


router.put('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = usersArray.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).type('text/plain').send(`User ${userId} not found.`);
  }
  const { password, fullName, givenName, familyName, role } = req.body;
  if (password && typeof password === 'string' && password.trim()) user.password = password.trim();
  if (fullName && typeof fullName === 'string' && fullName.trim()) user.fullName = fullName.trim();
  if (givenName && typeof givenName === 'string' && givenName.trim()) user.givenName = givenName.trim();
  if (familyName && typeof familyName === 'string' && familyName.trim()) user.familyName = familyName.trim();
  if (role && typeof role === 'string' && role.trim()) user.role = role.trim();
  user.lastUpdated = new Date().toISOString();
  res.status(200).type('text/plain').send('User updated!');
});





router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  const idx = usersArray.findIndex(u => String(u.id) === String(userId));
  if (idx === -1) {
    return res.status(404).type('text/plain').send(`User ${userId} not found.`);
  }
  usersArray.splice(idx, 1);
  res.status(200).type('text/plain').send('User deleted!');
});

export { router as UserRouter };