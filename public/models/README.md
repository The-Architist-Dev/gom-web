# 3D Models for The Archivist

## Current Model: Pyxis 724 mit Deckel

**Model:** Ancient Greek Pyxis (ceramic vessel with lid)
**Location:** `public/models/source/Pyxis_724 mit Deckel.glb`
**Format:** GLB with embedded textures
**Source:** Likely from museum 3D digitization project
**Type:** Game-ready model with PBR textures

### Textures Included:
- Diffuse/Albedo maps
- Normal maps (OpenGL format)
- AO (Ambient Occlusion) + Roughness combined maps
- Separate textures for body and lid

This is an authentic ceramic artifact model, perfect for showcasing The Archivist's 3D viewing capabilities.

## Model Structure

```
public/models/
├── source/
│   └── Pyxis_724 mit Deckel.glb  (Main model file)
└── textures/
    ├── T_Pyxis_724_gameready_diffuse_2.jpeg
    ├── T_Pyxis_724_gameready_normalGL_0.jpeg
    ├── T_Pyxis_724_gameready_ao-T_Pyxis_724_gameready_rough-T_Pyxi.jpeg
    ├── T_Pyxis_724_lid_gameready_diffuse_5.jpeg
    ├── T_Pyxis_724_lid_normalGL_3.jpeg
    └── T_Pyxis_724_lid_gameready_ao-T_Pyxis_724_lid_rough-T_Pyxis_.jpeg
```

**Note:** The GLB file should have textures embedded. The separate texture files in `/textures/` are likely backups or source files.

## Usage in Code

Currently used in `ModelShowcaseSection.jsx`:

```jsx
<ModelViewer 
  url="/models/source/Pyxis_724 mit Deckel.glb"
  autoFrame={true}
  autoRotate={true}
  autoRotateSpeed={0.35}
  environmentPreset="sunset"
  width="100%"
  height={520}
/>
```

## Model Properties

- **Format:** GLB (GLTF Binary)
- **PBR Materials:** Yes (Physically Based Rendering)
- **Textures:** Embedded in GLB
- **Optimization:** Game-ready (optimized for real-time rendering)
- **Scale:** Auto-fitted by ModelViewer component
- **Lighting:** Works best with "sunset" or "warehouse" environment preset

## Technical Notes

- The model uses PBR workflow with separate AO+Roughness maps
- Normal maps are in OpenGL format (compatible with Three.js)
- The GLB format ensures all textures are embedded for easy deployment
- ModelViewer's `autoFrame` prop handles automatic camera fitting
- The `Center` component with `scale={2.5}` ensures proper display size

## Performance

- GLB file size: Check actual file size (should be < 10MB for web)
- Textures: JPEG format for good compression
- Polygon count: Game-ready optimization
- Loading time: Fast with local hosting (no CORS issues)

## Alternative Models

If you want to add more models in the future:

1. Place GLB files in `public/models/source/`
2. Ensure textures are embedded in GLB (preferred)
3. Update the `url` prop in ModelShowcaseSection.jsx
4. Test with different `environmentPreset` values for best lighting

## About Pyxis

A pyxis is a shape of vessel from the classical world, usually a cylindrical box with a separate lid. Originally designed to hold cosmetics, trinkets or jewellery, surviving pyxides are mostly Greek pottery, but especially in later periods may be in wood, metal, ivory, or other materials. This makes it a perfect example for a ceramic heritage platform!
