import { z } from 'zod';

export const SortingOperatorSchema = z.union([
  z.literal('equal'),
  z.literal('notEqual'),
  z.literal('greaterThan'),
  z.literal('greaterThanOrEqual'),
  z.literal('lessThan'),
  z.literal('lessThanOrEqual'),
  z.literal('include'),
  z.literal('notInclude'),
]);
