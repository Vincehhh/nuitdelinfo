const quizData = [
{
	question: "Que signifie NIRD ?",
	options: ["Numérique Inclusif Responsable Durable", "Nouveau Internet Rapide et Décentralisé", "Norme Internationale de Recyclage Digital", "Network of Independent Research Domains"],
	correct: 0
},
{
	question: "Quelle est la principale menace pour les PC des écoles en 2025 ?",
	options: ["Les virus informatiques", "La fin du support de Windows 10", "Le manque de connexion internet", "Les coupures électriques"],
	correct: 1
},
{
	question: "Quel système d'exploitation libre permet de prolonger la vie des ordinateurs ?",
	options: ["Windows 11", "macOS", "Linux", "ChromeOS"],
	correct: 2
},
{
	question: "Où est né le projet NIRD ?",
	options: ["Lycée Henri IV, Paris", "Lycée Carnot, Bruay-la-Buissière", "Université de Bordeaux", "École Polytechnique"],
	correct: 1
},
{
	question: "Quel est l'avantage principal des logiciels libres pour l'éducation ?",
	options: ["Ils sont plus beaux", "Transparence, souveraineté et gratuité", "Ils sont plus lents mais plus sûrs", "Ils nécessitent moins de RAM"],
	correct: 1
}];
let currentQuestion = 0;
let score = 0;

function initQuiz()
{
	const progress = document.getElementById('quiz-progress');
	if (!progress) return;
	progress.innerHTML = '';
	for (let i = 0; i < quizData.length; i++)
	{
		const pip = document.createElement('div');
		pip.className = 'progress-pip' + (i === 0 ? ' active' : '');
		progress.appendChild(pip);
	}
	showQuestion();
}

function showQuestion()
{
	const q = quizData[currentQuestion];
	document.getElementById('quiz-title')
		.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
	document.getElementById('quiz-question')
		.textContent = q.question;
	document.getElementById('quiz-result')
		.style.display = 'none';
	const container = document.getElementById('quiz-options');
	container.innerHTML = '';
	q.options.forEach((opt, i) =>
	{
		const btn = document.createElement('button');
		btn.className = 'quiz-option';
		btn.textContent = opt;
		btn.onclick = () => selectAnswer(i);
		container.appendChild(btn);
	});
	const pips = document.querySelectorAll('.progress-pip');
	pips.forEach((pip, i) =>
	{
		pip.classList.remove('active');
		if (i === currentQuestion) pip.classList.add('active');
	});
}

function selectAnswer(index)
{
	const q = quizData[currentQuestion];
	const options = document.querySelectorAll('.quiz-option');
	const result = document.getElementById('quiz-result');
	options.forEach((opt, i) =>
	{
		opt.style.pointerEvents = 'none';
		if (i === q.correct) opt.classList.add('correct');
		else if (i === index && i !== q.correct) opt.classList.add('wrong');
	});
	if (index === q.correct)
	{
		score++;
		result.textContent = '✓ Correct !';
		result.style.background = 'rgba(163, 230, 53, 0.15)';
		result.style.color = '#a3e635';
	}
	else
	{
		result.textContent = '✗ Incorrect';
		result.style.background = 'rgba(248, 113, 113, 0.15)';
		result.style.color = '#f87171';
	}
	result.style.display = 'block';
	document.querySelectorAll('.progress-pip')[currentQuestion].classList.add('done');
	setTimeout(() =>
	{
		currentQuestion++;
		if (currentQuestion < quizData.length)
		{
			showQuestion();
		}
		else
		{
			showFinalResult();
		}
	}, 1400);
}

function showFinalResult()
{
	document.getElementById('quiz-title')
		.textContent = 'Résultat Final';
	document.getElementById('quiz-question')
		.textContent = `Score : ${score}/${quizData.length}`;
	document.getElementById('quiz-options')
		.innerHTML = '';
	const result = document.getElementById('quiz-result');
	let message;
	if (score === quizData.length)
	{
		message = '🏆 Parfait ! Vous êtes prêt à rejoindre la résistance !';
		result.style.background = 'rgba(163, 230, 53, 0.15)';
		result.style.color = '#a3e635';
	}
	else if (score >= 3)
	{
		message = '👍 Bien joué ! Quelques révisions et ce sera parfait.';
		result.style.background = 'rgba(251, 191, 36, 0.15)';
		result.style.color = '#fbbf24';
	}
	else
	{
		message = '📚 Explorez le site pour en apprendre plus sur NIRD !';
		result.style.background = 'rgba(236, 72, 153, 0.15)';
		result.style.color = '#ec4899';
	}
	result.textContent = message;
	result.style.display = 'block';
	const restart = document.createElement('button');
	restart.className = 'btn btn-secondary';
	restart.textContent = 'Recommencer';
	restart.style.marginTop = '20px';
	restart.onclick = () =>
	{
		currentQuestion = 0;
		score = 0;
		initQuiz();
	};
	document.getElementById('quiz-options')
		.appendChild(restart);
}
document.addEventListener('DOMContentLoaded', initQuiz);