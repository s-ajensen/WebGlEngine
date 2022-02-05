class Shader {
    context: WebGLRenderingContext;
    vertex: WebGLShader;
    fragment: WebGLShader;
    program: WebGLProgram;
    attributes: Map<string, GLint>;
    uniforms: Map<string, WebGLUniformLocation>;

    constructor(context: WebGLRenderingContext, vertex: string, fragment: string) {
        this.context = context;

        this.vertex = this.loadShader(this.context.VERTEX_SHADER, vertex);
        this.fragment = this.loadShader(this.context.FRAGMENT_SHADER, fragment);
        this.program = this.generateProgram();
        this.attributes = new Map<string, GLint>();
        this.uniforms = new Map<string, WebGLUniformLocation>();
    }

    loadShader(type: number, source: string): WebGLShader {
        const shader = this.context.createShader(type);

        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            console.log('An error occurred compiling the shaders: ' + this.context.getShaderInfoLog(shader));
            this.context.deleteShader(shader);
            return null;
        }

        return shader;
    }

    generateProgram(): WebGLProgram {
        const shaderProgram = this.context.createProgram();
        this.context.attachShader(shaderProgram, this.vertex);
        this.context.attachShader(shaderProgram, this.fragment);
        this.context.linkProgram(shaderProgram);

        if (!this.context.getProgramParameter(shaderProgram, this.context.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.context.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    addAttributes(attrs: string[]) {
        attrs.forEach(attr => this.addAttribute(attr));
    }

    addAttribute(attr: string): void {
        this.attributes.set(attr, this.context.getAttribLocation(this.program, attr));
    }

    addUniforms(uniforms: string[]) {
        uniforms.forEach(uni => this.addUniform(uni));
    }

    addUniform(uni: string): void {
        this.uniforms.set(uni, this.context.getUniformLocation(this.program, uni));
    }
}