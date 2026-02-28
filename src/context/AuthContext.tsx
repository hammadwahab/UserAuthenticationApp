import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type User = {
  name: string;
  email: string;
};

type StoredUser = User & {
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const USERS_KEY = '@konnect/users';
const CURRENT_USER_KEY = '@konnect/current-user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function readUsers(): Promise<StoredUser[]> {
  const rawUsers = await AsyncStorage.getItem(USERS_KEY);
  if (!rawUsers) return [];
  try {
    const parsed = JSON.parse(rawUsers) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const rawCurrentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (rawCurrentUser) {
          setUser(JSON.parse(rawCurrentUser) as User);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession().catch(() => {
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const { email, password } = data;
      const normalizedEmail = email.trim().toLowerCase();
      const users = await readUsers();

      const existingUser = users.find(
        storedUser => storedUser.email.toLowerCase() === normalizedEmail,
      );

      if (!existingUser) {
        throw new Error('User not found.');
      }

      if (existingUser.password !== password) {
        throw new Error('Incorrect credentials. Please try again.');
      }

      const sessionUser: User = {
        name: existingUser.name,
        email: existingUser.email,
      };

      setUser(sessionUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    },
    [],
  );

  const signup = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const { name, email, password } = data;
      const users = await readUsers();
      const normalizedEmail = email.trim().toLowerCase();

      const emailExists = users.some(
        existingUser => existingUser.email.toLowerCase() === normalizedEmail,
      );

      if (emailExists) {
        throw new Error('An account with this email already exists.');
      }

      const newStoredUser: StoredUser = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      const updatedUsers = [...users, newStoredUser];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      const sessionUser: User = {
        name: newStoredUser.name,
        email: newStoredUser.email,
      };

      setUser(sessionUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [isLoading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
