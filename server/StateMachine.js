class StateMachine {
    constructor(data) {
        this._data = data;
        this.data = data.data || {};
        this.states = data.states;
        this.afterHandlers = [];
        this.handlers = {};
        data.states.forEach(s => {
            this.handlers[s.name] = [];
        });
    }

    setState(state) {
        this.currentState = state;
        this.currentTransitions = this._data.transitions.filter(t => {
            return t.source == state;
        });
        this.emit(state);

        if (this.finalState == state) {
            this.running = false;
            return;
        }
    }

    update() {
        if (!this.running) {
            return;
        }
        let data = this.data;
        let next = null;
        this.currentTransitions.forEach(s => {
            if (s.value(data)) {
                next = s;
            }
        });
        if (next) {
            let data;
            if (next.target) {
                data = this.get(next.target);

                this.setState(next.target);

                if (this.finalState == next.target) {
                    this.running = false;
                }
            }
            if (next.event) {
                next.event();
            }
            this.emitAfter(data);
        }
    }

    get(state) {
        return this.states.find(function(s) {
            return s.name == state;
        });
    }

    start() {
        this.running = true;
        this.setState(this._data.initialState);
        this.emitAfter();
    }

    emit(state) {
        let item = this.get(state);
        this.handlers[state].forEach(f => {
            f(item);
        });
    }

    emitAfter(data) {
        this.afterHandlers.forEach(f => {
            f(data);
        });
    }

    on(state, f) {
        this.handlers[state].push(f);
    }

    after(f) {
        this.afterHandlers.push(f);
    }
}

module.exports = StateMachine;