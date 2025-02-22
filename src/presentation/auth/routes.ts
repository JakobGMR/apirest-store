import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";

export class AuthRoutes{
    static get routes(){
        const router = Router();
        const authService = new AuthService(); // Aqui se manda la inyección del servicio a utilizar

        const controller = new AuthController(authService);

        // Definir las rutas
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.get('/validate-email/:token', controller.validateEmail);

        return router;
    }
}