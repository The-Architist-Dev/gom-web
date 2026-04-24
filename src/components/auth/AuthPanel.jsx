import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { PremiumInput } from './PremiumInput';
import { PremiumButton } from './PremiumButton';
import './AuthPanel.css';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

export const AuthPanel = ({ 
  setToken, 
  setUser, 
  notify, 
  subView, 
  setSubView, 
  resetEmail, 
  setResetEmail 
}) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const sendSocialAuth = async (provider, token) => {
    setLoading(true);
    try {
      const res = await axios.post(API_BASE + "/login/social", { provider, token });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      notify(`Chào mừng ${res.data.user.name} đã gia nhập!`, "success");
    } catch (err) {
      notify(err.response?.data?.message || `Lỗi kết nối ${provider}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGoogleSuccess = (res) => {
      sendSocialAuth('google', res.credential);
    };

    const initGoogle = () => {
      if (window.google && document.getElementById('google-button-container')) {
        window.google.accounts.id.initialize({
          client_id: "208231172368-34f26e0l7771ngcqa89j9ufj01gm6mtt.apps.googleusercontent.com",
          callback: handleGoogleSuccess
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-button-container'),
          { theme: "outline", size: "large", width: 280, text: "signin_with", shape: "rectangular" }
        );
      } else {
        setTimeout(initGoogle, 500);
      }
    };

    initGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subView]);

  const handleSocialLogin = (provider) => {
    if (provider === "Facebook") {
      if (window.FB) {
        window.FB.login((res) => {
          if (res.authResponse) {
            sendSocialAuth('facebook', res.authResponse.accessToken);
          } else notify("Đã hủy đăng nhập Facebook", "info");
        }, { scope: 'public_profile,email' });
      } else notify("Đang tải thư viện Facebook...", "info");
    }
  };

  const isLogin = subView === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const res = await axios.post(API_BASE + endpoint, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      notify(`Chào mừng ${res.data.user.name} quay trở lại!`, "success");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi xác thực hệ thống");
    }
    setLoading(false);
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  if (subView === "forgot") {
    return <ForgotPasswordPanel setSubView={setSubView} notify={notify} setResetEmail={setResetEmail} />;
  }

  if (subView === "reset") {
    return <ResetPasswordPanel setSubView={setSubView} notify={notify} email={resetEmail} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={subView}
        className="auth-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="auth-panel-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="auth-panel-title">
            {isLogin ? "Chào mừng trở lại" : "Gia nhập hệ thống"}
          </h2>
          <p className="auth-panel-subtitle">
            {isLogin ? "Đăng nhập để tiếp tục sử dụng hệ thống" : "Tạo tài khoản mới để bắt đầu"}
          </p>
        </motion.div>

        {error && (
          <motion.div 
            className="auth-error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <PremiumInput
              label="TÊN NGHỆ NHÂN"
              placeholder="Họ và tên đầy đủ..."
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              icon={<User size={20} />}
            />
          )}
          
          <PremiumInput
            label="EMAIL"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            icon={<Mail size={20} />}
          />
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="premium-input-label">MẬT KHẨU</label>
              {isLogin && (
                <motion.span 
                  className="auth-forgot-link"
                  onClick={() => setSubView("forgot")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Quên mật khẩu?
                </motion.span>
              )}
            </div>
            <PremiumInput
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              icon={<Lock size={20} />}
              rightElement={
                <motion.div
                  onClick={() => setShowPass(!showPass)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.div>
              }
            />
          </div>

          {!isLogin && (
            <PremiumInput
              label="XÁC NHẬN MẬT KHẨU"
              type="password"
              placeholder="••••••••"
              value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
              required
              icon={<Lock size={20} />}
            />
          )}

          <PremiumButton
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký ngay"}
          </PremiumButton>
        </form>

        <div className="auth-divider">
          <span>HOẶC KẾT NỐI QUA</span>
        </div>

        <div className="auth-social-buttons">
          <div id="google-button-container" className="auth-google-container" />
          <PremiumButton
            variant="outline"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </PremiumButton>
        </div>

        <motion.p 
          className="auth-switch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <motion.span 
            className="auth-switch-link"
            onClick={() => setSubView(isLogin ? "register" : "login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </motion.span>
        </motion.p>

        <motion.div 
          className="auth-terms"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Bằng việc tiếp tục, bạn đồng ý với <b>Điều khoản Dịch vụ</b> và <b>Chính sách Bảo mật</b> của chúng tôi.
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Forgot Password Panel
const ForgotPasswordPanel = ({ setSubView, notify, setResetEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await axios.post(API_BASE + "/forgot-password", { email });
      notify("Mã phục hồi đã được gửi về email của bạn.", "success");
      setResetEmail(email);
      setSubView("reset");
    } catch (err) {
      notify(err.response?.data?.message || "Lỗi gửi yêu cầu phục hồi", "error");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className="auth-panel"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <motion.div 
        className="auth-back-button"
        onClick={() => setSubView("login")}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        <span>Quay lại</span>
      </motion.div>

      <div className="auth-panel-header">
        <h2 className="auth-panel-title">Quên mật khẩu</h2>
        <p className="auth-panel-subtitle">
          Nhập email của bạn và chúng tôi sẽ gửi mã khôi phục tài khoản
        </p>
      </div>

      <form onSubmit={handleReset} className="auth-form">
        <PremiumInput
          label="EMAIL"
          type="email"
          placeholder="Nhập email liên lạc..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          icon={<Mail size={20} />}
        />

        <PremiumButton
          type="submit"
          variant="primary"
          loading={loading}
        >
          Gửi yêu cầu
        </PremiumButton>
      </form>
    </motion.div>
  );
};

// Reset Password Panel
const ResetPasswordPanel = ({ setSubView, notify, email }) => {
  const [form, setForm] = useState({ code: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE + "/reset-password", { ...form, email });
      notify("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", "success");
      setSubView("login");
    } catch (err) {
      notify(err.response?.data?.message || "Mã xác nhận không chính xác", "error");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className="auth-panel"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <motion.div 
        className="auth-back-button"
        onClick={() => setSubView("login")}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        <span>Quay lại</span>
      </motion.div>

      <div className="auth-panel-header">
        <h2 className="auth-panel-title">Đặt lại mật khẩu</h2>
        <p className="auth-panel-subtitle">
          Nhập mã xác nhận đã được gửi tới <b style={{ color: '#0F265C' }}>{email}</b>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <PremiumInput
          label="MÃ XÁC NHẬN"
          placeholder="Nhập mã 6 số..."
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
          required
          icon={<Mail size={20} />}
        />

        <PremiumInput
          label="MẬT KHẨU MỚI"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          icon={<Lock size={20} />}
        />

        <PremiumButton
          type="submit"
          variant="primary"
          loading={loading}
        >
          Xác nhận đổi mật khẩu
        </PremiumButton>
      </form>
    </motion.div>
  );
};
