import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (
      error.message.includes("WebGL") ||
      error.message.includes("canvas") ||
      error.message.includes("context")
    ) {
      this.setState({ hasError: true });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx = (
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    ) as WebGLRenderingContext | null;
    if (!ctx) return false;

    // Check for sandbox/fake GPU (VENDOR = 0xffff means no real GPU)
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const vendor = ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string;
      const renderer = ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
      if (
        vendor === "0xffff" ||
        renderer === "0xffff" ||
        vendor.includes("0xffff") ||
        renderer.includes("0xffff")
      ) {
        return false;
      }
    }

    // Try to create a minimal shader to verify the context works
    const vs = ctx.createShader(ctx.VERTEX_SHADER);
    if (!vs) return false;
    ctx.shaderSource(vs, "void main(){gl_Position=vec4(0);}");
    ctx.compileShader(vs);
    if (!ctx.getShaderParameter(vs, ctx.COMPILE_STATUS)) return false;

    return true;
  } catch {
    return false;
  }
}
