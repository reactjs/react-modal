// Tracks portals that are open and emits events to subscribers

class PortalOpenInstances {
  constructor() {
    this.openInstances = [];
    this.subscribers = [];
  }

  register = openInstance => {
    if (this.openInstances.indexOf(openInstance) !== -1) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `React-Modal: Cannot register modal instance that's already open`
        );
      }
      return;
    }
    this.openInstances.push(openInstance);
    this.emit("register");
  };

  deregister = openInstance => {
    const index = this.openInstances.indexOf(openInstance);
    if (index === -1) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `React-Modal: Unable to deregister ${openInstance} as it was never registered`
        );
      }
      return;
    }
    this.openInstances.splice(index, 1);
    this.emit("deregister");
  };

  subscribe = callback => {
    this.subscribers.push(callback);
  };

  emit = eventType => {
    this.subscribers.forEach(subscriber =>
      subscriber(
        eventType,
        // shallow copy to avoid accidental mutation
        this.openInstances.slice()
      )
    );
  };
}

const portalOpenInstances = new PortalOpenInstances();

export default portalOpenInstances;
