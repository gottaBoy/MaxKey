import 'dart:io';
import 'package:image/image.dart' as img;

void main() async {
  // 读取原始图片以获取尺寸
  // final logoMaxkeyFile = File('assets/logo_zeron1.png');
  final logoJpgFile = File('assets/logo.jpg');
  
  // 生成 logo_zeron.png (PNG格式，白色背景)
  // if (await logoMaxkeyFile.exists()) {
  //   final originalImage = img.decodeImage(await logoMaxkeyFile.readAsBytes());
  //   final width = originalImage?.width ?? 400;
  //   final height = originalImage?.height ?? 200;
    
  //   // 创建新图片
  //   final pngImage = img.Image(width: width, height: height);
  //   // 填充白色背景
  //   img.fill(pngImage, color: img.ColorRgb8(255, 255, 255));
    
  //   // 绘制 "ZERON" 文字（使用简单的矩形和线条模拟）
  //   final text = 'ZERON';
  //   final fontSize = (width / text.length * 0.7).round();
  //   final charWidth = (fontSize * 0.6).round();
  //   final charHeight = fontSize;
  //   final startX = (width - (text.length * charWidth)) ~/ 2;
  //   final startY = (height - charHeight) ~/ 2;
    
  //   for (int i = 0; i < text.length; i++) {
  //     final char = text[i];
  //     final x = startX + i * charWidth;
  //     final y = startY;
  //     _drawChar(pngImage, char, x, y, charWidth, charHeight);
  //   }
    
  //   await logoMaxkeyFile.writeAsBytes(img.encodePng(pngImage));
  //   print('✓ Generated assets/logo_zeron.png (${width}x${height})');
  // }
  
  // 生成 logo.jpg (JPG格式，浅灰色背景)
  if (await logoJpgFile.exists()) {
    final originalImage = img.decodeImage(await logoJpgFile.readAsBytes());
    final width = originalImage?.width ?? 200;
    final height = originalImage?.height ?? 200;
    
    // 创建新图片
    final jpgImage = img.Image(width: width, height: height);
    // 填充浅灰色背景
    img.fill(jpgImage, color: img.ColorRgb8(240, 240, 240));
    
    // 绘制 "ZERON" 文字
    final text = 'ZERON';
    final fontSize = (width / text.length * 0.7).round();
    final charWidth = (fontSize * 0.6).round();
    final charHeight = fontSize;
    final startX = (width - (text.length * charWidth)) ~/ 2;
    final startY = (height - charHeight) ~/ 2;
    
    for (int i = 0; i < text.length; i++) {
      final char = text[i];
      final x = startX + i * charWidth;
      final y = startY;
      _drawChar(jpgImage, char, x, y, charWidth, charHeight);
    }
    
    await logoJpgFile.writeAsBytes(img.encodeJpg(jpgImage, quality: 90));
    print('✓ Generated assets/logo.jpg (${width}x${height})');
  }
  
  print('Done!');
}

// 绘制单个字符（使用像素级操作）
void _drawChar(img.Image image, String char, int x, int y, int width, int height) {
  final thickness = (height * 0.15).round().clamp(2, 10);
  final color = img.ColorRgb8(0, 0, 0); // 黑色
  
  // 使用像素级操作绘制字符
  switch (char.toUpperCase()) {
    case 'Z':
      // 上横线
      _drawRect(image, x, y, width, thickness, color);
      // 斜线
      for (int i = 0; i < width - thickness; i++) {
        final py = y + (i * (height - 2 * thickness) / (width - thickness)).round();
        if (py < y + height - thickness) {
          _drawRect(image, x + i, py, thickness, thickness, color);
        }
      }
      // 下横线
      _drawRect(image, x, y + height - thickness, width, thickness, color);
      break;
    case 'E':
      // 左竖线
      _drawRect(image, x, y, thickness, height, color);
      // 上横线
      _drawRect(image, x, y, width, thickness, color);
      // 中横线
      _drawRect(image, x, y + height ~/ 2 - thickness ~/ 2, (width * 0.75).round(), thickness, color);
      // 下横线
      _drawRect(image, x, y + height - thickness, width, thickness, color);
      break;
    case 'R':
      // 左竖线
      _drawRect(image, x, y, thickness, height, color);
      // 上横线
      _drawRect(image, x, y, (width * 0.75).round(), thickness, color);
      // 右竖线（上半部分）
      _drawRect(image, x + (width * 0.75).round() - thickness, y, thickness, height ~/ 2, color);
      // 右下斜线
      for (int i = 0; i < (width * 0.4).round(); i++) {
        final py = y + height ~/ 2 + (i * (height ~/ 2) / (width * 0.4)).round();
        if (py < y + height) {
          _drawRect(image, x + (width * 0.75).round() - thickness + i, py, thickness, thickness, color);
        }
      }
      break;
    case 'O':
      // 外框
      _drawRectOutline(image, x, y, width, height, thickness, color);
      break;
    case 'N':
      // 左竖线
      _drawRect(image, x, y, thickness, height, color);
      // 右竖线
      _drawRect(image, x + width - thickness, y, thickness, height, color);
      // 斜线
      for (int i = 0; i < width - thickness; i++) {
        final py = y + (i * (height - thickness) / (width - thickness)).round();
        if (py < y + height) {
          _drawRect(image, x + i, py, thickness, thickness, color);
        }
      }
      break;
    default:
      // 默认绘制一个矩形
      _drawRect(image, x, y, width, height, color);
  }
}

// 绘制实心矩形（使用像素级操作）
void _drawRect(img.Image image, int x, int y, int width, int height, img.Color color) {
  for (int py = y; py < y + height && py < image.height; py++) {
    for (int px = x; px < x + width && px < image.width; px++) {
      if (px >= 0 && py >= 0) {
        image.setPixel(px, py, color);
      }
    }
  }
}

// 绘制矩形边框
void _drawRectOutline(img.Image image, int x, int y, int width, int height, int thickness, img.Color color) {
  // 上边
  _drawRect(image, x, y, width, thickness, color);
  // 下边
  _drawRect(image, x, y + height - thickness, width, thickness, color);
  // 左边
  _drawRect(image, x, y, thickness, height, color);
  // 右边
  _drawRect(image, x + width - thickness, y, thickness, height, color);
}
