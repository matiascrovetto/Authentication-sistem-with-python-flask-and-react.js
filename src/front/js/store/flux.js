const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			API_URL: 'https://3001-matiascrove-authenticat-me51ialy9h6.ws-us99.gitpod.io',
			currentUser: null,
			error: null,
		},
		actions: {

			register: async (e, navigate) => {
				//Login
				e.preventDefault()

				try {
					const { API_URL } = getStore()
					const { full_name, email, password } = e.target;
					const credentials = {
						full_name: full_name?.value,
						email: email?.value,
						password: password?.value,
					}

					const options = {
						method: 'POST',
						body: JSON.stringify(credentials),
						headers: {
							'Content-Type': 'application/json'
						}
					}

					const response = await fetch(`${API_URL}/api/signup`, options)
					const data = await response.json()

					if (data.msg) {
						setStore({
							currentUser: null,
							error: data
						})

					} else {
						// Agregando la propiedad justRegistered al objeto data (currentUser)
						data.justRegistered = true;

						setStore({
							currentUser: data,
							error: null
						})
						sessionStorage.setItem('currentUser', JSON.stringify(data))
						navigate('/')
					}

				} catch (error) {
					console.log(error.message);

				}
			},	// Use getActions to call a function within a fuction

			login: async (e, navigate) => {
				e.preventDefault()
				try {
					const { API_URL } = getStore()
					const { email, password } = e.target;
					const credentials = { email: email.value, password: password.value }

					const options = {
						method: 'POST',
						body: JSON.stringify(credentials),
						headers: {
							'Content-Type': 'application/json'
						}
					}

					const response = await fetch(`${API_URL}/api/login`, options)
					const data = await response.json()

					if (data.msg) {
						setStore({
							currentUser: null,
							error: data
						})

					} else {
						// Establece justRegistered a false cuando el usuario inicia sesión
						data.justRegistered = false;

						setStore({
							currentUser: data,
							error: null
						})
						sessionStorage.setItem('currentUser', JSON.stringify(data))

						// Asegúrate de que el usuario está autenticado antes de llamar a getPrivate
						await getPrivate();
						navigate('/private')
					}

				} catch (error) {
					console.log(error.message);

				}
			},

			checkCurrentUser: () => { //mantener la información del currentUser
				if (sessionStorage.getItem('currentUser')) {
					setStore({
						currentUser: JSON.parse(sessionStorage.getItem('currentUser'))
					})
				}
			},

			logout: () => {
				if (sessionStorage.getItem('currentUser')) {
					setStore({
						currentUser: null
					})
					sessionStorage.removeItem('currentUser')
				}
			},

			getPrivate: async () => { // Obtener pacientes del usario

				const store = getStore();

				const token = store.currentUser?.access_token; // Obtén el token del usuario actual

				const options = {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				};

				try {
					const { API_URL } = getStore()
					const response = await fetch(`${API_URL}/api/private`, options);
					const data = await response.json();

					if (response.ok) {
						setStore({
							currentPatient: data,
						});
					} else {
						console.error('Error getting user:', data);
					}
				} catch (error) {
					console.error('Error getting user:', error);
				}
			},
		}
	};
};

export default getState;