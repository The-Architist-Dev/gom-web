import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import ModelViewer from '../../components/3d/ModelViewer';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

/**
 * ModelViewerDemo - Showcase page for 3D model viewer
 * Demonstrates different configurations and model types
 */

const DEMO_MODELS = [
  {
    id: 'vase',
    name: 'Glass Vase with Flowers',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb',
    type: 'GLB',
    description: 'Beautiful glass vase with flowers - demonstrates transparency and complex materials',
  },
  {
    id: 'helmet',
    name: 'Damaged Helmet',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    type: 'GLB',
    description: 'Sci-fi helmet with PBR materials and detailed textures',
  },
  {
    id: 'lantern',
    name: 'Japanese Lantern',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
    type: 'GLB',
    description: 'Traditional Japanese lantern with emissive materials',
  },
];

const ENVIRONMENT_PRESETS = [
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'studio',
  'city',
  'park',
  'lobby',
];

export const ModelViewerDemo = () => {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState(DEMO_MODELS[0]);
  const [environment, setEnvironment] = useState('sunset');
  const [enableParallax, setEnableParallax] = useState(true);
  const [enableHoverRotation, setEnableHoverRotation] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(true);

  return (
    <PageContainer>
      <PageHeader
        title="3D Model Viewer Demo"
        subtitle="Interactive 3D model viewer with mouse parallax, hover rotation, and screenshot capabilities"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left sidebar: Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Model selection */}
          <Card>
            <h3 className="mb-4 font-heading text-lg font-bold text-navy dark:text-ivory">
              Select Model
            </h3>
            <div className="space-y-2">
              {DEMO_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-all',
                    selectedModel.id === model.id
                      ? 'border-navy bg-navy/5 dark:border-gold dark:bg-gold/5'
                      : 'border-stroke hover:border-navy/50 dark:border-dark-stroke dark:hover:border-gold/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy dark:text-ivory">{model.name}</p>
                      <p className="mt-1 text-xs text-muted dark:text-dark-text-muted">
                        {model.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold-dark">
                      {model.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Environment selection */}
          <Card>
            <h3 className="mb-4 font-heading text-lg font-bold text-navy dark:text-ivory">
              Environment
            </h3>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEnvironment(preset)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-bold capitalize transition-all',
                    environment === preset
                      ? 'bg-navy text-white dark:bg-gold dark:text-navy-dark'
                      : 'bg-surface-alt text-muted hover:bg-navy/10 hover:text-navy dark:bg-dark-surface-alt dark:text-dark-text-muted dark:hover:bg-gold/10 dark:hover:text-gold'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </Card>

          {/* Options */}
          <Card>
            <h3 className="mb-4 font-heading text-lg font-bold text-navy dark:text-ivory">
              Options
            </h3>
            <div className="space-y-3">
              <ToggleOption
                label="Mouse Parallax"
                description="Model follows mouse movement"
                checked={enableParallax}
                onChange={setEnableParallax}
              />
              <ToggleOption
                label="Hover Rotation"
                description="Auto-rotate on hover"
                checked={enableHoverRotation}
                onChange={setEnableHoverRotation}
              />
              <ToggleOption
                label="Auto Rotate"
                description="Continuous rotation"
                checked={autoRotate}
                onChange={setAutoRotate}
              />
              <ToggleOption
                label="Screenshot Button"
                description="Show screenshot button"
                checked={showScreenshot}
                onChange={setShowScreenshot}
              />
            </div>
          </Card>
        </div>

        {/* Right side: 3D Viewer */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="font-heading text-2xl font-bold text-navy dark:text-ivory">
                {selectedModel.name}
              </h2>
              <p className="mt-1 text-sm text-muted dark:text-dark-text-muted">
                {selectedModel.description}
              </p>
            </div>

            <div className="flex justify-center">
              <ModelViewer
                key={`${selectedModel.id}-${environment}-${enableParallax}-${enableHoverRotation}-${autoRotate}`}
                url={selectedModel.url}
                width="100%"
                height={600}
                modelXOffset={0}
                modelYOffset={0}
                enableMouseParallax={enableParallax}
                enableHoverRotation={enableHoverRotation}
                environmentPreset={environment}
                fadeIn={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.35}
                showScreenshotButton={showScreenshot}
              />
            </div>

            {/* Instructions */}
            <div className="mt-6 rounded-xl bg-surface-alt p-4 dark:bg-dark-surface-alt">
              <h4 className="mb-2 font-semibold text-navy dark:text-ivory">Controls:</h4>
              <ul className="space-y-1 text-sm text-muted dark:text-dark-text-muted">
                <li>• <strong>Left click + drag:</strong> Rotate model</li>
                <li>• <strong>Right click + drag:</strong> Pan camera</li>
                <li>• <strong>Scroll:</strong> Zoom in/out</li>
                <li>• <strong>Mouse move:</strong> Parallax effect (if enabled)</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

// Toggle option component
const ToggleOption = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <p className="font-semibold text-navy dark:text-ivory">{label}</p>
      <p className="text-xs text-muted dark:text-dark-text-muted">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-navy dark:bg-gold' : 'bg-stroke dark:bg-dark-stroke'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  </div>
);

export default ModelViewerDemo;
