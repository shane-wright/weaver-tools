# Setup

```
npm install
npm start
```

## Development

To run the development server with `nodemon`, use the following command:

```bash
npm run dev
```

# Usage

## /chat

```
curl -X POST http://localhost:4007/chat \
    --header "content-type: application/json" \
    --header "accept: application/json" \
    -d '{"model": "gemma2:2b", "messages": [{"role": "user", "content": "good morning AI"}]}'
```

