const userForm = new UserForm();

userForm.loginFormCallback = data => {
	// data - это пользовательский ввод { login, password }
	ApiConnector.login(data, response => {
		// возвращает объект {success, error}
		if (response.success === true) {
			location.reload();							// обновить страницу
		} else {
			userForm.setLoginErrorMessage(response.error);
		}
	})
}

userForm.registerFormCallback = data => {
	ApiConnector.register(data, response => {
		if (response.success === true) {
			location.reload();
		} else {
			userForm.setRegisterErrorMessage(response.error);
		}
	})
}


// ApiConnector.login({login: "ivan@demo.ru", password: "demo"}, response => console.log(response));
// ApiConnector.logout(response => console.log(response));
// userForm.loginFormCallback = data => console.log(data);