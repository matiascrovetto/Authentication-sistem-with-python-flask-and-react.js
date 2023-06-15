import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import React, { useContext } from 'react'


function Private() {



	const { store, actions } = useContext(Context);

	return (
		<div className="wrapper bg-warning d-flex align-items-center justify-content-center w-100">
			<div className="login text-center">
				<h2>{store?.currentUser?.user?.full_name}</h2>

				<div className="row text-center">

					<div className="my-6 ">
					<img src="https://img.freepik.com/vector-premium/perfil-avatar-hombre-icono-redondo_24640-14044.jpg?w=2000" className="card-img-top" alt="..." />
						<h1>¡Hello!</h1>
						<h2>Congratulations you have already login</h2>
						
						<Link to='/'>
							<button type='submit' className="btn btn-danger text-uppercase w-100 mt-2" onClick={actions.logout}>logout</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Private
