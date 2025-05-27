import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstanc';
import { UserContext } from '../../context/userContext';

const translations = {
  en: {
    title: "Task Manager",
    welcome: "Welcome Back",
    enterDetails: "Please enter your details to log in",
    email: "Email Address",
    password: "Password",
    login: "Log In",
    noAccount: "Don't have an account?",
    signup: "Sign Up"
  },
  tr: {
    title: "Görev Yöneticisi",
    welcome: "Tekrar Hoşgeldiniz",
    enterDetails: "Lütfen giriş yapmak için bilgilerinizi girin",
    email: "E-posta Adresi",
    password: "Şifre",
    login: "Giriş Yap",
    noAccount: "Hesabınız yok mu?",
    signup: "Kayıt Ol"
  }
};

const fontFamilies = {
  en: "'Poppins', sans-serif",
  tr: "'Poppins', sans-serif"
};

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [lang, setLang] = useState('en')
  const { updateUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  const t = translations[lang];

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null)

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError("");

    // Login Api Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data); 

        // Redirect to dashboard based on role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'member') {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <AuthLayout>
      <div className="flex justify-between mb-4">
        <h2 className='text-lg font-medium text-black'>{t.title}</h2>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="border border-slate-200 rounded px-3 py-1 text-sm bg-slate-100/50 focus:outline-blue-400 transition"
          style={{
            fontFamily: fontFamilies[lang],
            minWidth: 110
          }}
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>
      <div
        className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center"
        style={{ fontFamily: fontFamilies[lang] }}
      >
        <h3 className='text-xl font-semibold text-black'>{t.welcome}</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {t.enterDetails}
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label={t.email}
            placeholder="john@example.com"
            type="email"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label={t.password}
            placeholder="********"
            type="password"
          />

          {error && (
            <p
              className="text-red-500 text-xs transition-all duration-300 opacity-100 translate-y-0"
              style={{ animation: 'fadeIn 0.3s' }}
            >
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            {t.login}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            {t.noAccount}{' '}
            <Link to="/signup" className="text-blue-500 font-medium underline">{t.signup}</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
