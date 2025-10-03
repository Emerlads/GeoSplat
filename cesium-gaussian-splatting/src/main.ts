import { GaussianSplatLayer } from "./gaussian-splat-layer";
import { Viewer } from "./viewer";

const viewer = new Viewer();
let burbankLayer: GaussianSplatLayer;

// Starting values for tracking
const INITIAL_VALUES = {
  lon: -118.28457825,
  lat: 34.18977717,
  height: 329,
  rotationX: -0.540857,
  rotationY: 0.466542,
  rotationZ: -0.237358,
  scale: 56.750
};

function loadBurbankScene() {
  // Burbank, California coordinates
  // Lat: 34.18991967, Lon: -118.28507075, Alt: 327.70m
  viewer.flyTo(-118.28507075, 34.18991967, 150, 0, -60, 2);

  burbankLayer = new GaussianSplatLayer(
    "./splats/myscene/Burbank1Clean.ply",
    { lon: INITIAL_VALUES.lon, lat: INITIAL_VALUES.lat, height: INITIAL_VALUES.height },
    { x: INITIAL_VALUES.rotationX, y: INITIAL_VALUES.rotationY, z: INITIAL_VALUES.rotationZ },
    INITIAL_VALUES.scale
  );

  viewer.addGaussianSplatLayer(burbankLayer);
}

// Function to print final adjusted values
function printFinalValues() {
  if (!burbankLayer) {
    console.error('❌ Splat layer not loaded yet');
    return;
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎯 FINAL SPLAT POSITION - COPY THIS INTO main.ts');
  console.log('='.repeat(70));
  console.log('\nReplace the loadBurbankScene() function with:\n');
  console.log('function loadBurbankScene() {');
  console.log('  viewer.flyTo(-118.28507075, 34.18991967, 150, 0, -60, 2);');
  console.log('');
  console.log('  const burbankLayer = new GaussianSplatLayer(');
  console.log('    "./splats/myscene/Burbank1Clean.ply",');
  console.log(`    { lon: ${burbankLayer.location.lon.toFixed(8)}, lat: ${burbankLayer.location.lat.toFixed(8)}, height: ${burbankLayer.location.height.toFixed(2)} },`);
  console.log(`    { x: ${burbankLayer.scene.rotation.x.toFixed(6)}, y: ${burbankLayer.scene.rotation.y.toFixed(6)}, z: ${burbankLayer.scene.rotation.z.toFixed(6)} },`);
  console.log(`    ${burbankLayer.scale.toFixed(3)}`);
  console.log('  );');
  console.log('');
  console.log('  viewer.addGaussianSplatLayer(burbankLayer);');
  console.log('}');
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary of changes from initial:');
  console.log('='.repeat(70));
  console.log(`Longitude:    ${INITIAL_VALUES.lon.toFixed(8)} → ${burbankLayer.location.lon.toFixed(8)} (Δ ${(burbankLayer.location.lon - INITIAL_VALUES.lon).toFixed(8)})`);
  console.log(`Latitude:     ${INITIAL_VALUES.lat.toFixed(8)} → ${burbankLayer.location.lat.toFixed(8)} (Δ ${(burbankLayer.location.lat - INITIAL_VALUES.lat).toFixed(8)})`);
  console.log(`Height:       ${INITIAL_VALUES.height.toFixed(2)}m → ${burbankLayer.location.height.toFixed(2)}m (Δ ${(burbankLayer.location.height - INITIAL_VALUES.height).toFixed(2)}m)`);
  console.log(`Rotation X:   ${INITIAL_VALUES.rotationX.toFixed(6)} → ${burbankLayer.scene.rotation.x.toFixed(6)} (Δ ${(burbankLayer.scene.rotation.x - INITIAL_VALUES.rotationX).toFixed(6)})`);
  console.log(`Rotation Y:   ${INITIAL_VALUES.rotationY.toFixed(6)} → ${burbankLayer.scene.rotation.y.toFixed(6)} (Δ ${(burbankLayer.scene.rotation.y - INITIAL_VALUES.rotationY).toFixed(6)})`);
  console.log(`Rotation Z:   ${INITIAL_VALUES.rotationZ.toFixed(6)} → ${burbankLayer.scene.rotation.z.toFixed(6)} (Δ ${(burbankLayer.scene.rotation.z - INITIAL_VALUES.rotationZ).toFixed(6)})`);
  console.log(`Scale:        ${INITIAL_VALUES.scale.toFixed(3)} → ${burbankLayer.scale.toFixed(3)} (Δ ${(burbankLayer.scale - INITIAL_VALUES.scale).toFixed(3)})`);
  console.log('='.repeat(70) + '\n');
}

// Add keyboard listener for saving final position
document.addEventListener('keydown', (e) => {
  // Press 'P' to print final values
  if (e.key === 'p' || e.key === 'P') {
    printFinalValues();
  }
});

if (viewer.cesium) {
  loadBurbankScene();

  console.log('💡 TIP: Adjust the splat using keyboard controls (see legend)');
  console.log('💡 When done, press P to print final values to paste into code');
}
