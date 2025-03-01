import { Router } from "express";
import { CategoryController } from "./controller";
import { envs } from "../../config";
import { CategoryService } from "../services/category.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class CategoryRoutes{
    static get routes(){
        const router = Router();

        const categoryService = new CategoryService(); // Aqui se manda la inyección del servicio a utilizar
        const controller = new CategoryController(categoryService);

        // Definir las rutas
        router.get('/', controller.getCategories);
        router.post('/', AuthMiddleware.validateJwt, controller.createCategory);

        return router;
    }
}