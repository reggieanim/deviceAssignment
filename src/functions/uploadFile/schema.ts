export default {
  type: "object",
  properties: {
    notification: { type: 'string' },
    filename: { type: 'string' }
  },
  required: ['notification', 'filename']
} as const;
