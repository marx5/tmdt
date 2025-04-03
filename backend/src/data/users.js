import bcryptjs from 'bcryptjs';

// Khai báo mật khẩu trước
const adminPassword = 'admin123';
const userPassword1 = 'piyush123';
const userPassword2 = 'johndoe123';

// Hash mật khẩu
const hashedAdminPassword = bcryptjs.hashSync(adminPassword);
const hashedUserPassword1 = bcryptjs.hashSync(userPassword1);
const hashedUserPassword2 = bcryptjs.hashSync(userPassword2);

const users = [
    { name: 'Admin', email: 'admin@proshop.com', password: hashedAdminPassword, isAdmin: true },
    { name: 'Piyush Saha', email: 'piyush@example.com', password: hashedUserPassword1 },
    { name: 'John Doe', email: 'john@exmaple.com', password: hashedUserPassword2 }
];

export default users;