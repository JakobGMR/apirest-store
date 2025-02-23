import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService{
    // DI
    constructor(
        private readonly emailService: EmailService,
    ){}

    public async registerUser(registerUserDto: RegisterUserDto){
        // Validar que no se repitan emails
        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            // Encriptar contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // Email de verificación
            await this.sendEmailValidationLink(user.email);

            // JWT <----- para mantener la autenticación del usuario
            const token = await JwtAdapter.generateToken({id: user.id});
            if(!token) throw CustomError.internalServer('Error while creating Token');

            //? Forma de ocultar el password, Hay Varias
            const {password, ...userEntity} = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto){
        // FindOne para verificar que si existe
        const user = await UserModel.findOne({email: loginUserDto.email});
        if(!user) throw CustomError.badRequest('Email is not registered');

        // isMatch bcrypt compare
        const isPassMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
        if(!isPassMatch) throw CustomError.badRequest('Credentials are not valid');

        const {password, ...userEntity} = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({id: user.id});
        if(!token) throw CustomError.internalServer('Error while creating Token');

        return {
            user: userEntity,
            token,
        };
    }

    public validateEmail = async(token: string)=>{
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid Token');
                                    // Solo para decirle a typescript de que incluye un email
        const {email} = payload as {email: string};
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();
    
        return true;
    };

    private sendEmailValidationLink = async(email: string)=>{
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalServer('Error getting token');

        // Link de verificación del usuario
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>

            <a href="${link}">Validate your email: ${email}</a>
        `;

        const emailOptions = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(emailOptions);
        if(!isSent) throw CustomError.internalServer('Error sending email');

        return true;
    };
}