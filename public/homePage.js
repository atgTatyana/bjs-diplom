const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
	ApiConnector.logout(response => {
		// возвращает объект {success}
		if (response.success) {
			clearInterval(interval);
			location.reload();
		}
	});  
}

ApiConnector.current(response => {
	// возвращает объект {success: true, data: {данные профиля}}
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	} else {
		favoritesWidget.setMessage(false, "Ошибка загрузки данных профиля!");
	}
});

function getCurrencyExchangeRates() {
	ApiConnector.getStocks(response => {
		// возвращает объект {success: true, data: {данные курсов валют}}
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		} else {
			favoritesWidget.setMessage(false, "Ошибка загрузки курсов валют!");
		}
	});
}
getCurrencyExchangeRates();
let interval = setInterval(getCurrencyExchangeRates, 60000);

moneyManager.addMoneyCallback = data => {
	// data - это пользовательский ввод { currency, amount}
	ApiConnector.addMoney(data, response => {
		// возвращает объект {success, data: {обновлённые данные профиля} или error}
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Деньги добавлены на счет!");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

moneyManager.conversionMoneyCallback = data => {
	// data - это пользовательский ввод { fromCurrency, targetCurrency, fromAmount}
	ApiConnector.convertMoney(data, response => {
		// возвращает объект {success, data: {обновлённые данные профиля} или error}
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Конвертация выполнена!");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
}

moneyManager.sendMoneyCallback = data => {
	// data - это пользовательский ввод { to, amount, currency}
	ApiConnector.transferMoney(data, response => {
		// возвращает объект {success, data: {обновлённые данные профиля} или error}
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Перевод выполнен!");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});	
}

function updateFavorites(data) {
	favoritesWidget.clearTable();
	favoritesWidget.fillTable(data);
	moneyManager.updateUsersList(data);
}

ApiConnector.getFavorites(response => {
	// возвращает объект {success: true, data: {список избранных}}
	if (response.success) {
		updateFavorites(response.data);
	} else {
		favoritesWidget.setMessage(false, "Ошибка загрузки избранного!");
	}
});

favoritesWidget.addUserCallback = (data) => {
	// data - это пользовательский ввод {id, name}
	ApiConnector.addUserToFavorites(data, response => {
		// возвращает объект {success, data: {обновлённый список избранных} или error}
		if (response.success) {
			updateFavorites(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь добавлен в избранные!");
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	});
}

favoritesWidget.removeUserCallback = (userId) => {
	ApiConnector.removeUserFromFavorites(userId, response => {
		// возвращает объект {success: true, data: {обновлённый список избранных}}
		if (response.success) {
			updateFavorites(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь удалён из избранных!");
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	})
}