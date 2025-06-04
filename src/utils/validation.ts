export const validateName = (name: string): boolean => {
    return /^[a-zA-Z\s-']+$/.test(name) && name.trim().length > 0;
};

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateZipCode = (zipCode: string): boolean => {
    return /^\d{5}$/.test(zipCode);
}; 