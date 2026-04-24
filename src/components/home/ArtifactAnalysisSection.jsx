import React from 'react';
import { Upload, Camera, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './ArtifactAnalysisSection.css';

export const ArtifactAnalysisSection = ({
  file,
  preview,
  loading,
  error,
  onFileChange,
  onAnalyze
}) => {
  return (
    <section id="analysis-section" className="artifact-analysis-premium">
      <div className="artifact-analysis-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="artifact-analysis-header"
        >
          <h2 className="artifact-analysis-title">Giám định hiện vật của bạn</h2>
          <p className="artifact-analysis-subtitle">
            Tải lên ảnh gốm sứ để hệ thống AI đa đại lý phân tích nguồn gốc, niên đại và phong cách
          </p>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="artifact-analysis-grid">
          {/* Left: Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="artifact-upload-card"
          >
            <div
              className={`artifact-upload-zone ${preview ? 'has-preview' : ''}`}
              onClick={() => !loading && document.getElementById('artifact-file-input').click()}
            >
              {preview ? (
                <div className="artifact-preview-wrapper">
                  <img src={preview} alt="Preview" className="artifact-preview-image" />
                  <div className="artifact-preview-overlay">
                    <Camera size={32} />
                    <span>Thay đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="artifact-upload-placeholder">
                  <div className="artifact-upload-icon">
                    <Upload size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="artifact-upload-title">Tải ảnh hiện vật lên</h3>
                  <p className="artifact-upload-desc">
                    Nhấn vào đây hoặc kéo thả ảnh gốm sứ của bạn
                  </p>
                  <div className="artifact-upload-formats">
                    JPG, PNG, WEBP • Tối đa 10MB
                  </div>
                </div>
              )}
              <input
                id="artifact-file-input"
                type="file"
                hidden
                accept="image/*"
                onChange={onFileChange}
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="artifact-error-alert"
              >
                <span className="artifact-error-icon">⚠️</span>
                <span className="artifact-error-text">{error}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Process Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="artifact-process-card"
          >
            <h3 className="artifact-process-title">Quy trình phân tích</h3>

            <div className="artifact-process-steps">
              <div className="artifact-process-step">
                <div className="artifact-step-icon">
                  <Upload size={20} />
                </div>
                <div className="artifact-step-content">
                  <h4 className="artifact-step-title">1. Tải ảnh lên</h4>
                  <p className="artifact-step-desc">Chọn ảnh hiện vật gốm sứ rõ nét</p>
                </div>
              </div>

              <div className="artifact-process-step">
                <div className="artifact-step-icon">
                  <Sparkles size={20} />
                </div>
                <div className="artifact-step-content">
                  <h4 className="artifact-step-title">2. AI phân tích</h4>
                  <p className="artifact-step-desc">Hệ thống đa đại lý tranh biện</p>
                </div>
              </div>

              <div className="artifact-process-step">
                <div className="artifact-step-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div className="artifact-step-content">
                  <h4 className="artifact-step-title">3. Nhận kết quả</h4>
                  <p className="artifact-step-desc">Báo cáo chi tiết nguồn gốc & niên đại</p>
                </div>
              </div>
            </div>

            <div className="artifact-process-divider" />

            <div className="artifact-process-info">
              <div className="artifact-info-item">
                <Zap size={18} className="artifact-info-icon" />
                <span className="artifact-info-text">Kết quả trong vài giây</span>
              </div>
              <div className="artifact-info-item">
                <CheckCircle2 size={18} className="artifact-info-icon" />
                <span className="artifact-info-text">Độ chính xác cao</span>
              </div>
            </div>

            <button
              className="artifact-analyze-button"
              onClick={onAnalyze}
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <span className="artifact-button-spinner" />
                  Các chuyên gia đang tranh biện...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Phân tích hiện vật ngay
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
