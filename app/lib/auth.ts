/**
 * Authentication utilities for the document generator application
 * Uses sessionStorage for session-based authentication (clears on browser close)
 */

export interface User {
    username: string;
}

// Hardcoded user credentials
const VALID_USERS = [
    { username: "Najih", password: "najih123" },
    { username: "Vishnu", password: "vishnu123" },
    { username: "Nidheesh", password: "nidhe123" },
];

const SESSION_KEY = "auth_user";

/**
 * Validate credentials and create a session
 * @param username - Username to validate
 * @param password - Password to validate
 * @returns User object if valid, null if invalid
 */
export function login(username: string, password: string): User | null {
    const user = VALID_USERS.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const sessionUser: User = { username: user.username };
        if (typeof window !== "undefined") {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        }
        return sessionUser;
    }

    return null;
}

/**
 * Clear the current session
 */
export function logout(): void {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
    }
}

/**
 * Get the currently logged-in user
 * @returns User object if logged in, null otherwise
 */
export function getUser(): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const userJson = sessionStorage.getItem(SESSION_KEY);
    if (!userJson) {
        return null;
    }

    try {
        return JSON.parse(userJson) as User;
    } catch {
        return null;
    }
}

/**
 * Check if a user is currently authenticated
 * @returns true if authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
    return getUser() !== null;
}
