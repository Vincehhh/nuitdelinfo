const responses = ["Je ne comprends rien"];

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

	function getResponse()
	{
		return responses[Math.floor(Math.random() * responses.length)];
	}

	function sendMessage()
	{
		const text = input.value.trim();
		if (!text) return;
		addMessage(text, false);
		input.value = '';
		setTimeout(() => addMessage(getResponse(), true), 500 + Math.random() * 700);
	}
	send.onclick = sendMessage;
	input.onkeypress = (e) =>
	{
		if (e.key === 'Enter') sendMessage();
	};
}
document.addEventListener('DOMContentLoaded', initChatbot);