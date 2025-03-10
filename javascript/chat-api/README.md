# Setup

```
npm install
```

## Development

To run the development server with `nodemon`, use the following command:

```bash
npm run dev
```

## Production

To run the server in production mode, use the following command:

```bash
npm start
```

# Usage

## /chat

```
curl -X POST http://localhost:4007/chat \
    --header "content-type: application/json" \
    --header "accept: application/json" \
    -d '{"model": "gemma2:2b", "messages": [{"role": "user", "content": "good morning AI"}]}'
```

## /api/tags

```
curl -X GET http://localhost:4007/tags \
    --header "accept: application/json"
```

## /initialize_db

```
curl -X POST http://localhost:4007/initialize_db
```

## /create_chat_dialog

```
curl -X POST http://localhost:4007/create_chat_dialog \
    --header "content-type: application/json" \
    --header "accept: application/json" \
    -d '{"id": "unique-id", "description": "Chat description", "messages": [[{"role": "user", "content": "good morning AI"}]]}"}'
```

## /update_chat_dialog

```
curl -X POST http://localhost:4007/update_chat_dialog \
    --header "content-type: application/json" \
    --header "accept: application/json" \
    -d '{"id": "unique-id", "messages": [[{"role": "user", "content": "good morning AI"}]]}'
```

## /get_chat_dialog

```
curl -X POST http://localhost:4007/get_chat_dialog \
    --header "content-type: application/json" \
    --header "accept: application/json" \
    -d '{"id": "unique-id"}'
```
