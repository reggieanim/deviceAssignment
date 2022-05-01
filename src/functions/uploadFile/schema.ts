export default {
  type: "object",
  properties: {
    email: { type: 'string' },
    filename: { type: 'string' }
  },
  required: ['email', 'filename']
} as const;
