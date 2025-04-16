const telegram = window.Telegram.WebApp;
telegram.ready(); // Сообщаем Telegram, что приложение готово

const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const noiseButtons = document.querySelectorAll('.noise-button');
const audioPlayer = document.getElementById('audio-player');

let currentAudio = null; // Хранит текущую играющую кнопку

// Функция переключения вкладок
function openTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabId}')"]`).classList.add('active');

    // Меняем фон body в зависимости от активной вкладки
    if (tabId === 'white-noise') {
        document.body.style.backgroundColor = '#222';
    } else {
        document.body.style.backgroundColor = '#f4f4f4';
    }
}

// Функция обработки нажатия на кнопку белого шума
function handleNoiseButtonClick(event) {
    const button = event.target;
    const audioSrc = button.dataset.audio;

    // Если нажата та же кнопка, которая сейчас играет - останавливаем
    if (button === currentAudio && !audioPlayer.paused) {
        audioPlayer.pause();
        button.classList.remove('playing');
        currentAudio = null;
    } else {
        // Останавливаем предыдущий звук, если он был
        if (currentAudio) {
            currentAudio.classList.remove('playing');
        }

        // Запускаем новый звук
        audioPlayer.src = audioSrc;
        audioPlayer.play().catch(error => {
            console.error("Ошибка воспроизведения:", error);
            // Можно добавить уведомление для пользователя
            telegram.showAlert("Не удалось воспроизвести аудио. Попробуйте еще раз.");
        });
        button.classList.add('playing');
        currentAudio = button;
    }
}

// Назначаем обработчики событий
noiseButtons.forEach(button => {
    button.addEventListener('click', handleNoiseButtonClick);
});

// Инициализация: открываем первую вкладку по умолчанию
openTab('white-noise');
