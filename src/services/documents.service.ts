import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserDocumentsService = async (user_id: string) => {
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

export const createUserDocumentService = async (name: string, user_id: string, filePath: string) => {
	return prisma.userDocuments.create({
		data: {
			name,
			url: filePath,
			user_id,
		},
	});
};
