import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware{
    static async validateJwt(req: Request, res: Response, next: NextFunction){
        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json('No token provided');
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer Token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateToken<{id: string}>(token);
            if(!payload) return res.status(401).json({error: 'Invalid token'});

            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error: 'Invalid token - user'});
            // Añadir al usuario a la categoría para vincularlo o relacionarlo
            req.body.user = UserEntity.fromObject(user);

            next(); // Para proceder con el siguiente middleware o ya pasa con el controlador de ruta
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}