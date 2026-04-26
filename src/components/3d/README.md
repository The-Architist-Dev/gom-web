# ModelViewer Component

Premium 3D model viewer component built with React Three Fiber, Drei, and Three.js.

## Features

- ✅ **Multiple Format Support**: GLB, GLTF, FBX, OBJ
- ✅ **Mouse Parallax**: Model follows mouse movement
- ✅ **Hover Rotation**: Auto-rotate on hover
- ✅ **Auto Rotation**: Continuous rotation
- ✅ **Environment Presets**: 10+ HDR environments (sunset, forest, studio, etc.)
- ✅ **Screenshot Capability**: Download model screenshots
- ✅ **Orbit Controls**: Drag to rotate, scroll to zoom, right-click to pan
- ✅ **Fade-in Animation**: Smooth entrance animation
- ✅ **Loading State**: Beautiful loading indicator
- ✅ **Error Handling**: Graceful error fallback
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Theme-aware**: Adapts to light/dark mode

## Installation

Dependencies are already installed:
```bash
npm install three @react-three/fiber @react-three/drei gsap
```

## Basic Usage

```jsx
import ModelViewer from './components/3d/ModelViewer';

<ModelViewer
  url="https://example.com/model.glb"
  width={600}
  height={600}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | **required** | URL to 3D model file (GLB, GLTF, FBX, OBJ) |
| `width` | `number \| string` | `600` | Viewer width in pixels or CSS value |
| `height` | `number \| string` | `600` | Viewer height in pixels or CSS value |
| `modelXOffset` | `number` | `0` | Horizontal model offset |
| `modelYOffset` | `number` | `0` | Vertical model offset |
| `enableMouseParallax` | `boolean` | `false` | Enable mouse parallax effect |
| `enableHoverRotation` | `boolean` | `false` | Enable rotation on hover |
| `environmentPreset` | `string` | `'sunset'` | HDR environment preset |
| `fadeIn` | `boolean` | `true` | Enable fade-in animation |
| `autoRotate` | `boolean` | `false` | Enable continuous rotation |
| `autoRotateSpeed` | `number` | `0.35` | Auto-rotation speed |
| `showScreenshotButton` | `boolean` | `false` | Show screenshot button |
| `className` | `string` | `''` | Additional CSS classes |

## Environment Presets

Available environment presets:
- `sunset` (default)
- `dawn`
- `night`
- `warehouse`
- `forest`
- `apartment`
- `studio`
- `city`
- `park`
- `lobby`

## Examples

### Basic Model

```jsx
<ModelViewer
  url="https://example.com/vase.glb"
  width={400}
  height={400}
/>
```

### With Mouse Parallax

```jsx
<ModelViewer
  url="https://example.com/vase.glb"
  width={600}
  height={600}
  enableMouseParallax
  environmentPreset="forest"
/>
```

### With Auto Rotation

```jsx
<ModelViewer
  url="https://example.com/helmet.glb"
  width={500}
  height={500}
  autoRotate
  autoRotateSpeed={0.5}
  showScreenshotButton
/>
```

### With Hover Rotation

```jsx
<ModelViewer
  url="https://example.com/lantern.glb"
  width={400}
  height={400}
  enableHoverRotation
  environmentPreset="night"
/>
```

### Full Configuration

```jsx
<ModelViewer
  url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb"
  width={600}
  height={600}
  modelXOffset={0.5}
  modelYOffset={0}
  enableMouseParallax
  enableHoverRotation
  environmentPreset="sunset"
  fadeIn={true}
  autoRotate={false}
  autoRotateSpeed={0.35}
  showScreenshotButton
/>
```

## Integration Examples

### In Ceramic Detail Modal

The ModelViewer is integrated into `CeramicDetailModal.jsx` with a tab system to switch between image and 3D view:

```jsx
import ModelViewer from '../../components/3d/ModelViewer';

// In modal
<ModelViewer
  url={item.model_url || item.model_3d_url}
  width="100%"
  height={500}
  enableMouseParallax
  enableHoverRotation
  environmentPreset="sunset"
  showScreenshotButton
/>
```

### Standalone Demo Page

See `ModelViewerDemo.jsx` for a complete interactive demo with:
- Model selection
- Environment switching
- Feature toggles
- Live preview

## Controls

- **Left click + drag**: Rotate model
- **Right click + drag**: Pan camera
- **Scroll**: Zoom in/out
- **Mouse move**: Parallax effect (if enabled)

## Performance

The component is optimized for performance:
- Memoized canvas to prevent unnecessary re-renders
- Efficient GSAP animations
- Proper cleanup on unmount
- Lazy loading with Suspense
- GPU-accelerated rendering

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Touch controls supported

## Troubleshooting

### Model not loading
- Check URL is accessible
- Verify file format (GLB, GLTF, FBX, OBJ)
- Check browser console for CORS errors

### Performance issues
- Reduce model polygon count
- Use compressed textures
- Disable parallax/hover rotation on mobile

### Screenshot not working
- Ensure `showScreenshotButton={true}`
- Check browser allows canvas.toBlob()
- Try different browser if issues persist

## File Structure

```
src/components/3d/
├── ModelViewer.jsx       # Main component
└── README.md            # This file

src/features/ceramics/
├── CeramicDetailModal.jsx  # Integration example
└── ModelViewerDemo.jsx     # Demo page
```

## Dependencies

- `three`: 3D rendering engine
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Useful helpers for R3F
- `gsap`: Animation library (already installed)

## License

Part of the Gom project.
