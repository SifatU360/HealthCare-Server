import jwt, { SignOptions } from 'jsonwebtoken';

const generateToken = (payload : any, secret: string, expiresIn: SignOptions["expiresIn"]): string => {
    
    const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn
    });
    return token;
}

export const jwtHelpers = {
    generateToken
}