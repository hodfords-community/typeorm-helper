import { createConnection, getConnection } from 'typeorm';
import '../lib';
import { UserEntity } from '../sample/entities/user.entity';
import { UserRepository } from '../sample/repositories/user.repository';
import { loadRelations } from '../lib/helper';

describe('Test relations one to many', () => {
    beforeAll(async () => {
        await createConnection();
    });

    it('Single', async () => {
        let user = await UserEntity.createQueryBuilder().orderBy('random()').getOne();
        await user.loadRelation('posts');
        for (let post of user.posts) {
            expect(post.userId).toEqual(user.id);
        }
    });

    it('Multiple', async () => {
        let users = await UserEntity.createQueryBuilder().limit(10).orderBy('random()').getMany();
        await users.loadRelation('posts');

        for (let user of users) {
            for (let post of user.posts) {
                expect(post.userId).toEqual(user.id);
            }
        }
    });

    it('Multiple with repository', async () => {
        let userRepo = UserEntity.getRepository();
        let users = await userRepo.find();
        await users.loadRelation('posts');

        for (let user of users) {
            for (let post of user.posts) {
                expect(post.userId).toEqual(user.id);
            }
        }
    });

    it('Multiple with custom Repository', async () => {
        let userRepo = getConnection().getCustomRepository(UserRepository);
        let users = await userRepo.find();
        await users.loadRelation(['posts']);

        for (let user of users) {
            for (let post of user.posts) {
                expect(post.userId).toEqual(user.id);
            }
        }
    });

    it('Pagination', async () => {
        let userRepo = getConnection().getCustomRepository(UserRepository);
        let userPagination = await userRepo.pagination({}, { page: 1, perPage: 10 });
        await userPagination.loadRelation('posts');

        for (let user of userPagination.items) {
            for (let post of user.posts) {
                expect(post.userId).toEqual(user.id);
            }
        }
    });
});
