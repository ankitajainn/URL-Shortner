import jwt from 'jsonwebtoken';
import {userTokenSchema} from '../validations/token.validation.js'

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload) {
    const validationResult =userTokenSchema.safeParse(payload)

if(validationResult.error) throw new Error(validationResult.error.messge)

    const payloadValidatedResult=validationResult.data;

  const token = jwt.sign(payload, JWT_SECRET);
  return token;
}

export function validateUserToken(token){
    try{
        const payload=jwt.verify(token,JWT_SECRET)
        return payload;
    }
    catch(error){
        return null;
    }
    const payload=jwt.verify(token,JWT_SECRET)
}