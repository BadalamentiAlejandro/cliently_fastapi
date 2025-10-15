import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const { authLogin } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authLogin(username, password); // llama al contexto
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    }

    return(
        <div className="flex flex-wrap lg:flex-nowrap font-sans">
            {/* Side bar (desktop), top bar (mobile) */}
            <div className="bg-stone-950 text-white h-16 lg:h-screen w-full lg:w-[calc(50vw)] px-6 py-4 flex lg:items-center lg:justify-end items-center">
                <div className="lg:text-right">
                    <h1 className="text-3xl font-bold">LOGO DE EMPRESA</h1>
                    <p className="text-zinc-300 mt-2 hidden lg:block">Descripción descripción de la plataforma.</p>
                </div>
            </div>

            {/* Right side Main Window */}
            <div className="h-[calc(100vh-64px)] lg:h-screen w-full p-4 bg-cover bg-center flex justify-center items-center bg-[url(././assets/oficina.jpg)]">
                <div className="w-full max-w-md bg-neutral-200 backdrop-blur-sm rounded-xl shadow-2xl p-8 m-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl font-bold text-zinc-800 text-center">¡Bienvenido!</h1>
                            <p className="text-zinc-600 text-center mb-4">Ingresa tus credenciales para continuar.</p>
                            
                            {/* Campo de Usuario */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">Usuario</label>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete='off'
                                    placeholder='Usuario'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition duration-200 text-black box"
                                />
                            </div>

                            {/* Campo de Contraseña */}
                            <div>
                                <label htmlFor='password' className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    autoComplete='off'
                                    placeholder='Contraseña'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition duration-200 text-black"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            {/* Botón de Envío */}
                            <button
                                type="submit"
                                className="w-full h-11 mt-2 rounded-lg bg-stone-950 text-white font-bold hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login