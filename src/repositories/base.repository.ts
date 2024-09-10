import mongoose, { Document, Model, QueryOptions } from "mongoose";

export default class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>) {
        return await this.model.create(data);
    }

    async findOne(query: {}, projection?: {}, options?: QueryOptions) {
        return await this.model.findOne(query, projection, options);
    }

    async find(query: {} = {}, projection?: {}, options?: QueryOptions) {
        return await this.model.find(query, projection, options);
    }

    async findById(id: string) {
        return await this.model.findById(id);
    }

    async updateById(id: string, update: Partial<T>, options?: QueryOptions) {
        return await this.model.findByIdAndUpdate(id, update, { new: true, ...options });
    }

    async deleteById(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async countDocuments(query?: {}) {
        return await this.model.countDocuments(query);
    }

    async validateId(id: string) {
        return mongoose.Types.ObjectId.isValid(id);
    }
}
