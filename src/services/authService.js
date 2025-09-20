const loadUsers = () => {
    const storedUsers = localStorage.getItem('mockUsers');
    return storedUsers ? JSON.parse(storedUsers) : {
        'staff@example.com': { password: 'password', role: 'staff' },
        'admin@example.com': { password: 'password', role: 'admin' },
    };
};

const saveUsers = (users) => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
};

export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = loadUsers();
            const user = users[email];
            if (user && user.password === password) {
                console.log(`User ${email} logged in with role: ${user.role}`);
                resolve({ email, role: user.role });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 500);
    });
};

export const signup = async (email, password, role) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = loadUsers();
            if (users[email]) {
                return reject(new Error('User already exists'));
            }
            users[email] = { password, role };
            saveUsers(users);
            console.log(`New user ${email} signed up with role: ${role}`);
            resolve({ email, role });
        }, 500);
    });
};