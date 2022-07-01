/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
//import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultMessage = Prisma.validator<Prisma.MessageSelect>()({
    id: true,
    user : true,
    text: true,
    createdAt: true,
    updatedAt: true,
});

export const messageRouter = createRouter()
    .mutation('add', {
        input: z.object({
            id: z.string().uuid().optional(),
            user: z.string(),
            text: z.string().min(1),
        }),
        async resolve({ input }){
            const message = await prisma.message.create({
                data: input,
                select: defaultMessage,
            });
            return message;
        },
    })
    .query('byID',{
        input: z.object({
            id: z.string().uuid().optional(),
        }),
        async resolve({input}){
            const { id } = input;
            const usermessage = await prisma.message.findUnique({
                where: { id },
                select: defaultMessage,
            });
            
            if(!usermessage){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cannot find user message",
                });
            }
            return usermessage;
        },
    })
    .query('allUserMessages',{
        input: z.object({
            user: z.string(),
        }),
        async resolve({input}){
            const { user } = input;
            const messages = await prisma.message.findMany({
                where: { user },
            });
            if(!messages){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cannot find any user messages",
                });
            }

            return messages;
        }
    })
