import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { ArtifactAnalysisSection } from './ArtifactAnalysisSection';
import { Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import './HomePage.css';

export const HomePage = ({ token, notify, quota, setQuota, setView, user, onShowResult }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featuredLines, setFeaturedLines] = useState([]);

  useEffect(() => {
    api.getCeramicLines({ featured: 1 })
      .then(res => setFeaturedLines(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError("");
    }
  };

  const analyze = async () => {
    if (quota.free_used >= quota.free_limit && quota.token_balance <= 0) {
      notify("Hết lượt giám định. Vui lòng nạp thêm!", "error");
      setView("payment");
      return;
    }
    if (!file) {
      setError("Vui lòng tải ảnh cổ vật lên trước khi giám định!");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.predict(formData, token);
      const result = res.data.data;
      const q = res.data.quota || {};
      if (q.free_used !== undefined) {
        setQuota({ 
          free_used: q.free_used, 
          free_limit: q.free_limit || quota.free_limit, 
          token_balance: q.token_balance || quota.token_balance 
        });
      }
      notify("Giám định hoàn tất!", "success");
      onShowResult(result, preview);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi kết nối máy chủ AI");
    } finally {
      setLoading(false);
    }
  };

  const scrollToAnalysis = () => {
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Content */}
      <div className="home-page-content">
        {/* Hero Section */}
        <HeroSection 
          onCtaClick={scrollToAnalysis}
          onSecondaryClick={() => setView('lines')}
        />

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="trust-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="trust-card"
          >
            <div className="trust-icon">
              <Sparkles size={32} />
            </div>
            <h3>Giám định chuyên sâu</h3>
            <p>Sử dụng mô hình AI được huấn luyện trên hàng ngàn hiện vật mẫu</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="trust-card"
          >
            <div className="trust-icon">
              <Shield size={32} />
            </div>
            <h3>Bảo mật hồ sơ</h3>
            <p>Kết quả giám định được lưu trữ riêng tư và an toàn tuyệt đối</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="trust-card"
          >
            <div className="trust-icon">
              <Zap size={32} />
            </div>
            <h3>Kết quả tức thì</h3>
            <p>Phân tích đa đại lý chỉ trong vài giây ngay sau khi tải ảnh</p>
          </motion.div>
        </div>
      </section>

      {/* Analysis Section */}
      <ArtifactAnalysisSection
        file={file}
        preview={preview}
        loading={loading}
        error={error}
        onFileChange={onFileChange}
        onAnalyze={analyze}
      />

      {/* Featured Equipment */}
      <section className="featured-lines-section">
        <div className="featured-lines-container">
          <div className="featured-lines-header">
            <h2>Dòng gốm nổi bật</h2>
            <button 
              className="view-all-btn"
              onClick={() => setView('lines')}
            >
              Xem tất cả
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="featured-lines-grid">
            {featuredLines.length > 0 ? (
              featuredLines.slice(0, 3).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="featured-line-card"
                  onClick={() => setView('lines')}
                >
                  <div className="line-image-wrapper">
                    <img 
                      src={line.image_url || '/placeholder-ceramic.jpg'} 
                      alt={line.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="line-card-overlay">
                      <span className="view-details">Tìm hiểu thêm</span>
                    </div>
                  </div>
                  <div className="line-content">
                    <div className="line-meta">
                      <span className="line-era">{line.era}</span>
                    </div>
                    <h3 className="line-name">{line.name}</h3>
                    <p className="line-description">{line.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="loading-placeholder">
                <div className="spinner-dots">
                  <span></span><span></span><span></span>
                </div>
                <p>Đang tải dữ liệu tinh hoa...</p>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
