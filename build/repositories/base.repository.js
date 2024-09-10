"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    findOne(query, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(query, projection, options);
        });
    }
    find() {
        return __awaiter(this, arguments, void 0, function* (query = {}, projection, options) {
            return yield this.model.find(query, projection, options);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    updateById(id, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, update, Object.assign({ new: true }, options));
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(id);
        });
    }
    countDocuments(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments(query);
        });
    }
    validateId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongoose_1.default.Types.ObjectId.isValid(id);
        });
    }
}
exports.default = BaseRepository;
