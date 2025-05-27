import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import axiosInstance from '../../utils/axiosInstanc'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import { validateEmail } from '../../utils/helper'
import uploadImage from '../../utils/uploadImage'

const SignUp = () => {
  const [profilePic, setProfilePic] = React.useState(null)
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [adminInviteToken, setAdminInviteToken] = React.useState('')

  const [error, setError] = React.useState(null)
  const [lang, setLang] = React.useState('en')

  const { updateUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError(null)

    let profileImageUrl = '';

    if (!fullName) {
      setError('Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError("");

    // Signup API call
    try {

      // Upload profile picture if provided
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
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

  const translations = {
    en: {
      title: 'Task Manager',
      welcome: 'Create Account',
      enterDetails: 'Join us today by entering your details below. We can\'t wait to have you on board!',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      inviteToken: 'Admin Invite Token (optional)',
      signup: 'Sign Up',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Log In'
    },
    tr: {
      title: 'Görev Yöneticisi',
      welcome: 'Hesap Oluştur',
      enterDetails: 'Bugün bize katılın, aşağıdaki bilgilerinizi girin. Sizi aramızda görmek için sabırsızlanıyoruz!',
      fullName: 'Ad Soyad',
      email: 'E-posta Adresi',
      password: 'Şifre',
      inviteToken: 'Yönetici Davet Kodu (isteğe bağlı)',
      signup: 'Kayıt Ol',
      alreadyHaveAccount: 'Zaten bir hesabınız var mı?',
      login: 'Giriş Yap'
    }
  }
  const t = translations[lang];

  return (
    <AuthLayout>
      {/* Header and selector */}
      <div className="flex justify-between mb-4">
        <h2 className='text-lg font-medium text-black'>{t.title}</h2>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="border border-slate-200 rounded px-3 py-1 text-sm bg-slate-100/50 focus:outline-blue-400 transition"
          style={{
            minWidth: 110
          }}
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>

      <div className="w-full h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">{t.welcome}</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {t.enterDetails}
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label={t.fullName}
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder={t.fullName}
            />
            <Input
              label={t.email}
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={t.email}
            />
            <Input
              label={t.password}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder={t.password}
            />

            <Input
              label={t.inviteToken}
              type="text"
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder={t.inviteToken}
            />
          </div>
          <button type="submit" className="w-full py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer">
            {t.signup}
          </button>

          {error && (
            <p
              className="text-red-500 text-xs transition-all duration-300 opacity-100 translate-y-0"
              style={{ animation: 'fadeIn 0.3s' }}
            >
              {error}
            </p>
          )}

          <p className="text-[13px] text-slate-700 mt-4">
            {t.alreadyHaveAccount} <a href="/login" className="font-medium text-blue-500">{t.login}</a>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
