import * as Cesium from "cesium";

import { ThreeOverlay } from "./three-overlay";
import { GaussianSplatLayer } from "./gaussian-splat-layer";

export class Viewer {
  public cesium!: Cesium.Viewer;

  private threeOverlay!: ThreeOverlay;

  constructor() {
    this.createViewer();
    this.createOverlay();

    // call rendering on our three overlay after Cesium is done rendering
    this.cesium.scene.postRender.addEventListener(() => {
      this.threeOverlay.render();
    });
  }

  private createViewer() {
    // Set Cesium Ion token FIRST before creating viewer
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhY2QxODIxMy05YTg2LTQ1NWQtODE0NC1kMWRiZWUwYjgyY2UiLCJpZCI6MzE2Nzg3LCJpYXQiOjE3NTkwODAzMzJ9.uN7tc0tUNOVkYaD8sP8pWcwGPgBbliqvLktW-SBlgVU';

    this.cesium = new Cesium.Viewer("cesium", {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      animation: false,
      timeline: false,
      navigationHelpButton: false,
      infoBox: false,
      terrain: Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true,
        requestWaterMask: true,
      }),
    });

    this.cesium.scene.debugShowFramesPerSecond = true;

    // CRITICAL: Enable depth testing so terrain shows in 3D
    this.cesium.scene.globe.depthTestAgainstTerrain = true;

    // Enable lighting for better 3D effect
    this.cesium.scene.globe.enableLighting = true;

    // Better rendering quality
    this.cesium.scene.fxaa = true;
    this.cesium.scene.requestRenderMode = false;

    this.addBaseLayer();
    this.addBuildingsLayer();

    console.log('✅ 3D Viewer initialized with terrain elevation');
  }

  private addBaseLayer(): void {
    // Use OpenStreetMap for base imagery (no API key needed)
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/',
    });
    this.cesium.imageryLayers.addImageryProvider(osmProvider);
    console.log('OpenStreetMap imagery loaded');
  }

  private async addBuildingsLayer(): Promise<void> {
    try {
      // Use Google 3D Tiles for buildings (works in California)
      const buildings = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
      this.cesium.scene.primitives.add(buildings);
      console.log('Google 3D Buildings loaded');
    } catch (error) {
      console.warn('Failed to load 3D buildings:', error);
    }
  }

  private createOverlay() {
    this.threeOverlay = new ThreeOverlay(this.cesium!.camera);
  }

  public flyTo(
    x: number,
    y: number,
    z: number,
    heading: number,
    pitch: number,
    duration: number
  ): void {
    this.cesium.camera?.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(x, y, z),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: 0.0,
      },
      duration: duration,
    });
  }

  public addGaussianSplatLayer(layer: GaussianSplatLayer): void {
    this.threeOverlay.addGaussianSplatLayer(layer);
  }
}
