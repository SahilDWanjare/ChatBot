# 💀 Tatya Vinchu AI Chatbot

A fun, horror-themed chatbot application built with **React (TypeScript)** and powered by **Google's Gemini API** for generating chat responses, and **Fal.ai** for text-to-image generation. The bot, styled as the mischievous Indian puppet character Tatya Vinchu, communicates in character and can generate and modify images on command.
### (Due to lack of free gemini 2.5 flash image generator API credits this fucntion will not work until its revoked with a paid plan).

## 😂You will definately enjoy using this mischief making chatbot here: https://chat-bot-gamma-weld.vercel.app/
<div align="center">
  <img 
    width="438" 
    height="775" 
    alt="Screenshot 2025-11-21 084141" 
    src="https://github.com/user-attachments/assets/d2b69c34-e7b3-4661-91b5-8795648d116e" 
  />
</div>

## ✨ Features

* **Tatya Vinchu Persona:** A dedicated `systemInstruction` ensures the bot replies with a funny, witty, and slightly scary persona, often using the catchphrase 'Om Bhatt Swaha'.
* **Gemini Chat (Text):** Uses `generateChatResponse` with `gemini-2.5-flash` for high-speed, engaging conversation.
* **Image Generation (Text-to-Image):** Uses the `fal-ai/flux/dev` model via the **Fal.ai** client to create new images based on user prompts.
* **Image Modification (Image-to-Image):** Uses the **Gemini API** (`gemini-2.5-flash-image` with `responseModalities: [Modality.IMAGE]`) to modify an uploaded image based on a text prompt.
* **Responsive UI:** A dark, horror-themed user interface built with **Tailwind CSS**.

## 🚀 Getting Started

### Prerequisites

You will need the following accounts and keys:

1.  **Google Gemini API Key:** Get a key from Google AI Studio.
2.  **Fal.ai API Key:** Get a key from [Fal.ai](https://www.fal.ai/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [use the repo link after making a fork]
    cd [use the project directory name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` or `.env.local` in the root directory and add your keys:

    ```env
    # .env.local
    VITE_API_KEY="YOUR_GEMINI_API_KEY"
    VITE_FAL_KEY="YOUR_FAL_AI_API_KEY" 
    ```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```
### AND YOU ARE GOOD TO GO 😉
