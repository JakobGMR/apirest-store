import { Validators } from "../../../config";

export class CreateProductDto{
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly userId: string,
        public readonly categoryId: string,
    ){}

    static create(object: {[key: string]: any}): [string?, CreateProductDto?] {
        const {
            name,
            available,
            price,
            description,
            userId,
            categoryId,
        } = object;

        if(!name) return ['Missing name'];
        if(!userId) return ['Missing userId'];
        if(!Validators.isMongoId(userId)) return ['Invalid User Id'];
        if(!categoryId) return ['Missing categoryId'];
        if(!Validators.isMongoId(categoryId)) return ['Invalid Category Id'];

        return [, new CreateProductDto(
            name,
            !!available, // Doble negación para convertirlo en boolean
            price,
            description,
            userId,
            categoryId,
        )];
    }
}