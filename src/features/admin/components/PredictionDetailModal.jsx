import React from 'react';
import { Modal } from './Modal';
import { formatDate } from '../../../lib/utils';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';
import { User, Calendar, Target, TrendingUp } from 'lucide-react';

export const PredictionDetailModal = ({ isOpen, onClose, prediction }) => {
  if (!prediction) return null;

  // Confidence may already be 0..100 (certainty) or 0..1; normalize.
  const rawConfidence = prediction.confidence ?? prediction.certainty ?? 0;
  const confidence = Math.round(rawConfidence > 1 ? rawConfidence : rawConfidence * 100);
  const imgSrc =
    prediction.image_url ||
    prediction.image ||
    (prediction.image_path ? `/storage/${prediction.image_path}` : null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prediction Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <ImageWithFallback
                src={imgSrc}
                alt={prediction.predicted_label || prediction.label || 'Prediction'}
                className="h-full w-full"
              />
            </div>

            {/* Confidence Bar */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confidence Level
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${confidence >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : confidence >= 60
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}
                >
                  {confidence}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full transition-all duration-500 ${confidence >= 80
                    ? 'bg-green-600'
                    : confidence >= 60
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                    }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {/* Prediction Result Card */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="mb-2 flex items-center gap-2">
                <Target size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Predicted Ceramic Line
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {prediction.predicted_label || prediction.label || 'Unknown'}
              </h3>
              {prediction.country && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Origin: {prediction.country}
                </p>
              )}
              {prediction.era && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Era: {prediction.era}
                </p>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* User Info */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <User size={16} />
                  <span className="text-xs font-medium uppercase tracking-wide">User</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {prediction.user?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {prediction.user?.email || `ID: ${prediction.user_id}`}
                </p>
              </div>

              {/* Date Info */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase tracking-wide">Date</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(prediction.created_at)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Prediction #{prediction.id}
                </p>
              </div>
            </div>

            {/* Description */}
            {prediction.description && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {prediction.description}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* AI Result Sections (real multi-agent debate output) */}
        <AIResultSections prediction={prediction} />
      </div>
    </Modal>
  );
};

/**
 * Render the real AI multi-agent debate output stored in `prediction.result_json` /
 * `prediction.result` / `prediction.final_report`. Gracefully handles missing fields.
 */
const AIResultSections = ({ prediction }) => {
  const result = prediction.result || prediction.result_json || null;
  const finalReport =
    prediction.final_report ||
    (result && typeof result === 'object' ? result.final_report : null) ||
    null;
  const visualFeatures = result && typeof result === 'object' ? result.visual_features : null;
  const agentPredictions = result && typeof result === 'object' ? result.agent_predictions : null;

  // Legacy seed shape compatibility
  const legacyAgents = Array.isArray(prediction.debate_results) ? prediction.debate_results : null;

  if (!finalReport && !visualFeatures && !agentPredictions && !legacyAgents) {
    return null;
  }

  return (
    <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
      {finalReport && (finalReport.reasoning || finalReport.debate_summary) && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Final Judge — Reasoning
          </h4>
          {finalReport.reasoning && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {finalReport.reasoning}
            </p>
          )}
          {finalReport.debate_summary && (
            <p className="mt-3 whitespace-pre-line text-xs italic text-gray-500 dark:text-gray-400">
              {finalReport.debate_summary}
            </p>
          )}
        </div>
      )}

      {Array.isArray(agentPredictions) && agentPredictions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Agent Predictions
          </h4>
          <div className="grid gap-3 md:grid-cols-3">
            {agentPredictions.map((a, i) => {
              const conf = a?.confidence != null ? Math.round(a.confidence * 100) : null;
              const pred = a?.prediction || {};
              return (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {a?.agent_name || `Agent ${i + 1}`}
                    </p>
                    {conf != null && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{conf}%</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {pred.ceramic_line || a?.label || '—'}
                  </p>
                  {pred.country && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pred.country}</p>
                  )}
                  {pred.era && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pred.era}</p>
                  )}
                  {a?.evidence && (
                    <p className="mt-2 line-clamp-3 text-xs text-gray-600 dark:text-gray-400">
                      {a.evidence}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {legacyAgents && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            AI Debate Results
          </h4>
          <div className="space-y-2">
            {legacyAgents.map((row, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
              >
                <p className="mb-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {row.agent}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{row.opinion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visualFeatures && typeof visualFeatures === 'object' && (
        <details className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <summary className="cursor-pointer select-none text-sm font-semibold text-gray-700 dark:text-gray-300">
            Visual Features
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {JSON.stringify(visualFeatures, null, 2)}
          </pre>
        </details>
      )}

      {result && (
        <details className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <summary className="cursor-pointer select-none text-sm font-semibold text-gray-700 dark:text-gray-300">
            Raw JSON
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default PredictionDetailModal;
