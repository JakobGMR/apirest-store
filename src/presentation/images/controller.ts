import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

export class ImageController{
    constructor(){}

    getImage = (req: Request, res: Response)=>{
        const {type = '', img = ''} = req.params;

        const imgPath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        if(!fs.existsSync(imgPath)) return res.status(404).send('Img not found');

        return res.sendFile(imgPath);
    }
}