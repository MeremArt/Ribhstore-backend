import { MESSAGES } from "../configs/constants.config";
import IUser from "../interfaces/user.interface";
import BaseRepository from "../repositories/base.repository";
import User from "../models/user.model";
import HttpException from "../utils/helpers/httpException.util";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils/statusCodes.util";
import { isValidObjectId } from "mongoose";
const UserRepository = new BaseRepository(
    User
);
const { USER_NOT_FOUND } = MESSAGES.USER;

export default class UserService {

    async create(user: any) {
        try {

            return await UserRepository.create(user);

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findById(id: string) {
        try {

            if (!isValidObjectId(id)) {
                throw new HttpException(BAD_REQUEST, MESSAGES.NOT_ID);
            }
            const user = await UserRepository.findById(id);

            if (!user) throw new HttpException(NOT_FOUND, USER_NOT_FOUND);

            return user;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findByQuery(params: {}) {
        try {
            const user = await UserRepository.findOne(params);

            return user;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async find(params: {}) {
        try {
            const users = await UserRepository.find(params);

            return users;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

}
