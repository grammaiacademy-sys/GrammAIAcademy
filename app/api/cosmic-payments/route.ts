import { createCosmicPaymentsHandler } from 'cosmic-payments/server';
import { getServerSession } from 'cosmic-authentication';

const handler = createCosmicPaymentsHandler({
  getServerSession
});

export const POST = handler;