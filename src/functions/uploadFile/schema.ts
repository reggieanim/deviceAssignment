export default {
  type: "object",
  properties: {
    notification: { type: 'string' },
    filename: { type: 'string' }
  },
  required: ['email', 'filename']
} as const;
