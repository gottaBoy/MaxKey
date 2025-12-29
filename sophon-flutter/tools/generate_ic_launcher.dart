import 'dart:io';
import 'package:image/image.dart' as img;

void main() {
  // Android launcher icon sizes
  final sizes = {
    'mipmap-ldpi': 36,
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  };

  // Read source image
  final sourcePath = 'android/app/src/main/res/logo_zeron.png';
  final sourceFile = File(sourcePath);
  
  if (!sourceFile.existsSync()) {
    print('Error: Source image not found at $sourcePath');
    exit(1);
  }

  final sourceBytes = sourceFile.readAsBytesSync();
  final sourceImage = img.decodeImage(sourceBytes);
  
  if (sourceImage == null) {
    print('Error: Failed to decode source image');
    exit(1);
  }

  print('Source image: ${sourceImage.width}x${sourceImage.height}');

  // Generate icons for each density
  for (final entry in sizes.entries) {
    final density = entry.key;
    final size = entry.value;
    
    // Resize image
    final resized = img.copyResize(
      sourceImage,
      width: size,
      height: size,
      interpolation: img.Interpolation.cubic,
    );
    
    // Save to appropriate directory
    final outputDir = Directory('android/app/src/main/res/$density');
    if (!outputDir.existsSync()) {
      outputDir.createSync(recursive: true);
    }
    
    final outputPath = '${outputDir.path}/ic_launcher.png';
    final outputFile = File(outputPath);
    outputFile.writeAsBytesSync(img.encodePng(resized));
    
    print('✓ Generated $outputPath (${size}x${size})');
  }

  print('\nAll launcher icons generated successfully!');
}

