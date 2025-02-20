import React from 'react';
import marked from 'marked';
import DOMPurify from 'dompurify';

interface ChatDialogOptions {
    id?: string;
    classes?: string[];
    style?: React.CSSProperties;
}

interface ChatDialogApp {
    id?: string;
    addMessage: (sender: string, message: string) => void;
    clearMessages: () => void;
}

export default function ChatDialog(options: ChatDialogOptions): HTMLDivElement {
    const chatDialog = document.createElement('div');

    if (options.id) {
        chatDialog.id = options.id;
    }

    chatDialog.classList.add('message');

    if (options.classes) {
        for (let className of options.classes) {
        chatDialog.classList.add(className);
        }
    }

    if (options.style) {
        Object.assign(chatDialog.style, options.style);
    }
    chatDialog.style.overflowY = 'scroll';

    const chatDialogApp: ChatDialogApp = {
        id: options.id,
        addMessage: (sender, message) => { addMessage(options.id, sender, message); },
        clearMessages: () => { clearMessages(options.id); }
    };

    (chatDialog as any).app = chatDialogApp;

    return chatDialog;
}

function addMessage(chatDialogId: string | undefined, sender: string, message: string): void {
    const chatDialog = document.getElementById(chatDialogId || '');
    if (!chatDialog) return;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');

    iconSpan.innerHTML = sender === 'user' ?
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    contentDiv.innerHTML = message;

    /*
    contentDiv.innerHTML = marked.parse(message, {
        breaks: true,
        gfm: true,
        });
        // const sanitizedHTML = DOMPurify.sanitize(parsedHTML);
        contentDiv.innerHTML = parsedHTML;
    });
    */

    messageDiv.appendChild(iconSpan);
    messageDiv.appendChild(contentDiv);

    chatDialog.appendChild(messageDiv);

    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearMessages(chatDialogId: string | undefined): void {
    const chatDialog = document.getElementById(chatDialogId || '');

    if (chatDialog) {
        chatDialog.innerHTML = "";
    }
}

