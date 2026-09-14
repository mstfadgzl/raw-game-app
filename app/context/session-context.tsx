import React, { createContext, useContext } from 'react';

type SessionContextValue = {
    logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = ({
    logout,
    children,
}: SessionContextValue & { children: React.ReactNode }) => (
    <SessionContext.Provider value={{ logout }}>
        {children}
    </SessionContext.Provider>
);

export const useSession = () => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('useSession must be used inside SessionProvider');
    }

    return context;
};
