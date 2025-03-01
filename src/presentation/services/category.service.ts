import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class CategoryService{
    constructor(){}

    async getCategories(paginationDto: PaginationDto){
        const {page, limit} = paginationDto;

        try {
            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip((page-1) * limit) // skip salta datos o registros. Es base 0. Se usa una ecuación para calcular los datos a traer
            //     .limit(limit);

            //* Juntar varios metodos asyncronos en uno
            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page-1) * limit) // skip salta datos o registros. Es base 0. Se usa una ecuación para calcular los datos a traer
                    .limit(limit),
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/categories?page=${(page - 1)}&limit=${limit}` : null,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available,
                }))
            };
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    };

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity){
        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});
        if(categoryExists) throw CustomError.badRequest('Category already exists');

        // try catch siempre para cosas que nosotros no controlemos como base de datos
        try {
            const category = new CategoryModel({...createCategoryDto, user: user.id});
            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            };
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    };
}