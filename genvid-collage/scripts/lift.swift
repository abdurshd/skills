// Subject lift: input image -> transparent PNG of the foreground (Vision framework).
// Build: swiftc -O lift.swift -o lift   Use: ./lift in.jpg out.png  (macOS 14+)
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3, let src = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  fputs("usage: lift in out\n", stderr); exit(1)
}
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: src)
try handler.perform([req])
guard let result = req.results?.first else { fputs("no subject\n", stderr); exit(2) }
let buf = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writePNGRepresentation(of: ci, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: cs)
print("ok \(Int(ci.extent.width))x\(Int(ci.extent.height))")
