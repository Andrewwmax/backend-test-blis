import { PrismaClient } from "@prisma/client";
import { UserDocument } from "../interfaces/userDocument";

const prisma = new PrismaClient();

export const getUserDocumentsService = async (
	user_id: string
): Promise<Pick<UserDocument, "id" | "name" | "url" | "created_at">[]> => {
	return prisma.userDocuments.findMany({
		where: { user_id },
		select: {
			id: true,
			name: true,
			url: true,
			created_at: true,
		},
	});
};

export const createUserDocumentService = async (
	name: string,
	user_id: string,
	filePath: string
): Promise<UserDocument> => {
	return prisma.userDocuments.create({
		data: {
			name,
			url: filePath,
			user_id,
		},
	});
};
