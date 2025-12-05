const CHATBOT_API_URL = 'api/chatbot.php';

function initChatbot()
{
	const toggle = document.getElementById('chatbot-toggle');
	const window = document.getElementById('chatbot-window');
	const messages = document.getElementById('chatbot-messages');
	const input = document.getElementById('chatbot-input');
	const send = document.getElementById('chatbot-send');
	if (!toggle) return;
	toggle.onclick = () => window.classList.toggle('open');

	function addMessage(text, isBot)
	{
		const msg = document.createElement('div');
		msg.className = 'chat-msg ' + (isBot ? 'bot' : 'user');
		msg.textContent = text;
		messages.appendChild(msg);
		messages.scrollTop = messages.scrollHeight;
	}

	function addTypingIndicator()
	{
		const indicator = document.createElement('div');
		indicator.className = 'chat-msg bot';
		indicator.id = 'typing-indicator';
		indicator.textContent = '...';
		messages.appendChild(indicator);
		messages.scrollTop = messages.scrollHeight;
		return indicator;
	}

	function removeTypingIndicator()
	{
		const indicator = document.getElementById('typing-indicator');
		if (indicator) indicator.remove();
	}
	async function sendMessage()
	{
		const text = input.value.trim();
		if (!text) return;
		addMessage(text, false);
		input.value = '';
		send.disabled = true;
		input.disabled = true;
		addTypingIndicator();
		try
		{
			const response = await fetch(CHATBOT_API_URL,
			{
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
				{
					message: text
				})
			});
			removeTypingIndicator();
			const data = await response.json();
			if (response.status === 429)
			{
				addMessage(data.message || 'Trop de questions existentielles! Patiente un peu...', true);
			}
			else if (!response.ok)
			{
				addMessage(data.message || 'Une erreur cosmique s\'est produite...', true);
			}
			else
			{
				addMessage(data.message, true);
			}
		}
		catch (error)
		{
			removeTypingIndicator();
			addMessage('Le manchot est parti pêcher... Réessaie plus tard.', true);
		}
		send.disabled = false;
		input.disabled = false;
		input.focus();
	}
	send.onclick = sendMessage;
	input.onkeypress = (e) =>
	{
		if (e.key === 'Enter' && !send.disabled) sendMessage();
	};
}
document.addEventListener('DOMContentLoaded', initChatbot);