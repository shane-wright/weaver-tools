# Palantir AI Chatbot

This document explains how the local AI chatbot functions, focusing on the architecture, functionality, and the methods used to make the AI context-aware for specific use cases. The goal is to provide a lightweight, locally hosted chatbot that’s both useful and efficient.

---

## How It Works

The system is built around three main components: **Ollama** for hosting the local AI, a **Node.js API** to manage communication, and a **React/Typescript UI** for user interaction. Here’s a breakdown of how everything fits together:

### Ollama: The Local AI Host
Ollama hosts the AI model locally, and for this POC, we’re using **Gemma2b**. It’s a small model that runs smoothly on most laptops but still packs enough capability to handle meaningful tasks. Ollama provides the endpoint that the Node.js API interacts with.

### Node.js API: The Middleman
The Node.js API acts as the bridge between the UI and Ollama. It handles all the communication, sending user inputs to Ollama and managing functions like chat or message arrays. It’s designed to be flexible, making it easy to add or modify functionality as needed.

### React/Typescript UI: The User Interface
The UI is where users interact with the chatbot. Built with React and Typescript, it’s fast, responsive, and easy to use. It takes user input, sends it to the Node.js API, and displays the AI’s responses in real-time.

---

## Making the AI Context-Aware

To make the AI useful for specific use cases, we explored two approaches:

### Option 1: EmbedChain with RAG (The Overkill Approach)
This method uses **EmbedChain** alongside Ollama to perform **Retrieval-Augmented Generation (RAG)**. It’s a powerful way to make smaller models aware of specific datasets, ensuring the AI prioritizes relevant information in its responses. While it’s more resource-intensive, it’s great for scenarios where the dataset is critical to the AI’s performance.

### Option 2: Context Window Manipulation (The Faster Approach)
This approach takes advantage of Ollama’s built-in functionality. By sending a pre-defined message array with all the necessary context and instructions at startup, we can "prime" the AI before the user even starts typing. Surprisingly, this method often produces better results than RAG, and it’s much quicker to implement. It’s ideal for smaller datasets or when speed is a priority.

---

## What We Learned

Both approaches have their strengths. The RAG method is better for larger datasets, while the context window manipulation is faster and often produces higher-quality outputs. The Gemma2b model, combined with Ollama, proved to be a great choice for local deployment, balancing performance and resource usage.

---

## What’s Next?

- **Customization**: Tailor the system to the client’s specific needs and datasets.  
- **Optimization**: Fine-tune the context window manipulation for even better results.  
- **Testing**: Evaluate how the system handles larger datasets and more complex queries.  

---

This POC shows that a lightweight, locally hosted AI chatbot is not only feasible but also highly effective. By combining Ollama, a Node.js API, and a React/Typescript UI, we’ve created a system that’s both powerful and easy to use. Whether using RAG or context window manipulation, the results are promising, and the system is ready for further customization and testing.
