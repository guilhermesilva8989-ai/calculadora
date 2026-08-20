class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Números
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => this.inputNumber(btn.dataset.number));
        });

        // Operações
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });

        // Teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    inputNumber(number) {
        // Previne múltiplos pontos decimais
        if (number === '.' && this.currentValue.includes('.')) {
            return;
        }

        // Se deve resetar o display, começa novo número
        if (this.shouldResetDisplay) {
            this.currentValue = '';
            this.shouldResetDisplay = false;
        }

        this.currentValue += number;
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'divide':
                this.setOperation('/');
                break;
            case 'multiply':
                this.setOperation('*');
                break;
            case 'subtract':
                this.setOperation('-');
                break;
            case 'add':
                this.setOperation('+');
                break;
            case 'percent':
                this.percent();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    handleKeyboard(event) {
        const key = event.key;

        // Números
        if (key >= '0' && key <= '9' || key === '.') {
            event.preventDefault();
            this.inputNumber(key);
        }
        // Operações
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            event.preventDefault();
            if (key === '/') this.setOperation('/');
            else if (key === '*') this.setOperation('*');
            else if (key === '+') this.setOperation('+');
            else if (key === '-') this.setOperation('-');
        }
        // Enter ou =
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.calculate();
        }
        // Backspace
        else if (key === 'Backspace') {
            event.preventDefault();
            this.delete();
        }
        // Escape para limpar
        else if (key === 'Escape') {
            event.preventDefault();
            this.clear();
        }
    }

    setOperation(op) {
        // Se não há valor atual, retorna
        if (this.currentValue === '') {
            return;
        }

        // Se há operação anterior e valor anterior, calcula primeiro
        if (this.previousValue !== '' && this.operation !== null) {
            this.calculate();
        } else {
            this.previousValue = this.currentValue;
            this.currentValue = '';
        }

        this.operation = op;
        this.shouldResetDisplay = true;
    }

    calculate() {
        // Se não há valores ou operação, retorna
        if (this.previousValue === '' || this.currentValue === '' || this.operation === null) {
            return;
        }

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Erro' : prev / current;
                break;
            default:
                return;
        }

        // Limita casas decimais
        if (typeof result === 'number') {
            result = parseFloat(result.toFixed(10));
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    percent() {
        if (this.currentValue === '') {
            return;
        }

        const current = parseFloat(this.currentValue);
        const result = current / 100;
        this.currentValue = result.toString();
        this.updateDisplay();
    }

    delete() {
        if (this.currentValue === '') {
            return;
        }

        this.currentValue = this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentValue || '0';
    }
}

// Inicia a calculadora quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
