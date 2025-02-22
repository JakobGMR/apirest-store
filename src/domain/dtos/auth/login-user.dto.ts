import { regularExps } from "../../../config";

export class LoginUserDto{
    private constructor(
        public email: string,
        public password: string,
    ){}

    static create(object: {[key: string]: any}): [string?, LoginUserDto?] {
        const {email, password} = object;

        if(!email) return ['Email is missing'];
        if(!regularExps.email.test(email)) return ['Email must be valid'];
        if(!password) return ['Password is missing'];
        if(password.length < 6) return ['Password is too short'];

        return [, new LoginUserDto(email, password)];
    }
}