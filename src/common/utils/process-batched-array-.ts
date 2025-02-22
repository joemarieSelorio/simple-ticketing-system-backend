import { Ticket } from '../../tickets/ticket.entity';

export const processBatchedArray = async (
  array: any[],
  batchSize: number,
  processBatch,
) => {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    await processBatch(batch);
  }
};