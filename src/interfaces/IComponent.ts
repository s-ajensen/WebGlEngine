abstract class IComponent {
    parent: GameObject;
    type: string;

    constructor(parent: GameObject, type: string) {
        this.parent = parent;
        this.type = type;
    }
}