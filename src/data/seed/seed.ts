import { envs } from "../../config";
import { CategoryModel, ProductModel, UserModel } from "../index";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async()=>{
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();

    await MongoDatabase.disconnect();
});

// To pick a random element
const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x);

async function main(){
    // Limpiar DB
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);
    // Crear usuarios
    const users = await UserModel.insertMany([seedData.users]);

    // Crear categorias
    const categories = await CategoryModel.insertMany(seedData.categories.map(category =>{
        return {
            ...category,
            userId: users[0].id,
        };
    }));

    // Crear productos
    await ProductModel.insertMany(seedData.products.map(product =>{
        return {
            ...product,
            userId: users[randomBetween0AndX(users.length - 1)]._id,
            categoryId: categories[randomBetween0AndX(categories.length - 1)],
        };
    }));

    console.log('Seeded');
}