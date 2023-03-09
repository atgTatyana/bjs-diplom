const logoutButton = new LogoutButton;
logoutButton.action = () => {
	ApiConnector.logout(response => {
		// возвращает объект {success}
		if (response.success) {
			location.reload();
		}
	});  
}

ApiConnector.current(response => {
	// возвращает объект {success: true, data: {данные профиля}}
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});
 
const ratesBoard = new RatesBoard;
function getCurrencyExchangeRates() {
	ApiConnector.getStocks(response => {
		// возвращает объект {success: true, data: {данные курсов валют}}
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}
getCurrencyExchangeRates();
setInterval(getCurrencyExchangeRates, 60000);

const moneyManager = new MoneyManager;
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

const favoritesWidget = new FavoritesWidget;
ApiConnector.getFavorites(response => {
	// возвращает объект {success: true, data: {список избранных}}
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = (data) => {
	// data - это пользовательский ввод {id, name}
	ApiConnector.addUserToFavorites(data, response => {
		// возвращает объект {success, data: {обновлённый список избранных} или error}
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
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
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь удалён из избранных!");
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	})
}