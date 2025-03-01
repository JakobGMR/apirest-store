import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService{
    constructor(){}

    async getProducts(paginationDto: PaginationDto){
        const {page, limit} = paginationDto;

        try {
            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip((page-1) * limit) // skip salta datos o registros. Es base 0. Se usa una ecuación para calcular los datos a traer
            //     .limit(limit);

            //* Juntar varios metodos asyncronos en uno
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page-1) * limit) // skip salta datos o registros. Es base 0. Se usa una ecuación para calcular los datos a traer
                    .limit(limit)
                    .populate('userId')
                    .populate('categoryId'), // traer el dato extra
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/products?page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${(page - 1)}&limit=${limit}` : null,
                products: products,
            };
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    };

    async createProduct(createProductDto: CreateProductDto){
        const productExists = await ProductModel.findOne({name: createProductDto.name});
        if(productExists) throw CustomError.badRequest('Product already exists');

        // try catch siempre para cosas que nosotros no controlemos como base de datos
        try {
            const product = new ProductModel({...createProductDto});
            await product.save();

            return product; // Retornar el modelo total
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    };
}