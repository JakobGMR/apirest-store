import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService{
    constructor(){}

    public async registerUser(registerUserDto: RegisterUserDto){
        // Validar que no se repitan emails
        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            // Encriptar contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // JWT <----- para mantener la autenticación del usuario

            //? Forma de ocultar el password, Hay Varias
            const {password, ...userEntity} = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'User Token',
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
}