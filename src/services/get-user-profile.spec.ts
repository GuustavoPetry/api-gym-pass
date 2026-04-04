import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileService } from "./get-user-profile.service";
import { describe, expect, it } from "vitest";
import { beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileService(usersRepository);
    });

    it("should be able to get user profile", async () => {

        const createdUser = await usersRepository.create({
            name: "Gustavo Petry",
            email: "gustavo@gmail.com",
            password_hash: await hash("123456", 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.email).toEqual(createdUser.email);
    });

    it("should not be able to get profile with wrong id", async () => {
        await expect(() => 
            sut.execute({
                userId: "non-existing-userId"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    })

});