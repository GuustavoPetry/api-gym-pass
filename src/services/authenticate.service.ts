import { UsersRepository } from "@/repositories/users.repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
    email: string,
    password: string
}

interface AuthenticateServiceResponse {
    user: User
}

export class AuthenticateService {
    constructor(
        private usersRepository: UsersRepository
    ) {}

    async execute({ 
        email, 
        password 
    }: AuthenticateServiceRequest): Promise <AuthenticateServiceResponse> {
        // buscar usuário no banco pelo email
        const user = await this.usersRepository.findByEmail(email);

        //comparar se senha salva no banco coincide com senha enviada no request
        if (!user) {
            throw new InvalidCredentialsError();
        };

        const doesPasswordMatches = await compare(
            password,
            user.password_hash
        );

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        };

        return {
            user,
        };
    }
}