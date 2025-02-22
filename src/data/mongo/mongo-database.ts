import mongoose from "mongoose";

interface ConnectionOptions{
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase{
    static async connect(options: ConnectionOptions){
        const {mongoUrl, dbName}= options;

        try {
            await mongoose.connect(mongoUrl, {dbName});
            // Si todo sale bien
            return true;
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }
}