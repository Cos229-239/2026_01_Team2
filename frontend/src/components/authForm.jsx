import { useState } from react;
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from "@heroui/react";

const AuthForm = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/signup';
        const payload = isLogin ? { email, password } : { email, password, username };

        try {
            const res = await axios.post(`${API_BASE}${endpoint}`, payload, { withCredentials: true });
            setUser(res.data.user);
            navigate('/designer');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-neutral-100">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} className="space-gap-y-4">
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Username</label>
                            <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 w-full">
                            <Alert color="danger" title="Login Failed"
                                description={error} variant="faded"
                                onClose={() => setError("")} />
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        {isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-neutral-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-600 font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;